import { isEmpty } from '@ember/utils';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class SingleTask extends Component {
  @tracked isEditing = false;
  @tracked editDescription;

  get editable() {
    let task = this.args.task;
    return !task.isNew || task.isError;
  }

  @action
  editTask() {
    if (!this.editable) {
      return;
    }
    this.editDescription = this.args.task.description;
    this.isEditing = true;
    if (this.args.editingStart) this.args.editingStart();
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
    next(() => (this.isEditing = false));

    if (this.args.editingEnd) this.args.editingEnd();
  }

  @action
  toggleTaskDone() {
    let task = this.args.task;
    task.done = !task.done;
    task.save();
  }

  @action
  async updateTask() {
    if (!this.editable) {
      return;
    }
    let task = this.args.task;
    let description = this.editDescription.trim();
    if (isEmpty(description)) {
      await task.destroyRecord();
    } else {
      task.description = description;
      await task.save();
      this.isEditing = false;
    }
    if (this.args.editingEnd) this.args.editingEnd();
  }
}
