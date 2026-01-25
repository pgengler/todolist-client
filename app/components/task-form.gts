import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { isEmpty } from '@ember/utils';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import preventDefault from '../helpers/prevent-default';
import AutofocusElasticTextarea from './autofocus-elastic-textarea';
import MarkdownToHtml from 'ember-showdown/components/markdown-to-html';
import type Task from 'ember-todo/models/task';
import type { RecurrenceType } from 'ember-todo/models/recurrence-rule';

function taskDate(task?: Task): string | null {
  if (!task) return null;
  return task.dueDate;
}

const eq = <T,>(a: T, b: T): boolean => a === b;
const includes = (arr: number[], value: number): boolean => arr.includes(value);

const RECURRENCE_TYPES: { value: RecurrenceType | 'none'; label: string }[] = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Every day' },
  { value: 'weekdays', label: 'Weekdays (Mon-Fri)' },
  { value: 'weekends', label: 'Weekends (Sat-Sun)' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom_weekly', label: 'Specific days of week' },
  { value: 'every_n_days', label: 'Every N days' },
  { value: 'every_n_weeks', label: 'Every N weeks' },
  { value: 'every_n_months', label: 'Every N months' },
  { value: 'monthly_weekday', label: 'Monthly (nth weekday)' },
  { value: 'yearly', label: 'Yearly (specific date)' },
  { value: 'yearly_weekday', label: 'Yearly (nth weekday)' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

const WEEKS_OF_MONTH = [
  { value: 1, label: 'First' },
  { value: 2, label: 'Second' },
  { value: 3, label: 'Third' },
  { value: 4, label: 'Fourth' },
  { value: 5, label: 'Fifth' },
  { value: -1, label: 'Last' },
];

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export interface RecurrenceOptions {
  recurrenceType: RecurrenceType;
  interval: number;
  dayOfWeek: number | null;
  daysOfWeek: number[];
  dayOfMonth: number | null;
  weekOfMonth: number | null;
  month: number | null;
  endDate: string | null;
  maxInstances: number | null;
}

interface TaskFormSignature {
  Args: {
    cancel: () => void;
    task?: Task;
    saveButtonLabel?: string;
    save?: (task: {
      date: string;
      description: string;
      notes: string;
      recurrence?: RecurrenceOptions;
    }) => Promise<void>;
    showRecurrence?: boolean;
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

  // Recurrence state
  @tracked recurrenceType: RecurrenceType | 'none' = 'none';
  @tracked interval = 1;
  @tracked dayOfWeek = 1;
  @tracked daysOfWeek: number[] = [];
  @tracked dayOfMonth = 1;
  @tracked weekOfMonth = 1;
  @tracked month = 1;
  @tracked recurrenceEndDate: string | null = null;
  @tracked maxInstances: number | null = null;

  get editingNotes(): boolean {
    return !this.args.task || this.args.task?.isNew || isEmpty(this.args.task?.notes) || this.isEditingNotes;
  }

  get formId(): string {
    return `task-form-${guidFor(this)}`;
  }

  get saveButtonLabel(): string {
    return this.args.saveButtonLabel ?? 'Save';
  }

  get showRecurrence(): boolean {
    return this.args.showRecurrence ?? false;
  }

  get hasRecurrence(): boolean {
    return this.recurrenceType !== 'none';
  }

  get recurrenceTypes() {
    return RECURRENCE_TYPES;
  }

  get daysOfWeekOptions() {
    return DAYS_OF_WEEK;
  }

  get weeksOfMonth() {
    return WEEKS_OF_MONTH;
  }

  get months() {
    return MONTHS;
  }

  get showDayOfWeek() {
    return ['weekly', 'every_n_weeks', 'monthly_weekday', 'yearly_weekday'].includes(this.recurrenceType);
  }

  get showDaysOfWeek() {
    return this.recurrenceType === 'custom_weekly';
  }

  get showInterval() {
    return ['every_n_days', 'every_n_weeks', 'every_n_months'].includes(this.recurrenceType);
  }

  get showDayOfMonth() {
    return ['every_n_months', 'yearly'].includes(this.recurrenceType);
  }

  get showWeekOfMonth() {
    return ['monthly_weekday', 'yearly_weekday'].includes(this.recurrenceType);
  }

  get showMonth() {
    return ['yearly', 'yearly_weekday'].includes(this.recurrenceType);
  }

  get intervalLabel() {
    switch (this.recurrenceType) {
      case 'every_n_days':
        return 'days';
      case 'every_n_weeks':
        return 'weeks';
      case 'every_n_months':
        return 'months';
      default:
        return '';
    }
  }

  showPicker(event: Event) {
    try {
      (event.target as HTMLInputElement).showPicker();
    } catch {
      // this can fail in tests and we don't care
    }
  }

  @action
  updateRecurrenceType(event: Event) {
    this.recurrenceType = (event.target as HTMLSelectElement).value as RecurrenceType | 'none';
  }

  @action
  updateInterval(event: Event) {
    this.interval = parseInt((event.target as HTMLInputElement).value, 10) || 1;
  }

  @action
  updateDayOfWeek(event: Event) {
    this.dayOfWeek = parseInt((event.target as HTMLSelectElement).value, 10);
  }

  @action
  toggleDayOfWeek(day: number) {
    if (this.daysOfWeek.includes(day)) {
      this.daysOfWeek = this.daysOfWeek.filter((d) => d !== day);
    } else {
      this.daysOfWeek = [...this.daysOfWeek, day].sort();
    }
  }

  @action
  updateDayOfMonth(event: Event) {
    this.dayOfMonth = parseInt((event.target as HTMLInputElement).value, 10) || 1;
  }

  @action
  updateWeekOfMonth(event: Event) {
    this.weekOfMonth = parseInt((event.target as HTMLSelectElement).value, 10);
  }

  @action
  updateMonth(event: Event) {
    this.month = parseInt((event.target as HTMLSelectElement).value, 10);
  }

  @action
  updateRecurrenceEndDate(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.recurrenceEndDate = value || null;
  }

  @action
  updateMaxInstances(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.maxInstances = value ? parseInt(value, 10) : null;
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

    const recurrence = this.hasRecurrence
      ? {
          recurrenceType: this.recurrenceType as RecurrenceType,
          interval: this.interval,
          dayOfWeek: this.showDayOfWeek ? this.dayOfWeek : null,
          daysOfWeek: this.showDaysOfWeek ? this.daysOfWeek : [],
          dayOfMonth: this.showDayOfMonth ? this.dayOfMonth : null,
          weekOfMonth: this.showWeekOfMonth ? this.weekOfMonth : null,
          month: this.showMonth ? this.month : null,
          endDate: this.recurrenceEndDate,
          maxInstances: this.maxInstances,
        }
      : undefined;

    await this.args.save?.({ date, description, notes, recurrence });
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

      {{#if this.showRecurrence}}
        <br />
        <div class="recurrence-section">
          <label for="recurrence-type">Repeat</label>
          <select id="recurrence-type" {{on "change" this.updateRecurrenceType}} data-test-recurrence-type>
            {{#each this.recurrenceTypes as |type|}}
              <option value={{type.value}} selected={{eq this.recurrenceType type.value}}>
                {{type.label}}
              </option>
            {{/each}}
          </select>

          {{#if this.hasRecurrence}}
            <div class="recurrence-options">
              {{#if this.showInterval}}
                <div class="recurrence-option">
                  <label for="recurrence-interval">Every</label>
                  <input
                    type="number"
                    id="recurrence-interval"
                    min="1"
                    value={{this.interval}}
                    {{on "input" this.updateInterval}}
                  />
                  <span>{{this.intervalLabel}}</span>
                </div>
              {{/if}}

              {{#if this.showDayOfWeek}}
                <div class="recurrence-option">
                  <label for="recurrence-day-of-week">On</label>
                  <select id="recurrence-day-of-week" {{on "change" this.updateDayOfWeek}}>
                    {{#each this.daysOfWeekOptions as |day|}}
                      <option value={{day.value}} selected={{eq this.dayOfWeek day.value}}>
                        {{day.label}}
                      </option>
                    {{/each}}
                  </select>
                </div>
              {{/if}}

              {{#if this.showDaysOfWeek}}
                <div class="recurrence-option">
                  <label>On days</label>
                  <div class="days-of-week-picker">
                    {{#each this.daysOfWeekOptions as |day|}}
                      <label class="day-checkbox">
                        <input
                          type="checkbox"
                          checked={{includes this.daysOfWeek day.value}}
                          {{on "change" (fn this.toggleDayOfWeek day.value)}}
                        />
                        {{day.label}}
                      </label>
                    {{/each}}
                  </div>
                </div>
              {{/if}}

              {{#if this.showWeekOfMonth}}
                <div class="recurrence-option">
                  <label for="recurrence-week-of-month">The</label>
                  <select id="recurrence-week-of-month" {{on "change" this.updateWeekOfMonth}}>
                    {{#each this.weeksOfMonth as |week|}}
                      <option value={{week.value}} selected={{eq this.weekOfMonth week.value}}>
                        {{week.label}}
                      </option>
                    {{/each}}
                  </select>
                </div>
              {{/if}}

              {{#if this.showDayOfMonth}}
                <div class="recurrence-option">
                  <label for="recurrence-day-of-month">Day</label>
                  <input
                    type="number"
                    id="recurrence-day-of-month"
                    min="1"
                    max="31"
                    value={{this.dayOfMonth}}
                    {{on "input" this.updateDayOfMonth}}
                  />
                </div>
              {{/if}}

              {{#if this.showMonth}}
                <div class="recurrence-option">
                  <label for="recurrence-month">In</label>
                  <select id="recurrence-month" {{on "change" this.updateMonth}}>
                    {{#each this.months as |m|}}
                      <option value={{m.value}} selected={{eq this.month m.value}}>
                        {{m.label}}
                      </option>
                    {{/each}}
                  </select>
                </div>
              {{/if}}

              <div class="recurrence-option">
                <label for="recurrence-end-date">End date (optional)</label>
                <input type="date" id="recurrence-end-date" {{on "change" this.updateRecurrenceEndDate}} />
              </div>

              <div class="recurrence-option">
                <label for="recurrence-max-instances">Max occurrences (optional)</label>
                <input type="number" id="recurrence-max-instances" min="1" {{on "input" this.updateMaxInstances}} />
              </div>
            </div>
          {{/if}}
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
