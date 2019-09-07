import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class AutofocusElasticTextarea extends Component {
  @action
  setFocus(element) {
    element.focus();
    element.select();
  }
}
