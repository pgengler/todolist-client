import DS from 'ember-data';
import moment from 'moment';

export default DS.Transform.extend({
  serialize(value) {
    return value ? value.toJSON() : null;
  },

  deserialize(value) {
    return value ? moment.utc(value) : null;
  }
});
