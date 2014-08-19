import Ember from 'ember';
import DS from 'ember-data';
import Persisted from 'ember-todo/mixins/persisted';

export default DS.Model.extend(Persisted, {
  name: DS.attr('string'),
  itemTags: DS.hasMany('itemTag'),
  items: Ember.computed.mapBy('itemTags', 'item'),
  savedItemTags: function() {
    return this.persisted('itemTags')
  }.property('itemTags')
});
