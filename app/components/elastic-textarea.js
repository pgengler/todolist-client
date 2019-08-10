import Component from '@ember/component';
import { action } from '@ember/object';

export default class ElasticTextarea extends Component {
  tagName = '';

  @action
  resizeArea(element) {
    element.style.height = '1px';
    window.requestAnimationFrame(() => {
      element.style.height = `${element.scrollHeight}px`;
    });
  }
}
