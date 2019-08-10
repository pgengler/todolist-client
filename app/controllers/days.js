import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import moment from 'moment';

export default class DaysController extends Controller {
  queryParams = [ 'date' ];
  date = null;

  @alias('model.days') days;
  @alias('model.lists') lists;

  @action
  changeDate(date) {
    let dateString = moment(date).format('YYYY-MM-DD');
    this.set('date', dateString);
  }

  @action
  stopPolling() {
    this.send('pausePolling');
  }

  @action
  startPolling() {
    this.send('resumePolling');
  }
}
