import { next } from '@ember/runloop';
import { computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import DraggableDropzone from '../mixins/draggable-dropzone';
import { filterBy, sortBy } from '../utils/computed';

function plaintext(str) {
  return str.replace(/[^A-Za-z0-9]/g, '');
}

export default Component.extend(DraggableDropzone, {
  classNames: [ 'task-list', 'spec-day' ],
  classNameBindings: [ 'hasUnfinishedTasks', 'dragClass' ],
  attributeBindings: [ 'formattedDate:spec-date' ],
  day: null,
  newTaskDescription: '',
  dragClass: '',

  formattedDate: computed('day.date', function() {
    let date = this.get('day.date');
    return date ? date.format('YYYY-MM-DD') : '';
  }),

  store: service(),

  sortedTasks: sortBy('day.tasks', 'description', plaintext),
  sortedFinishedTasks: filterBy('sortedTasks', 'done', true),
  sortedUnfinishedTasks: filterBy('sortedTasks', 'done', false),
  sortedPendingTasks: filterBy('sortedTasks', 'isNew', true),

  hasUnfinishedTasks: notEmpty('sortedUnfinishedTasks'),

  didInsertElement() {
    this.$('.task-list-header').on('click', () => this.$('.new-task').focus());
  },

  willDestroyElement() {
    this.$('.task-list-header').off('click');
  },

  cloneTask(task) {
    let newTask = this.store.createRecord('task', {
      day: this.get('day'),
      description: task.get('description')
    });
    newTask.save();
  },
  moveTaskToDay(task) {
    task.set('day', this.get('day'));
    task.save();
  },

  actions: {
    addTask() {
      let description = this.get('newTaskDescription').trim();
      if (!description) {
        return;
      }
      let day = this.get('day');
      let task = this.get('store').createRecord('task', { description, day });
      day.get('tasks').addObject(task);
      this.set('newTaskDescription', '');
      next(() => task.save());
    },

    clearTextarea() {
      this.set('newTaskDescription', '');
    },

    dropped(id, event) {
      let cloningTask = event.ctrlKey ? true : false;

      this.set('dragClass', '');

      this.store.findRecord('task', id).then((task) => cloningTask ? this.cloneTask(task) : this.moveTaskToDay(task));
    },

    editingStart() {
      this.sendAction('editingStart');
    },
    editingEnd() {
      this.sendAction('editingEnd');
    },

    dragIn() {
      this.set('dragClass', 'active-drop-target');
    },
    dragOut() {
      this.set('dragClass', '');
    }
  }
});
