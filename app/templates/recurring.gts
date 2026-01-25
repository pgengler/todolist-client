import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import type Store from '@ember-data/store';
import RecurrenceEditor from 'ember-todo/components/recurrence-editor';
import type RecurrenceRule from 'ember-todo/models/recurrence-rule';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';

function formatDate(date: Date | null): string {
  if (!date) return '-';
  return date.toLocaleDateString();
}

interface RecurringSignature {
  Args: {
    model: RecurrenceRule[];
  };
}

export default class RecurringTemplate extends Component<RecurringSignature> {
  @service declare store: Store;

  @tracked isCreating = false;
  @tracked editingRule: RecurrenceRule | null = null;

  @action
  startCreating() {
    this.isCreating = true;
    this.editingRule = null;
  }

  @action
  startEditing(rule: RecurrenceRule) {
    this.editingRule = rule;
    this.isCreating = false;
  }

  @action
  cancelEdit() {
    this.isCreating = false;
    this.editingRule = null;
  }

  @action
  onSave() {
    this.isCreating = false;
    this.editingRule = null;
  }

  @action
  async deleteRule(rule: RecurrenceRule) {
    if (confirm(`Delete recurring task "${rule.description}"? This will not affect existing task instances.`)) {
      await rule.destroyRecord();
    }
  }

  <template>
    <div class="recurring-tasks">
      <header class="recurring-tasks-header">
        <h1>Recurring Tasks</h1>
        <button type="button" class="btn btn-primary" {{on "click" this.startCreating}}>
          <FaIcon @icon="plus" />
          New Recurring Task
        </button>
      </header>

      {{#if this.isCreating}}
        <div class="recurrence-editor-container">
          <h2>Create Recurring Task</h2>
          <RecurrenceEditor @onSave={{this.onSave}} @onCancel={{this.cancelEdit}} />
        </div>
      {{else if this.editingRule}}
        <div class="recurrence-editor-container">
          <h2>Edit Recurring Task</h2>
          <RecurrenceEditor @rule={{this.editingRule}} @onSave={{this.onSave}} @onCancel={{this.cancelEdit}} />
        </div>
      {{else}}
        <div class="recurring-tasks-list">
          {{#if @model.length}}
            <table class="recurring-tasks-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Schedule</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Instances</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {{#each @model as |rule|}}
                  <tr>
                    <td>{{rule.description}}</td>
                    <td>{{rule.humanReadableSchedule}}</td>
                    <td>{{formatDate rule.startDate}}</td>
                    <td>{{formatDate rule.endDate}}</td>
                    <td>
                      {{rule.instancesCreated}}
                      {{#if rule.maxInstances}}
                        /
                        {{rule.maxInstances}}
                      {{/if}}
                    </td>
                    <td class="actions">
                      <button type="button" class="btn btn-sm" title="Edit" {{on "click" (fn this.startEditing rule)}}>
                        <FaIcon @icon="pencil" />
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        title="Delete"
                        {{on "click" (fn this.deleteRule rule)}}
                      >
                        <FaIcon @icon="trash" />
                      </button>
                    </td>
                  </tr>
                {{/each}}
              </tbody>
            </table>
          {{else}}
            <p class="empty-state">
              No recurring tasks configured. Click "New Recurring Task" to create one.
            </p>
          {{/if}}
        </div>
      {{/if}}
    </div>
  </template>
}
