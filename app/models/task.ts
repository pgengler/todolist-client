import Model, { attr, belongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type List from './list';
import type RecurrenceRule from './recurrence-rule';

export default class Task extends Model {
  declare [Type]: 'task';

  @belongsTo('list', { async: false, inverse: 'tasks' }) declare list: List | null;
  @belongsTo('recurrence-rule', { async: false, inverse: 'tasks' })
  declare recurrenceRule: RecurrenceRule | null;

  @attr('string') declare description: string;
  @attr('boolean', { defaultValue: false }) declare done: boolean;
  @attr('string') declare dueDate: string;
  @attr('string') declare notes: string;
  @attr('date') declare originalDate: Date | null;
  @attr('boolean', { defaultValue: false }) declare instanceModified: boolean;
  @attr('boolean', { defaultValue: false }) declare skipped: boolean;
  @attr('boolean', { defaultValue: false }) declare recurring: boolean;

  get plaintextDescription(): string {
    return this.description.replace(/[^A-Za-z0-9]/g, '');
  }

  get isRecurring(): boolean {
    return this.recurring;
  }
}
