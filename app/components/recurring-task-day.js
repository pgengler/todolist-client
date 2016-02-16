import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'task-list' ],
	day: null,
	tasks: Ember.computed.alias('day.tasks'),
	taskSortProperties: [ 'description' ],
	sortedTasks: Ember.computed.sort('tasks', 'taskSortProperties'),

	newTaskDescription: '',

	actions: {
		addTask() {
			const description = this.get('newTaskDescription').trim();
			if (!Ember.isEmpty(description)) {
				const day = this.get('day');
				this.get('store')
					.createRecord('recurringTask', { description, day })
					.save()
					.then(task => {
						day.get('tasks').addObject(task);
						this.set('newTaskDescription', '');
					});
			}
		}
	}
});
