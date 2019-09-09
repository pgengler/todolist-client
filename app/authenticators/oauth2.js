import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default class extends OAuth2PasswordGrant {
  serverTokenEndpoint = '/api/oauth/token';
}
