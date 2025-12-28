import Route from '@ember/routing/route';
import { service } from '@ember/service';
import startMirage from 'ember-todo/mirage/config';
import type SessionService from 'ember-todo/services/session';
import type Owner from '@ember/owner';

export default class ApplicationRoute extends Route {
  @service declare session: SessionService;

  constructor(owner: Owner) {
    super(owner);

    startMirage({});
  }

  async beforeModel() {
    await this.session.setup();
  }
}
