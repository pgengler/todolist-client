import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SingleLineTextarea extends Component {
  @action
  insertNewline(value, event) {
    if (!event.shiftKey) {
      if (this.args['insert-newline']) this.args['insert-newline'](...arguments);
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
