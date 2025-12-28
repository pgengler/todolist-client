import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-todo/tests/helpers';
import { click, render } from '@ember/test-helpers';
import { clickToEdit } from 'ember-todo/tests/helpers/click-to-edit';
import SingleTask from 'ember-todo/components/single-task';

module('Integration | Component | SingleTask', function (hooks) {
  setupRenderingTest(hooks);

  test('displays a regular task', async function (assert) {
    const task = {
      description: 'foo',
    };
    await render(<template><SingleTask @task={{task}} /></template>);

    assert.dom('input[type=checkbox]').exists('displays a checkbox');
    assert.dom('.task').hasText('foo', 'displays task description');
  });

  test('displays a pending task', async function (assert) {
    const task = {
      isNew: true,
      description: 'bar',
    };
    await render(<template><SingleTask @task={{task}} /></template>);

    assert.dom('input[type=checkbox]').doesNotExist('does not show a checkbox for pending tasks');
    assert.dom('.fa-spinner').exists('shows a spinner');
    assert.dom('.task').hasClass('pending', 'pending tasks get the "pending" class');
    assert.dom('.task').hasText('bar', 'displays task description');
  });

  test('displays a task that failed to save', async function (assert) {
    const task = {
      isError: true,
      description: 'baz',
    };
    await render(<template><SingleTask @task={{task}} /></template>);

    assert.dom('input[type=checkbox]').doesNotExist('does not show a checkbox');
    assert.dom('.fa-triangle-exclamation').exists('shows the right icon');
    assert.dom('.fa-triangle-exclamation').hasAttribute('title', 'Task failed to save');
    assert.dom('.task').hasClass('error', 'failed saves get the "error" class');
    assert.dom('.task').hasText('baz', 'displays task description');
  });

  test('single-clicking a task enters edit mode', async function (assert) {
    let editingStartCalled = false;
    const task = {
      description: 'foo bar',
    };
    const editingStart = () => {
      editingStartCalled = true;
    };
    await render(<template><SingleTask @task={{task}} @editingStart={{editingStart}} /></template>);
    await clickToEdit('.task');

    assert.ok(editingStartCalled, 'made call to "editStart" action');
    assert.dom('.task').hasClass('editing');
    assert.dom('input[type=checkbox]').doesNotExist('checkbox is no longer displayed');
    assert.dom('textarea').exists('displays a textarea for editing');
    assert.dom('textarea').hasValue('foo bar', 'textarea is prepopulated with the current description');
  });

  test('pending tasks are not editable', async function (assert) {
    const task = {
      isNew: true,
      description: 'xyz',
    };
    await render(<template><SingleTask @task={{task}} /></template>);
    await click('.task');

    assert.dom('.task').doesNotHaveClass('editing');
    assert.dom('textarea').doesNotExist('does not become editable');
  });

  test('tasks that failed to save are editable', async function (assert) {
    const task = {
      isError: true,
      description: 'abc',
    };
    await render(<template><SingleTask @task={{task}} /></template>);
    await clickToEdit('.task');

    assert.dom('.task').hasClass('editing');
    assert.dom('textarea').exists('displays a textarea for editing');
    assert.dom('textarea').hasValue('abc', 'textarea is populated with the current description');
  });
});
