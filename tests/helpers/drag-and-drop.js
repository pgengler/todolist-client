import Ember from 'ember';

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

export default Ember.Test.registerAsyncHelper('dragAndDrop', function(app, draggedElementSelector, targetElementSelector, eventOptions = { }) {
  let draggedElement = find(draggedElementSelector);
  let dropTargetElement = find(targetElementSelector);
  Ember.run(function() {
    let dragStartEvent = Ember.$.Event('dragstart', eventOptions);
    dragStartEvent.dataTransfer = new DataTransferMock();
    draggedElement.trigger(dragStartEvent);

    let dropEvent = Ember.$.Event('drop', eventOptions);
    dropEvent.dataTransfer = dragStartEvent.dataTransfer;
    dropTargetElement.trigger(dropEvent);

    draggedElement.trigger('dragend', eventOptions);
  });
});
