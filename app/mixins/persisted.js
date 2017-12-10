import Mixin from '@ember/object/mixin';

export default Mixin.create({
  persisted(property) {
    return this.get(property).filterBy('isNew', false);
  }
});
