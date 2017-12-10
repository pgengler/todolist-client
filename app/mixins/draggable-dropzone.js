import Mixin from '@ember/object/mixin';

export default Mixin.create({
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
    let data = event.dataTransfer.getData('text/data');
    this.send('dropped', data, event);
  }
});
