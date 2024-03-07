import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

export default function setupAcceptanceTest(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
}
