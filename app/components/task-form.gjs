import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { isEmpty } from '@ember/utils';

function taskDate(task) {
  if (!task) return null;
  return task.dueDate;
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

<form
  class="task-form"
  {{on "submit" (prevent-default this.save)}}
  id={{this.formId}}
>
  <AutofocusElasticTextarea
    @onEnterPressed={{this.save}}
    @onEscapePressed={{@cancel}}
    @value={{this.description}}
    id="task-description"
    data-test-task-description
    placeholder="Task description"
    class="w-100"
    required
  />
  <br /><br />
  <input
    type="date"
    id="task-date"
    value={{this.taskDate}}
    {{on "focus" this.showPicker}}
    data-test-task-date
    required
  />

  <br /><br />
  {{#if this.editingNotes}}
    <AutofocusElasticTextarea
      @onEscapePressed={{this.cancelNotesEdit}}
      @onEnterPressed={{this.save}}
      @value={{this.notes}}
      id="task-notes"
      data-test-task-notes
      class="w-100"
      placeholder="Notes (optional)"
    />
  {{else}}
    {{! template-lint-disable no-invalid-interactive }}
    <div {{on "click" this.startNotesEdit}} data-test-task-notes>
      <MarkdownToHtml @markdown={{@task.notes}} />
    </div>
  {{/if}}

  <br /><br />
  <button type="submit" data-test-save-task>
    {{this.saveButtonLabel}}
  </button>
  <button type="button" {{on "click" @cancel}} data-test-cancel-button>
    Cancel
  </button>

  {{yield to="footer"}}
</form>