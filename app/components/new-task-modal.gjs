import showDialogOnInsert from "../modifiers/show-dialog-on-insert.js";
import NewTaskForm from "./new-task-form.js";
<template><dialog class="new-task-dialog" {{showDialogOnInsert onClose=@onClose}}>
  <h1>Add new task</h1>
  <NewTaskForm @cancel={{@onClose}} @onTaskCreated={{@onClose}} />
</dialog></template>