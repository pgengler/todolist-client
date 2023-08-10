import { find, triggerEvent } from '@ember/test-helpers';

export class DataTransferMock {
  constructor() {
    this.savedData = new Map();
  }

  setData(format, data) {
    this.savedData.set(format, data);
  }

  getData(format) {
    if (this.savedData.has(format)) {
      return this.savedData.get(format);
    }
    return null;
  }
}

export default async function dragAndDrop(draggedElementSelector, targetElementSelector, eventOptions = {}) {
  let dataTransfer = new DataTransferMock();
  let draggedElement = find(draggedElementSelector);
  await triggerEvent(draggedElement, 'dragstart', Object.assign(eventOptions, { dataTransfer }));
  await triggerEvent(targetElementSelector, 'drop', Object.assign(eventOptions, { dataTransfer }));
  return await triggerEvent(draggedElement, 'dragend', {
    dataTransfer,
  });
}
