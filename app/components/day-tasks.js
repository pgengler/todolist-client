import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default class DayTasks extends Component {
  tagName = '';

  @computed('list.name')
  get date() {
    return moment(this.get('list.name'));
  }

  @computed('date')
  get formattedDate() {
    let date = this.date;
    return date ? date.format('YYYY-MM-DD') : '';
  }

  @computed('date')
  get isPast() {
    let date = this.date;
    let now = moment();
    return (date.isBefore(now, 'day') && !date.isSame(now, 'day'));
  }

  @computed('date')
  get isCurrent() {
    let now = moment();
    return this.date.isSame(now, 'day');
  }

  @computed('date')
  get isFuture() {
    let now = moment();
    return this.date.isAfter(now, 'day');
  }
}
