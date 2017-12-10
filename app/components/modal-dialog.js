import { on } from '@ember/object/evented';
import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import {
  EKMixin as EmberKeyboardMixin,
  keyDown
} from 'ember-keyboard';

export default ModalDialog.extend(EmberKeyboardMixin, {
  init() {
    this._super(...arguments);

    this.set('keyboardActivated', true);
  },

  closeOnEsc: on(keyDown('Escape'), function() {
    this.sendAction('close');
  })
});
