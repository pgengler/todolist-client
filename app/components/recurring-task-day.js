import { isEmpty } from '@ember/utils';
import { alias, sort } from '@ember/object/computed';
import Component from '@ember/component';

const TASK_SORT_PROPERTIES = [ 'description' ];

export default Component.extend({
  classNames: [ 'task-list' ],
  tasks: alias('list.tasks'),
  taskSortProperties: TASK_SORT_PROPERTIES,
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
