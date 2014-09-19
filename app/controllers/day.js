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
			this.get('items').addObject(this.store.createRecord('item', {
				event: itemEvent
			}));
			this.set('newItemEvent', '');
		}
	},

	newItemEvent: ''
});
