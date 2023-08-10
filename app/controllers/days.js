import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { compare } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

export default class DaysController extends Controller {
  @service poller;

  queryParams = ['date'];
  @tracked date = null;

  get showOverdueTasks() {
    return this.poller.overdueTasks.length > 0;
  }

  get isLoading() {
    return !this.poller.loaded;
  }

  get days() {
    return this.poller.days ? this.poller.days.sort((a, b) => compare(a.name, b.name)) : [];
  }

  get lists() {
    return this.poller.lists;
  }

  @action
  changeDate(date) {
    let dateString = moment(date).format('YYYY-MM-DD');
    this.date = dateString;
  }

  @action
  stopPolling() {
    this.poller.stop();
  }

  @action
  startPolling() {
    this.poller.start();
  }
}
