import DS from 'ember-data';

export default DS.Model.extend({
  day: DS.attr('string'),

  tasks: DS.hasMany('recurringTask', { async: false })
});
