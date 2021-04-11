import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | task list/header', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the list name', async function (assert) {
    let list = EmberObject.create({
      name: 'Foo Bar Baz',
    });
    this.set('list', list);
    await render(hbs`
      {{task-list/header list=list}}
    `);

    assert.dom('.task-list-header').exists('has header class');
    assert.dom('h1').hasText('Foo Bar Baz', 'renders list name');
  });
});
