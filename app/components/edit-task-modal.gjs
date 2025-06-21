import showDialogOnInsert from '../modifiers/show-dialog-on-insert.js';
import EditTaskForm from './edit-task-form.js';

<template>
  <dialog class="edit-task-dialog" {{showDialogOnInsert onClose=@onClose}} data-test-edit-task-dialog>
    <h1>Edit task</h1>
    <EditTaskForm @cancel={{@onClose}} @onTaskDeleted={{@onClose}} @onTaskSaved={{@onClose}} @task={{@task}} />
  </dialog>
</template>
