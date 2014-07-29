import Ember from 'ember';
import DS from 'ember-data';
import Persisted from 'ember-todo/mixins/persisted';

export default DS.Model.extend(Persisted, {
  name: DS.attr('string'),
  itemTags: DS.hasMany('itemTag'),
  items: Ember.computed.mapBy('itemTags', 'item'),
  savedItems: function() {
    return this.persisted('items')
  }.property('items')
});
