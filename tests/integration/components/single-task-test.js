import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import clickToEdit from 'ember-todo/tests/helpers/click-to-edit';

module('Integration | Component | SingleTask', function (hooks) {
  setupRenderingTest(hooks);

  test('displays a regular task', async function (assert) {
    this.set('task', {
      description: 'foo',
    });
    await render(hbs`<SingleTask @task={{this.task}} />`);

    assert.dom('input[type=checkbox]').exists('displays a checkbox');
    assert.dom('.task').hasText('foo', 'displays task description');
  });

  test('displays a pending task', async function (assert) {
    this.set('task', {
      isNew: true,
      description: 'bar',
    });
    await render(hbs`<SingleTask @task={{this.task}} />`);

    assert.dom('input[type=checkbox]').doesNotExist('does not show a checkbox for pending tasks');
    assert.dom('.fa-spinner').exists('shows a spinner');
    assert.dom('.task').hasClass('pending', 'pending tasks get the "pending" class');
    assert.dom('.task').hasText('bar', 'displays task description');
  });

  test('displays a task that failed to save', async function (assert) {
    this.set('task', {
      isError: true,
      description: 'baz',
    });
    await render(hbs`<SingleTask @task={{this.task}} />`);

    assert.dom('input[type=checkbox]').doesNotExist('does not show a checkbox');
    assert.dom('.fa-exclamation-triangle').exists('shows the right icon');
    assert.dom('.fa-exclamation-triangle').hasAttribute('title', 'Task failed to save');
    assert.dom('.task').hasClass('error', 'failed saves get the "error" class');
    assert.dom('.task').hasText('baz', 'displays task description');
  });

  test('single-clicking a task enters edit mode', async function (assert) {
    let editingStartCalled = false;
    this.set('task', {
      description: 'foo bar',
    });
    this.set('editingStart', () => {
      editingStartCalled = true;
    });
    await render(hbs`
      <SingleTask
        @task={{this.task}}
        @editingStart={{this.editingStart}}
      />
    `);
    await clickToEdit('.task');

    assert.ok(editingStartCalled, 'made call to "editStart" action');
    assert.dom('.task').hasClass('editing');
    assert.dom('input[type=checkbox]').doesNotExist('checkbox is no longer displayed');
    assert.dom('textarea').exists('displays a textarea for editing');
    assert.dom('textarea').hasValue('foo bar', 'textarea is prepopulated with the current description');
  });

  test('pending tasks are not editable', async function (assert) {
    this.set('task', {
      isNew: true,
      description: 'xyz',
    });
    await render(hbs`<SingleTask @task={{this.task}} />`);
    await click('.task');

    assert.dom('.task').doesNotHaveClass('editing');
    assert.dom('textarea').doesNotExist('does not become editable');
  });

  test('tasks that failed to save are editable', async function (assert) {
    this.set('task', {
      isError: true,
      description: 'abc',
    });
    await render(hbs`<SingleTask @task={{this.task}} />`);
    await clickToEdit('.task');

    assert.dom('.task').hasClass('editing');
    assert.dom('textarea').exists('displays a textarea for editing');
    assert.dom('textarea').hasValue('abc', 'textarea is populated with the current description');
  });
});
