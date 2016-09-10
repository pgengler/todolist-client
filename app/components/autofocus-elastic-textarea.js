import ElasticTextarea from './elastic-textarea';

export default ElasticTextarea.extend({
  didInsertElement() {
    this._super();
    this.$().focus().select();
  }
});
