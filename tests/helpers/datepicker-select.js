import { assert } from '@ember/debug';
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers';
import { calendarSelect } from 'ember-power-calendar/test-support';
import { find } from '@ember/test-helpers';
import moment from 'moment';

export default async function datepickerSelect(selector, selected) {
  assert(
    '`datepickerSelect` expect a date string as second argument',
    typeof selected === 'string'
  );
  let selectorElement = find(selector);
  assert(
    `'datepickerSelect' couldn't find any element with selector: ${selector}`,
    !!selectorElement
  );
  let triggerElement;
  if (selectorElement.classList.contains('ember-power-datepicker-trigger')) {
    triggerElement = selectorElement;
  } else {
    triggerElement = find(`${selector} .ember-power-datepicker-trigger`);
    assert(
      `'datepickerSelect' couln't find any datepicker within the selector ${selector}`,
      !!triggerElement
    );
    selector = `${selector} .ember-power-datepicker-trigger`;
  }

  await clickTrigger(selector);
  return calendarSelect(
    '.ember-power-datepicker-content',
    moment(selected).utc().toDate()
  );
}
