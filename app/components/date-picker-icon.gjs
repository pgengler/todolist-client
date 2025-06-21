import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import moment from 'moment';
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import { on } from "@ember/modifier";
import RangeDatepicker from "./range-datepicker.gjs";

export default class DatePickerIcon extends Component {<template><div>
  <FaIcon @icon="calendar-alt" @prefix="far" {{on "click" this.toggleCalendar}} ...attributes />
  {{#if this.showingCalendar}}
    <RangeDatepicker @onSelect={{this.changeDate}} @selected={{@dateRange}} @renderInPlace={{true}} class="date-picker-content" />
  {{/if}}
</div></template>
  @tracked showingCalendar = false;

  @action
  changeDate(newDate) {
    let date = moment(newDate.moment.start).format('YYYY-MM-DD');
    this.args.dateSelected(date);
    this.showingCalendar = false;
  }

  @action
  toggleCalendar() {
    this.showingCalendar = !this.showingCalendar;
  }
}
