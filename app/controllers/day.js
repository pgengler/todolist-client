import Ember from 'ember';
import { filterBy, sortBy } from '../utils/computed';

export default Ember.ObjectController.extend({
	finishedTasks: filterBy('tasks', 'done', true),
	sortedFinishedTasks: sortBy('finishedTasks', 'description'),
	unfinishedTasks: filterBy('tasks', 'done', false),
	sortedUnfinishedTasks: sortBy('unfinishedTasks', 'description'),

	hasUnfinishedTasks: Ember.computed.notEmpty('unfinishedTasks'),

	newTaskDescription: '',
	isPast: function() {
		var date = this.get('date');
		var now  = moment();
		now.subtract(now.zone(), 'minutes').utc();
		return (date.isBefore(now, 'day') && !date.isSame(now, 'day'));
	}.property('date'),

	isCurrent: function() {
		var now  = moment();
		now.subtract(now.zone(), 'minutes').utc();
		return this.get('date').isSame(now, 'day');
	}.property('date'),

	isFuture: function() {
		var now  = moment();
		now.subtract(now.zone(), 'minutes').utc();
		return this.get('date').isAfter(now, 'day');
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
				task.set('day', self.get('model'));
				task.save();
			});
		}
	}
});
