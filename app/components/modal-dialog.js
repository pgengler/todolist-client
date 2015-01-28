import Ember from 'ember';

export default Ember.Component.extend({
	className: 'modal-dialog',
	actions: {
		close: function() {
			return this.sendAction();
		}
	}
});
