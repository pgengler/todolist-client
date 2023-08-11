import Model, { attr, hasMany } from '@ember-data/model';

export default class List extends Model {
  @attr('boolean', { defaultValue: false }) expanded;
  @attr('string') listType;
  @attr('string') name;

  @hasMany('task', { async: false, inverse: 'list' }) tasks;
}
