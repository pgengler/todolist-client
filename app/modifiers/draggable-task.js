import { modifier } from 'ember-modifier';

export default modifier(function draggableTask(element, [task], { onDragStart, onDragEnd }) {
  element.draggable = 'true';

  let dragStartHandler = function (event) {
    event.dataTransfer.setData('text/data', task.id);
    onDragStart?.(task);
  };
  let dragEndHandler = function (/* event */) {
    onDragEnd?.(task);
  };

  element.addEventListener('dragstart', dragStartHandler);
  element.addEventListener('dragend', dragEndHandler);

  return () => {
    element.draggable = null;
    element.removeEventListener('dragstart', dragStartHandler);
    element.removeEventListener('dragend', dragEndHandler);
  };
});
