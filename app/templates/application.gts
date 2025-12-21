import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { format } from 'date-fns';
import { pageTitle } from 'ember-page-title';
import TopNav from 'ember-todo/components/top-nav';
import type RouterService from '@ember/routing/router-service';
import type SelectedDateService from 'ember-todo/services/selected-date';
import type SessionService from 'ember-simple-auth/services/session';

export default class extends Component {
  @service declare router: RouterService;
  @service declare selectedDate: SelectedDateService;
  @service declare session: SessionService;

  @action
  changeDate(date: Date): void {
    const dateStr = format(date, 'yyyy-MM-dd');
    this.router.transitionTo('days', { queryParams: { date: dateStr } });
  }

  @action
  logout(event: Event): void {
    event.preventDefault();
    this.session.invalidate();
    this.router.transitionTo('login');
  }

  <template>
    {{pageTitle "Todo"}}

    <div class="page-wrapper">
      {{#if this.session.isAuthenticated}}
        <TopNav @selectedDate={{this.selectedDate}} @changeDate={{this.changeDate}} @logout={{this.logout}} />
      {{/if}}

      {{outlet}}
    </div>
  </template>
}
