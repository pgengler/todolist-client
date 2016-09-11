import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  done: false,
  description: (i) => `Task ${i}`
});
