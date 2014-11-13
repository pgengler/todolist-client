import Ember from 'ember';

export default Ember.Route.extend({
	queryParams: {
		date: { refreshModel: true }
	},

	model: function(params) {
		return this.store.find('day', params);
	},
	afterModel: function() {
		if (!Ember.testing) {
			Ember.run.later(this, this.refresh, 5000);
		}
	}
});
