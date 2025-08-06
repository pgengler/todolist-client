import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import TaskForm from './task-form';
import type Store from '@ember-data/store';
import type Task from 'ember-todo/models/task';

interface NewTaskFormSignature {
  Args: {
    cancel: () => void;
    onTaskCreated?: () => void;
  };
}

export default class NewTaskForm extends Component<NewTaskFormSignature> {
  @service declare store: Store;

  @action
  async createTask({ date, description, notes }: { date: string; description: string; notes: string }): Promise<void> {
    if (isEmpty(description) || isEmpty(date)) {
      return;
    }

    const lists = await this.store.query('list', {
      filter: {
        'list-type': 'day',
        date,
      },
      page: {
        size: 1,
      },
    });

    const task = <Task>this.store.createRecord('task', {
      description,
      notes,
      list: lists[0],
    });
    await task.save();

    this.args.onTaskCreated?.();
  }

  <template><TaskForm @save={{this.createTask}} @cancel={{@cancel}} @saveButtonLabel="Add" /></template>
}
