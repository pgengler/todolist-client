export default Ember.ArrayController.extend({
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

  groupedByDate: function () {
    var result = [];

    this.get('content').forEach(function(item) {
      var hasDate = result.findBy('date', item.get('date'));

      if (!hasDate) {
        result.pushObject(Ember.Object.create({
          date: item.get('date'),
          contents: []
        }));
      }

      result.findBy('date', item.get('date')).get('contents').pushObject(item);
    });

    return result;
  }.property('content.[]')
});
