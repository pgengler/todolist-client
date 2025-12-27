import Model, { attr, belongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type List from './list';

export default class Task extends Model {
  declare [Type]: 'task';

  @belongsTo('list', { async: false, inverse: 'tasks' }) declare list: List | null;

  @attr('string') declare description: string;
  @attr('boolean', { defaultValue: false }) declare done: boolean;
  @attr('string') declare dueDate: string;
  @attr('string') declare notes: string;

  get plaintextDescription(): string {
    return this.description.replace(/[^A-Za-z0-9]/g, '');
  }
}
