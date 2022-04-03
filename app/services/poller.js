import Service, { inject as service } from '@ember/service';
import { all, didCancel, restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { isTesting, macroCondition } from '@embroider/macros';

export default class PollerService extends Service {
  @service flashMessages;
  @service selectedDate;
  @service store;

  @tracked days;
  @tracked lists;

  async start() {
    try {
      await this.pollForChanges.perform();
    } catch (e) {
      if (!didCancel(e)) throw e;
    }
  }

  stop() {
    return this.pollForChanges.cancelAll();
  }

  @restartableTask
  *pollForChanges() {
    yield all([this.loadDayLists.perform(), this.loadOtherLists.perform()]);

    if (macroCondition(isTesting())) {
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
