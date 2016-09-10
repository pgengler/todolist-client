import Ember from 'ember';

export default Ember.Mixin.create({
  classNames: [ 'draggable-dropzone' ],

  dragLeave(event) {
    event.preventDefault();
    this.send('dragOut');
  },

  dragOver(event) {
    event.preventDefault();
    this.send('dragIn');
  },

  drop(event) {
    const data = event.dataTransfer.getData('text/data');
    this.send('dropped', data, event);
  }
});
