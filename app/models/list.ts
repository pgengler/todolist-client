import Model, { attr, hasMany } from '@ember-data/model';
import type Task from './task';

export default class List extends Model {
  @attr('string') declare listType: string;
  @attr('string') declare name: string;

  @hasMany('task', { async: false, inverse: 'list' }) declare tasks: Task[];
}
