import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class NewTaskForm extends Component {
  tagName = '';

  newTaskDescription = '';
  newTaskDate = null;

  @service store;

  @action
  changeDate(newDate) {
    this.set('newTaskDate', newDate.moment);
    document.querySelector('.new-task input[type=submit]').focus();
  }

  @action
  async createTask(event) {
    event.preventDefault();
    let description = this.newTaskDescription.trim();
    let date = this.newTaskDate;

    if (isEmpty(description) || isEmpty(date)) {
      return;
    }

    let lists = await this.store.query('list', {
      filter: {
        'list-type': 'day',
        date: date.format('YYYY-MM-DD')
      },
      page: {
        size: 1
      }
    });

    let task = this.store.createRecord('task', {
      description,
      list: lists.get('firstObject')
    });
    await task.save();

    if (this.onTaskCreated) this.onTaskCreated();
  }
}
