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
			this.get('items').addObject(this.store.createRecord('item', {
				event: itemEvent
			}));
			this.set('newItemEvent', '');
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
