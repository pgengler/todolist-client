import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SingleLineTextarea extends Component {
  @action
  insertNewline(value, event) {
    if (!this.args['insert-newline']) return;

    if (value.trim() === '' || !event.shiftKey) {
      this.args['insert-newline'](...arguments);
    }
  }

  @action
  preventDefaultWhenSubmitting(event) {
    if (event.key !== 'Enter') return;

    let value = event.target.value.trim();
    if (value === '' || !event.shiftKey) {
      event.preventDefault();
    }
  }
}
