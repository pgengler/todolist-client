import { cell, resource } from 'ember-resources';
import { isSameDay } from 'date-fns';

const UPDATE_INTERVAL = 250; // in ms.

export const CurrentDay = resource(({ on }) => {
  const today = cell(new Date());

  const timer = setInterval(() => {
    const now = new Date();
    if (!isSameDay(now, today.current)) {
      today.current = now;
    }
  }, UPDATE_INTERVAL);

  on.cleanup(() => {
    clearInterval(timer);
  });

  return () => today.current;
});
