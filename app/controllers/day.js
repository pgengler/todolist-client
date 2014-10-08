import Ember from 'ember';

export default Ember.ObjectController.extend({
	taskSort: [ 'description' ],
	sortedTasks: Ember.computed.sort('tasks', 'taskSort'),

	newTaskDescription: '',
	isPast: function() {
		var date = this.get('date');
		var now  = moment();
		return (date.isBefore(now, 'day') && !date.isSame(now, 'day'));
	}.property('date'),

	isCurrent: function() {
		return this.get('date').isSame(moment(), 'day');
	}.property('date'),

	isFuture: function() {
		return this.get('date').isAfter(moment(), 'day');
	}.property('date'),

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
	}
});
