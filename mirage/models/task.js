import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  list: belongsTo(),
});
