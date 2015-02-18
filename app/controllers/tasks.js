import Ember from 'ember';

export default Ember.Controller.extend({
	sortProperties: [ 'description' ],
	tasks: Ember.computed.alias('model'),
	sortedTasks: Ember.computed.sort('tasks', 'sortProperties')
});
