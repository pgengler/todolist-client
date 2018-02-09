import { computed } from '@ember/object';
import TaskList from './task-list';
import moment from 'moment';

export default TaskList.extend({
  attributeBindings: [ 'formattedDate:spec-date' ],
  classNameBindings: [ ':spec-day', 'isPast:past', 'isCurrent:current', 'isFuture:future' ],
  headerComponent: 'day-tasks/header',
  layoutName: 'components/task-list',

  date: computed('list.name', function() {
    return moment(this.get('list.name')).utc();
  }),

  formattedDate: computed('date', function() {
    let date = this.get('date');
    return date ? date.format('YYYY-MM-DD') : '';
  }),

  isPast: computed('date', function() {
    let date = this.get('date');
    let now = moment().utc();
    return (date.isBefore(now, 'day') && !date.isSame(now, 'day'));
  }).readOnly(),

  isCurrent: computed('date', function() {
    let now = moment().utc();
    return this.get('date').isSame(now, 'day');
  }).readOnly(),

  isFuture: computed('date', function() {
    let now = moment().utc();
    return this.get('date').isAfter(now, 'day');
  }).readOnly()
});
