import Ember from 'ember';

export default Ember.TextField.extend({
  didInsertElement() {
    let picker = new Pikaday({
      field: this.$()[0]
    });
    this.set('picker', picker);
  }
});
