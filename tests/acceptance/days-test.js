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
import keyEvent from 'ember-todo/tests/helpers/key-event';
import { authenticateSession } from 'ember-simple-auth/test-support';

async function fillInAndPressEnter(selector, text) {
  await fillIn(selector, text);
  return keyEvent(selector, 'Enter');
}

module('Acceptance | Days', function (hooks) {
  setupAcceptanceTest(hooks);
  hooks.beforeEach(() => authenticateSession());

  test('visiting /days shows lists', async function (assert) {
    this.server.create('list', {
      listType: 'day',
      name: '2014-11-06',
    });
    this.server.createList('list', 4, { listType: 'day' });
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
    let list = this.server.create('list', {
      listType: 'day',
      name: '2018-01-01',
    });
    this.server.create('task', { description: 'xyz', list });
    this.server.create('task', { description: 'abc', list });
    this.server.create('task', { description: 'mno', list });

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
