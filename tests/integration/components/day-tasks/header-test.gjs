import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Header from 'ember-todo/components/day-tasks/header';

module('Integration | Component | DayTasks::Header', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the day and formatted date', async function (assert) {
    const list = {
      name: '2017-12-31',
    };
    await render(<template><Header @list={{list}} /></template>);

    assert.dom('h1').hasText('Sunday');
    assert.dom('h2').hasText('Dec 31, 2017');
  });
});
