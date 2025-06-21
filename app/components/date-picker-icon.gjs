import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import { on } from '@ember/modifier';
import RangeDatepicker from './range-datepicker';

export default class DatePickerIcon extends Component {
  @tracked showingCalendar = false;

  @action
  changeDate({ date: range }) {
    this.args.dateSelected(range.start);
    this.showingCalendar = false;
  }

  @action
  toggleCalendar() {
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
