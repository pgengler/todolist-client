import { test } from 'qunit';
import moduleForAcceptance from 'ember-todo/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | recurring tasks');

test('redirects to login if user is not authenticated', function(assert) {
  visit('/recurring');

  andThen(function() {
    assert.equal(currentRouteName(), 'login');
  });
});
