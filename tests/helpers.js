import Ember from 'ember';
import QUnit from 'qunit';

QUnit.assert.contains = function(selector, value, message) {
  var mess = message || "";
  var el = find(selector + ':contains(' + value + ')');
  if (el.length) {
    this.ok(true, selector + ' should contain ' + value + ' ' + mess);
  } else {
    this.ok(false, 'Expected ' + selector + ' to contain ' + value + ' but contains ' + findWithAssert(selector).text().trim() + ' ' + mess);
  }
};

QUnit.assert.doesNotContain = function(selector, value, message) {
  var el = find(selector + ':contains(' + value + ')');
  if (el.length) {
    this.ok(false, selector + ' should NOT contain ' + value + ' but does contain ' + findWithAssert(selector).text().trim() + ' ' + message);
  } else {
    this.ok(true, selector + ' should not contain ' + value + ' ' + message);
  }
};

function exists(selector) {
  return !!find(selector).length;
}

QUnit.assert.exists = function(selector, message) {
  message = message || "";
  this.ok(exists(selector), message + ('| ' + selector + ' should exist'));
};

QUnit.assert.doesNotExist = function(selector, message) {
  message = message || (selector + ' should not exist');
  this.ok(!exists(selector), message);
};

export function mockRequest(server, verb, url, responseBody, status, testRequest) {
  status = status || 200;
  server.register(verb.toUpperCase(), url, function(request) {
    if (testRequest) {
      testRequest(JSON.parse(request.requestBody));
    }
    return [ status, { "Content-Type": "application/json" }, JSON.stringify(responseBody) ];
  });
}
