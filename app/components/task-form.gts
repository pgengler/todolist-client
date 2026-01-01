import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { isEmpty } from '@ember/utils';
import { on } from '@ember/modifier';
import preventDefault from '../helpers/prevent-default';
import AutofocusElasticTextarea from './autofocus-elastic-textarea';
import MarkdownToHtml from 'ember-showdown/components/markdown-to-html';
import type Task from 'ember-todo/models/task';

function taskDate(task?: Task): string | null {
  if (!task) return null;
  return task.dueDate;
}

interface TaskFormSignature {
  Args: {
    cancel: () => void;
    task?: Task;
    saveButtonLabel?: string;
    save?: (task: { date: string; description: string; notes: string }) => Promise<void>;
  };
  Blocks: {
    footer: [];
  };
}

export default class TaskForm extends Component<TaskFormSignature> {
  @tracked description = this.args.task?.description;
  @tracked isEditingNotes = false;
  @tracked notes = this.args.task?.notes;
  @tracked taskDate = taskDate(this.args.task);

  get editingNotes(): boolean {
    return !this.args.task || this.args.task?.isNew || isEmpty(this.args.task?.notes) || this.isEditingNotes;
  }

  get formId(): string {
    return `task-form-${guidFor(this)}`;
  }

  get saveButtonLabel(): string {
    return this.args.saveButtonLabel ?? 'Save';
  }

  showPicker(event: Event) {
    try {
      (event.target as HTMLInputElement).showPicker();
    } catch {
      // this can fail in tests and we don't care
    }
  }

  @action
  async save(): Promise<void> {
    const form = <HTMLFormElement>document.getElementById(this.formId)!;

    const date = (form.querySelector('#task-date') as HTMLInputElement).value;
    const description = (form.querySelector('#task-description') as HTMLTextAreaElement).value.trim();
    const notes =
      (form.querySelector('#task-notes') as HTMLTextAreaElement | undefined)?.value.trim() ||
      this.args.task?.notes ||
      '';

    if (isEmpty(description) || isEmpty(date)) {
      return;
    }

    await this.args.save?.({ date, description, notes });
  }

  @action
  startNotesEdit(): void {
    this.isEditingNotes = true;
  }

  @action
  cancelNotesEdit(): void {
    this.isEditingNotes = false;
  }

  <template>
    <form class="task-form" {{on "submit" (preventDefault this.save)}} id={{this.formId}}>
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
  </template>
}
