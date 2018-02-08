import Service from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import moment from 'moment';

export default Service.extend({
  date: null,

  dates: computed('date', function() {
    let date = this.get('date');
    return [
      moment(date).subtract(1, 'day'),
      date,
      ...[1, 2, 3].map((val) => moment(date).add(val, 'days'))
    ];
  }),

  startDate: alias('dates.firstObject'),
  endDate: alias('dates.lastObject'),

  dateRange: computed('startDate', 'endDate', function() {
    return {
      start: this.get('startDate'),
      end: this.get('endDate')
    };
  })
});
