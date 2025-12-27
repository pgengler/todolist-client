import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-mirage/test-support';

export default function setupAcceptanceTest(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
}
