import { filterBy, notEmpty, sort } from '@ember/object/computed';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default class TaskList extends Component {
  tagName = '';

  dragClass = '';
  headerComponent = 'task-list/header';
  newTaskDescription = '';
  taskSorting = [ 'plaintextDescription' ];

  @service flashMessages;
  @service store;

  @filterBy('list.tasks', 'done', true) finishedTasks;
  @filterBy('list.tasks', 'done', false) unfinishedTasks;
  @filterBy('list.tasks', 'isNew') pendingTasks;

  @sort('finishedTasks', 'taskSorting') sortedFinishedTasks;
  @sort('unfinishedTasks', 'taskSorting') sortedUnfinishedTasks;
  @sort('pendingTasks', 'taskSorting') sortedPendingTasks;

  @notEmpty('unfinishedTasks') hasUnfinishedTasks;

  initializeHeaderClickHandler(element) {
    let clickHandler = () => element.querySelector('.new-task').focus();
    element.querySelector('.task-list-header').addEventListener('click', clickHandler);
  }

  cloneTask(task) {
    let newTask = this.store.createRecord('task', {
      list: this.list,
      description: task.get('description')
    });
    newTask.save();
  }

  dragIn(event) {
    event.preventDefault();
    this.set('dragClass', 'active-drop-target');
  }

  dragOut(event) {
    event.preventDefault();
    this.set('dragClass', '');
  }

  dropped(event) {
    let id = event.dataTransfer.getData('text/data');
    let cloningTask = event.ctrlKey ? true : false;

    this.set('dragClass', '');

    this.store.findRecord('task', id).then((task) => cloningTask ? this.cloneTask(task) : this.moveTaskToList(task));
  }

  moveTaskToList(task) {
    task.set('list', this.list);
    task.save();
  }

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
  }

  clearTextarea() {
    this.set('newTaskDescription', '');
  }
}
