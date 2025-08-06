import Service from '@ember/service';
import Transition from '@ember/routing/transition';

export default class SessionService extends Service {
  invalidate(): void;
  requireAuthentication(transition: Transition, routeName: string): void;
  setup(): void;

  isAuthenticated: boolean;
}
