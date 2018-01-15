import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  redirect() {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('days');
    } else {
      this.transitionTo('login');
    }
  }
});
