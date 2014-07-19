import Ember from 'ember';

export default Ember.ObjectController.extend({
  isCurrent: function() {
    return datesEqual(this.get('date'), new Date());
  }.property('model.date'),
  isPast: function() {
    return dateLessThan(this.get('date'), new Date());
  }.property('model.date'),
  isFuture: function() {
    return dateGreaterThan(this.get('date'), new Date());
  }.property('model.date'),
  isUndated: function() {
    return !this.get('date');
  }.property('model.date'),

  isDone: function(key, value){
    var model = this.get('model');

    if (value === undefined) {
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


function datesEqual(a, b)
{
  if (!a && !b) {
    return true;
  }
  if ((a && !b) || (!a && b)) {
    return false;
  }
  return (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate());
}

function dateLessThan(a, b)
{
  if (!a && !b) {
    // null on both sides is considered equal
    return false;
  }

  if (!a && b) {
    // null on the left is considered less than any value on the right
    return true;
  }

  if (!b) {
    // null on the right will never be less than any value on the left
    return false;
  }

  if (a.getFullYear() < b.getFullYear()) {
    return true;
  } else if (a.getFullYear() > b.getFullYear()) {
    return false;
  }
  if (a.getMonth() < b.getMonth()) {
    return true;
  } else if (a.getMonth() > b.getMonth()) {
    return false;
  }
  return (a.getDate() < b.getDate());
}

function dateGreaterThan(a, b)
{
  return (!datesEqual(a, b) && !dateLessThan(a, b));
}
