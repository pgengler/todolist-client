import showDialogOnInsert from '../modifiers/show-dialog-on-insert';
import EditTaskForm from './edit-task-form';
import type Task from 'ember-todo/models/task';
import type { TOC } from '@ember/component/template-only';

interface EditTaskModalSignature {
  Args: {
    onClose: () => void;
    task: Task;
  };
}

export default <template>
  <dialog class="edit-task-dialog" {{showDialogOnInsert onClose=@onClose}} data-test-edit-task-dialog>
    <h1>Edit task</h1>
    <EditTaskForm @cancel={{@onClose}} @onTaskDeleted={{@onClose}} @onTaskSaved={{@onClose}} @task={{@task}} />
  </dialog>
</template> satisfies TOC<EditTaskModalSignature>;
