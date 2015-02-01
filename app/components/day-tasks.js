import Ember from 'ember';
import { filterBy, sortBy } from '../utils/computed';

function plaintext(str)
{
	return str.replace(/[^A-Za-z0-9]/g, '');
}

export default Ember.Component.extend({
	classNames: [ 'task-list', 'spec-day' ],
	classNameBindings: [ 'hasUnfinishedTasks' ],
	day: null,
	newTaskDescription: '',

	finishedTasks: filterBy('day.tasks', 'done', true),
	sortedFinishedTasks: sortBy('finishedTasks', 'description', plaintext),
	unfinishedTasks: filterBy('day.tasks', 'done', false),
	sortedUnfinishedTasks: sortBy('unfinishedTasks', 'description', plaintext),

	hasUnfinishedTasks: Ember.computed.notEmpty('unfinishedTasks'),

	actions: {
		addTask: function() {
			var taskDescription = this.get('newTaskDescription').trim();
			if (!taskDescription) {
				return;
			}
			var self = this;
			var day = this.get('day');
			this.store.createRecord('task', {
				description: taskDescription,
				day: day
			}).save().then(function(task) {
				day.get('tasks').addObject(task);
				self.set('newTaskDescription', '');
			});
		},

		moveTaskToDay: function(id) {
			var day = this.get('day');
			this.store.find('task', id).then(function(task) {
				task.set('day', day);
				task.save();
			});
		}
	},

	isPast: function() {
		var date = this.get('day.date');
		var now  = moment();
		now.subtract(now.zone(), 'minutes').utc();
		return (date.isBefore(now, 'day') && !date.isSame(now, 'day'));
	}.property('day.date'),

	isCurrent: function() {
		var now = moment();
		now.subtract(now.zone(), 'minutes').utc();
		return this.get('day.date').isSame(now, 'day');
	}.property('day.date'),

	isFuture: function() {
		var now = moment();
		now.subtract(now.zone(), 'minutes').utc();
		return this.get('day.date').isAfter(now, 'day');
	}.property('day.date'),
});
