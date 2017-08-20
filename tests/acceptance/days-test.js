import { skip, test } from 'qunit';
import moment from 'moment';
import moduleForAcceptance from 'ember-todo/tests/helpers/module-for-acceptance';

function fillInAndPressEnter(selector, text) {
  fillIn(selector, text);
  keyEvent(selector, 'keyup', 13);
}

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
  visit('/days?date=2014-11-07');

  andThen(function() {
    assert.equal(currentPath(), 'days');
    assert.contains('.spec-day:first h1', 'Thursday');
    assert.contains('.spec-day:first h2', 'Nov 6, 2014');
    assert.equal(find('.spec-day').length, 6);
  });
});

test('adding a new task sends right data to server', function(assert) {
  let day = server.create('day', { date: '2017-08-20' });
  assert.expect(3);

  server.post('/tasks', function({ tasks }, request) {
    let requestData = JSON.parse(request.requestBody).data;
    assert.equal(requestData.relationships.day.data.id, day.id, 'request includes correct day ID');
    assert.equal(requestData.attributes.description, 'A new task', 'request includes correct description');

    return tasks.create(this.normalizedRequestAttrs());
  });

  visit('/days?date=2017-08-20');
  fillInAndPressEnter('.spec-day:contains(Aug 20, 2017) .spec-new-task', 'A new task');

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

  server.patch('/tasks/:id', function({ tasks }, request) {
    let requestData = JSON.parse(request.requestBody).data;
    assert.equal(requestData.relationships.day.data.id, targetDay.id, 'makes PATCH request with new day ID');

    let task = tasks.find(request.params.id);
    task.update(this.normalizedRequestAttrs());
    return task;
  });

  visit('/days?date=2016-03-07');

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

  server.post('/tasks', function({ tasks }, request) {
    let requestData = JSON.parse(request.requestBody).data;
    assert.ok(true, 'makes POST request to create new task');
    assert.equal(requestData.attributes.description, task.description, 'creates new task with same description');
    assert.equal(requestData.relationships.day.data.id, targetDay.id, 'creates new task on the correct day');

    return tasks.create(this.normalizedRequestAttrs());
  });

  visit('/days?date=2016-03-07');
  dragAndDrop('.spec-task', '.spec-day:contains(Mar 8, 2016)', { ctrlKey: true });
});

test('updating the description for a task', function(assert) {
  assert.expect(3);
  let task = server.create('task', { description: "I'm a task" });
  server.create('day', { date: '2016-03-07', taskIds: [ task.id ] });

  server.patch('/tasks/:id', function({ tasks }, request) {
    let requestData = JSON.parse(request.requestBody).data;

    assert.ok(true, 'makes a PATCH request');
    assert.equal(request.params.id, task.id, 'makes a PUT request for the correct task');
    assert.equal(requestData.attributes.description, 'New description', 'sends the new description in the request');

    let matchingTask = tasks.find(request.params.id);
    matchingTask.update(this.normalizedRequestAttrs());
    return matchingTask;
  });

  visit('/days?date=2016-03-07');
  triggerEvent('.spec-task', 'dblclick');
  fillInAndPressEnter('.spec-task textarea', 'New description');
});

test('setting an empty description for a task deletes it', function(assert) {
  assert.expect(2);
  let task = server.create('task');
  server.create('day', { date: '2016-03-07', taskIds: [ task.id ] });

  server.delete('/tasks/:id', function(db, request) {
    assert.ok(true, 'makes a DELETE request');
    assert.equal(request.params.id, task.id, 'makes a DELETE request for the right ID');
  });

  visit('/days?date=2016-03-07');
  triggerEvent('.spec-task', 'dblclick');
  fillInAndPressEnter('.spec-task textarea', '');
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
  fillInAndPressEnter('.spec-new-task', 'new thing');

  andThen(function() {
    assert.equal(find('.spec-task').length, 1, 'still only displays one item after save finishes');
    assert.doesNotExist('.spec-task.pending', '"pending" CSS class is no longer applied');
  });
});

skip('clicking a date column header focuses the "add new task" for it', function(assert) {
  // passes in Chrome but fails in Firefox/Phantom
  server.create('day', { date: '2017-04-02' });
  visit('/days');
  click('h1:first');
  andThen(() => {
    assert.ok(find('.spec-new-task:first').is(':focus'));
  });
});

test('tasks are resorted correctly when editing descriptions', function(assert) {
  let tasks = [
    server.create('task', { description: 'xyz' }),
    server.create('task', { description: 'abc' }),
    server.create('task', { description: 'mno' })
  ];
  server.create('day', {
    date: moment().format('YYYY-MM-DD'),
    taskIds: tasks.map((t) => t.id)
  });

  server.patch('/tasks/:id', function({ tasks }, request) {
    let matchingTask = tasks.find(request.params.id);
    matchingTask.update(this.normalizedRequestAttrs());
    return matchingTask;
  });

  visit('/days');

  andThen(() => {
    assert.contains('.spec-task:eq(0)', 'abc');
    assert.contains('.spec-task:eq(1)', 'mno');
    assert.contains('.spec-task:eq(2)', 'xyz');
  });

  triggerEvent('.spec-task:eq(1)', 'dblclick');
  fillInAndPressEnter('.spec-task:eq(1) textarea', 'zzz');

  andThen(() => {
    assert.contains('.spec-task:eq(0)', 'abc');
    assert.contains('.spec-task:eq(1)', 'xyz');
    assert.contains('.spec-task:eq(2)', 'zzz');
  });
});
