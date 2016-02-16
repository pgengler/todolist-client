import Ember from 'ember';
/* global Pikaday */

export default Ember.TextField.extend({
	didInsertElement() {
		const picker = new Pikaday({
			field: this.$()[0]
		});
		this.set('picker', picker);
	}
});
