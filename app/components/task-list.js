import { filterBy, notEmpty, sort } from '@ember/object/computed';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

const taskSorting = [ 'plaintextDescription' ];

export default Component.extend({
  tagName: '',

  dragClass: '',
  headerComponent: 'task-list/header',
  newTaskDescription: '',
  taskSorting,

  editingStart() { /* noop */ },
  editingEnd() { /* noop */ },

  flashMessages: service(),
  store: service(),

  finishedTasks: filterBy('list.tasks', 'done', true),
  unfinishedTasks: filterBy('list.tasks', 'done', false),
  pendingTasks: filterBy('list.tasks', 'isNew'),

  sortedFinishedTasks: sort('finishedTasks', 'taskSorting'),
  sortedUnfinishedTasks: sort('unfinishedTasks', 'taskSorting'),
  sortedPendingTasks: sort('pendingTasks', 'taskSorting'),

  hasUnfinishedTasks: notEmpty('unfinishedTasks'),

  initializeHeaderClickHandler(element) {
    let clickHandler = () => element.querySelector('.new-task').focus();
    element.querySelector('.task-list-header').addEventListener('click', clickHandler);
  },

  cloneTask(task) {
    let newTask = this.store.createRecord('task', {
      list: this.list,
      description: task.get('description')
    });
    newTask.save();
  },

  dragIn(event) {
    event.preventDefault();
    this.set('dragClass', 'active-drop-target');
  },

  dragOut(event) {
    event.preventDefault();
    this.set('dragClass', '');
  },

  dropped(event) {
    let id = event.dataTransfer.getData('text/data');
    let cloningTask = event.ctrlKey ? true : false;

    this.set('dragClass', '');

    this.store.findRecord('task', id).then((task) => cloningTask ? this.cloneTask(task) : this.moveTaskToList(task));
  },

  moveTaskToList(task) {
    task.set('list', this.list);
    task.save();
  },

  actions: {
    addTask() {
      let description = this.newTaskDescription.trim();
      if (!description) {
        return;
      }
      let list = this.list;
      let task = this.store.createRecord('task', {
        description,
        list
      });

      this.set('newTaskDescription', '');

      next(() => {
        task.save()
          .catch((err) => this.flashMessages.error(err));
      });
    },

    clearTextarea() {
      this.set('newTaskDescription', '');
    },
  }
});
