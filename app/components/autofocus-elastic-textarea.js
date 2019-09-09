import Component from '@glimmer/component';

export default class AutofocusElasticTextarea extends Component {
  setFocus(element) {
    element.focus();
    element.select();
  }
}
