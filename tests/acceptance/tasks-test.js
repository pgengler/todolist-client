import Ember from 'ember';
import startApp from '../helpers/start-app';
import Responses from '../responses';
import { mockRequest } from '../helpers';

var App, server;

module('Acceptance: Tasks', {
  setup: function() {
    App = startApp();
    server = new Pretender(function() { });
     server.unhandledRequest = function(verb, path, request) {
      ok(false, "Request not handled: " + verb + " " + path);
    };
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /tasks/new', function() {
  visit('/tasks/new');

  andThen(function() {
    equal(currentPath(), 'tasks.new');
  });
});

test('adding a new task', function() {
  expect(3);

  mockRequest(server, 'get', '/api/v1/days', Responses.days);
  mockRequest(server, 'get', '/api/v1/days/2014-11-13', Responses.single_day);
  mockRequest(server, 'post', '/api/v1/tasks', { }, 200, function(request) {
    equal(request.task.day_id, 65);
    equal(request.task.description, 'Something');
  });

  visit('/tasks/new');
  fillIn('.spec-new-task-description', 'Something');
  fillIn('.spec-new-task-date', '2014-11-13');
  click('.spec-create-task');

  andThen(function() {
    equal(currentPath(), 'days');
  });
});
