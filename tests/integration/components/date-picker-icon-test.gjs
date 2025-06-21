import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, findAll, render } from '@ember/test-helpers';
import { calendarSelect } from 'ember-power-calendar/test-support/helpers';
import moment from 'moment';
import DatePickerIcon from 'ember-todo/components/date-picker-icon';

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
    await render(
      <template>
        <DatePickerIcon @dateSelected={{this.dateSelected}} @dateRange={{this.dateRange}} data-test-change-date />
      </template>,
    );

    await click('[data-test-change-date]');
    await calendarSelect('.date-picker-content', new Date(2018, 1, 1));

    assert.strictEqual(newDate, '2018-02-01');
  });

  test('it highlights the currently-viewed dates', async function (assert) {
    this.set('dateRange', {
      start: moment('2017-12-04'),
      end: moment('2017-12-06'),
    });
    await render(<template><DatePickerIcon @dateRange={{this.dateRange}} data-test-change-date /></template>);

    await click('[data-test-change-date]');
    let selectedDayElements = findAll('.date-picker-content .ember-power-calendar-day--selected');
    let highlightedDates = Array.from(selectedDayElements).map((elem) => elem.textContent.trim());
    assert.deepEqual(highlightedDates, ['4', '5', '6']);
  });
});
