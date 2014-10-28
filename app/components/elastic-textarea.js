import SingleLineTextarea from './single-line-textarea';

export default SingleLineTextarea.extend({
	didInsertElement: function() {
		var elem = this.$();

		var updateHeight = function() {
			if (elem[0].scrollHeight > elem.height() + 10) {
				elem[0].style.height = elem[0].scrollHeight + 'px';
			}
		};

		updateHeight();
		elem.on('keyup', updateHeight);
	}
});
