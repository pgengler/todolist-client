import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class NewTaskForm extends Component {
  @tracked newTaskDate = null;

  @service store;

  @action
  changeDate(newDate) {
    this.newTaskDate = newDate.moment;
    document.querySelector('.new-task button[type=submit]').focus();
  }

  @action
  async createTask() {
    let description = document
      .getElementById('new-task-description')
      .value.trim();
    let date = this.newTaskDate;

    if (isEmpty(description) || isEmpty(date)) {
      return;
    }

    let lists = await this.store.query('list', {
      filter: {
        'list-type': 'day',
        date: date.format('YYYY-MM-DD'),
      },
      page: {
        size: 1,
      },
    });

    let task = this.store.createRecord('task', {
      description,
      list: lists.toArray()[0],
    });
    await task.save();

    if (this.args.onTaskCreated) this.args.onTaskCreated();
  }
}
