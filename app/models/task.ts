import Model, { attr, belongsTo } from '@ember-data/model';
import { memberAction } from '@mainmatter/ember-api-actions';
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

  skip = memberAction<void>({ path: 'skip', type: 'post' });

  modifyInstance = memberAction<{ description?: string; notes?: string }>({
    path: 'modify_instance',
    type: 'post',
  });

  updateThisAndFuture = memberAction<{ description?: string; notes?: string }>({
    path: 'update_this_and_future',
    type: 'post',
  });

  deleteThisAndFuture = memberAction<void>({
    path: 'delete_this_and_future',
    type: 'post',
  });
}
