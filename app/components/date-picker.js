import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'date-picker' ],
	tagName: 'span',

	didInsertElement: function() {
		var component = this;
		var picker = new Pikaday({
			onSelect: function(date) {
				component.sendAction('action', date);
				component.get('$picker').hide();
			}
		});
		this.set('picker', picker);
		picker.el.style.position = 'absolute';
		var $picker = this.$(picker.el);
		this.set('$picker', $picker);
		$picker.hide();
		this.$().append($picker);

		this.$('i').click(function() {
			component.send('toggleDatepicker');
		});
	},

	actions: {
		toggleDatepicker: function() {
			var $picker = this.get('$picker');
			if ($picker.is(':visible')) {
				$picker.hide();
			} else {
				$picker.show();
				var position = this.$().position();
				position.left -= $picker.width();
				$picker.css(position);
			}
		}
	}
});
