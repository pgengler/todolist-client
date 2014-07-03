import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(startTime, endTime) {
    if (startTime && endTime) {
        return startTime + '-' + endTime;
    } else if (startTime) {
        return startTime;
    } else if (endTime) {
        return '-' + endTime;
    }
    return "";
});
