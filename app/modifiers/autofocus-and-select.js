import { modifier } from 'ember-modifier';

export default modifier(function autofocusAndSelect(element) {
  element.focus();
  element.select();
});
