import type Model from '@ember-data/model';

declare module '@mainmatter/ember-api-actions' {
  type HttpVerb = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH';

  interface ApiActionOptions {
    adapterOptions?: Record<string, unknown>;
    data?: Record<string, unknown>;
    path: string;
    method: HttpVerb;
    requestType?: string;
  }

  export async function apiAction(record: Model, options: ApiActionOptions): Promise<unknown>;
}
