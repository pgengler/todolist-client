import Component from '@glimmer/component';
import Header from '../task-list/header';
import { format, parse } from 'date-fns';

export default class DayTasksHeader extends Component {
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
    <Header ...attributes>
      <h1>{{this.dayOfWeek}}</h1>
      <h2>{{this.formattedDate}}</h2>
    </Header>
  </template>
}
