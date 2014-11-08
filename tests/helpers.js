import Ember from 'ember';

export function assertContains(selector, value, message) {
  var mess = message || "";
  var el = find(selector + ':contains(' + value + ')');
  if (el.length) {
    ok(true, selector + ' should contain ' + value + ' ' + mess);
  } else {
    ok(false, 'Expected ' + selector + ' to contain ' + value + ' but contains ' + findWithAssert(selector).text().trim() + ' ' + mess);
  }
}

export function assertDoesNotContain(selector, value, message) {
  var el = find(selector + ':contains(' + value + ')');
  if (el.length) {
    ok(false, selector + ' should NOT contain ' + value + ' but does contain ' + findWithAssert(selector).text().trim() + ' ' + message);
  } else {
    ok(true, selector + ' should not contain ' + value + ' ' + message);
  }
}

export function exists(selector) {
  return !!find(selector).length;
}

export function assertExists(selector, message) {
  message = message || "";
  ok(exists(selector), message + ('| ' + selector + ' should exist'));
}

export function assertDoesNotExist(selector, message) {
  message = message || (selector + ' should not exist');
  ok(!exists(selector), message);
}

export function mockRequest(server, verb, url, responseBody, status, testRequest) {
  status = status || 200;
  server.register(verb.toUpperCase(), url, function(request) {
    if (testRequest) {
      testRequest(JSON.parse(request.requestBody));
    }
    return [ status, { "Content-Type": "application/json" }, JSON.stringify(responseBody) ];
  });
}
