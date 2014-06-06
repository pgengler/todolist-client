export default Ember.Handlebars.makeBoundHelper(function(value) {
    if (value) {
        return value.strftime('%a (%m/%d)');
    }
    return "--";
});
