import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RangeDatepicker extends Component {
  @tracked center;

  @action
  updateCenter({ date }) {
    this.center = date;
  }
}

<PowerCalendarRange
  @center={{this.center}}
  @onCenterChange={{this.updateCenter}}
  @onSelect={{@onSelect}}
  @selected={{@selected}}
  @renderInPlace={{@renderInPlace}}
  ...attributes
/>