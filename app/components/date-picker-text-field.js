import Ember from 'ember';
/* global Pikaday */

export default Ember.TextField.extend({
	didInsertElement: function() {
		var picker = new Pikaday({
			field: this.$()[0]
		});
		this.set('picker', picker);
	}
});
