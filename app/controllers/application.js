import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    changeDate(date) {
      this.transitionToRoute('days', { queryParams: { date } });
    }
  }
});
