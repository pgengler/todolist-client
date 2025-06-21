import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import OverdueTaskList from "../components/overdue-task-list.js";
import DayTasks from "../components/day-tasks.js";
import TaskList from "../components/task-list.js";
<template><div class="days">
  {{#if @controller.isLoading}}
    <FaIcon @icon="spinner" @spin={{true}} @size="4x" />
  {{else}}
    {{#if @controller.showOverdueTasks}}
      <OverdueTaskList @tasks={{@controller.poller.overdueTasks}} />
    {{/if}}
    {{#each @controller.days as |list|}}
      <DayTasks @list={{list}} @editingStart={{@controller.stopPolling}} @editingEnd={{@controller.startPolling}} />
    {{/each}}
    {{#each @controller.lists as |list|}}
      <TaskList @list={{list}} @editingStart={{@controller.stopPolling}} @editingEnd={{@controller.startPolling}} />
    {{/each}}
  {{/if}}
</div></template>