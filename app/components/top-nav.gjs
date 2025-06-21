import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { LinkTo } from "@ember/routing";
import { hash } from "@ember/helper";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import { on } from "@ember/modifier";
import DatePickerIcon from "./date-picker-icon.js";
import FlashMessage from "ember-cli-flash/components/flash-message";
import NewTaskModal from "./new-task-modal.js";

export default class TopNav extends Component {<template><nav class="top-nav">
  <div class="todolist-actions">
    <LinkTo @route="days" @query={{hash date=null}} title="Home">
      <FaIcon @icon="home" />
    </LinkTo>
    <LinkTo @route="recurring" title="Recurring tasks">
      <FaIcon @icon="list" />
    </LinkTo>
    <FaIcon @icon="plus" {{on "click" this.toggleModal}} data-test-add-task />
    <DatePickerIcon @dateSelected={{@changeDate}} @dateRange={{@selectedDate.dateRange}} data-test-change-date />
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
</nav></template>
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
