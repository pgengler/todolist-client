import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers';
import { calendarSelect } from 'ember-power-calendar/test-support';
import moment from 'moment';

module('Integration | Component | date-picker-icon', function(hooks) {
  setupRenderingTest(hooks);

  test('triggers a dateSelected action when selecting a date', async function(assert) {
    let newDate;
    this.set('dateSelected', function(date) {
      newDate = date;
    });
    await render(hbs`
      {{date-picker-icon dateSelected=(action dateSelected)}}
    `);

    await clickTrigger();
    await calendarSelect('.ember-basic-dropdown-content', new Date(2018, 1, 1));

    assert.equal(newDate, '2018-02-01');
  });

  test('it highlights the currently-selected day', async function(assert) {
    let date = moment('2017-12-04');
    this.set('date', date);
    await render(hbs`
      {{date-picker-icon date=date}}
    `);

    await clickTrigger();
    assert.equal(this.element.querySelector('.ember-power-calendar-day--selected').textContent.trim(), '4');
  });
});
