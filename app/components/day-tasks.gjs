import Component from '@glimmer/component';
import { use } from 'ember-resources';
import { CurrentDay } from 'ember-todo/resources/current-day';
import TaskList from './task-list';
import DayTasksHeader from './day-tasks/header';
import { format, isAfter, isBefore, isSameDay, parse, startOfDay } from 'date-fns';

export default class DayTasks extends Component {
  @use today = CurrentDay;

  get date() {
    return parse(this.args.list.name, 'yyyy-MM-dd', new Date());
  }

  get formattedDate() {
    return format(this.date, 'yyyy-MM-dd');
  }

  get isPast() {
    let date = startOfDay(this.date);
    let today = startOfDay(this.today);
    return isBefore(date, today) && !isSameDay(date, today);
  }

  get isCurrent() {
    return isSameDay(this.date, this.today);
  }

  get isFuture() {
    let date = startOfDay(this.date);
    let today = startOfDay(this.today);
    return isAfter(date, today);
  }

  <template>
    <TaskList
      @headerComponent={{component DayTasksHeader}}
      @list={{@list}}
      @editingEnd={{@editingEnd}}
      @editingStart={{@editingStart}}
      class="{{if this.isPast 'past'}} {{if this.isCurrent 'current'}} {{if this.isFuture 'future'}}"
      data-test-date={{this.formattedDate}}
    />
  </template>
}
