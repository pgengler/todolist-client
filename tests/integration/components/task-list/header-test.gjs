import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Header from 'ember-todo/components/task-list/header';

module('Integration | Component | TaskList::Header', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the list name', async function (assert) {
    const list = {
      name: 'Foo Bar Baz',
    };
    await render(<template><Header @list={{list}} /></template>);

    assert.dom('.task-list-header').exists('has header class');
    assert.dom('h1').hasText('Foo Bar Baz', 'renders list name');
  });
});
