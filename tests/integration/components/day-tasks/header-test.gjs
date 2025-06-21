import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Header from "../../../../app/components/day-tasks/header.js";

module('Integration | Component | DayTasks::Header', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the day and formatted date', async function (assert) {
    let list = {
      name: '2017-12-31',
    };
    this.set('list', list);
    await render(<template>
      <Header @list={{this.list}} />
    </template>);

    assert.dom('h1').hasText('Sunday');
    assert.dom('h2').hasText('Dec 31, 2017');
  });
});
