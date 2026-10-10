import showDialogOnInsert from '../modifiers/show-dialog-on-insert';
import NewTaskForm from './new-task-form';

import type { TOC } from '@ember/component/template-only';

interface NewTaskModalSignature {
  Args: {
    onClose: () => void;
  };
}

const modalContainer = (): HTMLElement => document.getElementById('modal-container')!;

export default <template>
  {{#in-element (modalContainer) insertBefore=null}}
    <dialog class="new-task-dialog" {{showDialogOnInsert onClose=@onClose}}>
      <h1>Add new task</h1>
      <NewTaskForm @cancel={{@onClose}} @onTaskCreated={{@onClose}} />
    </dialog>
  {{/in-element}}
</template> satisfies TOC<NewTaskModalSignature>;
