import Header from './task-list/header';
import SingleTask from './single-task';
import draggableTask from '../modifiers/draggable-task';

<template>
  <div class="task-list has-unfinished-tasks past" data-test-list-overdue ...attributes>
    <Header>
      <h1>Overdue</h1>
    </Header>

    <ul>
      {{#each @tasks as |task|}}
        <SingleTask
          @task={{task}}
          @editingStart={{@editingStart}}
          @editingEnd={{@editingEnd}}
          {{draggableTask task}}
          data-test-task
        >
          <:after>
            <p class="due-date">Due {{task.dueDate}}</p>
          </:after>
        </SingleTask>
      {{/each}}
    </ul>
  </div>
</template>
