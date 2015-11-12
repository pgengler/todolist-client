import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
	date: (i) => moment().subtract(i, 'days'),
	task_ids: [ ]
});
