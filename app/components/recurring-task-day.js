import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'task-list' ],
	day: null,
	tasks: Ember.computed.alias('day.tasks'),
	taskSortProperties: [ 'description' ],
	sortedTasks: Ember.computed.sort('tasks', 'taskSortProperties'),

	newTaskDescription: '',

	actions: {
		addTask: function() {
			var description = this.get('newTaskDescription').trim();
			if (!Ember.isEmpty(description)) {
				var day = this.get('day');
				var component = this;
				this.get('store').createRecord('recurringTask', {
					description: description,
					day: day
				}).save().then(function(task) {
					day.get('tasks').addObject(task);
					component.set('newTaskDescription', '');
				});
			}
		}
	}
});
