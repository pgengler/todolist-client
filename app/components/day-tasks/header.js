import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default class extends Component {
  tagName = '';

  @computed('list.name')
  get date() {
    return moment(this.get('list.name'));
  }

  @computed('date')
  get dayOfWeek() {
    return this.date.format('dddd');
  }

  @computed('date')
  get formattedDate() {
    return this.date.format('MMM D, YYYY');
  }
}
