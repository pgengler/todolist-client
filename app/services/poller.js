import Service, { service } from '@ember/service';
import { didCancel, dropTask, restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { isTesting, macroCondition } from '@embroider/macros';
import { use } from 'ember-resources';
import { CurrentDay } from 'ember-todo/resources/current-day';
import { endOfDay, format, isBefore, parse, startOfDay } from 'date-fns';

export default class PollerService extends Service {
  @service selectedDate;
  @service store;

  @tracked days;
  @tracked lists;

  @tracked loaded = false;

  @use today = CurrentDay;

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
    let loadingPromises = [this.loadDayLists(), this.loadOtherLists()];
    if (this.#loadOverdueTasks) {
      loadingPromises.push(this.loadOverdueTasks.perform());
    }
    try {
      await Promise.all(loadingPromises);
      this.loaded = true;
    } catch (e) {
      console.warn(e); // eslint-disable no-console
    }

    if (macroCondition(isTesting())) {
      return;
    }
    await timeout(5000);
    this.pollForChanges.perform();
  });

  async loadDayLists() {
    const days = await this.store.query('list', {
      include: 'tasks',
      filter: {
        'list-type': 'day',
        date: this.selectedDate.dates.map((date) => format(date, 'yyyy-MM-dd')),
      },
    });
    this.days = days.slice();
  }

  async loadOtherLists() {
    this.lists = await this.store.query('list', {
      include: 'tasks',
      filter: {
        'list-type': 'list',
      },
      sort: 'sort-order',
    });
  }

  loadOverdueTasks = dropTask(async () => {
    if (!this.#loadOverdueTasks) return [];
    return await this.store.query('task', {
      filter: { due_before: format(new Date(), 'yyyy-MM-dd') },
      sort: 'due-date,plaintext-description',
    });
  });

  get overdueTasks() {
    let tasks = this.loadOverdueTasks.lastSuccessful?.value ?? [];
    let today = startOfDay(this.today);
    return tasks.filter((task) => {
      const taskDueDate = endOfDay(parse(task.dueDate, 'yyyy-MM-dd', new Date()));
      return isBefore(taskDueDate, today);
    });
  }

  get #loadOverdueTasks() {
    return !this.selectedDate.hasDateSelected;
  }
}
