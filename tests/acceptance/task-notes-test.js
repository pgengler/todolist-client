import { module, test } from 'qunit';
import { click, doubleClick, fillIn, visit } from '@ember/test-helpers';
// import clickToEdit from 'ember-todo/tests/helpers/click-to-edit';
// import fillInAndPressEnter from 'ember-todo/tests/helpers/fill-in-and-press-enter';
import setupAcceptanceTest from 'ember-todo/tests/helpers/setup-acceptance-test';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | Task notes', function (hooks) {
  setupAcceptanceTest(hooks);
  hooks.beforeEach(() => authenticateSession());

  test('new task modal has a "notes" field', async function (assert) {
    await visit('/');
    await click('[data-test-add-task]');

    assert.dom('.new-task-dialog .task-form [data-test-task-notes]').exists();
  });

  test('entered notes are saved when creating a new task', async function (assert) {
    await visit('/');
    await click('[data-test-add-task]');

    this.server.post('/tasks', function ({ tasks }) {
      let attrs = this.normalizedRequestAttrs();
      assert.step(`created new task with notes="${attrs.notes}"`);
      return tasks.create(attrs);
    });

    await fillIn('.new-task-dialog .task-form [data-test-task-description]', 'a thing');
    await fillIn('.new-task-dialog .task-form [data-test-task-date]', '2014-11-13');
    await fillIn('.new-task-dialog .task-form [data-test-task-notes]', 'foo bar baz');
    await click('.new-task-dialog [data-test-save-task]');
    assert.verifySteps(['created new task with notes="foo bar baz"']);
  });

  test('edit task modal displays existing notes in "notes" field', async function (assert) {
    this.server.create('task', 'withDayList', {
      notes: 'xyzzy',
    });

    await visit('/');
    await doubleClick('[data-test-task]');
    assert.dom('.edit-task-dialog .task-form [data-test-task-notes]').hasValue('xyzzy');
  });

  test('notes are updated when saving existing task', async function (assert) {
    let task = this.server.create('task', 'withDayList', {
      notes: 'xyzzy',
    });

    this.server.patch('/tasks/:id', function ({ tasks }, request) {
      let t = tasks.find(request.params.id);

      let attrs = this.normalizedRequestAttrs();
      assert.step(`updated task ID ${request.params.id} with notes="${attrs.notes}"`);
      t.update(attrs);
      return t;
    });

    await visit('/');
    await doubleClick('[data-test-task]');
    await fillIn('.edit-task-dialog .task-form [data-test-task-notes]', 'a new note');
    await click('.edit-task-dialog [data-test-save-task]');
    assert.verifySteps([`updated task ID ${task.id} with notes="a new note"`]);
  });

  test('tasks with notes display an icon on listing', async function (assert) {
    this.server.create('task', 'withDayList', {
      notes: 'xyzzy',
    });

    await visit('/');
    assert.dom('.task [data-test-task-has-notes]').exists();
  });

  test('tasks without notes do not display an icon on listing', async function (assert) {
    this.server.create('task', 'withDayList', {
      notes: null,
    });

    await visit('/');
    assert.dom('.task [data-test-task-has-notes]').doesNotExist();
  });
});
