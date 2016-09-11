import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  queryParams: [ 'date' ],
  date: null,

  days: Ember.computed.alias('model.days'),
  undated: Ember.computed.alias('model.undated'),

  actions: {
    changeDate(date) {
      const dateString = moment(date).format('YYYY-MM-DD');
      this.set('date', dateString);
    }
  }
});
