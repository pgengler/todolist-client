import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { isEmpty } from '@ember/utils';
import TaskForm from './task-form';
import type { RecurrenceOptions } from './task-form';
import RecurringTaskActionDialog from './recurring-task-action-dialog';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import { on } from '@ember/modifier';
import type List from 'ember-todo/models/list';
import type Task from 'ember-todo/models/task';
import type RecurrenceRule from 'ember-todo/models/recurrence-rule';
import type Store from '@ember-data/store';

const eq = <T,>(a: T, b: T): boolean => a === b;

type PendingAction = {
  type: 'save' | 'delete';
  data?: { date: string; description: string; notes: string; recurrence?: RecurrenceOptions };
};

interface EditTaskFormSignature {
  Args: {
    cancel: () => void;
    onTaskDeleted?: () => void;
    onTaskSaved?: () => void;
    task: Task;
  };
}

export default class EditTaskForm extends Component<EditTaskFormSignature> {
  @service declare store: Store;

  @tracked showRecurringDialog = false;
  @tracked pendingAction: PendingAction | null = null;

  get isRecurring() {
    return this.args.task.isRecurring;
  }

  get hasRecurrenceChanged(): boolean {
    const task = this.args.task;
    const hadRecurrence = task.isRecurring;
    // This will be set when save is called with recurrence data
    return this.pendingAction?.data?.recurrence !== undefined || hadRecurrence;
  }

  @action
  async save({
    date,
    description,
    notes,
    recurrence,
  }: {
    date: string;
    description: string;
    notes: string;
    recurrence?: RecurrenceOptions;
  }) {
    if (isEmpty(description) || isEmpty(date)) {
      return;
    }

    // If task is currently recurring, show dialog for edit scope
    if (this.isRecurring) {
      this.pendingAction = { type: 'save', data: { date, description, notes, recurrence } };
      this.showRecurringDialog = true;
      return;
    }

    // For non-recurring tasks (including adding recurrence), just save directly
    await this.performSave({ date, description, notes, recurrence });
  }

  async performSave({
    date,
    description,
    notes,
    recurrence,
  }: {
    date: string;
    description: string;
    notes: string;
    recurrence?: RecurrenceOptions;
  }) {
    const task = this.args.task;

    const lists = (
      await this.store.query<List>('list', {
        filter: {
          'list-type': 'day',
          date,
        },
        page: {
          size: 1,
        },
      })
    ).slice();

    task.description = description;
    task.list = lists[0] ?? null;
    task.notes = notes;

    // Handle adding recurrence to a non-recurring task
    if (recurrence && !task.isRecurring) {
      const rule = this.store.createRecord('recurrence-rule', {
        description,
        notes,
        recurrenceType: recurrence.recurrenceType,
        interval: recurrence.interval,
        dayOfWeek: recurrence.dayOfWeek,
        daysOfWeek: recurrence.daysOfWeek,
        dayOfMonth: recurrence.dayOfMonth,
        weekOfMonth: recurrence.weekOfMonth,
        month: recurrence.month,
        startDate: new Date(date),
        endDate: recurrence.endDate ? new Date(recurrence.endDate) : null,
        maxInstances: recurrence.maxInstances,
      });
      await rule.save();
      task.recurrenceRule = rule as RecurrenceRule;
      task.originalDate = new Date(date);
    }

    await task.save();

    this.args.onTaskSaved?.();
  }

  @action
  async deleteTask() {
    const task = this.args.task;

    if (this.isRecurring) {
      this.pendingAction = { type: 'delete' };
      this.showRecurringDialog = true;
      return;
    }

    await task.destroyRecord();
    this.args.onTaskDeleted?.();
  }

  @action
  closeRecurringDialog() {
    this.showRecurringDialog = false;
    this.pendingAction = null;
  }

  @action
  async handleThisOnly() {
    const task = this.args.task;
    if (!task.id) return;

    if (this.pendingAction?.type === 'save' && this.pendingAction.data) {
      await task.modifyInstance({
        description: this.pendingAction.data.description,
        notes: this.pendingAction.data.notes,
      });
      await task.reload();
      this.args.onTaskSaved?.();
    } else if (this.pendingAction?.type === 'delete') {
      await task.skip();
      task.unloadRecord();
      this.args.onTaskDeleted?.();
    }

    this.closeRecurringDialog();
  }

  @action
  async handleThisAndFuture() {
    const task = this.args.task;
    if (!task.id) return;

    if (this.pendingAction?.type === 'save' && this.pendingAction.data) {
      await task.updateThisAndFuture({
        description: this.pendingAction.data.description,
        notes: this.pendingAction.data.notes,
      });
      await task.reload();
      this.args.onTaskSaved?.();
    } else if (this.pendingAction?.type === 'delete') {
      await task.deleteThisAndFuture();
      task.unloadRecord();
      this.args.onTaskDeleted?.();
    }

    this.closeRecurringDialog();
  }

  <template>
    {{#if this.isRecurring}}
      <div class="recurring-task-indicator">
        <FaIcon @icon="rotate" />
        <span>This is a recurring task</span>
      </div>
    {{/if}}

    <TaskForm @cancel={{@cancel}} @save={{this.save}} @saveButtonLabel="Save" @task={{@task}} @showRecurrence={{true}}>
      <:footer>
        <div class="button-footer">
          <button type="button" {{on "click" this.deleteTask}} data-test-delete-task>
            {{if this.isRecurring "Skip" "Delete"}}
          </button>
        </div>
      </:footer>
    </TaskForm>

    {{#if this.showRecurringDialog}}
      <RecurringTaskActionDialog
        @task={{@task}}
        @actionType={{if (eq this.pendingAction.type "save") "edit" "delete"}}
        @onClose={{this.closeRecurringDialog}}
        @onThisOnly={{this.handleThisOnly}}
        @onThisAndFuture={{this.handleThisAndFuture}}
      />
    {{/if}}
  </template>
}
