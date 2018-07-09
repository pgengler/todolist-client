import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

export default function setupAcceptanceTest(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
}
