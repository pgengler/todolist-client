import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import moment from 'moment';

export default Component.extend({

  dateSelected() { /* noop */ },

  date: alias('selectedDate.date'),

  actions: {
    changeDate(newDate) {
      let date = moment(newDate.moment.start).utc().format('YYYY-MM-DD');
      this.dateSelected(date);
    }
  }
});
