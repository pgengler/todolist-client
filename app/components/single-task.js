import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  editDesciption: Ember.computed.oneWay('task.description'),
  isEditing: false,

  doubleClick() {
    this.send('editTask');
  },

  actions: {
    editTask() {
      this.set('editDescription', this.get('task.description'));
      this.set('isEditing', true);
      this.sendAction('editingStart');
    },

    cancelEdit() {
      this.set('editDescription', '');
      this.set('isEditing', false);
      this.sendAction('editingEnd');
    },

    updateTask() {
      let task = this.get('task');
      const description = this.get('editDescription');
      if (!Ember.isEmpty(description)) {
        task.set('description', description);
        task.save();
        this.set('isEditing', false);
      } else {
        task.deleteRecord();
        task.save();
      }
      this.sendAction('editingEnd');
    }
  }
});
