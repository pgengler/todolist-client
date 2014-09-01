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
		}
	},
	updateSortOrder: function(positions) {
		console.dir(positions);
		this.beginPropertyChanges();
		this.get('itemTags').forEach(function(itemTag) {
			var position = positions[ itemTag.get('id') ];
			console.log("Moving itemTag with ID %s to position %d", itemTag.get('id'), position);
			itemTag.set('position', position);
		}, this);
		this.endPropertyChanges();
	}
});
