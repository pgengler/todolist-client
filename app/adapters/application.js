import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
	namespace: 'api/v1',
	headers: {
		'X-Client-Timezone-Offset': (-1 * (new Date()).getTimezoneOffset())
	}
});
