import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'li',
	editDesciption: Ember.computed.oneWay('task.description'),
	isEditing: false,

	actions: {
		editTask: function() {
			this.set('editDescription', this.get('task.description'));
			this.set('isEditing', true);
			this.sendAction('editingStart');
		},

		cancelEdit: function() {
			this.set('editDescription', '');
			this.set('isEditing', false);
			this.sendAction('editingEnd');
		},

		updateTask: function() {
			var task = this.get('task');
			var description = this.get('editDescription');
			if (!Ember.isEmpty(description)) {
				task.set('description', description);
				task.save();
				this.set('isEditing', false);
			} else {
				task.deleteRecord();
				task.save();
			}
			this.sendAction('editingEnd');
		}
	}
});
