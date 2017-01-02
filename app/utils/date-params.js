import moment from 'moment';

export default function(date) {
  let params = {
    after_days: 3, // eslint-disable-line camelcase
    before_days: 1, // eslint-disable-line camelcase
    date: moment().format('YYYY-MM-DD')
  };
  if (date) {
    params.date = date;
  }
  return params;
}
