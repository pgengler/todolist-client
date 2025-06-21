import Component from '@glimmer/component';
import moment from 'moment';
import { use } from 'ember-resources';
import { CurrentDay } from 'ember-todo/resources/current-day';

export default class DayTasks extends Component {
  @use today = CurrentDay;

  get date() {
    return moment(this.args.list.name);
  }

  get formattedDate() {
    return this.date.format('YYYY-MM-DD');
  }

  get isPast() {
    let date = this.date;
    return date.isBefore(this.today, 'day') && !date.isSame(this.today, 'day');
  }

  get isCurrent() {
    return this.date.isSame(this.today, 'day');
  }

  get isFuture() {
    return this.date.isAfter(this.today, 'day');
  }
}

<TaskList
  @headerComponent={{component "day-tasks/header"}}
  @list={{@list}}
  @editingEnd={{@editingEnd}}
  @editingStart={{@editingStart}}
  class="{{if this.isPast 'past'}}
    {{if this.isCurrent 'current'}}
    {{if this.isFuture 'future'}}"
  data-test-date={{this.formattedDate}}
/>