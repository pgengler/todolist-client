import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'draggable-task' ],
	classNameBindings: [ , 'task.isDone:done', 'task.isEditing:editing' ],
	attributeBindings: [ 'draggable' ],
	tagName: 'li',

	draggable: 'true',
	isEditing: false,
	editDescription: '',
	task: null,

	dragStart: function(event) {
		event.dataTransfer.setData('text/data', this.get('task.id'));
	},

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
			var description = this.get('editDescription').trim();
			var task = this.get('task');
			if (!Ember.isEmpty(description)) {
				task.set('description', description);
				task.save();
				this.set('isEditing', false);
			} else {
				task.deleteRecord();
				task.save();
			}
			this.sendAction('editingEnd');
		},
	}
});
