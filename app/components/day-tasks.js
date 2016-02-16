import Ember from 'ember';
import TaskList from './task-list';

export default TaskList.extend({
	classNameBindings: [ 'isPast:past', 'isCurrent:current', 'isFuture:future' ],
	layoutName: 'components/task-list',

	isPast: Ember.computed('day.date', {
		get() {
			let date = this.get('day.date');
			let now  = moment();
			now.subtract(now.zone(), 'minutes').utc();
			return (date.isBefore(now, 'day') && !date.isSame(now, 'day'));
		}
	}).readOnly(),

	isCurrent: Ember.computed('day.date', {
		get() {
			let now = moment();
			now.subtract(now.zone(), 'minutes').utc();
			return this.get('day.date').isSame(now, 'day');
		}
	}).readOnly(),

	isFuture: Ember.computed('day.date', {
		get() {
			let now = moment();
			now.subtract(now.zone(), 'minutes').utc();
			return this.get('day.date').isAfter(now, 'day');
		}
	}).readOnly()
});
