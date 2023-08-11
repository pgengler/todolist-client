import { module, test } from 'qunit';
import { click, currentURL, findAll, visit } from '@ember/test-helpers';
import { clickToEdit } from 'ember-todo/tests/helpers/click-to-edit';
import fillInAndPressEnter from 'ember-todo/tests/helpers/fill-in-and-press-enter';
import setupAcceptanceTest from 'ember-todo/tests/helpers/setup-acceptance-test';
import { calendarSelect } from 'ember-power-calendar/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { Collection } from 'miragejs';

module('Acceptance | Lists', function (hooks) {
  setupAcceptanceTest(hooks);
  hooks.beforeEach(() => authenticateSession());

  test('lists display as expanded or collapsed depending on their state', async function (assert) {
    let expandedList = this.server.create('list', 'asExpanded');
    let collapsedList = this.server.create('list', 'asCollapsed');

    await visit('/');
    assert.dom(`[data-test-list-name="${expandedList.name}"]`).hasClass('list-expanded');
    assert.dom(`[data-test-list-name="${collapsedList.name}"]`).hasClass('list-collapsed');
  });

  test('collapsed lists display in their own column', async function (assert) {
    let expandedList = this.server.create('list', 'asExpanded');
    let collapsedLists = this.server.createList('list', 5, 'asCollapsed');

    await visit('/');
    assert.dom('.collapsed-lists .task-list.list-collapsed').exists({ count: 5 }, 'displays all collapsed lists in single section');
    assert.dom(`.collapsed-lists [data-test-list-name="${expandedList.name}"]`).doesNotExist('expanded list does not display in same section as collapsed lists');
  });

  test('expanding a list updates its state', async function (assert) {
    this.server.patch('/lists/:id', function ({ lists }, request) {
      let list = lists.find(request.params.id);
      let attrs = this.normalizedRequestAttrs();
      assert.step(`updated list ${list.id}, set expanded to ${attrs.expanded}`);
      list.update(attrs);
      return list;
    });

    let collapsedList = this.server.create('list', 'asCollapsed');
    let expandedList = this.server.create('list', 'asExpanded');

    await visit('/');
    assert.dom(`[data-test-list-name="${collapsedList.name}"]`).hasClass('list-collapsed', 'displays in "collapsed" state initially');

    await click(`[data-test-list-name="${collapsedList.name}"] button[data-test-toggle-expanded]`);
    assert.verifySteps([`updated list ${collapsedList.id}, set expanded to true`]);
    assert.dom(`[data-test-list-name="${collapsedList.name}"]`).hasClass('list-expanded', 'displays in "expanded" state after toggling');
  });

  test('collapsing a list updates its state', async function (assert) {
    this.server.patch('/lists/:id', function ({ lists }, request) {
      let list = lists.find(request.params.id);
      let attrs = this.normalizedRequestAttrs();
      assert.step(`updated list ${list.id}, set expanded to ${attrs.expanded}`);
      list.update(attrs);
      return list;
    });

    let collapsedList = this.server.create('list', 'asCollapsed');
    let expandedList = this.server.create('list', 'asExpanded');

    await visit('/');
    assert.dom(`[data-test-list-name="${expandedList.name}"]`).hasClass('list-expanded', 'displays in "expanded" state initially');

    await click(`[data-test-list-name="${expandedList.name}"] button[data-test-toggle-expanded]`);
    assert.verifySteps([`updated list ${expandedList.id}, set expanded to false`]);
    assert.dom(`[data-test-list-name="${expandedList.name}"]`).hasClass('list-collapsed', 'displays in "collapsed" state after toggling');
  });
});
