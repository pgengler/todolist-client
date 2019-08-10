import Controller from '@ember/controller';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class LoginController extends Controller {
  email = null;
  password = null;

  @service session;

  @action
  login() {
    let { email, password } = this;
    this.session.authenticate('authenticator:oauth2', email, password)
      .then(() => next(() => this.transitionToRoute('index')))
      .catch(() => alert('Login failed'))
      .finally(() => this.setProperties({ email: null, password: null }));
  }
}
