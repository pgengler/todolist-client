<template>
  <div class="task-list-header" ...attributes>
    {{#if (has-block)}}
      {{yield @list}}
    {{else}}
      <h1>{{@list.name}}</h1>
    {{/if}}
  </div>
</template>
