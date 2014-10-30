import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'date-picker' ],

	didInsertElement: function() {
		var component = this;
		var picker = new Pikaday({
			onSelect: function(date) {
				component.sendAction('action', date);
				component.get('$picker').hide();
			}
		});
		picker.el.style.position = 'absolute';
		this.set('picker', picker);
		var $picker = this.$(picker.el);
		this.set('$picker', $picker);
		$picker.hide();
		this.$().append($picker);

		this.$('i').click(function() {
			component.send('toggleDatepicker');
		});
	},

	actions: {
		showDatepicker: function() {
			var $picker = this.get('$picker');
			$picker.show();

			var $icon = this.$('i');
			var position = $icon.position();
			position.left -= $picker.width();
			position.top += ($icon.height() / 2);
			$picker.css(position);
		},

		hideDatepicker: function() {
			this.get('$picker').hide();
		},

		toggleDatepicker: function() {
			if (this.get('$picker').is(':visible')) {
				this.send('hideDatepicker');
			} else {
				this.send('showDatepicker');
			}
		}
	}
});
