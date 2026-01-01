import Service, { service } from '@ember/service';
import { didCancel, dropTask, restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { isTesting, macroCondition } from '@embroider/macros';
import { use } from 'ember-resources';
import { CurrentDay } from 'ember-todo/resources/current-day';
import { endOfDay, format, isBefore, parse, startOfDay } from 'date-fns';
import type SelectedDateService from 'ember-todo/services/selected-date';
import type Store from '@ember-data/store';
import type List from 'ember-todo/models/list';
import type Task from 'ember-todo/models/task';

export default class PollerService extends Service {
  @service declare selectedDate: SelectedDateService;
  @service declare store: Store;

  @tracked days: List[] | undefined;
  @tracked lists: List[] | undefined;

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
    const loadingPromises: Array<Promise<unknown>> = [this.loadDayLists(), this.loadOtherLists()];
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
    void this.pollForChanges.perform();
  });

  async loadDayLists() {
    this.days = (
      await this.store.query<List>('list', {
        include: ['tasks'],
        filter: {
          'list-type': 'day',
          date: this.selectedDate.dates.map((date) => format(date, 'yyyy-MM-dd')),
        },
      })
    ).slice();
  }

  async loadOtherLists() {
    this.lists = (
      await this.store.query<List>('list', {
        include: ['tasks'],
        filter: {
          'list-type': 'list',
        },
        sort: 'sort-order',
      })
    ).slice();
  }

  loadOverdueTasks = dropTask(async () => {
    if (!this.#loadOverdueTasks) return [];
    return (
      await this.store.query<Task>('task', {
        filter: { due_before: format(new Date(), 'yyyy-MM-dd') },
        sort: 'due-date,plaintext-description',
      })
    ).slice();
  });

  get overdueTasks() {
    const tasks = this.loadOverdueTasks.lastSuccessful?.value ?? [];
    const today = startOfDay(this.today);
    return tasks.filter((task) => {
      const taskDueDate = endOfDay(parse(task.dueDate, 'yyyy-MM-dd', new Date()));
      return isBefore(taskDueDate, today);
    });
  }

  get #loadOverdueTasks() {
    return !this.selectedDate.hasDateSelected;
  }
}
