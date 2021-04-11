import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class LoginController extends Controller {
  @tracked email = null;
  @tracked password = null;

  @service session;

  @action
  async login(event) {
    event.preventDefault();
    try {
      await this.session.authenticate(
        'authenticator:oauth2',
        this.email,
        this.password
      );
      this.transitionToRoute('index');
    } catch {
      alert('Login failed');
    }
    this.email = null;
    this.password = null;
  }
}
