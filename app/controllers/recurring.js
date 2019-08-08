import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';

export default class extends Controller {
  @alias('model') lists;
}
