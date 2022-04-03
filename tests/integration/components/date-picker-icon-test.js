import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers';
import { calendarSelect } from 'ember-power-calendar/test-support';
import moment from 'moment';

module('Integration | Component | DatePickerIcon', function (hooks) {
  setupRenderingTest(hooks);

  test('triggers a dateSelected action when selecting a date', async function (assert) {
    let newDate;
    this.setProperties({
      dateSelected: (date) => (newDate = date),
      dateRange: {
        start: moment('2018-02-02'),
        end: moment('2018-02-04'),
      },
    });
    await render(hbs`
      <DatePickerIcon @dateSelected={{this.dateSelected}} @dateRange={{this.dateRange}} />
    `);

    await clickTrigger();
    await calendarSelect('.ember-basic-dropdown-content', new Date(2018, 1, 1));

    assert.strictEqual(newDate, '2018-02-01');
  });

  test('it highlights the currently-viewed dates', async function (assert) {
    this.set('dateRange', {
      start: moment('2017-12-04'),
      end: moment('2017-12-06'),
    });
    await render(hbs`
      <DatePickerIcon @dateRange={{this.dateRange}} />
    `);

    await clickTrigger();
    let selectedDayElements = this.element.querySelectorAll(
      '.ember-power-calendar-day--selected'
    );
    let highlightedDates = Array.from(selectedDayElements).map((elem) =>
      elem.textContent.trim()
    );
    assert.deepEqual(highlightedDates, ['4', '5', '6']);
  });
});
