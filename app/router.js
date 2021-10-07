import EmberRouter from '@ember/routing/router';
import config from 'ember-todo/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('days', function () {
    /* nothing here, but this does generate index/loading routes */
  });
  this.route('recurring');
  this.route('login');
});
