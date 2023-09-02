import { modifier } from 'ember-modifier';

export default modifier(function draggableTask(element, [task], { onDragStart, onDragEnd }) {
  element.draggable = 'true';

  let dragging = false;

  let dragStartHandler = function (event) {
    event.dataTransfer.setData('text/data', task.id);
    dragging = true;
    onDragStart?.(task);
  };
  let dragEndHandler = function (/* event */) {
    dragging = false;
    onDragEnd?.(task);
  };

  element.addEventListener('dragstart', dragStartHandler);
  element.addEventListener('dragend', dragEndHandler);

  return () => {
    element.draggable = null;
    element.removeEventListener('dragstart', dragStartHandler);
    element.removeEventListener('dragend', dragEndHandler);

    // the element gets torn down as a result of the "drop" action;
    // if this happens, we still want to fire the 'onDragEnd' action.
    if (dragging) onDragEnd?.(task);
  };
});
