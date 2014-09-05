import Ember from 'ember';

export default Ember.ObjectController.extend({
	sortedItemTags: Ember.computed.sort('savedItemTags', 'sortProperties'),
	sortProperties: [ 'position:asc' ],
	actions: {
		saveItem: function() {
			var tag = this.get('model');
			var itemText = this.get('newItem').trim();
			if (!itemText) {
				return;
			}
			var self = this;
			var item = this.store.createRecord('item', {
				event: itemText
			});
			item.save().then(function() {
				var item_tag = self.store.createRecord('itemTag', {
					item: item,
					tag: tag
				});
				return item_tag.save();
			}).then(function() {
				self.set('newItem', '');
			});
		},
		updateSortOrder: function(positions) {
			this.get('itemTags').forEach(function(itemTag) {
				var position = positions[ itemTag.get('id') ];
				itemTag.set('position', position);
			}, this);
			this.get('itemTags').filterBy('isDirty', true).forEach(function(itemTag) {
				itemTag.save();
			});
		}
	}
});
