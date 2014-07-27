import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: 'event',

  actions: {
    createItem: function() {
      var event = this.get('newEvent').trim();
      if (!event) {
        return;
      }

      var item = this.store.createRecord('item', {
        'event': event
      });
      item.save();

      this.set('newEvent', '');
    }
  }
});
