import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import moment from 'moment';

export default class DaysRoute extends Route {
  @service flashMessages;
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
    let date = params.date ? moment(params.date) : null;
    this.selectedDate.date = date;
    this.poller.start();
  }

  @action deactivate() {
    this.poller.stop();
  }
}
