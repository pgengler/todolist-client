import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import preventDefault from '../helpers/prevent-default';
import { Input } from '@ember/component';

export default class extends Component {
  @tracked email = null;
  @tracked password = null;

  @service router;
  @service session;

  @action
  async login() {
    try {
      await this.session.authenticate('authenticator:oauth2', this.email, this.password);
      this.router.transitionTo('index');
    } catch {
      alert('Login failed');
    }
    this.email = null;
    this.password = null;
  }

  <template>
    <form class="login-form" {{on "submit" (preventDefault this.login)}}>
      <table>
        <tbody>
          <tr>
            <td>
              <label for="email">Email address</label>
            </td>
            <td>
              <Input @type="text" @value={{this.email}} id="email" />
            </td>
          </tr>
          <tr>
            <td>
              <label for="password">Password</label>
            </td>
            <td>
              <Input @type="password" @value={{this.password}} id="password" />
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <button type="submit">Log in</button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </template>
}
