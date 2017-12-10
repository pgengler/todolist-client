import $ from 'jquery';
import { run } from '@ember/runloop';
import { registerAsyncHelper } from '@ember/test';

export class DataTransferMock {
  constructor() {
    this.savedData = { };
  }

  setData(format, data) {
    this.savedData[ format ] = data;
  }

  getData(format) {
    if (this.savedData.hasOwnProperty(format)) {
      return this.savedData[ format ];
    }
    return null;
  }
}

export default registerAsyncHelper('dragAndDrop', function(app, draggedElementSelector, targetElementSelector, eventOptions = { }) {
  let draggedElement = find(draggedElementSelector);
  let dropTargetElement = find(targetElementSelector);
  run(function() {
    let dragStartEvent = $.Event('dragstart', eventOptions);
    dragStartEvent.dataTransfer = new DataTransferMock();
    draggedElement.trigger(dragStartEvent);

    let dropEvent = $.Event('drop', eventOptions);
    dropEvent.dataTransfer = dragStartEvent.dataTransfer;
    dropTargetElement.trigger(dropEvent);

    draggedElement.trigger('dragend', eventOptions);
  });
});
