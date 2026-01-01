import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-todo/tests/helpers';
import { click, currentURL, visit } from '@ember/test-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | login & logout', function (hooks) {
  setupApplicationTest(hooks);

  test('logging out redirects to login', async function (assert) {
    await authenticateSession();
    await visit('/days');
    await click('[data-test-logout]');

    assert.strictEqual(currentURL(), '/login');
  });
});
