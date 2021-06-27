import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SingleLineTextarea extends Component {
  @action
  handleKeyDown(event) {
    if (event.key !== 'Enter') return;

    let value = event.target.value.trim();

    // if textarea is empty, or the Shift key is not pressed along with Enter,
    // then don't add a new line and trigger the @onEnterPressed action.
    if (value === '' || !event.shiftKey) {
      event.preventDefault();
      if (this.args.onEnterPressed) this.args.onEnterPressed(value);
    }
  }

  @action
  handleKeyUp(event) {
    if (event.key === 'Escape') {
      if (this.args.onEscapePressed) this.args.onEscapePressed();
    }
  }

  @action
  updateValue(textarea) {
    textarea.value = this.args.value;
  }
}
