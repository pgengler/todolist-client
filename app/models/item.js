var Item = DS.Model.extend({
    done: DS.attr('boolean'),
    date: DS.attr('date'),
    event: DS.attr('string'),
    location: DS.attr('string'),
    startTime: DS.attr('number'),
    endTime: DS.attr('number'),

    tags: DS.hasMany('tag', { async: true })
});

Item.reopenClass({
    FIXTURES: [
        { id: 1, done: false, date: new Date(), event: "Rewrite todolist UI with Ember", location: null, startTime: null, endTime: null, tags: [ 1, 2 ] },
        { id: 2, done: true, date: new Date(), event: "Create some fixture data", location: null, startTime: null, endTime: null, tags: [ ] },
        { id: 3, done: false, date: new Date(), event: "With a start time only", location: null, startTime: '0400', endTime: null, tags: [ ] },
        { id: 4, done: false, date: new Date(), event: "With an end time only", location: null, startTime: null, endTime: '1600', tags: [ ] },
        { id: 5, done: false, date: new Date(), event: "With start and times", location: null, startTime: '0400', endTime: '1600', tags: [ ] },
        { id: 6, done: false, date: null, event: "Item without a date", location: null, startTime: null, endTime: null, tags: [ ] },
        { id: 7, done: false, date: new Date("2014-04-07T23:59:59"), event: "Item with an older date", location: null, startTime: null, endTime: null, tags: [ ] },
        { id: 8, done: false, date: new Date("2999-01-01T12:00:00"), event: "Way-in-the-future item", location: null, startTime: null, endTime: null, tags: [ ] }
    ]
});


export default Item;
