import DS from 'ember-data';

var Item = DS.Model.extend({
	done: DS.attr('boolean'),
	event: DS.attr('string'),
	day: DS.belongsTo('day'),

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
		{ id: 1, done: false, event: 'A thing' },
		{ id: 2, done: false, event: 'Something else' },
		{ id: 3, done: true, event: 'A finished thing' }
	]
});

export default Item;
