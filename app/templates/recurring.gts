import TaskList from 'ember-todo/components/task-list';
import type List from 'ember-todo/models/list';
import type { TOC } from '@ember/component/template-only';

interface RecurringSignature {
  Args: {
    model: List[];
  };
}

export default <template>
  <div class="recurring-task-days">
    {{#each @model as |list|}}
      <TaskList @list={{list}} @hideDoneToggles={{true}} />
    {{/each}}
  </div>
</template> satisfies TOC<RecurringSignature>;
