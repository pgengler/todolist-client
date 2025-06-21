<TaskList
  @headerComponent={{component "day-tasks/header"}}
  @list={{@list}}
  @editingEnd={{@editingEnd}}
  @editingStart={{@editingStart}}
  class="{{if this.isPast 'past'}}
    {{if this.isCurrent 'current'}}
    {{if this.isFuture 'future'}}"
  data-test-date={{this.formattedDate}}
/>