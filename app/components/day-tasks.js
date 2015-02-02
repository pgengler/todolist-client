import TaskList from './task-list';

export default TaskList.extend({
	classNameBindings: [ 'isPast:past', 'isCurrent:current', 'isFuture:future' ],
	layoutName: 'components/task-list',

	isPast: function() {
		var date = this.get('day.date');
		var now  = moment();
		now.subtract(now.zone(), 'minutes').utc();
		return (date.isBefore(now, 'day') && !date.isSame(now, 'day'));
	}.property('day.date'),

	isCurrent: function() {
		var now = moment();
		now.subtract(now.zone(), 'minutes').utc();
		return this.get('day.date').isSame(now, 'day');
	}.property('day.date'),

	isFuture: function() {
		var now = moment();
		now.subtract(now.zone(), 'minutes').utc();
		return this.get('day.date').isAfter(now, 'day');
	}.property('day.date')
});
