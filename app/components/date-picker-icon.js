import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import moment from 'moment';

export default class DatePickerIcon extends Component {
  @tracked showingCalendar = false;

  @action
  changeDate(newDate) {
    let date = moment(newDate.moment.start).utc().format('YYYY-MM-DD');
    this.args.dateSelected(date);
    this.showingCalendar = false;
  }

  @action
  toggleCalendar() {
    this.showingCalendar = !this.showingCalendar;
  }
}
