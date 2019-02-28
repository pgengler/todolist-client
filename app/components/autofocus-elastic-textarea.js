import ElasticTextarea from './elastic-textarea';

export default ElasticTextarea.extend({
  didInsertElement() {
    this._super();

    this.element.focus();
    this.element.select();
  }
});
