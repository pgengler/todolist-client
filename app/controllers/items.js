import Ember from 'ember';
import GroupableMixin from 'ember-todo/mixins/groupable';

export default Ember.ArrayController.extend(GroupableMixin, {
  sortProperties: [ 'date', 'startTime', 'endTime', 'event', 'location' ],
  actions: {
    createItem: function() {
      var event = this.get('newEvent').trim();
      if (!event) {
        return;
      }
      var location = this.get('newLocation');
      if (location) {
        location = location.trim();
      }
      var startTime = this.get('newStartTime');
      if (startTime) {
        startTime = startTime.trim();
      }
      var endTime = this.get('newEndTime');
      if (endTime) {
        endTime = endTime.trim();
      }

      var item = this.store.createRecord('item', {
        'event': event,
        'location': location,
        'startTime': startTime,
        'endTime': endTime
      });
      item.save();

      this.set('newEvent', '');
      this.set('newLocation', '');
      this.set('newStartTime', '');
      this.set('newEndTime', '');
    }
  },
  groupBy: 'date'
});
