import Service from '@ember/service';
import Transition from '@ember/routing/transition';

export default class SessionService extends Service {
  authenticate(authenticator: string, email: string | null, password: string | null): Promise<void>;
  invalidate(): void;
  requireAuthentication(transition: Transition, routeName: string): void;
  setup(): void;

  isAuthenticated: boolean;
}
