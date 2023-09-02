import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';
import { use } from 'ember-resources';
import { CurrentDay } from 'ember-todo/resources/current-day';

export default class SelectedDateService extends Service {
  @tracked _date = null;

  @use today = CurrentDay;

  get date() {
    return this._date ?? this.today;
  }

  set date(date) {
    this._date = date;
  }

  get hasDateSelected() {
    return !!this._date;
  }

  get dates() {
    return [
      moment(this.date).subtract(1, 'day'),
      this.date,
      ...[1, 2, 3].map((val) => moment(this.date).add(val, 'days')),
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
