import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click, currentRouteName, visit } from '@ember/test-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | login & logout', function(hooks) {
  setupApplicationTest(hooks);

  test('logging out redirects to login', async function(assert) {
    await authenticateSession();
    await visit('/days');
    await click('.spec-logout');

    assert.equal(currentRouteName(), 'login');
  });
});
