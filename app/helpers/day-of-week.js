import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(date) {
	if (date) {
		return moment(date).format('dddd');
	}
	return "";
});
