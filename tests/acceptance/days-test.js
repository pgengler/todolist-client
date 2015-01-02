import Ember from 'ember';
import startApp from '../helpers/start-app';
import Responses from '../responses';
import { assertContains, mockRequest } from '../helpers';

var App, server;

module('Acceptance: Days', {
  setup: function() {
    App = startApp();
    server = new Pretender(function() { });
    server.unhandledRequest = function(verb, path, request) {
      ok(false, "Request not handled: " + verb + " " + path);
    };
    mockRequest(server, 'get', '/api/v1/days', Responses.days);
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /days', function() {
  visit('/days');

  andThen(function() {
    equal(currentPath(), 'days');
    assertContains('.spec-day h1', 'Thursday');
    assertContains('.spec-day h2', 'Nov 6, 2014');
    equal(find('.spec-day').length, 5);
  });
});

test('visiting / redirects to /days', function() {
  visit('/');

  andThen(function() {
    equal(currentPath(), 'days');
  });
});

test('adding a new task', function() {
  expect(3);

  mockRequest(server, 'post', '/api/v1/tasks', { }, 200, function(request) {
    equal(request.task.day_id, 46);
    equal(request.task.description, 'A new task');
  });
  visit('/days');
  fillIn('.spec-new-task:first', 'A new task');
  keyEvent('.spec-new-task:first', 'keyup', 13);

  andThen(function() {
    assertContains('.spec-task', 'A new task');
  });
});
