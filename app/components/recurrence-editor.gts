import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import type Store from '@ember-data/store';
import type RecurrenceRule from 'ember-todo/models/recurrence-rule';
import type { RecurrenceType } from 'ember-todo/models/recurrence-rule';

const eq = <T,>(a: T, b: T): boolean => a === b;
const not = (value: unknown): boolean => !value;
const includes = (arr: number[], value: number): boolean => arr.includes(value);

const RECURRENCE_TYPES: { value: RecurrenceType; label: string }[] = [
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
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
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

interface RecurrenceEditorSignature {
  Args: {
    rule?: RecurrenceRule;
    onSave: (rule: RecurrenceRule) => void;
    onCancel: () => void;
  };
  Element: HTMLFormElement;
}

export default class RecurrenceEditor extends Component<RecurrenceEditorSignature> {
  @service declare store: Store;

  @tracked description = this.args.rule?.description ?? '';
  @tracked notes = this.args.rule?.notes ?? '';
  @tracked recurrenceType: RecurrenceType = this.args.rule?.recurrenceType ?? 'weekly';
  @tracked interval = this.args.rule?.interval ?? 1;
  @tracked dayOfWeek = this.args.rule?.dayOfWeek ?? 1;
  @tracked daysOfWeek: number[] = this.args.rule?.daysOfWeek ?? [];
  @tracked dayOfMonth = this.args.rule?.dayOfMonth ?? 1;
  @tracked weekOfMonth = this.args.rule?.weekOfMonth ?? 1;
  @tracked month = this.args.rule?.month ?? 1;
  @tracked startDate = this.args.rule?.startDate ?? null;
  @tracked endDate = this.args.rule?.endDate ?? null;
  @tracked maxInstances = this.args.rule?.maxInstances ?? null;

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

  get isValid() {
    if (!this.description.trim()) return false;
    if (this.showDaysOfWeek && this.daysOfWeek.length === 0) return false;
    return true;
  }

  @action
  updateDescription(event: Event) {
    this.description = (event.target as HTMLInputElement).value;
  }

  @action
  updateNotes(event: Event) {
    this.notes = (event.target as HTMLTextAreaElement).value;
  }

  @action
  updateRecurrenceType(event: Event) {
    this.recurrenceType = (event.target as HTMLSelectElement).value as RecurrenceType;
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
  updateStartDate(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.startDate = value ? new Date(value) : null;
  }

  @action
  updateEndDate(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.endDate = value ? new Date(value) : null;
  }

  @action
  updateMaxInstances(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.maxInstances = value ? parseInt(value, 10) : null;
  }

  @action
  async save(event: Event) {
    event.preventDefault();
    if (!this.isValid) return;

    const rule = this.args.rule ?? this.store.createRecord<RecurrenceRule>('recurrence-rule', {});

    rule.description = this.description.trim();
    rule.notes = this.notes.trim();
    rule.recurrenceType = this.recurrenceType;
    rule.interval = this.interval;
    rule.dayOfWeek = this.showDayOfWeek ? this.dayOfWeek : null;
    rule.daysOfWeek = this.showDaysOfWeek ? this.daysOfWeek : [];
    rule.dayOfMonth = this.showDayOfMonth ? this.dayOfMonth : null;
    rule.weekOfMonth = this.showWeekOfMonth ? this.weekOfMonth : null;
    rule.month = this.showMonth ? this.month : null;
    rule.startDate = this.startDate;
    rule.endDate = this.endDate;
    rule.maxInstances = this.maxInstances;

    await rule.save();
    this.args.onSave(rule);
  }

  @action
  cancel() {
    if (this.args.rule?.isNew) {
      this.args.rule.unloadRecord();
    }
    this.args.onCancel();
  }

  <template>
    <form class="recurrence-editor" {{on "submit" this.save}} ...attributes>
      <div class="form-group">
        <label for="description">Task Description</label>
        <input type="text" id="description" value={{this.description}} {{on "input" this.updateDescription}} required />
      </div>

      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea id="notes" {{on "input" this.updateNotes}}>{{this.notes}}</textarea>
      </div>

      <div class="form-group">
        <label for="recurrence-type">Repeats</label>
        <select id="recurrence-type" {{on "change" this.updateRecurrenceType}}>
          {{#each this.recurrenceTypes as |type|}}
            <option value={{type.value}} selected={{eq this.recurrenceType type.value}}>
              {{type.label}}
            </option>
          {{/each}}
        </select>
      </div>

      {{#if this.showInterval}}
        <div class="form-group">
          <label for="interval">Every</label>
          <div class="inline-group">
            <input type="number" id="interval" min="1" value={{this.interval}} {{on "input" this.updateInterval}} />
            <span>{{this.intervalLabel}}</span>
          </div>
        </div>
      {{/if}}

      {{#if this.showDayOfWeek}}
        <div class="form-group">
          <label for="day-of-week">Day of Week</label>
          <select id="day-of-week" {{on "change" this.updateDayOfWeek}}>
            {{#each this.daysOfWeekOptions as |day|}}
              <option value={{day.value}} selected={{eq this.dayOfWeek day.value}}>
                {{day.label}}
              </option>
            {{/each}}
          </select>
        </div>
      {{/if}}

      {{#if this.showDaysOfWeek}}
        <div class="form-group">
          <label>Days of Week</label>
          <div class="checkbox-group">
            {{#each this.daysOfWeekOptions as |day|}}
              <label class="checkbox-label">
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
        <div class="form-group">
          <label for="week-of-month">Week of Month</label>
          <select id="week-of-month" {{on "change" this.updateWeekOfMonth}}>
            {{#each this.weeksOfMonth as |week|}}
              <option value={{week.value}} selected={{eq this.weekOfMonth week.value}}>
                {{week.label}}
              </option>
            {{/each}}
          </select>
        </div>
      {{/if}}

      {{#if this.showDayOfMonth}}
        <div class="form-group">
          <label for="day-of-month">Day of Month</label>
          <input
            type="number"
            id="day-of-month"
            min="1"
            max="31"
            value={{this.dayOfMonth}}
            {{on "input" this.updateDayOfMonth}}
          />
        </div>
      {{/if}}

      {{#if this.showMonth}}
        <div class="form-group">
          <label for="month">Month</label>
          <select id="month" {{on "change" this.updateMonth}}>
            {{#each this.months as |m|}}
              <option value={{m.value}} selected={{eq this.month m.value}}>
                {{m.label}}
              </option>
            {{/each}}
          </select>
        </div>
      {{/if}}

      <fieldset class="constraints">
        <legend>Optional Constraints</legend>

        <div class="form-group">
          <label for="start-date">Start Date</label>
          <input type="date" id="start-date" {{on "change" this.updateStartDate}} />
        </div>

        <div class="form-group">
          <label for="end-date">End Date</label>
          <input type="date" id="end-date" {{on "change" this.updateEndDate}} />
        </div>

        <div class="form-group">
          <label for="max-instances">Maximum Instances</label>
          <input type="number" id="max-instances" min="1" {{on "input" this.updateMaxInstances}} />
        </div>
      </fieldset>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" disabled={{not this.isValid}}>
          Save
        </button>
        <button type="button" class="btn btn-secondary" {{on "click" this.cancel}}>
          Cancel
        </button>
      </div>
    </form>
  </template>
}
