import { modifier } from 'ember-modifier';
import type Task from 'ember-todo/models/task';

type NamedArgs = {
  onDragStart?: (this: void, task: Task) => void;
  onDragEnd?: (this: void, task: Task) => void;
};

type PositionalArgs = [task: Task];

export default modifier(function draggableTask(
  element: HTMLLIElement,
  [task]: PositionalArgs,
  { onDragStart, onDragEnd }: NamedArgs
) {
  element.draggable = true;

  const dragStartHandler = function (event: DragEvent) {
    event.dataTransfer!.setData('text/data', task.id!);
    onDragStart?.(task);
  };
  const dragEndHandler = function (/* event: DragEvent */) {
    onDragEnd?.(task);
  };

  element.addEventListener('dragstart', dragStartHandler);
  element.addEventListener('dragend', dragEndHandler);

  return () => {
    element.draggable = false;
    element.removeEventListener('dragstart', dragStartHandler);
    element.removeEventListener('dragend', dragEndHandler);
  };
});
