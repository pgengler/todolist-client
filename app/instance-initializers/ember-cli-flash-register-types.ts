import type ApplicationInstance from '@ember/application/instance';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';

export function initialize(instance: ApplicationInstance) {
  const flashMessagesService = <FlashMessagesService>instance.lookup('service:flash-messages')!;
  flashMessagesService.registerTypes(['alert']);
}

export default {
  initialize
};
