import Component from '@glimmer/component';
import { action } from '@ember/object';
import moment from 'moment';

export default class DatePickerIcon extends Component {
  get date() {
    return this.args.selectedDate.date;
  }

  @action
  changeDate(newDate) {
    let date = moment(newDate.moment.start).utc().format('YYYY-MM-DD');
    if (this.args.dateSelected) this.args.dateSelected(date);
  }
}
