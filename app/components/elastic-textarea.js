import SingleLineTextarea from './single-line-textarea';

export default SingleLineTextarea.extend({
  didInsertElement() {
    this._super(...arguments);
    let elem = this.$();

    let updateHeight = function() {
      elem.height(1);
      elem[0].style.height = `${elem[0].scrollHeight}px`;
    };

    updateHeight();
    elem.on('keyup', updateHeight);
  }
});
