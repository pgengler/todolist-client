import Transform from '@ember-data/serializer/transform';
import moment from 'moment';

export default class UTCDateTransform extends Transform {
  serialize(value) {
    return value ? value.toJSON() : null;
  }

  deserialize(value) {
    return value ? moment.utc(value) : null;
  }
}
