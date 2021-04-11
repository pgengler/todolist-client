import Ember from 'ember'; // for Ember.testing
import { alias } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import { all, timeout } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';

export default class PollerService extends Service {
  @service flashMessages;
  @service selectedDate;
  @service store;

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
    return yield this.store.query('list', {
      include: 'tasks',
      filter: {
        'list-type': 'day',
        date: this.selectedDate.dates.map((date) => date.format('YYYY-MM-DD')),
      },
    });
  }

  @restartableTask
  *loadOtherLists() {
    return yield this.store.query('list', {
      include: 'tasks',
      filter: {
        'list-type': 'list',
      },
      sort: 'sort-order',
    });
  }

  @alias('loadDayLists.lastSuccessful.value') days;
  @alias('loadOtherLists.lastSuccessful.value') lists;
}
