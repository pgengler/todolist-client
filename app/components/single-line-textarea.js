import Ember from 'ember';

export default Ember.TextArea.extend({
	keyDown: function(event) {
		// Prevent newlines when using bare Enter key
		if (event.which == 13 && !event.shiftKey) {
			event.preventDefault();
		}
	},

	insertNewline: function(event) {
		if (!event.shiftKey) {
			this._super(event);
		}
	}
});
