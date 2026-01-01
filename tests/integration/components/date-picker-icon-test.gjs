import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-todo/tests/helpers';
import { click, findAll, render } from '@ember/test-helpers';
import { calendarSelect } from 'ember-power-calendar/test-support/helpers';
import { format, parse } from 'date-fns';
import DatePickerIcon from 'ember-todo/components/date-picker-icon';

module('Integration | Component | DatePickerIcon', function (hooks) {
  setupRenderingTest(hooks);

  test('triggers a dateSelected action when selecting a date', async function (assert) {
    let newDate;
    const dateSelected = (date) => (newDate = date);
    const dateRange = {
      start: parse('2018-02-02', 'yyyy-MM-dd', new Date()),
      end: parse('2018-02-04', 'yyyy-MM-dd', new Date()),
    };
    await render(
      <template>
        <DatePickerIcon @dateSelected={{dateSelected}} @dateRange={{dateRange}} data-test-change-date />
      </template>
    );

    await click('[data-test-change-date]');
    await calendarSelect('.date-picker-content', new Date(2018, 1, 1));

    assert.strictEqual(format(newDate, 'yyyy-MM-dd'), '2018-02-01');
  });

  test('it highlights the currently-viewed dates', async function (assert) {
    const dateRange = {
      start: parse('2017-12-04', 'yyyy-MM-dd', new Date()),
      end: parse('2017-12-06', 'yyyy-MM-dd', new Date()),
    };
    await render(<template><DatePickerIcon @dateRange={{dateRange}} data-test-change-date /></template>);

    await click('[data-test-change-date]');
    let selectedDayElements = findAll('.date-picker-content .ember-power-calendar-day--selected');
    let highlightedDates = Array.from(selectedDayElements).map((elem) => elem.textContent.trim());
    assert.deepEqual(highlightedDates, ['4', '5', '6']);
  });
});
