import Ember from 'ember';

export default Ember.Component.extend({
	className: 'modal-dialog',
	didInsertElement: function() {
		var component = this;
		this.$().on('keydown', function(event) {
			if (event.which === 27) {
				component.triggerAction({
					action: 'close',
					target: component
				});
			}
		});
	},
	actions: {
		close: function() {
			return this.sendAction('close');
		}
	}
});
