import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-todo/tests/helpers';
import { currentURL, visit } from '@ember/test-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | index', function (hooks) {
  setupApplicationTest(hooks);

  test('redirects to login page when user is not authenticated', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/login', 'redirected to login page');
    assert.dom('.top-nav').doesNotExist('does not show top nav when not logged in');
  });

  test('redirects to days view when user is authenticated', async function (assert) {
    await authenticateSession(this.application);
    await visit('/');

    assert.strictEqual(currentURL(), '/days', 'redirected to days page');
    assert.dom('.top-nav').exists('shows top nav when logged in');
  });
});
