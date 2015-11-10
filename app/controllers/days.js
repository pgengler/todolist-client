import Ember from 'ember';
import dateParams from 'ember-todo/utils/date-params';

export default Ember.Controller.extend({
	sortProperties: [ 'date' ],
	queryParams: [ 'date' ],
	itemController: 'day',
	isPolling: false,
	sortFunction: function(a, b) {
		return (a < b) ? -1 : 1;
	},

	days: function() {
		return this.get('model.days');
	}.property('model'),

	undated: function() {
		return this.get('model.undated');
	}.property('model'),

	initiatePolling: function() {
		if (!Ember.testing) {
			this.set('isPolling', true);
		}
		this.poll();
	}.on('init'),

	poll: function() {
		if (!Ember.testing) {
			Ember.run.later(this, this.fetchNewData, 5000);
		}
	},

	fetchNewData: function() {
		if (!this.get('isPolling')) {
			this.poll();
			return;
		}
		var controller = this;
		var searchParams = dateParams(this.get('date'));
		this.store.query('day', searchParams).then(function(results) {
			controller.get('model.days').addObjects(results);
		}).catch(function(err) {
			Ember.Logger.assert(false, 'Failed to fetch days: ' + err);
		}).finally(function() {
			controller.poll();
		});
	},

	actions: {
		changeDate: function(date) {
			var dateString = moment(date).format('YYYY-MM-DD');
			this.set('date', dateString);
		},

		pausePolling: function() {
			this.set('isPolling', false);
		},
		resumePolling: function() {
			this.set('isPolling', true);
		}
	}
});
