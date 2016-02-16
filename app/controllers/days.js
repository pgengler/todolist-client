import Ember from 'ember';
import dateParams from 'ember-todo/utils/date-params';

export default Ember.Controller.extend({
	sortProperties: [ 'date' ],
	queryParams: [ 'date' ],
	date: null,
	itemController: 'day',
	isPolling: false,
	sortFunction: function(a, b) {
		return (a < b) ? -1 : 1;
	},

	days: Ember.computed.alias('model.days'),
	undated: Ember.computed.alias('model.undated'),

	initiatePolling: Ember.on('init', function() {
		if (!Ember.testing) {
			this.set('isPolling', true);
		}
		this.poll();
	}),

	poll() {
		if (!Ember.testing) {
			Ember.run.later(this, this.fetchNewData, 5000);
		}
	},

	fetchNewData() {
		if (!this.get('isPolling')) {
			this.poll();
			return;
		}
		const searchParams = dateParams(this.get('date'));
		this.store.query('day', searchParams)
			.then(results => this.get('model.days').addObjects(results))
			.catch(err => Ember.Logger.assert(false, 'Failed to fetch days: ' + err))
			.finally(() => this.poll());
	},

	actions: {
		changeDate(date) {
			const dateString = moment(date).format('YYYY-MM-DD');
			this.set('date', dateString);
		},

		pausePolling() {
			this.set('isPolling', false);
		},
		resumePolling() {
			this.set('isPolling', true);
		}
	}
});
