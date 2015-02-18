import SingleTask from './single-task';

export default SingleTask.extend({
	classNames: [ 'draggable-task' ],
	classNameBindings: [ , 'task.isDone:done', 'task.isEditing:editing' ],
	attributeBindings: [ 'draggable' ],

	draggable: 'true',
	task: null,

	dragStart: function(event) {
		event.dataTransfer.setData('text/data', this.get('task.id'));
	}
});
