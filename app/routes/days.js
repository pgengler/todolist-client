import Ember from 'ember';
import dateParams from 'ember-todo/utils/date-params';

export default Ember.Route.extend({
	queryParams: {
		date: { refreshModel: true }
	},

	model: function(params) {
		var searchParams = dateParams(params.date);
		return this.store.find('day', searchParams);
	}
});
