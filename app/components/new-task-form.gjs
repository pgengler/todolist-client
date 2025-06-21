import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import TaskForm from './task-form.gjs';

export default class NewTaskForm extends Component {
  <template><TaskForm @save={{this.createTask}} @cancel={{@cancel}} @saveButtonLabel="Add" /></template>
  @service store;

  @action
  async createTask({ date, description, notes }) {
    if (isEmpty(description) || isEmpty(date)) {
      return;
    }

    let lists = await this.store.query('list', {
      filter: {
        'list-type': 'day',
        date,
      },
      page: {
        size: 1,
      },
    });

    let task = this.store.createRecord('task', {
      description,
      notes,
      list: lists[0],
    });
    await task.save();

    this.args.onTaskCreated?.();
  }
}
