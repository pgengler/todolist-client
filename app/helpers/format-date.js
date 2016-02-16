import Ember from 'ember';

export default Ember.Helper.helper(function([ date ]) {
	return moment(date).format("MMM D, YYYY");
});
