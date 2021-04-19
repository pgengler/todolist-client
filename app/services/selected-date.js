import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

export default class SelectedDateService extends Service {
  @tracked date = null;

  get dates() {
    let date = this.date || moment();
    return [
      moment(date).subtract(1, 'day'),
      date,
      ...[1, 2, 3].map((val) => moment(date).add(val, 'days')),
    ];
  }

  get startDate() {
    return this.dates[0];
  }

  get endDate() {
    return this.dates[this.dates.length - 1];
  }

  get dateRange() {
    return {
      start: this.startDate,
      end: this.endDate,
    };
  }
}
