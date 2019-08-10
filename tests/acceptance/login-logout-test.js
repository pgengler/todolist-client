import { module, test } from 'qunit';
import setupAcceptanceTest from 'ember-todo/tests/helpers/setup-acceptance-test';
import { click, currentRouteName, visit } from '@ember/test-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | login & logout', function(hooks) {
  setupAcceptanceTest(hooks);

  test('logging out redirects to login', async function(assert) {
    await authenticateSession();
    await visit('/days');
    await click('[data-test-logout]');

    assert.equal(currentRouteName(), 'login');
  });
});
