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

  server.post('/tasks', function(schema, request) {
    let params = JSON.parse(request.requestBody);
    assert.equal(params.task.day_id, day.id, 'request includes correct day ID');
    assert.equal(params.task.description, 'A new task', 'request includes correct description');

    let task = schema.tasks.create(this.normalizedRequestAttrs());
    return task;
  });

  visit('/days');
  fillIn('.spec-new-task:first', 'A new task');
  keyEvent('.spec-new-task:first', 'keyup', 13);

  andThen(function() {
    assert.contains('.spec-task', 'A new task', 'new task is added');
  });
});

test('pressing Escape clears textarea for new tasks', function(assert) {
  server.create('day');
  visit('/days');

  fillIn('.spec-new-task', 'New task');
  keyEvent('.spec-new-task', 'keyup', 27);
  andThen(function() {
    assert.equal(find('.spec-new-task').val(), '', 'textarea is cleared after pressing Escape');
  });
});

test('dragging a task to another day', function(assert) {
  assert.expect(3);

  let task = server.create('task');
  server.create('day', { date: '2016-03-07', taskIds: [ task.id ] });
  let targetDay = server.create('day', { date: '2016-03-08' });

  server.put('/tasks/:id', function(schema, request) {
    let requestBody = JSON.parse(request.requestBody);
    assert.equal(requestBody.task.day_id, targetDay.id, 'makes PUT request with new day ID');

    let task = schema.tasks.find(request.params.id);
    task.update(this.normalizedRequestAttrs());
    return task;
  });

  visit('/days');

  dragAndDrop('.spec-task', '.spec-day:contains(Mar 8, 2016)');
  andThen(function() {
    assert.equal(find('.spec-day:contains(Mar 7, 2016) .spec-task').length, 0, 'task is no longer displays under original day');
    assert.equal(find('.spec-day:contains(Mar 8, 2016) .spec-task').length, 1, 'task is displayed under new day');
  });
});

test('dragging and dropping a task with Control held copies a task', function(assert) {
  assert.expect(3);

  let task = server.create('task');
  server.create('day', { date: '2016-03-07', taskIds: [ task.id ] });
  let targetDay = server.create('day', { date: '2016-03-08' });

  server.post('/tasks', function(schema, request) {
    let params = JSON.parse(request.requestBody).task;
    assert.ok(true, 'makes POST request to create new task');
    assert.equal(params.description, task.description, 'creates new task with same description');
    assert.equal(params.day_id, targetDay.id, 'creates new task on the correct day');

    return schema.tasks.create(this.normalizedRequestAttrs());
  });

  visit('/days');
  dragAndDrop('.spec-task', '.spec-day:contains(Mar 8, 2016)', { ctrlKey: true });
});

test('updating the description for a task', function(assert) {
  assert.expect(3);
  let task = server.create('task', { description: "I'm a task" });
  server.create('day', { date: '2016-03-07', taskIds: [ task.id ] });

  server.put('/tasks/:id', function(schema, request) {
    let params = JSON.parse(request.requestBody).task;

    assert.ok(true, 'makes a PUT request');
    assert.equal(request.params.id, task.id, 'makes a PUT request for the correct task');
    assert.equal(params.description, 'New description', 'sends the new description in the request');

    let matchingTask = schema.tasks.find(request.params.id);
    matchingTask.update(this.normalizedRequestAttrs());
    return matchingTask;
  });

  visit('/days');
  triggerEvent('.spec-task', 'dblclick');
  fillIn('.spec-task textarea', 'New description');
  keyEvent('.spec-task textarea', 'keyup', 13);
});

test('setting an empty description for a task deletes it', function(assert) {
  assert.expect(2);
  let task = server.create('task');
  server.create('day', { date: '2016-03-07', taskIds: [ task.id ] });

  server.delete('/tasks/:id', function(db, request) {
    assert.ok(true, 'makes a DELETE request');
    assert.equal(request.params.id, task.id, 'makes a DELETE request for the right ID');
  });

  visit('/days');
  triggerEvent('.spec-task', 'dblclick');
  fillIn('.spec-task textarea', '');
  keyEvent('.spec-task textarea', 'keyup', 13);
});

test('newly-created-but-still-saving tasks appear in the "pending" state', function(assert) {
  assert.expect(4);

  server.create('day', { date: '2016-09-10' });

  server.post('/tasks', function(schema) {
    assert.equal(find('.spec-task').length, 1, 'displays the new task');
    assert.exists('.spec-task.pending', 'new task gets the "pending" CSS class');

    return schema.tasks.create(this.normalizedRequestAttrs());
  });

  visit('/days');
  fillIn('.spec-new-task', 'new thing');
  keyEvent('.spec-new-task', 'keyup', 13);

  andThen(function() {
    assert.equal(find('.spec-task').length, 1, 'still only displays one item after save finishes');
    assert.doesNotExist('.spec-task.pending', '"pending" CSS class is no longer applied');
  });
});

test('clicking a date column header focuses the "add new task" for it', function(assert) {
  server.create('day', { date: '2017-04-02' });
  visit('/days');
  click('h1:first');
  andThen(() => {
    assert.ok(find('.spec-new-task:first').is(':focus'));
  });
});
