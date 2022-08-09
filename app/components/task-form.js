import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { isEmpty } from '@ember/utils';

function taskDate(task) {
  if (!task) return null;
  if (!task.list) return null;
  if (task.list.get('listType') !== 'day') return null;

  return task.list.get('name');
}

export default class TaskForm extends Component {
  @tracked taskDate = taskDate(this.args.task);
  @tracked description = this.args.task?.description;

  get formId() {
    return `task-form-${guidFor(this)}`;
  }

  get saveButtonLabel() {
    return this.args.saveButtonLabel ?? 'Save';
  }

  showPicker(event) {
    try {
      event.target.showPicker();
    } catch {
      // this can fail in tests and we don't care
    }
  }

  @action
  async save() {
    let form = document.getElementById(this.formId);
    let description = form.querySelector('#task-description').value.trim();
    let date = form.querySelector('#task-date').value;

    if (isEmpty(description) || isEmpty(date)) {
      return;
    }

    this.args.save?.({ date, description });
  }
}
