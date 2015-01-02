import Ember from 'ember';

export default Ember.HTMLBars.makeBoundHelper(function(params) {
	return moment(params[0]).format("MMM D, YYYY");
});
