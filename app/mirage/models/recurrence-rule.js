import { Model, hasMany } from 'miragejs';

export default Model.extend({
  tasks: hasMany(),
});
