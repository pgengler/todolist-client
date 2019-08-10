import Component from '@ember/component';
import { action } from '@ember/object';

export default class extends Component {
  tagName = '';

  @action
  setFocus(element) {
    element.focus();
    element.select();
  }
}
