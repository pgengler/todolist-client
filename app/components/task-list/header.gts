import Component from '@glimmer/component';
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

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class TaskListHeader extends Component<TaskListHeaderSignature> {
  <template>
    <div class="task-list-header" ...attributes>
      {{#if (has-block)}}
        {{yield @list}}
      {{else}}
        <h1>{{@list.name}}</h1>
      {{/if}}
    </div>
  </template>
}
