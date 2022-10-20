import { isEmpty } from '@ember/utils';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask, timeout } from 'ember-concurrency';

export default class SingleTask extends Component {
  @tracked editType = null;
  @tracked editDescription;

  get editable() {
    let task = this.args.task;
    return !task.isNew || task.isError;
  }

  get isFullEditing() {
    return this.editType === 'full';
  }

  get isQuickEditing() {
    return this.editType === 'quick';
  }

  quickEditTask = dropTask(async () => {
    if (!this.editable) {
      return;
    }
    await timeout(250);
    this.editDescription = this.args.task.description;
    this.editType = 'quick';
    this.args.editingStart?.();
  });

  @action
  editTask() {
    if (!this.editable) {
      return;
    }
    this.quickEditTask.cancelAll();
    this.editDescription = this.args.task.description;
    this.editType = 'full';
    this.args.editingStart?.();
  }

  @action
  simulateDoubleClicks(event) {
    let now = Date.now();
    let touch = event.changedTouches[0];

    let lastTouchEndEventInfo = this.lastTouchEndEventInfo;
    this.lastTouchEndEventInfo = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      when: now,
    };
    if (!lastTouchEndEventInfo) {
      return;
    }

    if (now - lastTouchEndEventInfo.when < 500) {
      let xDistance = Math.abs(lastTouchEndEventInfo.clientX - touch.clientX);
      let yDistance = Math.abs(lastTouchEndEventInfo.clientY - touch.clientY);

      if (xDistance < 40 && yDistance < 40) {
        let doubleClickEvent = document.createEvent('MouseEvents');
        doubleClickEvent.initMouseEvent(
          'dblclick',
          true, // click bubbles
          true, // click cancelable
          event.view, // copy view
          2, // click count
          // copy coordinates
          touch.screenX,
          touch.screenY,
          touch.clientX,
          touch.clientY,
          // copy key modifiers
          event.ctrlKey,
          event.altKey,
          event.shiftKey,
          event.metaKey,
          event.button, // copy button 0: left, 1: middle, 2: right
          event.relatedTarget // copy relatedTarget
        );

        event.target.dispatchEvent(doubleClickEvent);
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }

  @action
  onDragStart(event) {
    event.dataTransfer.setData('text/data', this.args.task.id);
  }

  @action
  cancelEdit() {
    this.editDescription = '';
    // wrapping this in a `next` to avoid double-updating `this.isEditing` twice
    // (e.g., when `updateTask` runs and sets `this.isEditing`, which then causes
    // the textarea to stop displaying and thus triggers the "focusout" event
    // that causes this method to run.)
    next(() => (this.editType = false));

    this.args.editingEnd?.();
  }

  @action
  toggleTaskDone() {
    let task = this.args.task;
    task.done = !task.done;
    task.save();
  }

  @action
  async updateTask(description) {
    if (!this.editable) {
      return;
    }
    let task = this.args.task;
    description = description.trim();
    if (isEmpty(description)) {
      await task.destroyRecord();
    } else {
      task.description = description;
      await task.save();
      this.editType = null;
    }
    this.args.editingEnd?.();
  }
}
