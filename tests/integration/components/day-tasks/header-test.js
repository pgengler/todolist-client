import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | day tasks/header', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the day and formatted date', async function (assert) {
    let list = EmberObject.create({
      name: '2017-12-31',
    });
    this.set('list', list);
    await render(hbs`
      {{day-tasks/header list=list}}
    `);

    assert.dom('h1').hasText('Sunday');
    assert.dom('h2').hasText('Dec 31, 2017');
  });
});
