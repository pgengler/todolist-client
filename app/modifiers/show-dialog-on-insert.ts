import { modifier } from 'ember-modifier';

type PositionalArgs = [];
type NamedArgs = {
  onClose(this: void, event: Event): void;
};

export default modifier(function showDialogOnInsert(
  element: HTMLDialogElement,
  positional: PositionalArgs,
  { onClose }: NamedArgs
) {
  element.addEventListener('close', onClose);
  element.showModal();

  return () => {
    element.removeEventListener('close', onClose);
  };
});
