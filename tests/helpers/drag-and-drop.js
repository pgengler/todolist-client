import { triggerEvent } from '@ember/test-helpers';
import { run } from '@ember/runloop';

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

export default function dragAndDrop(draggedElementSelector, targetElementSelector, eventOptions = { }) {
  return run(async function() {
    let dataTransfer = new DataTransferMock();
    await triggerEvent(draggedElementSelector, 'dragstart', Object.assign(eventOptions, { dataTransfer }));
    await triggerEvent(targetElementSelector, 'drop', Object.assign(eventOptions, { dataTransfer }));
    return await triggerEvent(draggedElementSelector, 'dragend', { dataTransfer });
  });
}
