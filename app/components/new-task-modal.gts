import showDialogOnInsert from '../modifiers/show-dialog-on-insert';
import NewTaskForm from './new-task-form';

import type { TOC } from '@ember/component/template-only';

interface NewTaskModalSignature {
  Args: {
    onClose: () => void;
  };
}

export default <template>
  <dialog class="new-task-dialog" {{showDialogOnInsert onClose=@onClose}}>
    <h1>Add new task</h1>
    <NewTaskForm @cancel={{@onClose}} @onTaskCreated={{@onClose}} />
  </dialog>
</template> satisfies TOC<NewTaskModalSignature>;
