import DS from 'ember-data';

var Item = DS.Model.extend({
    done: DS.attr('boolean'),
    event: DS.attr('string')
});

Item.reopenClass({
  FIXTURES: [
    { id: 1, done: false, event: 'A thing' },
    { id: 2, done: false, event: 'Something else' }
  ]
});

export default Item;
