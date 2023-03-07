import Model, { attr, belongsTo } from '@ember-data/model';

export default class Task extends Model {
  @belongsTo('list', { async: false, inverse: 'tasks' }) list;

  @attr('string') description;
  @attr('boolean') done;
  @attr('string') notes;

  get plaintextDescription() {
    return this.description.replace(/[^A-Za-z0-9]/g, '');
  }
}
