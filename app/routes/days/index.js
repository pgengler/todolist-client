import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
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
    let date = params.date ? moment(params.date) : moment();
    this.selectedDate.date = date;
    return this.poller.start();
  }

  @action deactivate() {
    this.poller.stop();
  }
}
