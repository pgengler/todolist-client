import { module, test } from 'qunit';
import setupAcceptanceTest from 'ember-todo/tests/helpers/setup-acceptance-test';
import { click, fillIn, visit } from '@ember/test-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | New Task modal', function (hooks) {
  setupAcceptanceTest(hooks);
  hooks.beforeEach(() => authenticateSession());

  test('adding a new task', async function (assert) {
    assert.expect(4);

    let list = this.server.create('list', {
      listType: 'day',
      name: '2014-11-13',
    });

    this.server.post('/tasks', function ({ tasks }) {
      let attrs = this.normalizedRequestAttrs();
      assert.strictEqual(attrs.listId, list.id, 'makes request with the correct list ID');
      assert.strictEqual(attrs.description, 'Something', 'makes request with the entered description');

      return tasks.create(attrs);
    });

    await visit('/days');
    await click('.top-nav [data-test-add-task]');

    assert.dom('.new-task-dialog').exists('"new task" modal displays after clicking icon in header');

    await fillIn('[data-test-task-description]', 'Something');
    await fillIn('[data-test-task-date]', '2014-11-13');
    await click('[data-test-save-task]');

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
});
