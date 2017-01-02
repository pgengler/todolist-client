import Ember from 'ember';

export default Ember.Controller.extend({
  newTaskDescription: '',
  newTaskDate: '',

  actions: {
    createTask() {
      let description = this.get('newTaskDescription').trim();
      let date = this.get('newTaskDate').trim();

      if (Ember.isEmpty(description) || Ember.isEmpty(date)) {
        return false;
      }

      this.send('doCreateTask', this.get('model'), date, description);
    }
  }
});
