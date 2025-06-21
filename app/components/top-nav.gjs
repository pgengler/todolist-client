import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TopNav extends Component {
  @service flashMessages;

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
