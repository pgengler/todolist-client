import { action } from '@ember/object';
import { service } from '@ember/service';
import { compare } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { runTask } from 'ember-lifeline';
import TaskListHeader from 'ember-todo/components/task-list/header';
import { on } from '@ember/modifier';
import preventDefault from '../helpers/prevent-default';
import SingleTask from './single-task';
import draggableTask from '../modifiers/draggable-task';
import ElasticTextarea from './elastic-textarea';
import type Task from 'ember-todo/models/task';
import type List from 'ember-todo/models/list';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';
import type Store from '@ember-data/store';

function taskSort(a: Task, b: Task): number {
  // unfinished tasks display above finished or pending
  if (a.done === true && b.done === false) return 1;
  if (a.done === false && b.done === true) return -1;

  // unfinished & finished tasks display above pending
  if (a.isNew === false && b.isNew === true) return -1;
  if (a.isNew === true && b.isNew === false) return 1;

  // finally, sort alphabetically
  return compare(a.plaintextDescription, b.plaintextDescription);
}

interface TaskListSignature {
  Args: {
    editingStart?: () => void;
    editingEnd?: () => void;
    hideDoneToggles?: boolean;
    list: List;
  };
  Blocks: {
    header?: [() => void];
  };
  Element: HTMLDivElement;
}

export default class TaskList extends Component<TaskListSignature> {
  @service declare flashMessages: FlashMessagesService;
  @service declare store: Store;

  @tracked declare dragClass: string;

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

  async cloneTask(task: Task): Promise<void> {
    const newTask = this.store.createRecord<Task>('task', {
      list: this.args.list,
      description: task.description,
    });
    await newTask.save();
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
  async dropped(event: DragEvent): Promise<void> {
    const id = event.dataTransfer!.getData('text/data');
    const cloningTask = event.ctrlKey ? true : false;

    this.dragClass = '';

    const task = await this.store.findRecord<Task>('task', id);
    if (cloningTask) {
      await this.cloneTask(task);
    } else {
      await this.moveTaskToList(task);
    }
  }

  async moveTaskToList(task: Task): Promise<void> {
    task.list = this.args.list;
    await task.save();
    this.args.editingEnd?.();
  }

  @action
  addTask(description: string): void {
    description = description.trim();
    if (!description) {
      return;
    }
    const task = this.store.createRecord<Task>('task', {
      description,
      list: this.args.list,
    });

    this.clearTextarea();

    // The "runTask()" call is necessary to be able to test the 'pending' state
    // for adding a task; without it, the test never gets into the pending state.
    // The actual application works with or without the "runTask()" call.
    runTask(this, async () => {
      try {
        await task.save();
        document.getElementById(this.newTaskFieldId)?.scrollIntoView();
      } catch (err) {
        this.flashMessages.alert(<string>err);
      }
    });
  }

  @action
  clearTextarea(): void {
    (document.getElementById(this.newTaskFieldId) as HTMLTextAreaElement).value = '';
  }

  @action
  focusNewTaskField(): void {
    const field = document.getElementById(this.newTaskFieldId)!;
    field.scrollIntoView();
    field.focus();
  }

  <template>
    <div
      class="task-list {{if this.hasUnfinishedTasks 'has-unfinished-tasks'}} {{this.dragClass}}"
      data-test-list-name={{@list.name}}
      {{on "dragleave" (preventDefault this.dragOut)}}
      {{on "dragover" (preventDefault this.dragIn)}}
      {{on "drop" this.dropped}}
      ...attributes
    >
      {{#if (has-block "header")}}
        {{yield this.focusNewTaskField to="header"}}
      {{else}}
        <TaskListHeader @list={{@list}} {{on "click" this.focusNewTaskField}} />
      {{/if}}
      <ul>
        {{#each this.sortedTasks as |task|}}
          <SingleTask
            @task={{task}}
            @editingStart={{@editingStart}}
            @editingEnd={{@editingEnd}}
            @hideDoneToggle={{@hideDoneToggles}}
            {{draggableTask task onDragStart=@editingStart onDragEnd=@editingEnd}}
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
  </template>
}
