import SingleLineTextarea from './single-line-textarea';

export default SingleLineTextarea.extend({
  didInsertElement() {
    this._super(...arguments);

    let updateHeight = () => {
      this.element.style.height = '1px';
      window.requestAnimationFrame(() => {
        if (this.element) this.element.style.height = `${this.element.scrollHeight}px`;
      });
    };
    this.set('updateHeight', updateHeight);

    updateHeight();
    this.element.addEventListener('keyup', updateHeight);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.element.removeEventListener('keyup', this.updateHeight);
  },
});
