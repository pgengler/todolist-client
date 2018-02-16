import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click, fillIn, visit } from '@ember/test-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';
import datepickerSelect from 'ember-todo/tests/helpers/datepicker-select';

module('Acceptance | New Task modal', function(hooks) {
  setupApplicationTest(hooks);
  hooks.beforeEach(() => authenticateSession());

  test('adding a new task', async function(assert) {
    assert.expect(4);

    let list = server.create('list', {
      listType: 'day',
      name: '2014-11-13'
    });

    server.post('/tasks', function({ tasks }, request) {
      let requestData = JSON.parse(request.requestBody).data;
      assert.equal(requestData.relationships.list.data.id, list.id, 'makes request with the correct list ID');
      assert.equal(requestData.attributes.description, 'Something', 'makes request with the entered description');

      return tasks.create(this.normalizedRequestAttrs());
    });

    await visit('/days');
    await click('.top-nav .spec-add-task');

    assert.dom('.new-task-dialog').exists('"new task" modal displays after clicking icon in header');

    await fillIn('.spec-new-task-description', 'Something');
    await datepickerSelect('.spec-new-task-date', '2014-11-13');
    await click('.spec-create-task');

    assert.dom('.new-task-dialog').doesNotExist('"new task" modal is no longer displayed after filling out the form');
  });

  test('cannot submit form when some information is missing', async function(assert) {
    await visit('/days');
    await click('.top-nav .spec-add-task');
    await click('.spec-create-task');

    assert.dom('.new-task-dialog').exists('"new task" modal continues to display after submitting with both fields missing');

    await fillIn('.spec-new-task-description', 'Something');
    await click('.spec-create-task');
    assert.dom('.new-task-dialog').exists('"new task" modal continues to display after submitting with date missing');

    await fillIn('.spec-new-task-description', '');
    await datepickerSelect('.spec-new-task-date', '2014-11-13');
    await click('.spec-create-task');
    assert.dom('.new-task-dialog').exists('"new task" modal continues to display after submitting with description missing');
  });

  test('clicking the Cancel button closes the modal', async function(assert) {
    await visit('/days');
    await click('.top-nav .spec-add-task');
    await click('.spec-cancel-button');

    assert.dom('.new-task-dialog').doesNotExist('"new task" modal is not displayed after clicking Cancel button');
  });
});
