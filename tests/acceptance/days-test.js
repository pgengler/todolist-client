import { module, test } from 'qunit';
import { click, currentURL, findAll, visit } from '@ember/test-helpers';
import { clickToEdit } from 'ember-todo/tests/helpers/click-to-edit';
import fillInAndPressEnter from 'ember-todo/tests/helpers/fill-in-and-press-enter';
import setupAcceptanceTest from 'ember-todo/tests/helpers/setup-acceptance-test';
import { calendarSelect } from 'ember-power-calendar/test-support/helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { Collection } from 'miragejs';
import { format } from 'date-fns';

module('Acceptance | Days', function (hooks) {
  setupAcceptanceTest(hooks);
  hooks.beforeEach(() => authenticateSession());

  test('visiting /days shows lists', async function (assert) {
    this.server.create('list', 'day', {
      name: '2014-11-06',
    });
    this.server.createList('list', 4, 'day');
    this.server.create('list', { listType: 'list' });
    await visit('/days?date=2014-11-07');

    assert.strictEqual(currentURL(), '/days?date=2014-11-07');
    assert.dom('.task-list h1').hasText('Thursday');
    assert.dom('.task-list h2').hasText('Nov 6, 2014');
    assert.dom('.task-list').exists({ count: 6 });
  });

  test('clicking a date column header focuses the "add new task" for it', async function (assert) {
    await visit('/days');
    await click('.task-list h1');

    assert.dom('[data-test-new-task]').isFocused();
  });

  test('tasks are resorted correctly when editing descriptions', async function (assert) {
    let list = this.server.create('list', 'day', {
      name: '2018-01-01',
    });
    this.server.create('task', { description: 'xyz', list });
    this.server.create('task', { description: 'abc', list });
    this.server.create('task', { description: 'mno', list });

    await visit('/days?date=2018-01-01');

    let displayedTasks = findAll(`[data-test-list-name="${list.name}"] [data-test-task]`).map((element) =>
      element.textContent.trim()
    );
    assert.deepEqual(displayedTasks, ['abc', 'mno', 'xyz'], 'tasks are displayed in alphabetical order');

    await clickToEdit(`[data-test-list-name="${list.name}"] [data-test-task]:nth-of-type(2)`);
    await fillInAndPressEnter(`[data-test-list-name="${list.name}"] [data-test-task]:nth-of-type(2) textarea`, 'zzz');

    displayedTasks = findAll(`[data-test-list-name="${list.name}"] [data-test-task]`).map((element) =>
      element.textContent.trim()
    );
    assert.deepEqual(displayedTasks, ['abc', 'xyz', 'zzz'], 'after editing a task, alphabetical order is preserved');
  });

  test('lists are sorted by date', async function (assert) {
    this.server.create('list', 'day', { name: '2021-04-26' });
    this.server.create('list', 'day', { name: '2021-04-22' });
    this.server.create('list', 'day', { name: '2021-04-23' });
    this.server.create('list', 'day', { name: '2021-04-24' });
    this.server.create('list', 'day', { name: '2021-04-25' });

    await visit('/days?date=2021-04-23');

    let listNames = Array.from(findAll('.task-list-header h2')).map((e) => e.textContent);
    assert.deepEqual(listNames, ['Apr 22, 2021', 'Apr 23, 2021', 'Apr 24, 2021', 'Apr 25, 2021', 'Apr 26, 2021']);
  });

  test('fetches and displays a list of overdue tasks when viewing current day (no date param)', async function (assert) {
    this.server.get('/tasks', function ({ tasks }, request) {
      if (request.queryParams['filter[due_before]']) {
        assert.step(
          `fetched list of overdue tasks from server, due_before=${request.queryParams['filter[due_before]']}`
        );
      }
      return tasks.all();
    });

    this.server.createList('task', 3, { dueDate: '2023-01-01' });

    await visit('/days');
    const today = format(new Date(), 'yyyy-MM-dd');
    assert.verifySteps([`fetched list of overdue tasks from server, due_before=${today}`]);
    assert.dom('[data-test-list-overdue]').exists('displays list for overdue tasks');
    assert.dom('[data-test-list-overdue] [data-test-task]').exists({ count: 3 });
  });

  test('if no overdue tasks are returned, does not display "Overdue" list', async function (assert) {
    this.server.get('/tasks', ({ tasks }, request) => {
      if (request.queryParams['filter[due_before]']) {
        assert.step(
          `fetched list of overdue tasks from server, due_before=${request.queryParams['filter[due_before]']}`
        );
        return new Collection('tasks', []);
      }
      return tasks.all();
    });

    this.server.createList('task', 12);
    await visit('/days');
    const today = format(new Date(), 'yyyy-MM-dd');
    assert.verifySteps([`fetched list of overdue tasks from server, due_before=${today}`]);
    assert.dom('[data-test-list-overdue]').doesNotExist('"Overdue" list is not displayed');
  });

  test('tasks in Overdue list are displayed with their due date', async function (assert) {
    let oldList = this.server.create('list', 'day', {
      name: '2023-01-01',
    });
    this.server.create('task', {
      dueDate: '2023-01-01',
      list: oldList,
    });

    await visit('/days');
    assert.dom('[data-test-list-overdue] [data-test-task] .due-date').hasText('Due 2023-01-01');
  });

  test('does not fetch overdue tasks when viewing a specific date', async function (assert) {
    this.server.get('/tasks', function ({ tasks }, request) {
      if (request.queryParams['filter[overdue]']) {
        assert.step('fetched list of overdue tasks from server');
      }
      return tasks.all();
    });

    this.server.createList('task', 3);

    await visit('/days?date=2023-08-01');
    assert.verifySteps([]);
    assert.dom('[data-test-list-overdue]').doesNotExist();
  });

  test('"Overdue" section is hidden when switching to a specific date', async function (assert) {
    const yesterday = this.server.create('list', 'yesterday');
    this.server.createList('task', 3, { list: yesterday, dueDate: yesterday.name });
    await visit('/days');
    assert.dom('[data-test-list-overdue]').exists();

    await click('[data-test-change-date]');
    await calendarSelect('.date-picker-content', new Date(2023, 1, 1));
    assert.dom('[data-test-list-overdue]').doesNotExist();
  });
});
