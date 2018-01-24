import { test } from 'qunit';
import moduleForAcceptance from 'ember-todo/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'ember-todo/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | New Task modal', {
  beforeEach() {
    authenticateSession(this.application);
  }
});

test('adding a new task', function(assert) {
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

  visit('/days');
  click('.top-nav .spec-add-task');
  andThen(() => {
    assert.exists('.new-task-dialog', '"new task" modal displays after clicking icon in header');
  });

  fillIn('.spec-new-task-description', 'Something');
  datepickerSelect('.spec-new-task-date', '2014-11-13');
  click('.spec-create-task');

  andThen(() => {
    assert.doesNotExist('.new-task-dialog', '"new task" modal is no longer displayed after filling out the form');
  });
});

test('cannot submit form when some information is missing', function(assert) {
  visit('/days');
  click('.top-nav .spec-add-task');
  click('.spec-create-task');

  andThen(() => {
    assert.exists('.new-task-dialog', '"new task" modal continues to display after submitting with both fields missing');
  });

  fillIn('.spec-new-task-description', 'Something');
  click('.spec-create-task');
  andThen(() => {
    assert.exists('.new-task-dialog', '"new task" modal continues to display after submitting with date missing');
  });

  fillIn('.spec-new-task-description', '');
  datepickerSelect('.spec-new-task-date', '2014-11-13');
  click('.spec-create-task');
  andThen(() => {
    assert.exists('.new-task-dialog', '"new task" modal continues to display after submitting with description missing');
  });
});

test('clicking the Cancel button closes the modal', function(assert) {
  visit('/days');
  click('.top-nav .spec-add-task');
  click('.spec-cancel-button');

  andThen(() => {
    assert.doesNotExist('.new-task-dialog', '"new task" modal is not displayed after clicking Cancel button');
  });
});
