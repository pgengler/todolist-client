import Ember from 'ember';

export default Ember.ObjectController.extend({
	isEditing: false,

	actions: {
		editTask: function() {
			this.set('isEditing', true);
		},

		updateTask: function() {
			if (!Ember.isEmpty(this.get('model.description'))) {
				this.get('model').save();
				this.set('isEditing', false);
			}
		}
	}
});
