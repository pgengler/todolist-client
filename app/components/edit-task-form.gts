import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import TaskForm from './task-form';
import { on } from '@ember/modifier';
import type List from 'ember-todo/models/list';
import type Task from 'ember-todo/models/task';
import type Store from '@ember-data/store';

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

  @action
  async save({ date, description, notes }: { date: string; description: string; notes: string }) {
    const task = this.args.task;

    if (isEmpty(description) || isEmpty(date)) {
      return;
    }

    const lists = <List[]>(
      await this.store.query('list', {
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

    await task.destroyRecord();
    this.args.onTaskDeleted?.();
  }

  <template>
    <TaskForm @cancel={{@cancel}} @save={{this.save}} @saveButtonLabel="Save" @task={{@task}}>
      <:footer>
        <div class="button-footer">
          <button type="button" {{on "click" this.deleteTask}} data-test-delete-task>
            Delete
          </button>
        </div>
      </:footer>
    </TaskForm>
  </template>
}
