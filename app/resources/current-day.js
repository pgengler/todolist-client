import { cell, resource } from 'ember-resources';
import moment from 'moment';

const UPDATE_INTERVAL = 250; // in ms.

export const CurrentDay = resource(({ on }) => {
  let today = cell(moment());

  let timer = setInterval(() => {
    let now = moment();
    if (!today.current.isSame(now, 'day')) {
      today.current = now;
    }
  }, UPDATE_INTERVAL);

  on.cleanup(() => {
    clearInterval(timer);
  });

  return () => today.current;
});
