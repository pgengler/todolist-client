import { modifier } from 'ember-modifier';

export default modifier(function showDialogOnInsert(element, positional, { onClose }) {
  element.addEventListener('close', onClose);
  element.showModal();

  return () => {
    element.removeEventListener('close', onClose);
  };
}, { eager: false });
