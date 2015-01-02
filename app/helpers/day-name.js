import Ember from 'ember';

export default Ember.HTMLBars.makeBoundHelper(function(params) {
	var date = params[0];
	return moment(date).format('dddd');
});
