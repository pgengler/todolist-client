import { isEmpty } from '@ember/utils';
import { alias, sort } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'task-list' ],
  day: null,
  tasks: alias('day.tasks'),
  taskSortProperties: [ 'description' ],
  sortedTasks: sort('tasks', 'taskSortProperties'),

  newTaskDescription: '',

  actions: {
    addTask() {
      let description = this.get('newTaskDescription').trim();
      if (!isEmpty(description)) {
        let day = this.get('day');
        this.get('store')
          .createRecord('recurringTask', { description, day })
          .save()
          .then((task) => {
            day.get('tasks').addObject(task);
            this.set('newTaskDescription', '');
          });
      }
    }
  }
});
