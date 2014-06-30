/**
@module ember
@submodule ember-runtime
*/

export default Ember.Mixin.create({
  contentArrayDidChange: function(array, idx, removedCount, addedCount) {
    var addedObjects = array.slice(idx, idx + addedCount);

    addedObjects.forEach(function(object) {
      Ember.addBeforeObserver(object, Ember.get(this, 'groupBy'), this, 'removeItemGrouped');
      Ember.addObserver(object, Ember.get(this, 'groupBy'), this, 'insertItemGrouped');

      this.insertItemGrouped(object);
    }, this);

    this._super.apply(this, array, idx, removedCount, addedCount);
  },

  contentArrayWillChange: function(array, idx, removedCount, addedCount) {
    var removedObjects = array.slice(idx, idx + removedCount);

    removedObjects.forEach(function(object) {
      Ember.removeBeforeObserver(object, Ember.get(this, 'groupBy'), this, 'removeItemGrouped');
      Ember.removeObserver(object, Ember.get(this, 'groupBy'), this, 'insertItemGrouped');

      this.removeItemGrouped(object);
    }, this);

    this._super.apply(this, array, idx, removedCount, addedCount);
  },

  insertItemGrouped: function(object) {
    var group = this.groupFor(object);
    group.pushObject(object);

    var groups = this.get('groups');
    if (!groups.contains(group)) groups.pushObject(group);
  },

  removeItemGrouped: function(object) {
    var group = this.groupFor(object);
    group.removeObject(object);

    if (Ember.get(group, 'length') === 0) {
      Ember.get(this, 'groups').removeObject(group);
    }
  },

  groupedContent: Ember.computed('arrangedContent', 'groupBy', function() {
    var content = Ember.get(this, 'arrangedContent');
    if (!content) return;

    return this.group(content);
  }),

  group: function(collection) {
    var groupsMap = {};
    var groups = Ember.A([]);

    Ember.set(this, 'groupsMap', groupsMap);
    Ember.set(this, 'groups', groups);

    collection.forEach((function(object) {
      Ember.addBeforeObserver(object, Ember.get(this, 'groupBy'), this, 'removeItemGrouped');
      Ember.addObserver(object, Ember.get(this, 'groupBy'), this, 'insertItemGrouped');

      var group = this.groupFor(object);

      if (!group) return;

      group.get("content").pushObject(object);
    }), this);

    return groups;
  },

  groupFor: function(object) {
    var group, groupName, groupType, groups, groupsMap;

    groupsMap = this.get('groupsMap');
    groups = this.get('groups');
    groupName = this.extractGroup(object);

    if (!groupName) return;

    group = groupsMap[groupName];

    if (!group) {
      groupType = this.get('groupType');

      group = Ember.ArrayProxy.create({
        content: Ember.A([]),
        name: groupName
      });

      groupsMap[groupName] = group;
      groups.pushObject(group);
    }

    return group;
  },

  extractGroup: function(object) {
    var propertyName = Ember.get(this, 'groupBy');

    if (!propertyName) return;

    return Ember.get(object, propertyName);
  }
});
