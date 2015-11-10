import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-todo/tests/helpers/start-app';
import Responses from '../responses';
import { mockRequest } from '../helpers';

var application, server;

module('Acceptance: Days', {
  beforeEach: function(assert) {
    application = startApp();
    server = new Pretender(function() { });
    server.unhandledRequest = function(verb, path) {
      assert.ok(false, "Request not handled: " + verb + " " + path);
    };
    mockRequest(server, 'get', '/api/v1/days', Responses.days);
    mockRequest(server, 'get', '/api/v1/days/undated', Responses.undated);
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /days', function(assert) {
  visit('/days');

  andThen(function() {
    assert.equal(currentPath(), 'days');
    assert.contains('.spec-day h1', 'Thursday');
    assert.contains('.spec-day h2', 'Nov 6, 2014');
    assert.equal(find('.spec-day').length, 6);
  });
});

test('visiting / redirects to /days', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'days');
  });
});

test('adding a new task', function(assert) {
  assert.expect(3);

  mockRequest(server, 'post', '/api/v1/tasks', { task: { id: 999, description: 'A new task', done: false } }, 200, function(request) {
    assert.equal(request.task.day_id, 46);
    assert.equal(request.task.description, 'A new task');
  });
  visit('/days');
  fillIn('.spec-new-task:first', 'A new task');
  keyEvent('.spec-new-task:first', 'keyup', 13);

  andThen(function() {
    assert.contains('.spec-task', 'A new task');
  });
});
