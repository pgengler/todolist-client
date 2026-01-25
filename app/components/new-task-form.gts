import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import TaskForm from './task-form';
import type { RecurrenceOptions } from './task-form';
import type Store from '@ember-data/store';
import type List from 'ember-todo/models/list';
import type Task from 'ember-todo/models/task';
import type RecurrenceRule from 'ember-todo/models/recurrence-rule';

interface NewTaskFormSignature {
  Args: {
    cancel: () => void;
    onTaskCreated?: () => void;
  };
}

export default class NewTaskForm extends Component<NewTaskFormSignature> {
  @service declare store: Store;

  @action
  async createTask({
    date,
    description,
    notes,
    recurrence,
  }: {
    date: string;
    description: string;
    notes: string;
    recurrence?: RecurrenceOptions;
  }): Promise<void> {
    if (isEmpty(description) || isEmpty(date)) {
      return;
    }

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

    if (recurrence) {
      // Create a recurrence rule first, then the initial task instance
      const rule = this.store.createRecord<RecurrenceRule>('recurrence-rule', {
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

      // Create the first task instance linked to the rule
      const task = this.store.createRecord<Task>('task', {
        description,
        notes,
        list: lists[0],
        recurrenceRule: rule,
        originalDate: new Date(date),
      });
      await task.save();
    } else {
      // Create a regular non-recurring task
      const task = this.store.createRecord<Task>('task', {
        description,
        notes,
        list: lists[0],
      });
      await task.save();
    }

    this.args.onTaskCreated?.();
  }

  <template>
    <TaskForm @save={{this.createTask}} @cancel={{@cancel}} @saveButtonLabel="Add" @showRecurrence={{true}} />
  </template>
}
