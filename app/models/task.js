import { computed } from '@ember/object';
import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  done: attr('boolean'),
  description: attr('string'),
  list: belongsTo('list'),

  isDone: computed('done', {
    get() {
      return this.done;
    },
    set(key, value) {
      this.set('done', value);
      this.save();
      return value;
    }
  }),

  plaintextDescription: computed('description', function() {
    return this.description.replace(/[^A-Za-z0-9]/g, '');
  })
});
