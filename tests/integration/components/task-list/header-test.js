import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

moduleForComponent('task-list/header', 'Integration | Component | task list/header', {
  integration: true
});

test('it renders the list name', function(assert) {
  let list = EmberObject.create({
    name: 'Foo Bar Baz'
  });
  this.set('list', list);
  this.render(hbs`
    {{task-list/header list=list}}
  `);

  assert.equal(this.$('.task-list-header').length, 1, 'has header class');
  assert.equal(this.$('h1').text().trim(), 'Foo Bar Baz', 'renders list name');
});
