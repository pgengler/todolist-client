import Ember from 'ember';

var Router = Ember.Router.extend({
  location: EmberTodoENV.locationType
});

Router.map(function() {
  this.resource('days');
});

export default Router;
