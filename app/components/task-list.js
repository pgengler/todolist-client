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

		dropped(id, event) {
			let updateTask = event.ctrlKey ? false : true;
			this.set('dragClass', '');
			const day = this.get('day');

			this.store.findRecord('task', id).then(task => {
				if (updateTask) {
					task.set('day', day);
					task.save();
				} else {
					let newTask = this.store.createRecord('task', {
						description: task.get('description'),
						day
					});
					newTask.save();
				}
			});
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
