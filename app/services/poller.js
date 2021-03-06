import Ember from 'ember'; // for Ember.testing
import Service, { inject as service } from '@ember/service';
import { all, restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class PollerService extends Service {
  @service flashMessages;
  @service selectedDate;
  @service store;

  @tracked days;
  @tracked lists;

  start() {
    this.pollForChanges.perform();
  }

  stop() {
    this.pollForChanges.cancelAll();
  }

  @restartableTask
  *pollForChanges() {
    yield all([this.loadDayLists.perform(), this.loadOtherLists.perform()]);

    if (Ember.testing) {
      return;
    }
    yield timeout(5000);
    this.pollForChanges.perform();
  }

  @restartableTask
  *loadDayLists() {
    this.days = yield this.store.query('list', {
      include: 'tasks',
      filter: {
        'list-type': 'day',
        date: this.selectedDate.dates.map((date) => date.format('YYYY-MM-DD')),
      },
    });
  }

  @restartableTask
  *loadOtherLists() {
    this.lists = yield this.store.query('list', {
      include: 'tasks',
      filter: {
        'list-type': 'list',
      },
      sort: 'sort-order',
    });
  }
}
