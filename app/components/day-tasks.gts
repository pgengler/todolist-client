import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { use } from 'ember-resources';
import { CurrentDay } from 'ember-todo/resources/current-day';
import TaskList from './task-list';
import DayTasksHeader from './day-tasks/header';
import { format, isAfter, isBefore, isSameDay, parse, startOfDay } from 'date-fns';
import type List from 'ember-todo/models/list';

interface DayTasksSignature {
  Args: {
    editingEnd?: () => void;
    editingStart?: () => void;
    list: List;
  };
}

export default class DayTasks extends Component<DayTasksSignature> {
  @use today = CurrentDay;

  get date(): Date {
    return parse(this.args.list.name, 'yyyy-MM-dd', new Date());
  }

  get formattedDate(): string {
    return format(this.date, 'yyyy-MM-dd');
  }

  get isPast(): boolean {
    const date = startOfDay(this.date);
    const today = startOfDay(this.today);
    return isBefore(date, today) && !isSameDay(date, today);
  }

  get isCurrent(): boolean {
    return isSameDay(this.date, this.today);
  }

  get isFuture(): boolean {
    const date = startOfDay(this.date);
    const today = startOfDay(this.today);
    return isAfter(date, today);
  }

  <template>
    <TaskList
      @list={{@list}}
      @editingEnd={{@editingEnd}}
      @editingStart={{@editingStart}}
      class="{{if this.isPast 'past'}} {{if this.isCurrent 'current'}} {{if this.isFuture 'future'}}"
      data-test-date={{this.formattedDate}}
    >
      <:header as |focusNewTaskField|>
        <DayTasksHeader @list={{@list}} {{on "click" focusNewTaskField}} />
      </:header>
    </TaskList>
  </template>
}
