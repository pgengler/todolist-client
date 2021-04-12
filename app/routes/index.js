import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;
  @service session;

  redirect() {
    if (this.session.isAuthenticated) {
      this.router.transitionTo('days');
    } else {
      this.router.transitionTo('login');
    }
  }
}
