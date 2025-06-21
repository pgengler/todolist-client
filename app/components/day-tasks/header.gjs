import Component from '@glimmer/component';
import moment from 'moment';
import Header from '../task-list/header';

export default class DayTasksHeader extends Component {
  get date() {
    return moment(this.args.list.name);
  }

  get dayOfWeek() {
    return this.date.format('dddd');
  }

  get formattedDate() {
    return this.date.format('MMM D, YYYY');
  }

  <template>
    <Header ...attributes>
      <h1>{{this.dayOfWeek}}</h1>
      <h2>{{this.formattedDate}}</h2>
    </Header>
  </template>
}
