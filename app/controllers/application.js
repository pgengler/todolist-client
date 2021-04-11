import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service flashMessages;
  @service router;
  @service selectedDate;
  @service session;

  @action
  changeDate(date) {
    this.router.transitionTo('days', { queryParams: { date } });
  }

  @action
  logout(event) {
    event.preventDefault();
    this.session.invalidate();
    this.router.transitionTo('login');
  }
}
