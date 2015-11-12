import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-todo/tests/helpers/start-app';

var application;

module('Acceptance: Days', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /days', function(assert) {
  server.create('day', { date: '2014-11-06' });
  server.createList('day', 4);
  visit('/days');

  andThen(function() {
    assert.equal(currentPath(), 'days');
    assert.contains('.spec-day:first h1', 'Thursday');
    assert.contains('.spec-day:first h2', 'Nov 6, 2014');
    assert.equal(find('.spec-day').length, 6);
  });
});

test('visiting / redirects to /days', function(assert) {
  server.createList('day', 7);

  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'days');
  });
});

test('adding a new task', function(assert) {
  let day = server.create('day');
  assert.expect(3);

  server.post('/tasks', function(db, request) {
    let params = JSON.parse(request.requestBody);
    assert.equal(params.task.day_id, day.id);
    assert.equal(params.task.description, 'A new task');

    let task = db.tasks.insert(params.task);
    return { task };
  });

  visit('/days');
  fillIn('.spec-new-task:first', 'A new task');
  keyEvent('.spec-new-task:first', 'keyup', 13);

  andThen(function() {
    assert.contains('.spec-task', 'A new task');
  });
});
