import ElasticTextarea from './elastic-textarea';

export default ElasticTextarea.extend({
	didInsertElement: function() {
		this._super();
		this.$().focus().select();
	}
});
