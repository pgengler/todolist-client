import Ember from 'ember';

export default Ember.ArrayController.extend({
	itemController: 'tag',

	actions: {
		saveTag: function() {
			var tagName = this.get('newTag').trim();
			if (!tagName) {
				return;
			}
			var self = this;
			this.store.createRecord('tag', {
				name: tagName
			}).save().then(function() {
				self.set('newTag', '');
			});
		}
	}
});
