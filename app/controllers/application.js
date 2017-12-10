import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    changeDate(date) {
      this.transitionToRoute('days', { queryParams: { date } });
    }
  }
});
