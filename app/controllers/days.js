import Ember from 'ember';
import dateParams from 'ember-todo/utils/date-params';

export default Ember.ArrayController.extend({
	sortProperties: [ 'date' ],
	queryParams: [ 'date' ],
	itemController: 'day',
	pausePolling: false,

	initiatePolling: function() {
		this.poll();
	}.on('init'),

	poll: function() {
		if (!Ember.testing) {
			Ember.run.later(this, this.fetchNewData, 5000);
		}
	},

	fetchNewData: function() {
		if (this.get('pausePolling')) {
			this.poll();
			return;
		}
		var controller = this;
		var searchParams = dateParams(this.get('date'));
		this.store.find('day', searchParams).then(function(results) {
			controller.get('model').addObjects(results);
		}).catch(function() {
			Ember.Logger.assert(false, 'Failed to fetch days');
		}).finally(function() {
			controller.poll();
		});
	},

	actions: {
		changeDate: function(date) {
			var dateString = moment(date).format('YYYY-MM-DD');
			this.set('date', dateString);
		},

		editingStart: function() {
			this.set('pausePolling', true);
		},
		editingEnd: function() {
			this.set('pausePolling', false);
		}
	}
});
