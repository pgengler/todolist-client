import Model, { attr, hasMany } from '@ember-data/model';

export default Model.extend({
  listType: attr('string'),
  name: attr('string'),

  tasks: hasMany()
});
