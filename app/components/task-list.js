import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class TaskList extends Component {
  @tracked dragClass = '';
  @tracked newTaskDescription = '';
  taskSorting = [ 'plaintextDescription' ];

  @service flashMessages;
  @service store;

  get headerComponent() {
    return this.args.headerComponent || 'task-list/header';
  }

  get newTaskFieldId() {
    return `list-${this.args.list.id}-new-task`;
  }

  get finishedTasks() {
    return this.args.list.tasks.filterBy('done', true).sortBy('plaintextDescription');
  }
  get unfinishedTasks() {
    return this.args.list.tasks.filterBy('done', false).sortBy('plaintextDescription');
  }
  get pendingTasks() {
    return this.args.list.tasks.filterBy('isNew').sortBy('plaintextDescription');
  }

  get hasUnfinishedTasks() {
    return this.unfinishedTasks.length > 0;
  }

  initializeHeaderClickHandler(element) {
    let clickHandler = () => element.querySelector('.new-task').focus();
    element.querySelector('.task-list-header').addEventListener('click', clickHandler);
  }

  cloneTask(task) {
    let newTask = this.store.createRecord('task', {
      list: this.args.list,
      description: task.description
    });
    newTask.save();
  }

  dragIn(event) {
    event.preventDefault();
    this.dragClass = 'active-drop-target';
  }

  dragOut(event) {
    event.preventDefault();
    this.dragClass = '';
  }

  dropped(event) {
    let id = event.dataTransfer.getData('text/data');
    let cloningTask = event.ctrlKey ? true : false;

    this.dragClass = '';

    this.store.findRecord('task', id).then((task) => cloningTask ? this.cloneTask(task) : this.moveTaskToList(task));
  }

  moveTaskToList(task) {
    task.list = this.args.list;
    task.save();
  }

  addTask() {
    let description = this.newTaskDescription.trim();
    if (!description) {
      return;
    }
    let list = this.args.list;
    let task = this.store.createRecord('task', {
      description,
      list
    });

    this.newTaskDescription = '';

    next(() => {
      task.save()
        .then(() => document.getElementById(this.newTaskFieldId).scrollIntoView())
        .catch((err) => this.flashMessages.error(err));
    });
  }

  clearTextarea() {
    this.newTaskDescription =  '';
  }
}
