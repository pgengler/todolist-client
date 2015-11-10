import Ember from 'ember';
import { filterBy, sortBy } from '../utils/computed';

function plaintext(str)
{
	return str.replace(/[^A-Za-z0-9]/g, '');
}

export default Ember.Component.extend({
	classNames: [ 'task-list', 'spec-day' ],
	classNameBindings: [ 'hasUnfinishedTasks', 'dragClass' ],
	day: null,
	newTaskDescription: '',
	dragClass: '',

	store: Ember.inject.service(),

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
			this.get('store').createRecord('task', {
				description: taskDescription,
				day: day
			}).save().then(function(task) {
				day.get('tasks').addObject(task);
				self.set('newTaskDescription', '');
			});
		},

		moveTaskToDay: function(id) {
			this.set('dragClass', '');
			var day = this.get('day');
			this.store.findRecord('task', id).then(function(task) {
				task.set('day', day);
				task.save();
			});
		},

		editingStart: function() {
			this.sendAction('editingStart');
		},
		editingEnd: function() {
			this.sendAction('editingEnd');
		},

		addDropTargetHighlight: function() {
			this.set('dragClass', 'active-drop-target');
		},
		removeDropTargetHighlight: function() {
			this.set('dragClass', '');
		}
	}
});
