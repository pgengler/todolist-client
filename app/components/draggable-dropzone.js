import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'draggable-dropzone' ],

	dragLeave(event) {
		event.preventDefault();
		this.sendAction('dragOut');
	},

	dragOver(event) {
		event.preventDefault();
		this.sendAction('dragIn');
	},

	drop(event) {
		const data = event.dataTransfer.getData('text/data');
		this.sendAction('dropped', data);
	}
});
