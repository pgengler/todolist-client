import { Factory, trait } from 'miragejs';
import moment from 'moment';

export default Factory.extend({
  day: trait({
    listType: 'day',
  }),

  list: trait({
    name: (i) => `List ${i}`,
  }),

  recurringDay: trait({
    listType: 'recurring-task-day',
  }),

  today: trait({
    listType: 'day',
    name: moment().format('YYYY-MM-DD'),
  }),

  yesterday: trait({
    listType: 'day',
    name: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  }),

  asCollapsed: trait({
    expanded: false,
    listType: 'list',
    name: (i) => `List ${i}`,
  }),

  asExpanded: trait({
    expanded: true,
    listType: 'list',
    name: (i) => `List ${i}`,
  }),
});
