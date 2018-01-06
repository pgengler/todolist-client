import { on } from '@ember/object/evented';
import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import {
  EKMixin as EmberKeyboardMixin,
  keyDown
} from 'ember-keyboard';

export default ModalDialog.extend(EmberKeyboardMixin, {
  close() { /* noop */ },

  init() {
    this._super(...arguments);

    this.set('keyboardActivated', true);
  },

  closeOnEsc: on(keyDown('Escape'), function() { // eslint-disable-line ember/no-on-calls-in-components
    this.close();
  })
});
