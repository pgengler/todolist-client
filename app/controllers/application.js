import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
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
