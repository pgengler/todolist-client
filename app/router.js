import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('days');
  this.resource('days', { path: 'days/:date' });
  this.resource('recurring');
});

export default Router;
