import Ember from 'ember';

export default Ember.View.extend({
	classNames: [ 'sortable' ],
	tagName: 'ul',
	templateName: 'sortable-item-list',

	didInsertElement: function() {
		var controller = this.get('controller');
		this.$().sortable({
			stop: function(event, ui) {
				var positions = { };

				var $this = $(this);
				$this.find('li[data-id]').each(function(index) {
					positions[ $(this).data('id') ] = index;
				});

				$this.sortable('cancel');

				controller.updateSortOrder(positions);
			}
		});
		this.$().disableSelection();
	}
});
