import ApplicationAdapter from './application';

export default class TaskAdapter extends ApplicationAdapter {
  private getTaskUrl(id: string, action: string): string {
    return `/${this.namespace}/tasks/${id}/${action}`;
  }

  async skip(id: string): Promise<Response> {
    const url = this.getTaskUrl(id, 'skip');
    return fetch(url, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/vnd.api+json',
      },
    });
  }

  async modifyInstance(
    id: string,
    attributes: { description?: string; notes?: string },
  ): Promise<Response> {
    const url = this.getTaskUrl(id, 'modify_instance');
    return fetch(url, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          attributes,
        },
      }),
    });
  }

  async updateThisAndFuture(
    id: string,
    attributes: { description?: string; notes?: string },
  ): Promise<Response> {
    const url = this.getTaskUrl(id, 'update_this_and_future');
    return fetch(url, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          attributes,
        },
      }),
    });
  }

  async deleteThisAndFuture(id: string): Promise<Response> {
    const url = this.getTaskUrl(id, 'delete_this_and_future');
    return fetch(url, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/vnd.api+json',
      },
    });
  }
}
