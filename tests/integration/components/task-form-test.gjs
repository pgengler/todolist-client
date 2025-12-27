import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render } from '@ember/test-helpers';
import TaskForm from 'ember-todo/components/task-form';

function noop() {}

module('Integration | Component | TaskForm', function (hooks) {
  setupRenderingTest(hooks);

  test('when given a @task, prefills description field with task description', async function (assert) {
    const task = {
      description: 'some task',
    };
    await render(<template><TaskForm @task={{task}} @cancel={{noop}} /></template>);

    assert.dom('[data-test-task-description]').hasValue('some task');
  });

  test('Save button label defaults to "Save" if @saveButtonLabel is not present', async function (assert) {
    await render(<template><TaskForm @cancel={{noop}} /></template>);

    assert.dom('[data-test-save-task]').hasText('Save');
  });

  test('Save button gets label from @saveButtonLabel, if present', async function (assert) {
    await render(<template><TaskForm @saveButtonLabel="Foo" @cancel={{noop}} /></template>);

    assert.dom('[data-test-save-task]').hasText('Foo');
  });

  test('Save button triggers @save action when clicked and all required fields are present', async function (assert) {
    const onSave = ({ date, description }) =>
      assert.step(`save action triggered with date="${date}" and description="${description}"`);
    await render(<template><TaskForm @save={{onSave}} @cancel={{noop}} /></template>);

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
    const onCancel = () => assert.step('cancel action triggered');
    await render(<template><TaskForm @cancel={{onCancel}} /></template>);

    await click('[data-test-cancel-button]');
    assert.verifySteps(['cancel action triggered']);
  });

  test('renders content in <:footer> after save/cancel buttons', async function (assert) {
    await render(
      <template>
        <TaskForm @cancel={{noop}}>
          <:footer>
            <div data-test-foo-bar></div>
          </:footer>
        </TaskForm>
      </template>
    );

    assert.dom('[data-test-cancel-button] + [data-test-foo-bar]').exists();
  });
});
