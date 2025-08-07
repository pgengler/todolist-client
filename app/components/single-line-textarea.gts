import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

interface SingleLineTextareaSignature {
  Args: {
    onEnterPressed?: (value: string) => void;
    onEscapePressed?: () => void;
    value?: string | null;
  };
  Element: HTMLTextAreaElement;
}

export default class SingleLineTextarea extends Component<SingleLineTextareaSignature> {
  @action
  handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;

    const element = <HTMLTextAreaElement>event.target;
    const value = element.value.trim();

    // if textarea is empty, or the Shift key is not pressed along with Enter,
    // then don't add a new line and trigger the @onEnterPressed action.
    if (value === '' || !event.shiftKey) {
      event.preventDefault();
      if (this.args.onEnterPressed) this.args.onEnterPressed(value);
    }
  }

  @action
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.args.onEscapePressed) this.args.onEscapePressed();
    }
  }

  <template>
    <textarea {{on "keydown" this.handleKeyDown}} {{on "keyup" this.handleKeyUp}} ...attributes>{{@value}}</textarea>
  </template>
}
