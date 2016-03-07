import { test } from 'qunit';
import moduleForAcceptance from 'ember-todo/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Days');

test('visiting / redirects to /days', function(assert) {
  server.createList('day', 7);

  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'days');
  });
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

test('adding a new task sends right data to server', function(assert) {
  let day = server.create('day');
  assert.expect(3);

  server.post('/tasks', function(db, request) {
    let params = JSON.parse(request.requestBody);
    assert.equal(params.task.day_id, day.id, 'request includes correct day ID');
    assert.equal(params.task.description, 'A new task', 'request includes correct description');

    let task = db.tasks.insert(params.task);
    return { task };
  });

  visit('/days');
  fillIn('.spec-new-task:first', 'A new task');
  keyEvent('.spec-new-task:first', 'keyup', 13);

  andThen(function() {
    assert.contains('.spec-task', 'A new task', 'new task is added');
  });
});

test('dragging a task to another day', function(assert) {
  assert.expect(3);

  let task = server.create('task');
  server.create('day', { date: '2016-03-07', task_ids: [ task.id ]});
  let targetDay = server.create('day', { date: '2016-03-08' });

  server.put('/tasks/:id', function(db, request) {
    let requestBody = JSON.parse(request.requestBody);
    assert.equal(requestBody.task.day_id, targetDay.id, 'makes PUT request with new day ID');

    db.tasks.update(request.params.id, requestBody.task);
  });

  visit('/days');

  dragAndDrop('.spec-task', `.spec-day:contains(Mar 8, 2016)`);
  andThen(function() {
    assert.equal(find('.spec-day:contains(Mar 7, 2016) .spec-task').length, 0, 'task is no longer displays under original day');
    assert.equal(find('.spec-day:contains(Mar 8, 2016) .spec-task').length, 1, 'task is displayed under new day');
  });
});

test('updating the description for a task', function(assert) {
  assert.expect(3);
  let task = server.create('task', { description: "I'm a task" });
  server.create('day', { date: '2016-03-07', task_ids: [ task.id ]});

  server.put('/tasks/:id', function(db, request) {
    let params = JSON.parse(request.requestBody)['task'];

    assert.ok(true, 'makes a PUT request');
    assert.equal(request.params.id, task.id, 'makes a PUT request for the correct task');
    assert.equal(params.description, 'New description', 'sends the new description in the request');
  });

  visit('/days');
  triggerEvent('.spec-task', 'dblclick');
  fillIn('.spec-task textarea', 'New description');
  keyEvent('.spec-task textarea', 'keyup', 13);
});

test('setting an empty description for a task deletes it', function(assert) {
  assert.expect(2);
  let task = server.create('task');
  server.create('day', { date: '2016-03-07', task_ids: [ task.id ]});

  server.delete('/tasks/:id', function(db, request) {
    assert.ok(true, 'makes a DELETE request');
    assert.equal(request.params.id, task.id, 'makes a DELETE request for the right ID');
  });

  visit('/days');
  triggerEvent('.spec-task', 'dblclick');
  fillIn('.spec-task textarea', '');
  keyEvent('.spec-task textarea', 'keyup', 13);
});
