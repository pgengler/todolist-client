import Component from '@ember/component';
import { action } from '@ember/object';

export default class TopNav extends Component {
  tagName = '';

  isShowingNewTaskModal = false;

  @action
  closeModal() {
    this.set('isShowingNewTaskModal', false);
  }

  @action
  toggleModal() {
    this.toggleProperty('isShowingNewTaskModal');
  }
}
