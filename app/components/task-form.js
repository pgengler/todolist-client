import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { isEmpty } from '@ember/utils';

function taskDate(task) {
  if (!task) return null;
  if (!task.list) return null;
  if (task.list.listType !== 'day') return null;

  return task.list.name;
}

export default class TaskForm extends Component {
  @tracked description = this.args.task?.description;
  @tracked isEditingNotes = false;
  @tracked notes = this.args.task?.notes;
  @tracked taskDate = taskDate(this.args.task);

  get editingNotes() {
    return !this.args.task || this.args.task?.isNew || isEmpty(this.args.task?.notes) || this.isEditingNotes;
  }

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

    let date = form.querySelector('#task-date').value;
    let description = form.querySelector('#task-description').value.trim();
    let notes = form.querySelector('#task-notes')?.value.trim() || this.args.task?.notes;

    if (isEmpty(description) || isEmpty(date)) {
      return;
    }

    this.args.save?.({ date, description, notes });
  }

  @action
  startNotesEdit() {
    this.isEditingNotes = true;
  }

  @action
  cancelNotesEdit() {
    this.isEditingNotes = false;
  }
}
