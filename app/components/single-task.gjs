import { isEmpty } from '@ember/utils';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask, timeout } from 'ember-concurrency';
import { runTask } from 'ember-lifeline';
import AutofocusElasticTextarea from './autofocus-elastic-textarea';
import { on } from '@ember/modifier';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import perform from 'ember-concurrency/helpers/perform';
import MarkdownToHtml from 'ember-showdown/components/markdown-to-html';
import EditTaskModal from './edit-task-modal';

export default class SingleTask extends Component {
  @tracked editType = null;
  @tracked editDescription;

  get editable() {
    let task = this.args.task;
    return !task.isNew || task.isError;
  }

  get isEditing() {
    return !!this.editType;
  }

  get isFullEditing() {
    return this.editType === 'full';
  }

  get isQuickEditing() {
    return this.editType === 'quick';
  }

  quickEditTask = dropTask(async () => {
    if (!this.editable || this.isEditing) {
      return;
    }
    await timeout(250);
    this.editDescription = this.args.task.description;
    this.editType = 'quick';
    this.args.editingStart?.();
  });

  @action
  editTask() {
    if (!this.editable || this.isEditing) {
      return;
    }
    this.quickEditTask.cancelAll();
    this.editDescription = this.args.task.description;
    this.editType = 'full';
    this.args.editingStart?.();
  }

  @action
  simulateDoubleClicks(event) {
    let now = Date.now();
    let touch = event.changedTouches[0];

    let lastTouchEndEventInfo = this.lastTouchEndEventInfo;
    this.lastTouchEndEventInfo = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      when: now,
    };
    if (!lastTouchEndEventInfo) {
      return;
    }

    if (now - lastTouchEndEventInfo.when < 500) {
      let xDistance = Math.abs(lastTouchEndEventInfo.clientX - touch.clientX);
      let yDistance = Math.abs(lastTouchEndEventInfo.clientY - touch.clientY);

      if (xDistance < 40 && yDistance < 40) {
        let doubleClickEvent = document.createEvent('MouseEvents');
        doubleClickEvent.initMouseEvent(
          'dblclick',
          true, // click bubbles
          true, // click cancelable
          event.view, // copy view
          2, // click count
          // copy coordinates
          touch.screenX,
          touch.screenY,
          touch.clientX,
          touch.clientY,
          // copy key modifiers
          event.ctrlKey,
          event.altKey,
          event.shiftKey,
          event.metaKey,
          event.button, // copy button 0: left, 1: middle, 2: right
          event.relatedTarget, // copy relatedTarget
        );

        event.target.dispatchEvent(doubleClickEvent);
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }

  @action
  cancelEdit() {
    // wrapping this in a `runTask` to avoid double-updating `this.isEditing` twice
    // (e.g., when `updateTask` runs and sets `this.isEditing`, which then causes
    // the textarea to stop displaying and thus triggers the "focusout" event
    // that causes this method to run.)
    runTask(this, () => (this.editType = false));

    this.args.editingEnd?.();
  }

  @action
  toggleTaskDone() {
    let task = this.args.task;
    task.done = !task.done;
    task.save();
  }

  @action
  async updateTask(description) {
    if (!this.editable) {
      return;
    }
    let task = this.args.task;
    description = description.trim();
    if (isEmpty(description)) {
      await task.destroyRecord();
    } else {
      task.description = description;
      await task.save();
      this.editType = null;
    }
    this.args.editingEnd?.();
  }

  <template>
    <li
      class="task
        {{if this.isQuickEditing 'editing'}}
        {{if @task.done 'done'}}
        {{if @task.isError 'error'}}
        {{if @task.isNew 'pending'}}"
      ...attributes
    >
      {{#if this.isQuickEditing}}
        <AutofocusElasticTextarea
          @onEscapePressed={{this.cancelEdit}}
          @onEnterPressed={{this.updateTask}}
          @value={{this.editDescription}}
          class="edit"
          {{on "focusout" this.cancelEdit}}
        />
      {{else}}
        {{#if (has-block "before")}}
          {{yield to="before"}}
        {{/if}}

        <div class="flex-container">
          <div class="state">
            {{#if @task.isError}}
              <FaIcon @icon="triangle-exclamation" title="Task failed to save" />
            {{else if @task.isNew}}
              <FaIcon @icon="spinner" @spin={{true}} />
            {{else}}
              {{! template-lint-disable require-input-label }}
              <input type="checkbox" checked={{@task.done}} {{on "change" this.toggleTaskDone}} />
            {{/if}}
          </div>

          {{! template-lint-disable require-presentational-children }}
          <div
            class="description"
            role="button"
            {{on "click" (perform this.quickEditTask)}}
            {{on "dblclick" this.editTask}}
            {{on "touchend" this.simulateDoubleClicks}}
          >
            <MarkdownToHtml @markdown={{@task.description}} />
          </div>
          {{! template-lint-enable require-presentational-children }}

          {{#if @task.notes}}
            <div>
              <FaIcon @icon="sticky-note" @prefix="far" data-test-task-has-notes />
            </div>
          {{/if}}
        </div>

        {{#if (has-block "after")}}
          {{yield to="after"}}
        {{/if}}
      {{/if}}

      {{!
    Don't include isFullEditing in the if/else ladder because we want to render the content normally underneath the modal.
  }}
      {{#if this.isFullEditing}}
        <EditTaskModal @task={{@task}} @onClose={{this.cancelEdit}} />
      {{/if}}
    </li>
  </template>
}
