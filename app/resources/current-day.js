import { cell, resource } from 'ember-resources';
import moment from 'moment';

export const CurrentDay = resource(({ on }) => {
  let today = cell(moment());

  let timer = setInterval(() => {
    let now = moment();
    if (!today.current.isSame(now, 'day')) {
      today.current = now;
    }
  });

  on.cleanup(() => {
    clearInterval(timer);
  });

  return () => today.current;
});
