import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import keyEvent from 'ember-todo/tests/helpers/key-event';
import SingleLineTextarea from 'ember-todo/components/single-line-textarea';

module('Integration | Component | SingleLineTextarea', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a <textarea> element', async function (assert) {
    await render(<template><SingleLineTextarea @value="foo bar baz" /></template>);

    assert.dom('textarea').exists();
    assert.dom('textarea').hasValue('foo bar baz');
  });

  test('it emits the "onEnterPressed" action when bare Enter is pressed', async function (assert) {
    const onEnterPressed = () => assert.step('onEnterPressed called');
    await render(<template><SingleLineTextarea @value="abcd" @onEnterPressed={{onEnterPressed}} /></template>);

    await keyEvent('textarea', 'Enter');
    assert.verifySteps(['onEnterPressed called']);
  });

  test('it emits the "onEnterPressed" action when Shift+Enter is pressed and textarea is empty', async function (assert) {
    const onEnterPressed = () => assert.step('onEnterPressed called');
    await render(<template><SingleLineTextarea @value="" @onEnterPressed={{onEnterPressed}} /></template>);

    await keyEvent('textarea', 'Enter', { shiftKey: true });
    assert.verifySteps(['onEnterPressed called']);
  });

  test('it does not emit the "onEnterPressed" action when Shift+Enter is pressed and textarea is not empty', async function (assert) {
    const onEnterPressed = () => assert.step('onEnterPressed called');
    await render(<template><SingleLineTextarea @value="abcd" @onEnterPressed={{onEnterPressed}} /></template>);

    await keyEvent('textarea', 'Enter', { shiftKey: true });
    assert.verifySteps([]);
  });

  test('it emits the "onEscapePressed" action when Escape is pressed', async function (assert) {
    const onEscapePressed = () => assert.step('onEscapePressed called');
    await render(<template><SingleLineTextarea @onEscapePressed={{onEscapePressed}} /></template>);
    await keyEvent('textarea', 'Escape');
    assert.verifySteps(['onEscapePressed called']);
  });
});
