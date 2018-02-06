import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  selectedDate: service(),
  session: service(),

  actions: {
    changeDate(date) {
      this.transitionToRoute('days', { queryParams: { date } });
    },

    logout() {
      this.get('session').invalidate();
    }
  }
});
