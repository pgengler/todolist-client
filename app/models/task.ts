import Model, { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import type List from './list';

export default class Task extends Model {
  @belongsTo('list', { async: true, inverse: 'tasks' }) declare list: AsyncBelongsTo<List>;

  @attr('string') declare description: string;
  @attr('boolean', { defaultValue: false }) declare done: boolean;
  @attr('string') declare dueDate: string;
  @attr('string') declare notes: string;

  get plaintextDescription(): string {
    return this.description.replace(/[^A-Za-z0-9]/g, '');
  }
}
