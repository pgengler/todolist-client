import DS from 'ember-data';

export default DS.Model.extend({
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
