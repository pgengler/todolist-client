import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(value) {
    if (value) {
        return moment(value).format('MMMM DD, YYYY');
    }
    return "--";
});
