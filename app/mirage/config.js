import { createServer, Response } from 'miragejs';
import config from 'ember-todo/config/environment';
import {
  endOfDay,
  isAfter,
  isBefore,
  parse,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  getDay,
  getDate,
  getMonth,
} from 'date-fns';
import factories from './factories';
import models from './models';
import defaultScenario from './scenarios/default';
import ApplicationSerializer from './serializers/application';

/**
 * Check if a recurrence rule applies to a given date
 */
function ruleAppliesToDate(rule, date) {
  const startDate = rule.startDate ? new Date(rule.startDate) : null;
  const endDate = rule.endDate ? new Date(rule.endDate) : null;

  if (startDate && date < startDate) return false;
  if (endDate && date > endDate) return false;
  if (rule.maxInstances && (rule.instancesCreated || 0) >= rule.maxInstances) return false;

  const dayOfWeek = getDay(date); // 0 = Sunday, 6 = Saturday
  const dayOfMonth = getDate(date);
  const month = getMonth(date) + 1; // getMonth is 0-indexed

  switch (rule.recurrenceType) {
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    case 'weekly':
      return dayOfWeek === rule.dayOfWeek;
    case 'custom_weekly':
      return rule.daysOfWeek?.includes(dayOfWeek);
    case 'every_n_days': {
      if (rule.interval === 1) return true;
      if (!rule.anchorDate) return false;
      const anchorDate = new Date(rule.anchorDate);
      const daysDiff = differenceInDays(date, anchorDate);
      return daysDiff % rule.interval === 0;
    }
    case 'every_n_weeks': {
      if (dayOfWeek !== rule.dayOfWeek) return false;
      if (rule.interval === 1) return true;
      if (!rule.anchorDate) return false;
      const anchorDate = new Date(rule.anchorDate);
      const weeksDiff = differenceInWeeks(date, anchorDate);
      return weeksDiff % rule.interval === 0;
    }
    case 'every_n_months': {
      if (dayOfMonth !== rule.dayOfMonth) return false;
      if (rule.interval === 1) return true;
      if (!rule.anchorDate) return false;
      const anchorDate = new Date(rule.anchorDate);
      const monthsDiff = differenceInMonths(date, anchorDate);
      return monthsDiff % rule.interval === 0;
    }
    case 'monthly_weekday': {
      if (dayOfWeek !== rule.dayOfWeek) return false;
      if (rule.weekOfMonth === -1) {
        // Last occurrence of this weekday in the month
        const nextWeek = new Date(date);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return getMonth(nextWeek) !== getMonth(date);
      }
      const weekOfMonth = Math.floor((dayOfMonth - 1) / 7) + 1;
      return weekOfMonth === rule.weekOfMonth;
    }
    case 'yearly':
      return month === rule.month && dayOfMonth === rule.dayOfMonth;
    case 'yearly_weekday': {
      if (month !== rule.month) return false;
      if (dayOfWeek !== rule.dayOfWeek) return false;
      if (rule.weekOfMonth === -1) {
        const nextWeek = new Date(date);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return getMonth(nextWeek) !== getMonth(date);
      }
      const weekOfMonth = Math.floor((dayOfMonth - 1) / 7) + 1;
      return weekOfMonth === rule.weekOfMonth;
    }
    default:
      return false;
  }
}

/**
 * Populate recurring tasks for a day-type list
 */
function populateRecurringTasks(schema, list) {
  if (list.listType !== 'day') return;

  const date = parse(list.name, 'yyyy-MM-dd', new Date());
  const rules = schema.recurrenceRules.all();

  rules.models.forEach((rule) => {
    if (!ruleAppliesToDate(rule, date)) return;

    // Check if a task already exists for this rule on this list
    // This handles both tasks created by the recurrence system and tasks
    // that were converted from non-recurring to recurring
    const existingTask = schema.tasks.findBy((task) => {
      // Check by recurrence rule ID (handles both relationship and ID)
      const matchesRule =
        task.recurrenceRuleId === rule.id || (task.recurrenceRule && task.recurrenceRule.id === rule.id);

      // Check if task is on this list
      const matchesList = task.listId === list.id || (task.list && task.list.id === list.id);

      return matchesRule && matchesList;
    });

    if (existingTask) return;

    // Create a new task instance for this recurrence
    schema.tasks.create({
      description: rule.description,
      notes: rule.notes,
      list,
      recurrenceRule: rule,
      originalDate: date,
      done: false,
      skipped: false,
      instanceModified: false,
      recurring: true,
      dueDate: list.name,
    });

    // Increment instances created
    rule.update({ instancesCreated: (rule.instancesCreated || 0) + 1 });
  });
}

export default function (config) {
  let finalConfig = {
    ...config,
    factories,
    models,
    scenarios: {
      default: defaultScenario,
    },
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

  this.get('/lists', function (schema, request) {
    let { lists } = schema;
    let matchingLists = lists.all();
    if (request.queryParams['filter[date]']) {
      let dates = request.queryParams['filter[date]'];
      dates = Array.isArray(dates) ? dates : [dates];
      matchingLists = dates.map((date) => {
        let list = lists.findBy({ name: date, listType: 'day' });
        if (!list) {
          list = lists.create({ name: date, listType: 'day' });
        }
        // Populate recurring tasks for this day
        populateRecurringTasks(schema, list);
        return list;
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
    // Sync recurring attribute based on recurrence rule
    task.update({ recurring: !!task.recurrenceRuleId });
    return task;
  });

  this.get('/tasks/:id');
  this.patch('/tasks/:id', function ({ tasks }, request) {
    let task = tasks.find(request.params.id);
    task.update(this.normalizedRequestAttrs());
    if (task.list.listType === 'day') {
      task.update({ dueDate: task.list.name });
    }
    // Sync recurring attribute based on recurrence rule
    task.update({ recurring: !!task.recurrenceRuleId });
    return task;
  });
  this.del('/tasks/:id');

  this.post('/recurrence-rules');

  // Recurring task actions
  this.post('/tasks/:id/skip', function ({ tasks }, request) {
    let task = tasks.find(request.params.id);
    task.update({ skipped: true, instanceModified: true });
    return task;
  });

  this.post('/tasks/:id/modify_instance', function ({ tasks }, request) {
    let task = tasks.find(request.params.id);
    let attrs = JSON.parse(request.requestBody);
    // Handle both JSON:API format and plain object format
    let data = attrs.data?.attributes || attrs;
    task.update({
      description: data.description ?? task.description,
      notes: data.notes ?? task.notes,
      instanceModified: true,
    });
    return task;
  });

  this.post('/tasks/:id/update_this_and_future', function (schema, request) {
    let { tasks } = schema;
    let task = tasks.find(request.params.id);
    let attrs = JSON.parse(request.requestBody);
    let data = attrs.data?.attributes || attrs;

    // Update the recurrence rule
    let rule = task.recurrenceRule;
    if (rule) {
      rule.update({
        description: data.description ?? rule.description,
        notes: data.notes ?? rule.notes,
      });

      // Update this task and all future non-modified instances
      let originalDate = task.originalDate ? new Date(task.originalDate) : null;
      tasks.all().models.forEach((t) => {
        if (t.recurrenceRuleId !== rule.id) return;
        if (t.instanceModified) return;

        let taskDate = t.originalDate ? new Date(t.originalDate) : null;
        if (taskDate && originalDate && taskDate >= originalDate) {
          t.update({
            description: data.description ?? t.description,
            notes: data.notes ?? t.notes,
          });
        }
      });
    }

    return task;
  });

  this.post('/tasks/:id/delete_this_and_future', function (schema, request) {
    let { tasks } = schema;
    let task = tasks.find(request.params.id);
    let rule = task.recurrenceRule;

    if (rule) {
      let originalDate = task.originalDate ? new Date(task.originalDate) : null;

      // Delete this task and all future instances
      tasks.all().models.forEach((t) => {
        if (t.recurrenceRuleId !== rule.id) return;

        let taskDate = t.originalDate ? new Date(t.originalDate) : null;
        if (taskDate && originalDate && taskDate >= originalDate) {
          t.destroy();
        }
      });

      // Set end date on the rule to prevent future instances
      if (originalDate) {
        let endDate = new Date(originalDate);
        endDate.setDate(endDate.getDate() - 1);
        rule.update({ endDate });
      }
    } else {
      task.destroy();
    }

    return new Response(204);
  });
}
