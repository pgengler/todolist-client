import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-todo/tests/helpers/start-app';

var application;

module('Acceptance: Tasks', {
  beforeEach: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /tasks/new', function(assert) {
  visit('/tasks/new');

  andThen(function() {
    assert.equal(currentPath(), 'tasks.new');
  });
});

test('adding a new task', function(assert) {
  let day = server.create('day', { date: '2014-11-13' });
  assert.expect(2);

  server.post('/tasks', function(db, request) {
    let params = JSON.parse(request.requestBody);
    assert.equal(params.task.day_id, day.id);
    assert.equal(params.task.description, 'Something');
  });

  visit('/tasks/new');
  fillIn('.spec-new-task-description', 'Something');
  fillIn('.spec-new-task-date', '2014-11-13');
  click('.spec-create-task');
});
