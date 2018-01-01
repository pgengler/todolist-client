import DS from 'ember-data';

export default DS.Model.extend({
  listType: DS.attr('string'),
  name: DS.attr('string'),

  tasks: DS.hasMany()
});
