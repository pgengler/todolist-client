import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
	done: DS.attr('boolean'),
	description: DS.attr('string'),
	day: DS.belongsTo('day'),

	isDone: Ember.computed('done', {
		get() {
			return this.get('done');
		},
		set(key, value) {
			this.set('done', value);
			this.save();
			return value;
		}
	})
});
