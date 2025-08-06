import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import { on } from '@ember/modifier';
import RangeDatepicker from './range-datepicker';
import type { DateRange } from 'ember-todo/services/selected-date';

interface DatePickerIconSignature {
  Args: {
    dateRange: DateRange;
    dateSelected: (date: Date) => void;
  };
  Element: HTMLDivElement;
}

export default class DatePickerIcon extends Component<DatePickerIconSignature> {
  @tracked showingCalendar = false;

  @action
  changeDate(range: DateRange): void {
    this.args.dateSelected(range.start);
    this.showingCalendar = false;
  }

  @action
  toggleCalendar(): void {
    this.showingCalendar = !this.showingCalendar;
  }

  <template>
    <div>
      <FaIcon @icon="calendar-alt" @prefix="far" {{on "click" this.toggleCalendar}} ...attributes />
      {{#if this.showingCalendar}}
        <RangeDatepicker
          @onSelect={{this.changeDate}}
          @selected={{@dateRange}}
          @renderInPlace={{true}}
          class="date-picker-content"
        />
      {{/if}}
    </div>
  </template>
}
