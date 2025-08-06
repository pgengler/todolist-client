import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendarRange from 'ember-power-calendar/components/power-calendar-range';
import type { NormalizeRangeActionValue } from 'ember-power-calendar/utils';
import type { DateRange } from 'ember-todo/services/selected-date';

interface RangeDatepickerSignature {
  Args: {
    onSelect: (range: DateRange) => void;
    selected: DateRange;
    renderInPlace: boolean;
  };
  Element: HTMLElement;
}

export default class RangeDatepicker extends Component<RangeDatepickerSignature> {
  @tracked center: Date | undefined;

  @action
  selectDateRange(range: NormalizeRangeActionValue): void {
    this.args.onSelect({
      start: range.date.start ?? new Date(),
      end: range.date.end ?? new Date(),
    });
  }

  @action
  updateCenter({ date }: { date: Date | undefined }) {
    this.center = date ?? new Date();
  }

  <template>
    <PowerCalendarRange
      @center={{this.center}}
      @onCenterChange={{this.updateCenter}}
      @onSelect={{this.selectDateRange}}
      @selected={{@selected}}
      @renderInPlace={{@renderInPlace}}
      ...attributes
    />
  </template>
}
