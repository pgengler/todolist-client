import Ember from 'ember';

export default Ember.ObjectController.extend({
	actions: {
		editItem: function() {
			this.set('isEditing', true);
		},

		updateItem: function() {
			if (!Ember.isEmpty(this.get('model.event'))) {
				this.get('model').save();
				this.set('isEditing', false);
			}
		}
	},

	isEditing: false
})
