import { test } from 'qunit';
import moduleForAcceptance from 'ember-todo/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | New Task modal');

test('adding a new task', function(assert) {
  assert.expect(4);

  let day = server.create('day', { date: '2014-11-13' });

  server.post('/tasks', function(schema, request) {
    let params = JSON.parse(request.requestBody).task;
    assert.equal(params.day_id, day.id, 'makes request with the correct day ID');
    assert.equal(params.description, 'Something', 'makes request with the entered description');

    return schema.tasks.create(this.normalizedRequestAttrs());
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
  click('.spec-cancel-create');

  andThen(() => {
    assert.doesNotExist('.new-task-dialog', '"new task" modal is not displayed after clicking Cancel button');
  });
});
