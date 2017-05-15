import Ember from 'ember';

export default Ember.Component.extend({
  newTaskDescription: '',
  newTaskDate: null,

  store: Ember.inject.service(),

  actions: {
    cancel() {
      this.sendAction('formCancelled');
    },

    changeDate(newDate) {
      this.set('newTaskDate', newDate.moment.format('YYYY-MM-DD'));
      this.$('input[type=submit]').focus();
    },

    createTask() {
      let description = this.get('newTaskDescription').trim();
      let date = this.get('newTaskDate');

      if (Ember.isEmpty(description) || Ember.isEmpty(date)) {
        return false;
      }

      this.get('store').queryRecord('day', { date }).then((day) => {
        let task = this.get('store').createRecord('task', {
          description,
          day
        });
        return task.save();
      }).then(() => {
        this.sendAction('taskCreated');
      });

      return false;
    }
  }
});
