import Ember from 'ember';
import GroupableMixin from 'ember-todo/mixins/groupable';

export default Ember.ArrayController.extend(GroupableMixin, {
	groupBy: [ 'date' ],
	sortProperties: [ 'date' ],

	actions: {
		addItem: function() {
			var itemEvent = this.get('newItemEvent').trim();
			if (!itemEvent) {
				return;
			}
			var self = this;
			this.store.createRecord('item', {
				event: itemEvent
			}).save().then(function() {
				self.set('newItemEvent', '');
			});
		}
	}
});
