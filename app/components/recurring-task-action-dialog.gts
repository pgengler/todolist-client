import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import showDialogOnInsert from '../modifiers/show-dialog-on-insert';
import type Task from 'ember-todo/models/task';

type ActionType = 'edit' | 'delete';

interface RecurringTaskActionDialogSignature {
  Args: {
    task: Task;
    actionType: ActionType;
    onClose: () => void;
    onThisOnly: () => void;
    onThisAndFuture: () => void;
  };
}

export default class RecurringTaskActionDialog extends Component<RecurringTaskActionDialogSignature> {
  @tracked isProcessing = false;

  get title() {
    return this.args.actionType === 'edit' ? 'Edit Recurring Task' : 'Delete Recurring Task';
  }

  get thisOnlyLabel() {
    return this.args.actionType === 'edit' ? 'Edit this instance only' : 'Delete this instance only';
  }

  get thisAndFutureLabel() {
    return this.args.actionType === 'edit'
      ? 'Edit this and all future instances'
      : 'Delete this and all future instances';
  }

  get thisOnlyDescription() {
    return this.args.actionType === 'edit'
      ? 'Changes will only apply to this specific occurrence.'
      : 'Only this occurrence will be skipped. Future instances will still appear.';
  }

  get thisAndFutureDescription() {
    return this.args.actionType === 'edit'
      ? 'Changes will apply to this occurrence and all future ones.'
      : 'This occurrence and all future ones will be removed.';
  }

  @action
  handleThisOnly() {
    this.args.onThisOnly();
  }

  @action
  handleThisAndFuture() {
    this.args.onThisAndFuture();
  }

  <template>
    <dialog
      class="recurring-task-action-dialog"
      {{showDialogOnInsert onClose=@onClose}}
      data-test-recurring-action-dialog
    >
      <h2>{{this.title}}</h2>
      <p>This is a recurring task. How would you like to proceed?</p>

      <div class="action-options">
        <button type="button" class="action-option" {{on "click" this.handleThisOnly}} data-test-this-only>
          <strong>{{this.thisOnlyLabel}}</strong>
          <span class="description">{{this.thisOnlyDescription}}</span>
        </button>

        <button type="button" class="action-option" {{on "click" this.handleThisAndFuture}} data-test-this-and-future>
          <strong>{{this.thisAndFutureLabel}}</strong>
          <span class="description">{{this.thisAndFutureDescription}}</span>
        </button>
      </div>

      <div class="dialog-footer">
        <button type="button" class="btn btn-secondary" {{on "click" @onClose}}>
          Cancel
        </button>
      </div>
    </dialog>
  </template>
}
