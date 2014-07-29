import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  itemTags: DS.hasMany('itemTag'),
  items: DS.hasMany('item')
});
