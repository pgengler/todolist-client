import { isEmpty } from '@ember/utils';
import { action, computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default class SingleTask extends Component {
  tagName = '';

  @oneWay('task.description') editDesciption;

  @computed('task.{isError,isNew}')
  get editable() {
    return !this.get('task.isNew') || this.get('task.isError');
  }

  isEditing = false;

  draggable = 'true';

  @action
  editTask() {
    if (!this.editable) {
      return;
    }
    this.set('editDescription', this.get('task.description'));
    this.set('isEditing', true);
    if (this.editingStart) this.editingStart();
  }

  @action
  simulateDoubleClicks(event) {
    let now = Date.now();
    let touch = event.changedTouches[0];

    let lastTouchEndEventInfo = this.lastTouchEndEventInfo;
    this.set('lastTouchEndEventInfo', {
      clientX: touch.clientX,
      clientY: touch.clientY,
      when: now
    });
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
          2,  // click count
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
    event.dataTransfer.setData('text/data', this.get('task.id'));
  }

  @action
  cancelEdit() {
    this.set('editDescription', '');
    this.set('isEditing', false);
    if (this.editingEnd) this.editingEnd();
  }

  @action
  toggleTaskDone(event) {
    this.task.toggleProperty('done');
    this.task.save();
    event.preventDefault();
  }

  @action
  updateTask() {
    if (!this.editable) {
      return;
    }
    let task = this.task;
    let description = this.editDescription;
    if (!isEmpty(description)) {
      task.set('description', description);
      task.save();
      this.set('isEditing', false);
    } else {
      task.deleteRecord();
      task.save();
    }
    if (this.editingEnd) this.editingEnd();
  }
}
