import Ember from 'ember';

export default Ember.Route.extend({
	queryParams: {
		date: { refreshModel: true }
	},

	model: function(params) {
		var defaultParams = {
			after_days: 3,
			before_days: 1,
			date: moment().format('YYYY-MM-DD')
		};
		Ember.$.extend(params, defaultParams, params);
		return this.store.find('day', params);
	}
});
