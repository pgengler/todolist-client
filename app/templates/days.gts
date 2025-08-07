import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { compare } from '@ember/utils';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import OverdueTaskList from '../components/overdue-task-list';
import DayTasks from '../components/day-tasks';
import TaskList from '../components/task-list';
import type PollerService from 'ember-todo/services/poller';
import type SelectedDateService from 'ember-todo/services/selected-date';

export default class extends Component {
  @service declare poller: PollerService;
  @service declare selectedDate: SelectedDateService;

  get showOverdueTasks() {
    // show "Overdue" section only if there _are_ overdue tasks, and an explicit date isn't being used
    return !this.selectedDate.hasDateSelected && this.poller.overdueTasks.length > 0;
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
  stopPolling() {
    void this.poller.stop();
  }

  @action
  startPolling() {
    void this.poller.start();
  }

  <template>
    <div class="days">
      {{#if this.isLoading}}
        <FaIcon @icon="spinner" @spin={{true}} @size="4x" />
      {{else}}
        {{#if this.showOverdueTasks}}
          <OverdueTaskList @tasks={{this.poller.overdueTasks}} />
        {{/if}}
        {{#each this.days as |list|}}
          <DayTasks @list={{list}} @editingStart={{this.stopPolling}} @editingEnd={{this.startPolling}} />
        {{/each}}
        {{#each this.lists as |list|}}
          <TaskList @list={{list}} @editingStart={{this.stopPolling}} @editingEnd={{this.startPolling}} />
        {{/each}}
      {{/if}}
    </div>
  </template>
}
