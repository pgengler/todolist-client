<TaskForm
  @cancel={{@cancel}}
  @save={{this.save}}
  @saveButtonLabel="Save"
  @task={{@task}}
>
  <:footer>
    <div class="button-footer">
      <button
        type="button"
        {{on "click" this.deleteTask}}
        data-test-delete-task
      >
        Delete
      </button>
    </div>
  </:footer>
</TaskForm>