import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from '@pgengler/ember-cli-mirage/test-support';

export default function setupAcceptanceTest(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
}
