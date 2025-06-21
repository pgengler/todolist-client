import TopNav from '../components/top-nav';

<template>
  <div class="page-wrapper">
    {{#if @controller.session.isAuthenticated}}
      <TopNav
        @selectedDate={{@controller.selectedDate}}
        @changeDate={{@controller.changeDate}}
        @logout={{@controller.logout}}
      />
    {{/if}}

    {{outlet}}
  </div>
</template>
