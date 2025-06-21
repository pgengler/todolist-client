import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendarRange from 'ember-power-calendar/components/power-calendar-range';

export default class RangeDatepicker extends Component {
  @tracked center;

  @action
  updateCenter({ date }) {
    this.center = date;
  }

  <template>
    <PowerCalendarRange
      @center={{this.center}}
      @onCenterChange={{this.updateCenter}}
      @onSelect={{@onSelect}}
      @selected={{@selected}}
      @renderInPlace={{@renderInPlace}}
      ...attributes
    />
  </template>
}
