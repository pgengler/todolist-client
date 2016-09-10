import Ember from 'ember';

export default Ember.Mixin.create({
  persisted(property) {
    return this.get(property).filterBy('isNew', false);
  }
});
