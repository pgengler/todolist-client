import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class extends Component {
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
  createTask() {
    let description = this.newTaskDescription.trim();
    let date = this.newTaskDate;

    if (isEmpty(description) || isEmpty(date)) {
      return false;
    }

    this.store.query('list', {
      filter: {
        'list-type': 'day',
        date: date.format('YYYY-MM-DD')
      },
      page: {
        size: 1
      }
    }).then((lists) => {
      let task = this.store.createRecord('task', {
        description,
        list: lists.get('firstObject')
      });
      return task.save();
    }).then(() => {
      if (this.onTaskCreate) this.onTaskCreated();
    });

    return false;
  }
}
