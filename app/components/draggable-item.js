import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'draggable-item' ],
	classNameBindings: [ , 'item.isDone:done', 'item.isEditing:editing' ],
	attributeBindings: [ 'draggable' ],
	tagName: 'li',
	draggable: 'true',

	dragStart: function(event) {
		event.dataTransfer.setData('text/data', this.get('item.id'));
	}
});
