import TaskList from '../components/task-list';

<template>
  <div class="recurring-task-days">
    {{#each @model as |list|}}
      <TaskList @list={{list}} />
    {{/each}}
  </div>
</template>
