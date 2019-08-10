import Component from '@ember/component';
import { action } from '@ember/object';

export default class extends Component {
  tagName = '';

  @action
  insertNewline(value, event) {
    if (!event.shiftKey) {
      if (this['insert-newline']) this['insert-newline'](...arguments);
    }
  }

  @action
  preventDefaultOnShiftlessEnter(event) {
    if (event.key === "Enter") {
      if (!event.shiftKey) {
        event.preventDefault();
      }
    }
  }
}
