import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'date-picker', 'fa', 'fa-calendar' ],
  tagName: 'i',

  didInsertElement() {
    let picker = new Pikaday({
      onSelect: (date) => {
        this.sendAction('action', date);
        this.get('$picker').hide();
      }
    });
    picker.el.style.position = 'absolute';
    this.set('picker', picker);
    let $picker = this.$(picker.el);
    this.set('$picker', $picker);
    $picker.hide();
    this.$().closest('body').append($picker);

    this.$().click(() => this.send('toggleDatepicker'));
  },

  actions: {
    showDatepicker() {
      let $picker = this.get('$picker');
      $picker.show();

      let $icon = this.$();
      let position = $icon.position();
      position.left += ($icon.width() / 2);
      position.top += ($icon.height() / 2);
      $picker.css(position);
    },

    hideDatepicker() {
      this.get('$picker').hide();
    },

    toggleDatepicker() {
      if (this.get('$picker').is(':visible')) {
        this.send('hideDatepicker');
      } else {
        this.send('showDatepicker');
      }
    }
  }
});
