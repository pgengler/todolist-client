import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'draggable-task' ],
	classNameBindings: [ , 'task.isDone:done', 'task.isEditing:editing' ],
	attributeBindings: [ 'draggable' ],
	tagName: 'li',
	draggable: 'true',

	dragStart: function(event) {
		event.dataTransfer.setData('text/data', this.get('task.id'));
	}
});
