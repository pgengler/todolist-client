import Component from '@ember/component';
import { action } from '@ember/object';

export default class AutofocusElasticTextarea extends Component {
  tagName = '';

  @action
  setFocus(element) {
    element.focus();
    element.select();
  }
}
