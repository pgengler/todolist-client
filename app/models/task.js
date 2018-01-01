import { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  done: DS.attr('boolean'),
  description: DS.attr('string'),
  list: DS.belongsTo('list'),

  isDone: computed('done', {
    get() {
      return this.get('done');
    },
    set(key, value) {
      this.set('done', value);
      this.save();
      return value;
    }
  })
});
