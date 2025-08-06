import Header from './task-list/header';
import SingleTask from './single-task';
import draggableTask from '../modifiers/draggable-task';
import type Task from 'ember-todo/models/task';
import type { TOC } from '@ember/component/template-only';

interface OverdueTaskListSignature {
  Args: {
    editingStart?: () => void;
    editingEnd?: () => void;
    tasks: Task[];
  };
  Element: HTMLDivElement;
}

export default <template>
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
</template> satisfies TOC<OverdueTaskListSignature>;
