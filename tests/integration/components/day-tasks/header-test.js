import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | DayTasks::Header', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the day and formatted date', async function (assert) {
    let list = {
      name: '2017-12-31',
    };
    this.set('list', list);
    await render(hbs`
      <DayTasks::Header @list={{this.list}} />
    `);

    assert.dom('h1').hasText('Sunday');
    assert.dom('h2').hasText('Dec 31, 2017');
  });
});
