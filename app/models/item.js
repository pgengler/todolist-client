import DS from 'ember-data';

var Item = DS.Model.extend({
	done: DS.attr('boolean'),
	date: DS.attr('date'),
	event: DS.attr('string'),

	isDone: function(key, value) {
		if (typeof(value) === 'undefined') {
			// property being used as a getter
			return this.get('done');
		} else {
			// property being used as a setter
			this.set('done', value);
			this.save();
			return value;
		}
	}.property('done')
});

Item.reopenClass({
	FIXTURES: [
		{ id: 1, done: false, event: 'A thing', date: new Date("September 19, 2014") },
		{ id: 2, done: false, event: 'Something else', date: new Date("July 3, 2014") },
		{ id: 3, done: true, event: 'A finished thing' }
	]
});

export default Item;
