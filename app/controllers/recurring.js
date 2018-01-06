import { sort } from '@ember/object/computed';
import Controller from '@ember/controller';

const SORT_PROPERTIES = [ 'id' ];

export default Controller.extend({
  sortProperties: SORT_PROPERTIES,
  lists: sort('model', 'sortProperties')
});
