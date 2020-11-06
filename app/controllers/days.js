import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

export default class DaysController extends Controller {
  @service poller;

  queryParams = [ 'date' ];
  @tracked date = null;

  @alias('poller.days') days;
  @alias('poller.lists') lists;

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
