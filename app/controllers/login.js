import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

export default Controller.extend({
  session: service(),

  actions: {
    login() {
      let { email, password } = this;
      this.session.authenticate('authenticator:oauth2', email, password)
        .then(() => next(() => this.transitionToRoute('index')))
        .catch(() => alert('Login failed'))
        .finally(() => this.setProperties({ email: null, password: null }));
    }
  }
});
