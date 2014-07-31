import Ember from 'ember';

export default Ember.View.extend({
	classNames: [ 'sortable' ],
	tagName: 'ul',
	templateName: 'sortable-item-list'
});
