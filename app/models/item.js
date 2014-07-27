import DS from 'ember-data';

export default DS.Model.extend({
    done: DS.attr('boolean'),
    date: DS.attr('date'),
    event: DS.attr('string'),

    item_tags: DS.hasMany('itemTag', { async: true })
});
