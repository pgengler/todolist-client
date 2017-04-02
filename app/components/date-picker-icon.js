import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  actions: {
    changeDate(newDate) {
      let date = moment(newDate.moment).utc().format('YYYY-MM-DD');
      this.sendAction('dateSelected', date);
    }
  }
});
