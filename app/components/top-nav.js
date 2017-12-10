import Component from '@ember/component';

export default Component.extend({
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
