import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class NewTaskForm extends Component {
  @tracked newTaskDate = null;

  @service store;

  get formId() {
    return `new-task-form-${guidFor(this)}`;
  }

  showPicker(event) {
    try {
      event.target.showPicker();
    } catch {
      // this can fail in tests and we don't care
    }
  }

  @action
  async createTask() {
    let form = document.getElementById(this.formId);
    let description = form.querySelector('#new-task-description').value.trim();
    let date = form.querySelector('#new-task-date').value;

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
      list: lists.toArray()[0],
    });
    await task.save();

    if (this.args.onTaskCreated) this.args.onTaskCreated();
  }
}
