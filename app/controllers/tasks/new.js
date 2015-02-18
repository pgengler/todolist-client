import Ember from 'ember';

export default Ember.Controller.extend({
	newTaskDescription: '',
	newTaskDate: '',

	actions: {
		createTask: function() {
			var description = this.get('newTaskDescription').trim();
			var date = this.get('newTaskDate').trim();

			if (Ember.isEmpty(description) || Ember.isEmpty(date)) {
				return false;
			}

			var controller = this;
			controller.store.find('day', date).then(function(day) {
				var task = controller.store.createRecord('task', {
					description: description,
					day: day
				});
				task.save().then(function() {
					controller.set('newTaskDescription', '');
					controller.set('newTaskDate', '');

					controller.send('closeModal');
				});
			});
		},

		cancel: function() {
			this.set('newTaskDescription', '');
			this.set('newTaskDate', null);
			this.send('closeModal');
		}
	}
});
