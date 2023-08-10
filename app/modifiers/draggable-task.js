import { modifier } from 'ember-modifier';

export default modifier(function draggableTask(element, [task]) {
  element.draggable = 'true';

  let dragStartHandler = function (event) {
    event.dataTransfer.setData('text/data', task.id);
  };
  element.addEventListener('dragstart', dragStartHandler);

  return () => {
    element.draggable = null;
    element.removeEventListener('dragstart', dragStartHandler);
  };
});
