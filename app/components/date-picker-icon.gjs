import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import moment from 'moment';

export default class DatePickerIcon extends Component {
  @tracked showingCalendar = false;

  @action
  changeDate(newDate) {
    let date = moment(newDate.moment.start).format('YYYY-MM-DD');
    this.args.dateSelected(date);
    this.showingCalendar = false;
  }

  @action
  toggleCalendar() {
    this.showingCalendar = !this.showingCalendar;
  }
}

<div>
  <FaIcon
    @icon="calendar-alt"
    @prefix="far"
    {{on "click" this.toggleCalendar}}
    ...attributes
  />
  {{#if this.showingCalendar}}
    <RangeDatepicker
      @onSelect={{this.changeDate}}
      @selected={{@dateRange}}
      @renderInPlace={{true}}
      class="date-picker-content"
    />
  {{/if}}
</div>