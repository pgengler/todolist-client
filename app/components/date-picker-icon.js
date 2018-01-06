import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  dateSelected() { /* noop */ },

  actions: {
    changeDate(newDate) {
      let date = moment(newDate.moment).utc().format('YYYY-MM-DD');
      this.dateSelected(date);
    }
  }
});
