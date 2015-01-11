/* global Showdown */
import Ember from 'ember';

export default Ember.HTMLBars.makeBoundHelper(function(params) {
	var value = params[0];
	if (typeof(value) === 'string') {
		var converter = new Showdown.converter();
		return new Ember.Handlebars.SafeString(converter.makeHtml(value));
	}
});
