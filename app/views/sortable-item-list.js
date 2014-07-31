import Ember from 'ember';

export default Ember.View.extend({
	classNames: [ 'sortable' ],
	tagName: 'ul',
	templateName: 'sortable-item-list',

	didInsertElement: function() {
		var element = this.get('element');
		this.$(element).sortable();
		this.$(element).disableSelection();
	}
});
