import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
  queryParams: [ 'date' ],
  date: null,

  days: alias('model.days'),
  lists: alias('model.lists'),

  actions: {
    changeDate(date) {
      let dateString = moment(date).format('YYYY-MM-DD');
      this.set('date', dateString);
    },

    stopPolling() {
      this.send('pausePolling');
    },
    startPolling() {
      this.send('resumePolling');
    }
  }
});
