import Ember from 'ember';

export default Ember.ArrayController.extend({
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
	},

	dateGroups: function() {
		var groups = Ember.A([]);
		this.get('arrangedContent').forEach(function(item) {
			var date = item.get('date');
			var group = groups.filter(function(g) {
				return g.date === date;
			})[0];
			var needToAppendGroup = false;
			if (!group) {
				group = Ember.ArrayProxy.create({
					content: Ember.A([]),
					date: date
				});
				needToAppendGroup = true;
			}
			group.get('content').pushObject(item);
			if (needToAppendGroup) {
				groups.push(group);
			}
		});
		return groups;
	}.property('content.@each')
});
