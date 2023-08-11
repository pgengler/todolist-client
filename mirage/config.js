import { discoverEmberDataModels } from '@pgengler/ember-cli-mirage';
import { createServer } from 'miragejs';
import config from 'ember-todo/config/environment';
import moment from 'moment';

export default function (config, owner) {
  let finalConfig = {
    ...config,
    models: { ...discoverEmberDataModels(owner), ...config.models },
    routes,
  };

  return createServer(finalConfig);
}

function routes() {
  this.passthrough('/write-coverage');

  this.logging = config.mirageLogging;

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
      matchingLists = matchingLists.filter((list) => list.listType === listType);
    }
    return matchingLists;
  });
  this.patch('/lists/:id');

  this.get('/tasks', function ({ tasks }, request) {
    let result = tasks.all();
    if (request.queryParams['filter[overdue]']) {
      result = result.filter((task) => {
        if (task.done) return false;
        const list = task.list;
        if (!list) return false;
        if (list.listType !== 'day') return false;
        let listDate = moment(list.name).endOf('day');
        return moment().isAfter(listDate);
      });
    }

    let sort = request.queryParams['sort'];
    if (sort === 'due-date,description') {
      result = result.sort((a, b) => {
        if (a.list && !b.list) return -1;
        if (!a.list && b.list) return 1;

        let aDate = moment(a.list.name);
        let bDate = moment(b.list.name);
        if (aDate.isBefore(bDate)) return -1;
        if (bDate.isBefore(aDate)) return 1;

        let aDescription = a.description.replace(/[^A-Za-z0-9]/g, '');
        let bDescription = b.description.replace(/[^A-Za-z0-9]/g, '');

        if (aDescription < bDescription) return -1;
        if (aDescription > bDescription) return 1;
        return 0;
      });
    }

    return result;
  });
  this.post('/tasks');

  this.get('/tasks/:id');
  this.patch('/tasks/:id');
  this.del('/tasks/:id');
}
