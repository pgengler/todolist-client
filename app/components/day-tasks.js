import Component from '@glimmer/component';
import moment from 'moment';

export default class DayTasks extends Component {
  get date() {
    return moment(this.args.list.name);
  }

  get formattedDate() {
    return this.date.format('YYYY-MM-DD');
  }

  get isPast() {
    let date = this.date;
    let now = moment();
    return (date.isBefore(now, 'day') && !date.isSame(now, 'day'));
  }

  get isCurrent() {
    let now = moment();
    return this.date.isSame(now, 'day');
  }

  get isFuture() {
    let now = moment();
    return this.date.isAfter(now, 'day');
  }
}
