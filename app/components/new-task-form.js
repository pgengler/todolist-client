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
      this.set('newTaskDate', newDate.moment.format('YYYY-MM-DD'));
      this.$('input[type=submit]').focus();
    },

    createTask() {
      let description = this.get('newTaskDescription').trim();
      let date = this.get('newTaskDate');

      if (isEmpty(description) || isEmpty(date)) {
        return false;
      }

      this.get('store').query('list', {
        filter: {
          'list-type': 'day',
          date
        },
        page: {
          size: 1
        }
      }).then((lists) => {
        let task = this.get('store').createRecord('task', {
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
