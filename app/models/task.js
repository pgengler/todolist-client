import Model, { attr, belongsTo } from '@ember-data/model';

export default class Task extends Model {
  @attr('string') description;
  @attr('boolean') done;
  @belongsTo('list') list;

  get plaintextDescription() {
    return this.description.replace(/[^A-Za-z0-9]/g, '');
  }
}
