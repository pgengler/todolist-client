import { createServer } from 'miragejs';
import config from 'ember-todo/config/environment';
import { endOfDay, isAfter, isBefore, parse } from 'date-fns';
import models from './models';
import ApplicationSerializer from './serializers/application';

export default function (config) {
  let finalConfig = {
    ...config,
    models,
    serializers: {
      application: ApplicationSerializer,
    },
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

  this.get('/tasks', function ({ tasks }, request) {
    let result = tasks.all();
    if (request.queryParams['filter[overdue]']) {
      result = result.filter((task) => {
        if (task.done) return false;
        const list = task.list;
        if (!list) return false;
        if (list.listType !== 'day') return false;
        let listDate = endOfDay(parse(list.name, 'yyyy-MM-dd', new Date()));
        return isAfter(new Date(), listDate);
      });
    }

    if (request.queryParams['filter[due_before]']) {
      const date = parse(request.queryParams['filter[due_before]'], 'yyyy-MM-dd', new Date());
      result = result.filter((task) => {
        if (task.done) return false;
        const list = task.list;
        if (!list) return false;
        if (list.listType !== 'day') return false;
        let listDate = endOfDay(parse(list.name, 'yyyy-MM-dd', new Date()));
        return isAfter(date, listDate);
      });
    }

    let sort = request.queryParams['sort'];
    if (sort === 'due-date,description') {
      result = result.sort((a, b) => {
        if (a.list && !b.list) return -1;
        if (!a.list && b.list) return 1;

        let aDate = parse(a.list.name, 'yyyy-MM-dd', new Date());
        let bDate = parse(b.list.name, 'yyyy-MM-dd', new Date());
        if (isBefore(aDate, bDate)) return -1;
        if (isBefore(bDate, aDate)) return 1;

        let aDescription = a.description.replace(/[^A-Za-z0-9]/g, '');
        let bDescription = b.description.replace(/[^A-Za-z0-9]/g, '');

        if (aDescription < bDescription) return -1;
        if (aDescription > bDescription) return 1;
        return 0;
      });
    }

    return result;
  });
  this.post('/tasks', function ({ tasks }) {
    let task = tasks.create(this.normalizedRequestAttrs());
    if (task.list.listType === 'day') {
      task.update({ dueDate: task.list.name });
    }
    return task;
  });

  this.get('/tasks/:id');
  this.patch('/tasks/:id', function ({ tasks }, request) {
    let task = tasks.find(request.params.id);
    task.update(this.normalizedRequestAttrs());
    if (task.list.listType === 'day') {
      task.update({ dueDate: task.list.name });
    }
    return task;
  });
  this.del('/tasks/:id');
}
