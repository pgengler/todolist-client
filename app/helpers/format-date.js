export default Ember.Handlebars.makeBoundHelper(function(value) {
    if (value) {
        return moment(value).format('ddd (MM/DD)');
    }
    return "--";
});
