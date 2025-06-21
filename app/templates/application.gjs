import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { format } from 'date-fns';
import TopNav from '../components/top-nav';

export default class extends Component {
  @service router;
  @service selectedDate;
  @service session;

  @action
  changeDate(date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    this.router.transitionTo('days', { queryParams: { date: dateStr } });
  }

  @action
  logout(event) {
    event.preventDefault();
    this.session.invalidate();
    this.router.transitionTo('login');
  }

  <template>
    <div class="page-wrapper">
      {{#if this.session.isAuthenticated}}
        <TopNav @selectedDate={{this.selectedDate}} @changeDate={{this.changeDate}} @logout={{this.logout}} />
      {{/if}}

      {{outlet}}
    </div>
  </template>
}
