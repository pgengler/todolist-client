import { isEmpty } from '@ember/utils';
import { alias, sort } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'task-list' ],
  tasks: alias('list.tasks'),
  taskSortProperties: [ 'description' ],
  sortedTasks: sort('tasks', 'taskSortProperties'),

  newTaskDescription: '',

  actions: {
    addTask() {
      let description = this.get('newTaskDescription').trim();
      if (!isEmpty(description)) {
        let list = this.get('list');
        this.get('store')
          .createRecord('task', { description, list })
          .save()
          .then((task) => {
            this.get('tasks').addObject(task);
            this.set('newTaskDescription', '');
          });
      }
    }
  }
});
