import DS from 'ember-data';

export default DS.Model.extend({
	date: DS.attr('utcDate'),
	tasks: DS.hasMany('task', { async: false })
});
