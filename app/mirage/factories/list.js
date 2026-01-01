import { Factory, trait } from 'miragejs';
import { format, subDays } from 'date-fns';

export default Factory.extend({
  day: trait({
    listType: 'day',
  }),

  recurringDay: trait({
    listType: 'recurring-task-day',
  }),

  today: trait({
    listType: 'day',
    name: format(new Date(), 'yyyy-MM-dd'),
  }),

  yesterday: trait({
    listType: 'day',
    name: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
  }),
});
