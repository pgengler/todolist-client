import { module, test } from 'qunit';
import setupAcceptanceTest from 'ember-todo/tests/helpers/setup-acceptance-test';
import { currentRouteName, visit } from '@ember/test-helpers';

module('Acceptance | recurring tasks', function(hooks) {
  setupAcceptanceTest(hooks);

  test('redirects to login if user is not authenticated', async function(assert) {
    await visit('/recurring');

    assert.equal(currentRouteName(), 'login');
  });
});
