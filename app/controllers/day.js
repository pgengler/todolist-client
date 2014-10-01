import Ember from 'ember';

export default Ember.ObjectController.extend({
	itemSort: [ 'event' ],
	sortedItems: Ember.computed.sort('items', 'itemSort'),
	actions: {
		addItem: function() {
			var itemEvent = this.get('newItemEvent').trim();
			if (!itemEvent) {
				return;
			}
			var self = this;
			this.store.createRecord('item', {
				event: itemEvent,
				day: this.get('model')
			}).save().then(function(item) {
				self.get('items').addObject(item);
				self.set('newItemEvent', '');
			});
		},

		moveItemToDay: function(id) {
			var self = this;
			this.store.find('item', id).then(function(item) {
				item.get('day.items').removeObject(item);
				self.get('items').pushObject(item);
				item.set('day', self.get('model'));
				item.save();
			});
		}
	},

	newItemEvent: ''
});
