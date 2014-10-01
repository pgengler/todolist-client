import Ember from 'ember';

export default Ember.ObjectController.extend({
	taskSort: [ 'description' ],
	sortedTasks: Ember.computed.sort('tasks', 'taskSort'),
	actions: {
		addTask: function() {
			var taskDescription = this.get('newTaskDescription').trim();
			if (!taskDescription) {
				return;
			}
			var self = this;
			this.store.createRecord('task', {
				description: taskDescription,
				day: this.get('model')
			}).save().then(function(task) {
				self.get('tasks').addObject(task);
				self.set('newTaskDescription', '');
			});
		},

		moveTaskToDay: function(id) {
			var self = this;
			this.store.find('task', id).then(function(task) {
				task.get('day.tasks').removeObject(task);
				self.get('tasks').pushObject(task);
				task.set('day', self.get('model'));
				task.save();
			});
		}
	},

	newTaskDescription: ''
});
