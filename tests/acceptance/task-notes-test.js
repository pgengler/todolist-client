import { module, test } from 'qunit';
import { click, fillIn, visit } from '@ember/test-helpers';
import { doubleClickToEdit } from 'ember-todo/tests/helpers/click-to-edit';
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

  test('edit task modal renders note content as HTML initially', async function (assert) {
    this.server.create('task', 'withDayList', {
      notes: '**something**',
    });

    await visit('/days');
    await doubleClickToEdit('[data-test-task]');
    assert.dom('.edit-task-dialog .task-form [data-test-task-notes]').doesNotMatchSelector('textarea');
    assert.dom('.edit-task-dialog .task-form [data-test-task-notes] strong').hasText('something');
  });

  test('edit task modal displays textarea if task has no note', async function (assert) {
    this.server.create('task', 'withDayList', {
      notes: '',
    });

    await visit('/days');
    await doubleClickToEdit('[data-test-task]');
    assert.dom('.edit-task-dialog .task-form [data-test-task-notes]').matchesSelector('textarea');
  });

  test('in edit task modal, clicking on note content changes it to a textarea with unrendered content', async function (assert) {
    this.server.create('task', 'withDayList', {
      notes: '**something**',
    });

    await visit('/days');
    await doubleClickToEdit('[data-test-task]');
    await click('.edit-task-dialog .task-form [data-test-task-notes]');
    assert.dom('.edit-task-dialog .task-form [data-test-task-notes]').matchesSelector('textarea');
    assert.dom('.edit-task-dialog .task-form [data-test-task-notes]').hasValue('**something**');
    assert.dom('.edit-task-dialog .task-form [data-test-task-notes]').isFocused();
  });

  test('when notes are not edited, saving task saves previous note content', async function (assert) {
    let task = this.server.create('task', 'withDayList', {
      notes: '**something**',
    });

    this.server.patch('/tasks/:id', function ({ tasks }, request) {
      let t = tasks.find(request.params.id);

      let attrs = this.normalizedRequestAttrs();
      assert.step(`saved task ID ${request.params.id} with notes="${attrs.notes}"`);
      t.update(attrs);
      return t;
    });

    await visit('/');
    await doubleClickToEdit('[data-test-task]');
    await click('.edit-task-dialog [data-test-save-task]');
    assert.verifySteps([`saved task ID ${task.id} with notes="**something**"`]);
  });

  test('when notes are edited, saving task saves new note content', async function (assert) {
    let task = this.server.create('task', 'withDayList', {
      notes: '**something**',
    });

    this.server.patch('/tasks/:id', function ({ tasks }, request) {
      let t = tasks.find(request.params.id);

      let attrs = this.normalizedRequestAttrs();
      assert.step(`saved task ID ${request.params.id} with notes="${attrs.notes}"`);
      t.update(attrs);
      return t;
    });

    await visit('/');
    await doubleClickToEdit('[data-test-task]');
    await click('.edit-task-dialog [data-test-task-notes]');
    await fillIn('.edit-task-dialog .task-form [data-test-task-notes]', 'a new note');
    await click('.edit-task-dialog [data-test-save-task]');
    assert.verifySteps([`saved task ID ${task.id} with notes="a new note"`]);
  });
});
