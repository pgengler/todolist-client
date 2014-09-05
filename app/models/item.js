import DS from 'ember-data';

export default DS.Model.extend({
    done: DS.attr('boolean'),
    date: DS.attr('date'),
    event: DS.attr('string'),

    itemTags: DS.hasMany('itemTag'),
    tags: DS.hasMany('tag'),

    isDone: function(key, value) {
      if (typeof(value) === 'undefined') {
        // property being used as a getter
        return this.get('done');
      } else {
        // property being used as a setter
        this.set('done', value);
        this.save();
        return value;
      }
    }.property('done')
});
