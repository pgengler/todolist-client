import Ember from 'ember';

export default Ember.Route.extend({
	queryParams: {
		date: { refreshModel: true }
	},

	model: function(params) {
		return this.store.find('day', params);
	}
});
