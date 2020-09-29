import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service session;

  namespace = 'api/v2';

  @computed('session.data.authenticated.access_token')
  get headers() {
    const headers = {};
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }

  handleResponse(status/*, headers, payload, requestData */) {
    if (status === 401 && this.session.isAuthenticated) {
      this.session.invalidate();
    }
    return super.handleResponse(...arguments);
  }
}
