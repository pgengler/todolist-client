import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-todo/tests/helpers';
import { currentURL, visit } from '@ember/test-helpers';

module('Acceptance | recurring tasks', function (hooks) {
  setupApplicationTest(hooks);

  test('redirects to login if user is not authenticated', async function (assert) {
    await visit('/recurring');

    assert.strictEqual(currentURL(), '/login');
  });
});
