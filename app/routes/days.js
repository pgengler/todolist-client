import Ember from 'ember';
import dateParams from 'ember-todo/utils/date-params';

export default Ember.Route.extend({
	queryParams: {
		date: { refreshModel: true }
	},

	model(params) {
		const searchParams = dateParams(params.date);
		return Ember.RSVP.hash({
			days: this.store.query('day', searchParams),
			undated: this.store.findRecord('day', 'undated')
		});
	}
});
