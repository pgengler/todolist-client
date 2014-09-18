import Ember from 'ember';

export default Ember.ArrayController.extend({
	actions: {
		addItem: function() {
			var itemEvent = this.get('newItemEvent').trim();
			if (!itemEvent) {
				return;
			}
			var self = this;
			this.store.createRecord('item', {
				event: itemEvent
			}).save().then(function() {
				self.set('newItemEvent', '');
			});
		}
	}
})
