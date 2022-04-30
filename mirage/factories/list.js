import { Factory, trait } from 'miragejs';
import moment from 'moment';

export default Factory.extend({
  day: trait({
    listType: 'day',
    name: moment().format('YYYY-MM-DD'),
  }),
});
