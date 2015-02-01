import Ember from 'ember';
import dateParams from 'ember-todo/utils/date-params';

export default Ember.Route.extend({
	queryParams: {
		date: { refreshModel: true }
	},

	model: function(params) {
		var searchParams = dateParams(params.date);
		return Ember.RSVP.hash({
			days: this.store.find('day', searchParams),
			undated: this.store.find('day', 'undated')
		});
	}
});
