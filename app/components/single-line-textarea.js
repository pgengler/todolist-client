import TextArea from '@ember/component/text-area';

export default TextArea.extend({
  keyDown(event) {
    // Prevent newlines when using bare Enter key
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault();
    }
  },

  insertNewline(event) {
    if (!event.shiftKey) {
      this._super(event);
    }
  }
});
