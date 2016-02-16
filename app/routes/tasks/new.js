import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.createRecord('task');
	},
	actions: {
		doCreateTask(task, date, description) {
			task.set('description', description);
			this.store.findRecord('day', date)
			.then(day => {
				task.set('day', day);
				return task.save();
			})
			.then(() => this.transitionTo('days'));
		}
	}
});
