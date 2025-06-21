import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import keyEvent from 'ember-todo/tests/helpers/key-event';

module('Integration | Component | SingleLineTextarea', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a <textarea> element', async function (assert) {
    await render(hbs`
      <SingleLineTextarea @value="foo bar baz" />
    `);

    assert.dom('textarea').exists();
    assert.dom('textarea').hasValue('foo bar baz');
  });

  test('it emits the "onEnterPressed" action when bare Enter is pressed', async function (assert) {
    this.onEnterPressed = () => assert.step('onEnterPressed called');
    await render(hbs`
      <SingleLineTextarea @value="abcd" @onEnterPressed={{this.onEnterPressed}} />
    `);

    await keyEvent('textarea', 'Enter');
    assert.verifySteps(['onEnterPressed called']);
  });

  test('it emits the "onEnterPressed" action when Shift+Enter is pressed and textarea is empty', async function (assert) {
    this.onEnterPressed = () => assert.step('onEnterPressed called');
    await render(hbs`
      <SingleLineTextarea @value="" @onEnterPressed={{this.onEnterPressed}} />
    `);

    await keyEvent('textarea', 'Enter', { shiftKey: true });
    assert.verifySteps(['onEnterPressed called']);
  });

  test('it does not emit the "onEnterPressed" action when Shift+Enter is pressed and textarea is not empty', async function (assert) {
    this.onEnterPressed = () => assert.step('onEnterPressed called');
    await render(hbs`
      <SingleLineTextarea @value="abcd" @onEnterPressed={{this.onEnterPressed}} />
    `);

    await keyEvent('textarea', 'Enter', { shiftKey: true });
    assert.verifySteps([]);
  });

  test('it emits the "onEscapePressed" action when Escape is pressed', async function (assert) {
    this.onEscapePressed = () => assert.step('onEscapePressed called');
    await render(hbs`
      <SingleLineTextarea @onEscapePressed={{this.onEscapePressed}} />
    `);
    await keyEvent('textarea', 'Escape');
    assert.verifySteps(['onEscapePressed called']);
  });
});
