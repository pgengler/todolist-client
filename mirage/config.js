import { discoverEmberDataModels } from 'ember-cli-mirage';
import { createServer } from 'miragejs';

export default function (config) {
  let finalConfig = {
    ...config,
    models: { ...discoverEmberDataModels(), ...config.models },
    routes,
  };

  return createServer(finalConfig);
}

function routes() {
  this.passthrough('/write-coverage');

  this.logging = true;

  this.namespace = '/api';
  this.post('/oauth/token', function () {
    return {
      access_token: 'foobarbaz',
      token_type: 'Bearer',
      expires_in: 15778476,
      refresh_token: 'bazbarfoo',
      created_at: +new Date(),
    };
  });

  this.namespace = '/api/v2';

  this.get('/lists', function ({ lists }, request) {
    let matchingLists = lists.all();
    if (request.queryParams['filter[date]']) {
      let dates = request.queryParams['filter[date]'];
      dates = Array.isArray(dates) ? dates : [dates];
      matchingLists = dates.map((date) => {
        return lists.findOrCreateBy({ name: date, listType: 'day' });
      });
      matchingLists = lists.all().filter((list) => dates.includes(list.name));
    }
    if (request.queryParams['filter[list-type]']) {
      let listType = request.queryParams['filter[list-type]'];
      matchingLists = matchingLists.filter(
        (list) => list.listType === listType
      );
    }
    return matchingLists;
  });

  this.get('/tasks');
  this.post('/tasks');

  this.get('/tasks/:id');
  this.patch('/tasks/:id');
  this.del('/tasks/:id');
}
