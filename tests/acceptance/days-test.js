import { module, test } from 'qunit';
import {
  click,
  currentURL,
  fillIn,
  findAll,
  triggerEvent,
  visit,
} from '@ember/test-helpers';
import setupAcceptanceTest from 'ember-todo/tests/helpers/setup-acceptance-test';
import dragAndDrop from 'ember-todo/tests/helpers/drag-and-drop';
import keyEvent from 'ember-todo/tests/helpers/key-event';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { Response } from 'ember-cli-mirage';

async function fillInAndPressEnter(selector, text) {
  await fillIn(selector, text);
  return keyEvent(selector, 'Enter');
}

module('Acceptance | Days', function (hooks) {
  setupAcceptanceTest(hooks);
  hooks.beforeEach(() => authenticateSession());

  test('visiting /days', async function (assert) {
    this.server.create('list', {
      listType: 'day',
      name: '2014-11-06',
    });
    this.server.createList('list', 4, { listType: 'day' });
    this.server.create('list', { listType: 'list' });
    await visit('/days?date=2014-11-07');

    assert.equal(currentURL(), '/days?date=2014-11-07');
    assert.dom('.task-list h1').hasText('Thursday');
    assert.dom('.task-list h2').hasText('Nov 6, 2014');
    assert.equal(findAll('.task-list').length, 6);
  });

  test('adding a new task sends right data to server', async function (assert) {
    let list = this.server.create('list', {
      listType: 'day',
      name: '2017-08-20',
    });
    assert.expect(3);

    this.server.post('/tasks', function ({ tasks }, request) {
      let requestData = JSON.parse(request.requestBody).data;
      assert.equal(
        requestData.relationships.list.data.id,
        list.id,
        'request includes correct list ID'
      );
      assert.equal(
        requestData.attributes.description,
        'A new task',
        'request includes correct description'
      );

      return tasks.create(this.normalizedRequestAttrs());
    });

    await visit('/days?date=2017-08-20');
    await fillInAndPressEnter(
      '.task-list[data-test-list-name="2017-08-20"] [data-test-new-task]',
      'A new task'
    );

    assert.dom('[data-test-task]').hasText('A new task');
  });

  test('pressing Escape clears textarea for new tasks', async function (assert) {
    await visit('/days');

    await fillIn('[data-test-new-task]', 'New task');
    await keyEvent('[data-test-new-task]', 27);

    assert
      .dom('[data-test-new-task]')
      .hasValue('', 'textarea is cleared after pressing Escape');
  });

  test('dragging a task to another day', async function (assert) {
    assert.expect(3);

    let task = this.server.create('task');
    this.server.create('list', {
      listType: 'day',
      name: '2016-03-07',
      taskIds: [task.id],
    });
    let targetDay = this.server.create('list', {
      listType: 'day',
      name: '2016-03-08',
    });

    this.server.patch('/tasks/:id', function ({ tasks }, request) {
      let requestData = JSON.parse(request.requestBody).data;
      assert.equal(
        requestData.relationships.list.data.id,
        targetDay.id,
        'makes PATCH request with new list ID'
      );

      let task = tasks.find(request.params.id);
      task.update(this.normalizedRequestAttrs());
      return task;
    });

    await visit('/days?date=2016-03-07');

    await dragAndDrop(
      '[data-test-task]',
      '.task-list[data-test-list-name="2016-03-08"]'
    );

    assert.equal(
      findAll('.task-list[data-test-list-name="2016-03-07"] [data-test-task]')
        .length,
      0,
      'task is no longer displays under original day'
    );
    assert.equal(
      findAll('.task-list[data-test-list-name="2016-03-08"] [data-test-task]')
        .length,
      1,
      'task is displayed under new day'
    );
  });

  test('dragging and dropping a task with Control held copies a task', async function (assert) {
    assert.expect(3);

    let task = this.server.create('task');
    this.server.create('list', {
      listType: 'day',
      name: '2016-03-07',
      taskIds: [task.id],
    });
    let targetDay = this.server.create('list', {
      listType: 'day',
      name: '2016-03-08',
    });

    this.server.post('/tasks', function ({ tasks }, request) {
      let requestData = JSON.parse(request.requestBody).data;
      assert.ok(true, 'makes POST request to create new task');
      assert.equal(
        requestData.attributes.description,
        task.description,
        'creates new task with same description'
      );
      assert.equal(
        requestData.relationships.list.data.id,
        targetDay.id,
        'creates new task on the correct day'
      );

      return tasks.create(this.normalizedRequestAttrs());
    });

    await visit('/days?date=2016-03-07');
    await dragAndDrop(
      '[data-test-task]',
      '.task-list[data-test-list-name="2016-03-08"]',
      { ctrlKey: true }
    );
  });

  test('updating the description for a task', async function (assert) {
    assert.expect(3);
    let task = this.server.create('task', { description: "I'm a task" });
    this.server.create('list', {
      listType: 'day',
      name: '2016-03-07',
      taskIds: [task.id],
    });

    this.server.patch('/tasks/:id', function ({ tasks }, request) {
      let requestData = JSON.parse(request.requestBody).data;

      assert.ok(true, 'makes a PATCH request');
      assert.equal(
        request.params.id,
        task.id,
        'makes a PUT request for the correct task'
      );
      assert.equal(
        requestData.attributes.description,
        'New description',
        'sends the new description in the request'
      );

      let matchingTask = tasks.find(request.params.id);
      matchingTask.update(this.normalizedRequestAttrs());
      return matchingTask;
    });

    await visit('/days?date=2016-03-07');
    await triggerEvent('[data-test-task]', 'dblclick');
    await fillInAndPressEnter('[data-test-task] textarea', 'New description');
  });

  test('setting an empty description for a task deletes it', async function (assert) {
    assert.expect(2);
    let task = this.server.create('task');
    this.server.create('list', {
      listType: 'day',
      name: '2016-03-07',
      taskIds: [task.id],
    });

    this.server.delete('/tasks/:id', function (db, request) {
      assert.ok(true, 'makes a DELETE request');
      assert.equal(
        request.params.id,
        task.id,
        'makes a DELETE request for the right ID'
      );
    });

    await visit('/days?date=2016-03-07');
    await triggerEvent('[data-test-task]', 'dblclick');
    await fillInAndPressEnter('[data-test-task] textarea', '');
  });

  test('pressing Shift+Enter adds a newline to the new description when it is not empty', async function (assert) {
    assert.expect(1);

    let task = this.server.create('task');
    this.server.create('list', 'day', { tasks: [task] });

    this.server.delete('/tasks/:id', function () {
      assert.ok(false, 'does not make a delete request');
    });

    await visit('/days');
    await triggerEvent('[data-test-task]', 'dblclick');
    await keyEvent('[data-test-task] textarea', 'Enter', {
      shiftKey: true,
    });
    assert.dom('[data-test-task] textarea').exists('remains in edit mode');
  });

  test('pressing Shift+Enter deletes a task when its description is empty', async function (assert) {
    assert.expect(2);

    let task = this.server.create('task');
    this.server.create('list', 'day', { tasks: [task] });

    this.server.delete('/tasks/:id', function ({ tasks }, request) {
      assert.ok(true, 'makes a delete request');
      tasks.find(request.params.id).destroy();
      return new Response(204);
    });

    await visit('/days');
    await triggerEvent('[data-test-task]', 'dblclick');
    await fillInAndPressEnter('[data-test-task] textarea', '');
    assert.dom('[data-test-task]').doesNotExist('task is removed');
  });

  test('newly-created-but-still-saving tasks appear in the "pending" state', async function (assert) {
    assert.expect(5);

    this.server.post('/tasks', function ({ tasks }) {
      assert.equal(
        findAll('[data-test-task]').length,
        1,
        'displays the new task'
      );
      assert
        .dom('[data-test-task].pending')
        .exists('new task gets the "pending" CSS class');
      assert
        .dom('[data-test-new-task]')
        .hasValue('', '"new task" textarea is cleared');

      return tasks.create(this.normalizedRequestAttrs());
    });

    await visit('/days');
    await fillInAndPressEnter('[data-test-new-task]', 'new thing');

    assert.equal(
      findAll('[data-test-task]').length,
      1,
      'still only displays one item after save finishes'
    );
    assert
      .dom('[data-test-task].pending')
      .doesNotExist('"pending" CSS class is no longer applied');
  });

  test('clicking a date column header focuses the "add new task" for it', async function (assert) {
    await visit('/days');
    await click('.task-list h1');

    assert.dom('[data-test-new-task]').isFocused();
  });

  test('tasks are resorted correctly when editing descriptions', async function (assert) {
    let list = this.server.create('list', {
      listType: 'day',
      name: '2018-01-01',
    });
    this.server.create('task', { description: 'xyz', list });
    this.server.create('task', { description: 'abc', list });
    this.server.create('task', { description: 'mno', list });

    this.server.patch('/tasks/:id', function ({ tasks }, request) {
      let matchingTask = tasks.find(request.params.id);
      matchingTask.update(this.normalizedRequestAttrs());
      return matchingTask;
    });

    await visit('/days?date=2018-01-01');

    let displayedTasks = findAll('[data-test-task]').map((element) =>
      element.textContent.trim()
    );
    assert.deepEqual(
      displayedTasks,
      ['abc', 'mno', 'xyz'],
      'tasks are displayed in alphabetical order'
    );

    await triggerEvent(findAll('[data-test-task]')[1], 'dblclick');
    await fillInAndPressEnter(
      findAll('[data-test-task]')[1].querySelector('textarea'),
      'zzz'
    );

    displayedTasks = findAll('[data-test-task]').map((element) =>
      element.textContent.trim()
    );
    assert.deepEqual(
      displayedTasks,
      ['abc', 'xyz', 'zzz'],
      'after editing a task, alphabetical order is preserved'
    );
  });

  test('handles when adding a task fails', async function (assert) {
    this.server.create('list', { listType: 'list', name: 'Other' });

    this.server.post('/tasks', function () {
      return new Response(
        500,
        {},
        {
          errors: [
            {
              status: 500,
              detail: 'Something went wrong',
            },
          ],
        }
      );
    });
    await visit('/days?date=2018-01-01');
    await fillInAndPressEnter(
      '.task-list[data-test-list-name="Other"] [data-test-new-task]',
      'This will fail'
    );

    assert.dom('.flash-message.alert').exists('an error message is displayed');
    assert
      .dom('.task.error')
      .exists('task is displayed with the "error" class');
  });

  test('lists are sorted by date', async function (assert) {
    this.server.create('list', 'day', { name: '2021-04-26' });
    this.server.create('list', 'day', { name: '2021-04-22' });
    this.server.create('list', 'day', { name: '2021-04-23' });
    this.server.create('list', 'day', { name: '2021-04-24' });
    this.server.create('list', 'day', { name: '2021-04-25' });

    await visit('/days?date=2021-04-23');

    let listNames = Array.from(findAll('.task-list-header h2')).map(
      (e) => e.textContent
    );
    assert.deepEqual(listNames, [
      'Apr 22, 2021',
      'Apr 23, 2021',
      'Apr 24, 2021',
      'Apr 25, 2021',
      'Apr 26, 2021',
    ]);
  });
});
