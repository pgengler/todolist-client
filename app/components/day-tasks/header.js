import TaskListHeader from 'ember-todo/components/task-list/header';
import { computed } from '@ember/object';
import moment from 'moment';

export default TaskListHeader.extend({
  date: computed('list.name', function() {
    return moment(this.get('list.name'));
  }),

  dayOfWeek: computed('date', function() {
    return this.get('date').format('dddd');
  }),

  formattedDate: computed('date', function() {
    return this.get('date').format('MMM D, YYYY');
  })
});
