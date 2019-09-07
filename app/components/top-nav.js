import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TopNav extends Component {
  @tracked isShowingNewTaskModal = false;

  @action
  closeModal() {
    this.isShowingNewTaskModal = false;
  }

  @action
  toggleModal() {
    this.isShowingNewTaskModal = !this.isShowingNewTaskModal;
  }
}
