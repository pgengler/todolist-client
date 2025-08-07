import { modifier } from 'ember-modifier';

export default modifier(function autofocusAndSelect(element: HTMLInputElement | HTMLTextAreaElement) {
  element.focus();
  element.select();
});
