import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

moduleForComponent('day-tasks/header', 'Integration | Component | day tasks/header', {
  integration: true
});

test('it renders the day and formatted date', function(assert) {
  let list = EmberObject.create({
    name: '2017-12-31'
  });
  this.set('list', list);
  this.render(hbs`
    {{day-tasks/header list=list}}
  `);

  assert.equal(this.$('h1').text().trim(), 'Sunday');
  assert.equal(this.$('h2').text().trim(), 'Dec 31, 2017');
});
