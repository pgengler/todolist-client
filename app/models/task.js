import Model, { attr, belongsTo } from '@ember-data/model';

export default class Task extends Model {
  @belongsTo('list', { async: true, inverse: 'tasks' }) list;

  @attr('string') description;
  @attr('boolean', { defaultValue: false }) done;
  @attr('string') dueDate;
  @attr('string') notes;

  get plaintextDescription() {
    return this.description.replace(/[^A-Za-z0-9]/g, '');
  }
}
