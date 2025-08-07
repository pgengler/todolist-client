import type { TOC } from '@ember/component/template-only';
import type List from 'ember-todo/models/list';

interface TaskListHeaderSignature {
  Args: {
    list?: List;
  };
  Blocks: {
    default?: [List?];
  };
  Element: HTMLDivElement;
}

export default <template>
  <div class="task-list-header" ...attributes>
    {{#if (has-block)}}
      {{yield @list}}
    {{else}}
      <h1>{{@list.name}}</h1>
    {{/if}}
  </div>
</template> satisfies TOC<TaskListHeaderSignature>;
