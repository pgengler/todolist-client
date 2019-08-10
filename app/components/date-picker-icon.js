import Component from '@ember/component';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import moment from 'moment';

export default class DatePickerIcon extends Component {
  tagName = '';

  @alias('selectedDate.date') date;

  @action
  changeDate(newDate) {
    let date = moment(newDate.moment.start).utc().format('YYYY-MM-DD');
    if (this.dateSelected) this.dateSelected(date);
  }
}
