import Service from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import moment from 'moment';

export default class SelectedDateService extends Service {
  date = null;

  @computed('date')
  get dates() {
    let date = this.date;
    return [
      moment(date).subtract(1, 'day'),
      date,
      ...[1, 2, 3].map((val) => moment(date).add(val, 'days'))
    ];
  }

  @alias('dates.firstObject') startDate;
  @alias('dates.lastObject') endDate;

  @computed('startDate', 'endDate')
  get dateRange() {
    return {
      start: this.startDate,
      end: this.endDate
    };
  }
}
