import DS from 'ember-data';

var Day = DS.Model.extend({
	date: DS.attr('date'),
	items: DS.hasMany('item', { async: true })
});

Day.reopenClass({
	FIXTURES: [
		{ id: 1, date: '2014-09-18', items: [ 1 ] },
		{ id: 2, date: '2014-09-19', items: [ 2 ] },
		{ id: 3, date: '2014-09-20', items: [ ] },
		{ id: 4, date: '2014-09-21', items: [ ] }
	]
});

export default Day;
