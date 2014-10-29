import Ember from 'ember';

export default Ember.ArrayController.extend({
	sortProperties: [ 'date' ],

	actions: {
		changeDate: function(date) {
			var dateString = moment(date).format('YYYY-MM-DD');
			this.transitionToRoute('/days/' + dateString);
		}
	}
});
