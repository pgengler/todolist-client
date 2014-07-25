import Ember from 'ember';
import GroupableMixin from 'ember-todo/mixins/groupable';

export default Ember.ArrayController.extend(GroupableMixin, {
  sortProperties: [ 'date', 'event' ],
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
  },
  groupBy: 'date'
});
