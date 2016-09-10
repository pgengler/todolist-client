import Ember from 'ember';

export default Ember.Controller.extend({
  sortProperties: [ 'id' ],
  days: Ember.computed.sort('model', 'sortProperties')
});
