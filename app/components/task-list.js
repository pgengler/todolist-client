import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import TaskListHeaderComponent from 'ember-todo/components/task-list/header';

export default class TaskList extends Component {
  @tracked dragClass = '';
  @tracked newTaskDescription = '';
  taskSorting = ['plaintextDescription'];

  @service flashMessages;
  @service store;

  get headerComponent() {
    return this.args.headerComponent || TaskListHeaderComponent;
  }

  get newTaskFieldId() {
    return `list-${this.args.list.id}-new-task`;
  }

  get finishedTasks() {
    return this.args.list.tasks
      .filterBy('done', true)
      .sortBy('plaintextDescription');
  }
  get unfinishedTasks() {
    return this.args.list.tasks
      .filterBy('done', false)
      .sortBy('plaintextDescription');
  }
  get pendingTasks() {
    return this.args.list.tasks
      .filterBy('isNew')
      .sortBy('plaintextDescription');
  }

  get hasUnfinishedTasks() {
    return this.unfinishedTasks.length > 0;
  }

  cloneTask(task) {
    let newTask = this.store.createRecord('task', {
      list: this.args.list,
      description: task.description,
    });
    newTask.save();
  }

  @action
  dragIn() {
    this.dragClass = 'active-drop-target';
  }

  @action
  dragOut() {
    this.dragClass = '';
  }

  @action
  async dropped(event) {
    let id = event.dataTransfer.getData('text/data');
    let cloningTask = event.ctrlKey ? true : false;

    this.dragClass = '';

    let task = await this.store.findRecord('task', id);
    if (cloningTask) {
      this.cloneTask(task);
    } else {
      this.moveTaskToList(task);
    }
  }

  moveTaskToList(task) {
    task.list = this.args.list;
    task.save();
  }

  @action
  addTask() {
    let description = this.newTaskDescription.trim();
    if (!description) {
      return;
    }
    let task = this.store.createRecord('task', {
      description,
      list: this.args.list,
    });

    this.newTaskDescription = '';

    // The "next()" call is necessary to be able to test the 'pending' state
    // for adding a task; without it, the test never gets into the pending state.'
    // The actual application works with or without the "next()" call.
    next(async () => {
      try {
        await task.save();
        document.getElementById(this.newTaskFieldId).scrollIntoView();
      } catch (err) {
        this.flashMessages.error(err);
      }
    });
  }

  @action
  clearTextarea() {
    this.newTaskDescription = '';
  }

  @action
  focusNewTaskField() {
    document.getElementById(this.newTaskFieldId).focus();
  }
}
