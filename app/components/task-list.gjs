import { action } from '@ember/object';
import { service } from '@ember/service';
import { compare } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { runTask } from 'ember-lifeline';
import TaskListHeaderComponent from 'ember-todo/components/task-list/header';

function taskSort(a, b) {
  // unfinished tasks display above finished or pending
  if (a.done === true && b.done === false) return 1;
  if (a.done === false && b.done === true) return -1;

  // unfinished & finished tasks display above pending
  if (a.isNew === false && b.isNew === true) return -1;
  if (a.isNew === true && b.isNew === false) return 1;

  // finally, sort alphabetically
  return compare(a.plaintextDescription, b.plaintextDescription);
}

export default class TaskList extends Component {
  @tracked dragClass = '';
  taskSorting = ['plaintextDescription'];

  @service flashMessages;
  @service store;

  get headerComponent() {
    return this.args.headerComponent || TaskListHeaderComponent;
  }

  get newTaskFieldId() {
    return `list-${this.args.list.id}-new-task`;
  }

  get sortedTasks() {
    return Array.from(this.args.list.tasks).toSorted((a, b) => taskSort(a, b));
  }

  get unfinishedTasks() {
    return this.args.list.tasks.filter((task) => task.done === false);
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

  async moveTaskToList(task) {
    task.list = this.args.list;
    await task.save();
    this.args.editingEnd?.();
  }

  @action
  addTask(description) {
    description = description.trim();
    if (!description) {
      return;
    }
    let task = this.store.createRecord('task', {
      description,
      list: this.args.list,
    });

    this.clearTextarea();

    // The "next()" call is necessary to be able to test the 'pending' state
    // for adding a task; without it, the test never gets into the pending state.'
    // The actual application works with or without the "next()" call.
    runTask(this, async () => {
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
    document.getElementById(this.newTaskFieldId).value = '';
  }

  @action
  focusNewTaskField() {
    document.getElementById(this.newTaskFieldId).focus();
  }
}

<div
  class="task-list
    {{if this.hasUnfinishedTasks 'has-unfinished-tasks'}}
    {{this.dragClass}}"
  data-test-list-name={{@list.name}}
  {{on "dragleave" (prevent-default this.dragOut)}}
  {{on "dragover" (prevent-default this.dragIn)}}
  {{on "drop" this.dropped}}
  ...attributes
>
  <this.headerComponent @list={{@list}} {{on "click" this.focusNewTaskField}} />
  <ul>
    {{#each this.sortedTasks as |task|}}
      <SingleTask
        @task={{task}}
        @editingStart={{@editingStart}}
        @editingEnd={{@editingEnd}}
        {{draggable-task task onDragStart=@editingStart onDragEnd=@editingEnd}}
        data-test-task
      />
    {{/each}}

    <li class="task">
      <ElasticTextarea
        @onEscapePressed={{this.clearTextarea}}
        @onEnterPressed={{this.addTask}}
        class="new-task"
        id={{this.newTaskFieldId}}
        placeholder="Add new task"
        data-test-new-task
      />
    </li>
  </ul>
</div>