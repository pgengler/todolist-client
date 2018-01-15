import { test } from 'qunit';
import moduleForAcceptance from 'ember-todo/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'ember-todo/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | index');

test('redirects to login page when user is not authenticated', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentRouteName(), 'login', 'redirected to login page');
  });
});

test('redirects to days view when user is authenticated', function(assert) {
  authenticateSession(this.application);
  visit('/');

  andThen(function() {
    assert.equal(currentRouteName(), 'days', 'redirected to days page');
  });
});
