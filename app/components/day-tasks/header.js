import Component from '@glimmer/component';
import moment from 'moment';

export default class DayTasksHeader extends Component {
  get date() {
    return moment(this.args.list.name);
  }

  get dayOfWeek() {
    return this.date.format('dddd');
  }

  get formattedDate() {
    return this.date.format('MMM D, YYYY');
  }
}
