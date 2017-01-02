import Ember from 'ember';
import dateParams from 'ember-todo/utils/date-params';
import { task, timeout } from 'ember-concurrency';

export default Ember.Route.extend({
  queryParams: {
    date: { refreshModel: true }
  },

  model(params) {
    let searchParams = dateParams(params.date);
    return Ember.RSVP.hash({
      days: this.store.query('day', searchParams),
      undated: this.store.findRecord('day', 'undated')
    });
  },

  pollForChanges: task(function* () {
    if (Ember.testing) {
      return;
    }
    yield timeout(5000);
    let searchParams = dateParams(this.get('controller.date'));
    this.store.query('day', searchParams)
      .then((results) => this.get('controller.model.days').addObjects(results))
      // .then(days => this.set('controller.model.days', days))
      .catch((err) => Ember.Logger.assert(false, `Failed to fetch days: ${err}`));
    this.get('pollForChanges').perform();
  }).on('activate').cancelOn('deactivate').restartable(),

  actions: {
    pausePolling() {
      this.get('pollForChanges').cancelAll();
    },
    resumePolling() {
      this.get('pollForChanges').perform();
    }
  }
});
