import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'draggable-dropzone' ],
	classNameBindings: [ 'dragClass', 'otherClassNames' ],
	dragClass: 'deactivated',
	otherClassNames: '',

	dragLeave: function(event) {
		event.preventDefault();
		this.set('dragClass', '');
	},

	dragOver: function(event) {
		event.preventDefault();
		this.set('dragClass', 'active-drop-target');
	},

	drop: function(event) {
		this.set('dragClass', '');
		var data = event.dataTransfer.getData('text/data');
		this.sendAction('dropped', data);
	}
});
