import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { parse } from 'date-fns';

export default class DaysRoute extends Route {
  @service poller;
  @service selectedDate;
  @service session;

  queryParams = {
    date: { refreshModel: true },
  };

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
    return this.poller.stop();
  }

  model(params) {
    let date = params.date ? parse(params.date, 'yyyy-MM-dd', new Date()) : null;
    this.selectedDate.date = date;
    this.poller.start();
  }

  @action deactivate() {
    this.poller.stop();
  }
}
