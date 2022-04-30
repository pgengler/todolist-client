import { Factory } from 'miragejs';

export default Factory.extend({
  done: false,
  description: (i) => `Task ${i}`,
});
