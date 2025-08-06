import Component from '@glimmer/component';
import Header from '../task-list/header';
import { format, parse } from 'date-fns';
import type List from 'ember-todo/models/list';

interface DayTasksHeaderSignature {
  Args: {
    list: List;
  };
  Element: HTMLDivElement;
}

export default class DayTasksHeader extends Component<DayTasksHeaderSignature> {
  get date() {
    return parse(this.args.list.name, 'yyyy-MM-dd', new Date());
  }

  get dayOfWeek() {
    return format(this.date, 'EEEE');
  }

  get formattedDate() {
    return format(this.date, 'MMM d, yyyy');
  }

  <template>
    <Header @list={{@list}} ...attributes>
      <h1>{{this.dayOfWeek}}</h1>
      <h2>{{this.formattedDate}}</h2>
    </Header>
  </template>
}
