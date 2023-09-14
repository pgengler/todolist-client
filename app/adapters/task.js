import ApplicationAdapter from './application';

export default class TaskAdapter extends ApplicationAdapter {
  urlForFindRecord(id, modelName, snapshot) {
    let url = super.urlForFindRecord(id, modelName, snapshot);
    url += '?include=list'
    return url;
  }

  urlForUpdateRecord(id, modelName, snapshot) {
    let url = super.urlForUpdateRecord(id, modelName, snapshot);
    url += '?include=list'
    return url;
  }
}
