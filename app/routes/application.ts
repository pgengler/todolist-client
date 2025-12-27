import Route from '@ember/routing/route';
import { service } from '@ember/service';
import startMirage  from 'ember-todo/mirage/config';
import type SessionService from 'ember-simple-auth/services/session';
import mirageConfig from 'ember-todo/mirage/config';

export default class ApplicationRoute extends Route {
  @service declare session: SessionService;

  constructor() {
    super(...arguments);

    startMirage(mirageConfig);
  }

  beforeModel() {
    this.session.setup();
  }
}
