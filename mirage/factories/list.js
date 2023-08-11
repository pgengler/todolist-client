import { Factory, trait } from 'miragejs';
import moment from 'moment';

export default Factory.extend({
  day: trait({
    listType: 'day',
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
});
