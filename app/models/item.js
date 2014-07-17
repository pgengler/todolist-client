import DS from 'ember-data';

export default DS.Model.extend({
    done: DS.attr('boolean'),
    date: DS.attr('date'),
    event: DS.attr('string'),
    location: DS.attr('string'),
    startTime: DS.attr('number'),
    endTime: DS.attr('number'),

    tags: DS.hasMany('tag')
});
