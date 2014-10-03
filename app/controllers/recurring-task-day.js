import Ember from 'ember';

export default Ember.ObjectController.extend({
	taskSortProperties: [ 'description' ],
	sortedTasks: Ember.computed.sort('tasks', 'taskSortProperties'),

	newTaskDescription: '',

	actions: {
		addTask: function() {
			var description = this.get('newTaskDescription').trim();
			if (!Ember.isEmpty(description)) {
				var self = this;
				this.store.createRecord('recurringTask', {
					description: description,
					day: this.get('model')
				}).save().then(function(task) {
					self.get('tasks').addObject(task);
					self.set('newTaskDescription', '');
				});
			}
		}
	}
});
