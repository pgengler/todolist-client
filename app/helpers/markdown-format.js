/* global Showdown */
import Ember from 'ember';

export default Ember.Helper.helper(function([ value ]) {
	if (typeof(value) === 'string') {
		const converter = new Showdown.converter();
		return Ember.String.htmlSafe(converter.makeHtml(value));
	}
});
