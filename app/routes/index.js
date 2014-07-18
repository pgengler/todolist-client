import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      items: this.store.findAll('item'),
      tags: this.store.findAll('tag')
    });
  }
});
