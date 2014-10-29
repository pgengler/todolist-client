import Ember from 'ember';

export default Ember.ArrayController.extend({
	sortProperties: [ 'date' ],
	queryParams: [ 'date' ],

	actions: {
		changeDate: function(date) {
			var dateString = moment(date).format('YYYY-MM-DD');
			this.set('date', dateString);
		}
	}
});
