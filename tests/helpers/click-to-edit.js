import { click, doubleClick, waitFor } from '@ember/test-helpers';

export async function clickToEdit(selector) {
  await click(`${selector} .description`);
  return waitFor(`${selector} textarea`);
}

export async function doubleClickToEdit(selector) {
  return doubleClick(`${selector} .description`);
}
