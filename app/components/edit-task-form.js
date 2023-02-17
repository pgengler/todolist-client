import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class EditTaskForm extends Component {
  @service store;

  @action
  async save({ date, description }) {
    let task = this.args.task;

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

    task.description = description;
    task.list = lists[0];
    await task.save();

    this.args.onTaskSaved?.();
  }

  @action
  async deleteTask() {
    let task = this.args.task;

    await task.destroyRecord();
    this.args.onTaskDeleted?.();
  }
}
