import EmberRouter from '@embroider/router';
import config from 'ember-todo/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('days');
  this.route('recurring');
  this.route('login');
});
