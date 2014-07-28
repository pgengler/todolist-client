import Ember from 'ember';

export default Ember.ObjectController.extend({
  isDone: function(key, value) {
    var model = this.get('model');

    if (typeof(value) === 'undefined') {
      // property being used as a getter
      return model.get('done');
    } else {
      // property being used as a setter
      model.set('done', value);
      model.save();
      return value;
    }
  }.property('model.done')
});
