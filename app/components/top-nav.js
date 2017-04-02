import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: [ 'top-nav' ],

  isShowingNewTaskModal: false,

  actions: {
    closeModal() {
      this.set('isShowingNewTaskModal', false);
    },

    toggleModal() {
      this.toggleProperty('isShowingNewTaskModal');
    }
  }
});
