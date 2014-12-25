import Ember from 'ember';

export default Ember.ArrayController.extend({
	sortProperties: [ 'id' ],
	itemController: 'recurring-task-day'
});
