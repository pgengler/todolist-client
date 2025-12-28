import { module, test } from 'qunit';
import { setupAcceptanceTest } from 'ember-todo/tests/helpers';
import { click, fillIn, visit } from '@ember/test-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | New Task modal', function (hooks) {
  setupAcceptanceTest(hooks);
  hooks.beforeEach(() => authenticateSession());

  test('adding a new task', async function (assert) {
    let list = this.server.create('list', 'day', {
      name: '2014-11-13',
    });

    this.server.post('/tasks', function ({ tasks }) {
      let attrs = this.normalizedRequestAttrs();
      assert.step(`created new task with list ID ${attrs.listId} and description "${attrs.description}"`);

      return tasks.create(attrs);
    });

    await visit('/days');
    await click('.top-nav [data-test-add-task]');

    assert.dom('.new-task-dialog').exists('"new task" modal displays after clicking icon in header');

    await fillIn('[data-test-task-description]', 'Something');
    await fillIn('[data-test-task-date]', '2014-11-13');
    await click('[data-test-save-task]');
    assert.verifySteps([`created new task with list ID ${list.id} and description "Something"`]);

    assert.dom('.new-task-dialog').doesNotExist('"new task" modal is no longer displayed after filling out the form');
  });

  test('cannot submit form when some information is missing', async function (assert) {
    await visit('/days');
    await click('.top-nav [data-test-add-task]');
    await click('[data-test-save-task]');

    assert
      .dom('.new-task-dialog')
      .exists('"new task" modal continues to display after submitting with both fields missing');

    await fillIn('[data-test-task-description]', 'Something');
    await click('[data-test-save-task]');
    assert.dom('.new-task-dialog').exists('"new task" modal continues to display after submitting with date missing');

    await fillIn('[data-test-task-description]', '');
    await fillIn('[data-test-task-date]', '2014-11-13');
    await click('[data-test-save-task]');
    assert
      .dom('.new-task-dialog')
      .exists('"new task" modal continues to display after submitting with description missing');
  });

  test('clicking the Cancel button closes the modal', async function (assert) {
    await visit('/days');
    await click('.top-nav [data-test-add-task]');
    await click('[data-test-cancel-button]');

    assert.dom('.new-task-dialog').doesNotExist('"new task" modal is not displayed after clicking Cancel button');
  });

  test('does not show a delete button for a new task', async function (assert) {
    await visit('/days');
    await click('.top-nav [data-test-add-task]');
    assert.dom('[data-test-edit-task-dialog] [data-test-delete-task]').doesNotExist();
  });
});
