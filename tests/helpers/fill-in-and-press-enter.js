import { fillIn } from '@ember/test-helpers';
import keyEvent from 'ember-todo/tests/helpers/key-event';

export default async function fillInAndPressEnter(selector, text) {
  await fillIn(selector, text);
  return keyEvent(selector, 'Enter');
}
