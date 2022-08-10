import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class NewTaskForm extends Component {
  @service store;

  @action
  async createTask({ description, date }) {
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
      list: lists.toArray()[0], // eslint-disable-line ember/no-array-prototype-extensions
    });
    await task.save();

    this.args.onTaskCreated?.();
  }
}
