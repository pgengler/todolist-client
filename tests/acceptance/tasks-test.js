import { module, test } from 'qunit';
import { click, fillIn, visit } from '@ember/test-helpers';
import { clickToEdit, doubleClickToEdit } from 'ember-todo/tests/helpers/click-to-edit';
import dragAndDrop from 'ember-todo/tests/helpers/drag-and-drop';
import fillInAndPressEnter from 'ember-todo/tests/helpers/fill-in-and-press-enter';
import keyEvent from 'ember-todo/tests/helpers/key-event';
import setupAcceptanceTest from 'ember-todo/tests/helpers/setup-acceptance-test';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { Response } from 'ember-cli-mirage';

module('Acceptance | Tasks', function (hooks) {
  setupAcceptanceTest(hooks);
  hooks.beforeEach(() => authenticateSession());

  test('adding a new task sends right data to server', async function (assert) {
    let list = this.server.create('list', {
      listType: 'day',
      name: '2017-08-20',
    });
    assert.expect(3);

    this.server.post('/tasks', function ({ tasks }, request) {
      let requestData = JSON.parse(request.requestBody).data;
      assert.strictEqual(requestData.relationships.list.data.id, list.id, 'request includes correct list ID');
      assert.strictEqual(requestData.attributes.description, 'A new task', 'request includes correct description');

      return tasks.create(this.normalizedRequestAttrs());
    });

    await visit('/days?date=2017-08-20');
    await fillInAndPressEnter('.task-list[data-test-list-name="2017-08-20"] [data-test-new-task]', 'A new task');

    assert.dom('[data-test-task]').hasText('A new task');
  });

  test('single-clicking a task enables quick-edit mode', async function (assert) {
    let list = this.server.create('list', {
      listType: 'list',
      name: 'List',
    });
    this.server.create('task', {
      description: 'initial description',
      list,
    });

    await visit('/days');
    assert.dom('[data-test-task]').doesNotHaveClass('editing');
    assert.dom('[data-test-task]').hasText('initial description');
    assert.dom('[data-test-task] textarea').doesNotExist();

    await clickToEdit('[data-test-task]');
    assert.dom('[data-test-task]').hasClass('editing');
    assert.dom('[data-test-task] textarea').exists();
    assert.dom('[data-test-task] textarea').hasValue('initial description');
  });

  test('double-clicking a task opens dialog with form', async function (assert) {
    let list = this.server.create('list', 'day');
    this.server.create('task', {
      description: 'initial description',
      list,
    });

    await visit('/days');
    assert.dom('[data-test-edit-task-dialog]').doesNotExist();

    await doubleClickToEdit('[data-test-task]');
    // make sure we're not in quick-edit state
    assert.dom('[data-test-task]').doesNotHaveClass('editing');
    assert.dom('[data-test-task] textarea.edit').doesNotExist();

    assert.dom('[data-test-edit-task-dialog]').exists();
    assert.dom('[data-test-edit-task-dialog] [data-test-task-description]').hasValue('initial description');
    assert.dom('[data-test-edit-task-dialog] [data-test-task-date]').hasValue(list.name);
  });

  test('can update task via edit form', async function (assert) {
    let list = this.server.create('list', 'day');
    let task = this.server.create('task', {
      description: 'initial description',
      list,
    });

    this.server.patch('/tasks/:id', function ({ tasks }, request) {
      let t = tasks.find(request.params.id);
      let attrs = this.normalizedRequestAttrs();
      assert.step(`updated task ${request.params.id}`);
      assert.step(`changed description to "${attrs.description}"`);
      t.update(attrs);
      return t;
    });

    await visit('/days');
    await doubleClickToEdit('[data-test-task]');
    await fillIn('[data-test-edit-task-dialog] [data-test-task-description]', 'updated description');
    await click('[data-test-edit-task-dialog] [data-test-save-task]');

    assert.verifySteps([`updated task ${task.id}`, 'changed description to "updated description"']);
  });

  test('can delete a task via edit form', async function (assert) {
    let task = this.server.create('task', 'withDayList');

    this.server.del('/tasks/:id', function ({ tasks }, request) {
      let t = tasks.find(request.params.id);
      assert.step(`made request to DELETE task ${t.id}`);
      t.destroy();
      return new Response(204);
    });

    await visit('/days');
    await doubleClickToEdit('[data-test-task]');
    await click('[data-test-edit-task-dialog] [data-test-delete-task]');

    assert.verifySteps([`made request to DELETE task ${task.id}`]);
  });

  test('pressing Escape clears textarea for new tasks', async function (assert) {
    await visit('/days');

    await fillIn('[data-test-new-task]', 'New task');
    await keyEvent('[data-test-new-task]', 27);

    assert.dom('[data-test-new-task]').hasValue('', 'textarea is cleared after pressing Escape');
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
      assert.strictEqual(requestData.relationships.list.data.id, targetDay.id, 'makes PATCH request with new list ID');

      let task = tasks.find(request.params.id);
      task.update(this.normalizedRequestAttrs());
      return task;
    });

    await visit('/days?date=2016-03-07');

    await dragAndDrop(
      '.task-list[data-test-list-name="2016-03-07"] [data-test-task]',
      '.task-list[data-test-list-name="2016-03-08"]'
    );

    assert
      .dom('.task-list[data-test-list-name="2016-03-07"] [data-test-task]')
      .doesNotExist('task is no longer displays under original day');
    assert
      .dom('.task-list[data-test-list-name="2016-03-08"] [data-test-task]')
      .exists({ count: 1 }, 'task is displayed under new day');
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
      assert.strictEqual(
        requestData.attributes.description,
        task.description,
        'creates new task with same description'
      );
      assert.strictEqual(requestData.relationships.list.data.id, targetDay.id, 'creates new task on the correct day');

      return tasks.create(this.normalizedRequestAttrs());
    });

    await visit('/days?date=2016-03-07');
    await dragAndDrop(
      '.task-list[data-test-list-name="2016-03-07"] [data-test-task]',
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
      assert.strictEqual(request.params.id, task.id, 'makes a PUT request for the correct task');
      assert.strictEqual(
        requestData.attributes.description,
        'New description',
        'sends the new description in the request'
      );

      let matchingTask = tasks.find(request.params.id);
      matchingTask.update(this.normalizedRequestAttrs());
      return matchingTask;
    });

    await visit('/days?date=2016-03-07');
    await clickToEdit('[data-test-task]');
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
      assert.strictEqual(request.params.id, task.id, 'makes a DELETE request for the right ID');
    });

    await visit('/days?date=2016-03-07');
    await clickToEdit('[data-test-task]');
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
    await clickToEdit('[data-test-task]');
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
    await clickToEdit('[data-test-task]');
    await fillInAndPressEnter('[data-test-task] textarea', '');
    assert.dom('[data-test-task]').doesNotExist('task is removed');
  });

  test('newly-created-but-still-saving tasks appear in the "pending" state', async function (assert) {
    assert.expect(5);

    this.server.post('/tasks', function ({ tasks }) {
      assert.dom('[data-test-task]').exists({ count: 1 }, 'displays the new task');
      assert.dom('[data-test-task].pending').exists('new task gets the "pending" CSS class');
      assert.dom('[data-test-new-task]').hasValue('', '"new task" textarea is cleared');

      return tasks.create(this.normalizedRequestAttrs());
    });

    await visit('/days');
    await fillInAndPressEnter('[data-test-new-task]', 'new thing');

    assert.dom('[data-test-task]').exists({ count: 1 }, 'still only displays one item after save finishes');
    assert.dom('[data-test-task].pending').doesNotExist('"pending" CSS class is no longer applied');
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
    await fillInAndPressEnter('.task-list[data-test-list-name="Other"] [data-test-new-task]', 'This will fail');

    assert.dom('.flash-message.alert').exists('an error message is displayed');
    assert.dom('.task.error').exists('task is displayed with the "error" class');
  });
});
