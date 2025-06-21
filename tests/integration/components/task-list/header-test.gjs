import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | TaskList::Header', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the list name', async function (assert) {
    this.set('list', {
      name: 'Foo Bar Baz',
    });
    await render(hbs`
      <TaskList::Header @list={{this.list}} />
    `);

    assert.dom('.task-list-header').exists('has header class');
    assert.dom('h1').hasText('Foo Bar Baz', 'renders list name');
  });
});
