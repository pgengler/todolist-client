import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type SessionService from 'ember-todo/services/session';

export default class IndexRoute extends Route {
  @service declare router: RouterService;
  @service declare session: SessionService;

  redirect() {
    if (this.session.isAuthenticated) {
      this.router.transitionTo('days');
    } else {
      this.router.transitionTo('login');
    }
  }
}
