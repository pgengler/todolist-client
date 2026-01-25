import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { isEmpty } from '@ember/utils';
import TaskForm from './task-form';
import RecurringTaskActionDialog from './recurring-task-action-dialog';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import { on } from '@ember/modifier';
import type List from 'ember-todo/models/list';
import type Task from 'ember-todo/models/task';
import type Store from '@ember-data/store';
import type TaskAdapter from 'ember-todo/adapters/task';

const eq = <T,>(a: T, b: T): boolean => a === b;

type PendingAction = {
  type: 'save' | 'delete';
  data?: { date: string; description: string; notes: string };
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

  @action
  async save({ date, description, notes }: { date: string; description: string; notes: string }) {
    if (isEmpty(description) || isEmpty(date)) {
      return;
    }

    if (this.isRecurring) {
      this.pendingAction = { type: 'save', data: { date, description, notes } };
      this.showRecurringDialog = true;
      return;
    }

    await this.performSave({ date, description, notes });
  }

  async performSave({ date, description, notes }: { date: string; description: string; notes: string }) {
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
    const taskId = task.id;
    if (!taskId) return;

    const adapter = this.store.adapterFor('task') as TaskAdapter;

    if (this.pendingAction?.type === 'save' && this.pendingAction.data) {
      await adapter.modifyInstance(taskId, {
        description: this.pendingAction.data.description,
        notes: this.pendingAction.data.notes,
      });
      await this.store.findRecord('task', taskId, { reload: true });
      this.args.onTaskSaved?.();
    } else if (this.pendingAction?.type === 'delete') {
      await adapter.skip(taskId);
      task.unloadRecord();
      this.args.onTaskDeleted?.();
    }

    this.closeRecurringDialog();
  }

  @action
  async handleThisAndFuture() {
    const task = this.args.task;
    const taskId = task.id;
    if (!taskId) return;

    const adapter = this.store.adapterFor('task') as TaskAdapter;

    if (this.pendingAction?.type === 'save' && this.pendingAction.data) {
      await adapter.updateThisAndFuture(taskId, {
        description: this.pendingAction.data.description,
        notes: this.pendingAction.data.notes,
      });
      await this.store.findRecord('task', taskId, { reload: true });
      this.args.onTaskSaved?.();
    } else if (this.pendingAction?.type === 'delete') {
      await adapter.deleteThisAndFuture(taskId);
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

    <TaskForm @cancel={{@cancel}} @save={{this.save}} @saveButtonLabel="Save" @task={{@task}}>
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
