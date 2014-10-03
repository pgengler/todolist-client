import Ember from 'ember';

export default Ember.ObjectController.extend({
	taskSortProperties: [ 'description' ],
	sortedTasks: Ember.computed.sort('tasks', 'taskSortProperties')
});
