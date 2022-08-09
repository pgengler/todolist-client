import { triggerEvent } from '@ember/test-helpers';

export class DataTransferMock {
  constructor() {
    this.savedData = {};
  }

  setData(format, data) {
    this.savedData[format] = data;
  }

  getData(format) {
    if (Object.prototype.hasOwnProperty.call(this.savedData, format)) {
      return this.savedData[format];
    }
    return null;
  }
}

export default async function dragAndDrop(draggedElementSelector, targetElementSelector, eventOptions = {}) {
  let dataTransfer = new DataTransferMock();
  await triggerEvent(draggedElementSelector, 'dragstart', Object.assign(eventOptions, { dataTransfer }));
  await triggerEvent(targetElementSelector, 'drop', Object.assign(eventOptions, { dataTransfer }));
  return await triggerEvent(draggedElementSelector, 'dragend', {
    dataTransfer,
  });
}
