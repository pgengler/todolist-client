/* global Showdown */
import Ember from 'ember';

export default Ember.Helper.helper(function(params) {
	var value = params[0];
	if (typeof(value) === 'string') {
		var converter = new Showdown.converter();
		return Ember.String.htmlSafe(converter.makeHtml(value));
	}
});
