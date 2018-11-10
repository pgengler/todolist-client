import { computed } from '@ember/object';
import TaskList from './task-list';
import moment from 'moment';

export default TaskList.extend({
  attributeBindings: [ 'formattedDate:spec-date' ],
  classNameBindings: [ 'isPast:past', 'isCurrent:current', 'isFuture:future' ],
  headerComponent: 'day-tasks/header',
  layoutName: 'components/task-list',

  date: computed('list.name', function() {
    return moment(this.get('list.name'));
  }),

  formattedDate: computed('date', function() {
    let date = this.date;
    return date ? date.format('YYYY-MM-DD') : '';
  }),

  isPast: computed('date', function() {
    let date = this.date;
    let now = moment();
    return (date.isBefore(now, 'day') && !date.isSame(now, 'day'));
  }).readOnly(),

  isCurrent: computed('date', function() {
    let now = moment();
    return this.date.isSame(now, 'day');
  }).readOnly(),

  isFuture: computed('date', function() {
    let now = moment();
    return this.date.isAfter(now, 'day');
  }).readOnly()
});
