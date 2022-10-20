import Service, { service } from '@ember/service';
import { all, didCancel, restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { isTesting, macroCondition } from '@embroider/macros';

export default class PollerService extends Service {
  @service flashMessages;
  @service selectedDate;
  @service store;

  @tracked days;
  @tracked lists;
  @tracked loaded = false;

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

  pollForChanges = restartableTask(async () => {
    await all([this.loadDayLists.perform(), this.loadOtherLists.perform()]);
    this.loaded = true;

    if (macroCondition(isTesting())) {
      return;
    }
    await timeout(5000);
    this.pollForChanges.perform();
  });

  loadDayLists = restartableTask(async () => {
    let days = await this.store.query('list', {
      include: 'tasks',
      filter: {
        'list-type': 'day',
        date: this.selectedDate.dates.map((date) => date.format('YYYY-MM-DD')),
      },
    });
    this.days = Array.from(days);
  });

  loadOtherLists = restartableTask(async () => {
    this.lists = await this.store.query('list', {
      include: 'tasks',
      filter: {
        'list-type': 'list',
      },
      sort: 'sort-order',
    });
  });
}
