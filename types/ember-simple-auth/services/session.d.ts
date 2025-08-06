import Service from '@ember/service';

export default class SessionService extends Service {
  invalidate(): void;
  setup(): void;

  isAuthenticated: boolean;
}
