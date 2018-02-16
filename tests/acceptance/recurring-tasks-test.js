import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { currentRouteName, visit } from '@ember/test-helpers';

module('Acceptance | recurring tasks', function(hooks) {
  setupApplicationTest(hooks);

  test('redirects to login if user is not authenticated', async function(assert) {
    await visit('/recurring');

    assert.equal(currentRouteName(), 'login');
  });
});
