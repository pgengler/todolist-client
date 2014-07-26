import Ember from 'ember';

export default Ember.ObjectController.extend({
	actions: {
		saveItem: function() {
			var tag = this.get('model');
			var itemText = this.get('newItem').trim();
			if (!itemText) {
				return;
			}
			var item = this.store.createRecord('item', {
				event: itemText
			});
		}
	}
});
