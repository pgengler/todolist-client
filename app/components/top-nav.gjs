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

<nav class="top-nav">
  <div class="todolist-actions">
    <LinkTo @route="days" @query={{hash date=null}} title="Home">
      <FaIcon @icon="home" />
    </LinkTo>
    <LinkTo @route="recurring" title="Recurring tasks">
      <FaIcon @icon="list" />
    </LinkTo>
    <FaIcon @icon="plus" {{on "click" this.toggleModal}} data-test-add-task />
    <DatePickerIcon
      @dateSelected={{@changeDate}}
      @dateRange={{@selectedDate.dateRange}}
      data-test-change-date
    />
  </div>
  <div class="flash-messages">
    {{#each this.flashMessages.queue as |flash|}}
      <FlashMessage @flash={{flash}} />
    {{/each}}
  </div>
  <div class="user-actions">
    <FaIcon @icon="sign-out-alt" {{on "click" @logout}} data-test-logout />
  </div>

  {{#if this.isShowingNewTaskModal}}
    <NewTaskModal @onClose={{this.closeModal}} />
  {{/if}}
</nav>