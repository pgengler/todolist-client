import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
	namespace: 'api/v1',
	headers: {
		CLIENT_TIMEZONE: (-1 * (new Date()).getTimezoneOffset())
	}
});
