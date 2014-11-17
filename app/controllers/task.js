import Ember from 'ember';

export default Ember.ObjectController.extend({
	isEditing: false,

	actions: {
		editTask: function() {
			this.set('editDescription', this.get('description'));
			this.set('isEditing', true);
			this.send('editingStart');
		},

		cancelEdit: function() {
			this.set('editDescription', '');
			this.set('isEditing', false);
			this.send('editingEnd');
		},

		updateTask: function() {
			var description = this.get('editDescription').trim();
			if (!Ember.isEmpty(description)) {
				this.set('description', description);
				this.get('model').save();
				this.set('isEditing', false);
			} else {
				this.get('model').deleteRecord();
				this.get('model').save();
			}
			this.send('editingEnd');
		}
	}
});
