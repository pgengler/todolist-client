import ApplicationSerializer from './application';

export default class TaskSerializer extends ApplicationSerializer {
  attrs = {
    dueDate: { serialize: false },
  };
}
