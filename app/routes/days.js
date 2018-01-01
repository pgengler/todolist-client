import { hash } from 'rsvp';
import Route from '@ember/routing/route';
// import dateParams from 'ember-todo/utils/date-params';
import moment from 'moment';
// import { task, timeout } from 'ember-concurrency';

function datesAround(date) {
  let days = [
    moment(date).subtract(1, 'day'),
    date,
    ...[1, 2, 3].map((val) => moment(date).add(val, 'days'))
  ];
  return days.map((day) => day.format('YYYY-MM-DD'));
}

export default Route.extend({
  queryParams: {
    date: { refreshModel: true }
  },

  model(params) {
    let date = params.date ? moment(params.date) : moment();
    return hash({
      days: this.store.query('list', {
        include: 'tasks',
        filter: {
          'list-type': 'day',
          date: datesAround(date)
        },
        sort: 'name'
      }),
      lists: this.store.query('list', {
        include: 'tasks',
        filter: {
          'list-type': 'list'
        }
      })
    });
  },

  // pollForChanges: task(function* () {
  //   if (Ember.testing) {
  //     return;
  //   }
  //   yield timeout(5000);
  //   let searchParams = dateParams(this.get('controller.date'));
  //   this.store.query('day', searchParams)
  //     .then((results) => this.get('controller.model.days').addObjects(results))
  //     // .then(days => this.set('controller.model.days', days))
  //     .catch((err) => Ember.Logger.assert(false, `Failed to fetch days: ${err}`));
  //   this.get('pollForChanges').perform();
  // }).on('activate').cancelOn('deactivate').restartable(),

  actions: {
    pausePolling() {
      // this.get('pollForChanges').cancelAll();
    },
    resumePolling() {
      // this.get('pollForChanges').perform();
    }
  }
});
