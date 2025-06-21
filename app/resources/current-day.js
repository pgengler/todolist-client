import { cell, resource } from 'ember-resources';
import { isSameDay } from 'date-fns';

const UPDATE_INTERVAL = 250; // in ms.

export const CurrentDay = resource(({ on }) => {
  let today = cell(new Date());

  let timer = setInterval(() => {
    let now = new Date();
    if (!isSameDay(now, today.current)) {
      today.current = now;
    }
  }, UPDATE_INTERVAL);

  on.cleanup(() => {
    clearInterval(timer);
  });

  return () => today.current;
});
