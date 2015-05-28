import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-todo/tests/helpers/start-app';
import Responses from '../responses';
import { mockRequest } from '../helpers';

var application, server;

module('Acceptance: Tasks', {
  beforeEach: function(assert) {
    application = startApp();
    server = new Pretender(function() { });
    server.unhandledRequest = function(verb, path, request) {
      assert.ok(false, "Request not handled: " + verb + " " + path);
    };
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
  assert.expect(2);

  mockRequest(server, 'get', '/api/v1/days', Responses.days);
  mockRequest(server, 'get', '/api/v1/days/2014-11-13', Responses.single_day);
  mockRequest(server, 'post', '/api/v1/tasks', { }, 200, function(request) {
    assert.equal(request.task.day_id, 65);
    assert.equal(request.task.description, 'Something');
  });

  visit('/tasks/new');
  fillIn('.spec-new-task-description', 'Something');
  fillIn('.spec-new-task-date', '2014-11-13');
  click('.spec-create-task');
});
