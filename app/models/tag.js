import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  itemTags: DS.hasMany('itemTag', { async: true }),
  items: function(){
    return this.get('itemTags').map(function(elem){
      return elem.get('item');
    });
  }.property('itemTags.@each')
});
