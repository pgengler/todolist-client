import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  newTaskDescription: '',
  newTaskDate: null,

  store: service(),

  onTaskCreated() { /* noop */ },

  actions: {
    changeDate(newDate) {
      this.set('newTaskDate', newDate.moment);
      this.$('input[type=submit]').focus();
    },

    createTask() {
      let description = this.newTaskDescription.trim();
      let date = this.newTaskDate;

      if (isEmpty(description) || isEmpty(date)) {
        return false;
      }

      this.store.query('list', {
        filter: {
          'list-type': 'day',
          date: date.format('YYYY-MM-DD')
        },
        page: {
          size: 1
        }
      }).then((lists) => {
        let task = this.store.createRecord('task', {
          description,
          list: lists.get('firstObject')
        });
        return task.save();
      }).then(() => {
        this.onTaskCreated();
      });

      return false;
    }
  }
});
