import { click, waitFor } from '@ember/test-helpers';

export default async function clickToEdit(selector) {
  await click(selector);
  return waitFor(`${selector} textarea`);
}
