import { modifier } from 'ember-modifier';
import type Task from 'ember-todo/models/task';

type NamedArgs = {
  onDragStart(task: Task): void;
  onDragEnd(task: Task): void;
}

type PositionalArgs = [task: Task];

export default modifier(function draggableTask(element: HTMLDivElement, [task]: PositionalArgs, { onDragStart, onDragEnd }: NamedArgs) {
  element.draggable = true;

  let dragStartHandler = function (event: DragEvent) {
    event.dataTransfer!.setData('text/data', task.id!);
    onDragStart?.(task);
  };
  let dragEndHandler = function (/* event: DragEvent */) {
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
