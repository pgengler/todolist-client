import Ember from 'ember';
import DraggableDropzone from '../mixins/draggable-dropzone';
import { filterBy, sortBy } from '../utils/computed';

function plaintext(str)
{
	return str.replace(/[^A-Za-z0-9]/g, '');
}

export default Ember.Component.extend(DraggableDropzone, {
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

	cloneTask(task) {
		let newTask = this.store.createRecord('task', {
			day: this.get('day'),
			description: task.get('description')
		});
		newTask.save();
	},
	moveTaskToDay(task) {
		task.set('day', this.get('day'));
		task.save();
	},

	actions: {
		addTask() {
			const description = this.get('newTaskDescription').trim();
			if (!description) {
				return;
			}
			let day = this.get('day');
			this.get('store')
				.createRecord('task', { description, day })
				.save()
				.then(task => {
					day.get('tasks').addObject(task);
					this.set('newTaskDescription', '');
				});
		},

		clearTextarea() {
			this.set('newTaskDescription', '');
		},

		dropped(id, event) {
			let cloningTask = event.ctrlKey ? true : false;

			this.set('dragClass', '');

			this.store.findRecord('task', id).then(task => cloningTask ? this.cloneTask(task) : this.moveTaskToDay(task));
		},

		editingStart() {
			this.sendAction('editingStart');
		},
		editingEnd() {
			this.sendAction('editingEnd');
		},

		dragIn() {
			this.set('dragClass', 'active-drop-target');
		},
		dragOut() {
			this.set('dragClass', '');
		}
	}
});
