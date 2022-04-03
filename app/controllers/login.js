import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class LoginController extends Controller {
  @tracked email = null;
  @tracked password = null;

  @service router;
  @service session;

  @action
  async login() {
    try {
      await this.session.authenticate(
        'authenticator:oauth2',
        this.email,
        this.password
      );
      this.router.transitionTo('index');
    } catch {
      alert('Login failed');
    }
    this.email = null;
    this.password = null;
  }
}
