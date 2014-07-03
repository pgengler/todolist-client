import DS from 'ember-data';

var Tag = DS.Model.extend({
    style: DS.attr('number'),
    name: DS.attr('string'),
    items: DS.hasMany('item', { async: true }),

    styleClass: function() {
        return "style" + this.get('style');
    }.property('style')
});

Tag.reopenClass({
    FIXTURES: [
        { id: 1, style: 1, name: 'first tag', items: [ 1 ] },
        { id: 2, style: 2, name: 'second tag' },
        { id: 3, style: 0, name: 'third tag' }
    ]
});

export default Tag;
