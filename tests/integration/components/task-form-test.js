import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | TaskForm', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.noop = () => {};
  });

  test('when given a @task, prefills description field with task description', async function (assert) {
    this.task = {
      description: 'some task',
    };
    await render(hbs`
      <TaskForm @task={{this.task}} @cancel={{this.noop}} />
    `);

    assert.dom('[data-test-task-description]').hasValue('some task');
  });

  test('Save button label defaults to "Save" if @saveButtonLabel is not present', async function (assert) {
    await render(hbs`
      <TaskForm @cancel={{this.noop}} />
    `);

    assert.dom('[data-test-save-task]').hasText('Save');
  });

  test('Save button gets label from @saveButtonLabel, if present', async function (assert) {
    await render(hbs`
      <TaskForm @saveButtonLabel="Foo" @cancel={{this.noop}} />
    `);

    assert.dom('[data-test-save-task]').hasText('Foo');
  });

  test('Save button triggers @save action when clicked and all required fields are present', async function (assert) {
    this.onSave = ({ date, description }) =>
      assert.step(`save action triggered with date="${date}" and description="${description}"`);
    await render(hbs`
      <TaskForm @save={{this.onSave}} @cancel={{this.noop}} />
    `);

    await click('[data-test-save-task]');
    assert.verifySteps([]);

    await fillIn('[data-test-task-description]', 'foo bar');
    await click('[data-test-save-task]');
    assert.verifySteps([]);

    await fillIn('[data-test-task-date]', '2022-08-09');
    await click('[data-test-save-task]');
    assert.verifySteps(['save action triggered with date="2022-08-09" and description="foo bar"']);
  });

  test('Cancel button triggers @cancel action when clicked', async function (assert) {
    this.onCancel = () => assert.step('cancel action triggered');
    await render(hbs`
      <TaskForm @cancel={{this.onCancel}} />
    `);

    await click('[data-test-cancel-button]');
    assert.verifySteps(['cancel action triggered']);
  });
});
