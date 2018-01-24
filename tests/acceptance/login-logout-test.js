import { test } from 'qunit';
import moduleForAcceptance from 'ember-todo/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'ember-todo/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | login & logout');

test('logging out redirects to login', function(assert) {
  authenticateSession(this.application);
  visit('/days');
  click('.spec-logout');

  andThen(function() {
    assert.equal(currentRouteName(), 'login');
  });
});
