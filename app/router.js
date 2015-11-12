import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('days');
  this.resource('recurring');
  this.resource('tasks', function() {
    this.route('new');
  });
});

export default Router;
