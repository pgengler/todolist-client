import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'draggable-dropzone' ],

	dragLeave: function(event) {
		event.preventDefault();
		this.sendAction('dragOut');
	},

	dragOver: function(event) {
		event.preventDefault();
		this.sendAction('dragIn');
	},

	drop: function(event) {
		var data = event.dataTransfer.getData('text/data');
		this.sendAction('dropped', data);
	}
});
