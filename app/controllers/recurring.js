import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';

export default class RecurringController extends Controller {
  @alias('model') lists;
}
