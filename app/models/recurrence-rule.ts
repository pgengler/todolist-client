import Model, { attr, hasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type Task from './task';

export type RecurrenceType =
  | 'daily'
  | 'weekdays'
  | 'weekends'
  | 'weekly'
  | 'custom_weekly'
  | 'every_n_days'
  | 'every_n_weeks'
  | 'every_n_months'
  | 'monthly_weekday'
  | 'yearly'
  | 'yearly_weekday';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default class RecurrenceRule extends Model {
  declare [Type]: 'recurrence-rule';

  @attr('string') declare description: string;
  @attr('string') declare notes: string;
  @attr('string') declare recurrenceType: RecurrenceType;
  @attr('number') declare interval: number;
  @attr('number') declare dayOfWeek: number | null;
  @attr() declare daysOfWeek: number[];
  @attr('number') declare dayOfMonth: number | null;
  @attr('number') declare weekOfMonth: number | null;
  @attr('number') declare month: number | null;
  @attr('date') declare anchorDate: Date | null;
  @attr('date') declare startDate: Date | null;
  @attr('date') declare endDate: Date | null;
  @attr('number') declare maxInstances: number | null;
  @attr('number') declare instancesCreated: number;
  @attr('string') declare humanReadableSchedule: string;

  @hasMany('task', { async: true, inverse: 'recurrenceRule' })
  declare tasks: Task[];

  get dayOfWeekName(): string | null {
    if (this.dayOfWeek === null || this.dayOfWeek === undefined) return null;
    return DAY_NAMES[this.dayOfWeek] ?? null;
  }

  get daysOfWeekNames(): string[] {
    if (!this.daysOfWeek) return [];
    return this.daysOfWeek.map((d) => DAY_NAMES[d]).filter((name): name is string => name !== undefined);
  }
}
