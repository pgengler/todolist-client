import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function([ date ]) {
  return moment(date).format('MMM D, YYYY');
});
