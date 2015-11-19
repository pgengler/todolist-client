import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
	date: (i) => moment().subtract(i, 'days').format('YYYY-MM-DD'),
	task_ids: [ ]
});
