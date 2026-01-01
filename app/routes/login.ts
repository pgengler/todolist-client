import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type SessionService from 'ember-todo/services/session';

export default class LoginRoute extends Route {
  @service declare session: SessionService;

  beforeModel(): void {
    this.session.prohibitAuthentication('index');
  }
}
