import Application from '../../app';
import config from '../../config/environment';
import { merge } from '@ember/polyfills';
import { run } from '@ember/runloop';

import './drag-and-drop';
import './qunit-assertions';
import keyboardRegisterTestHelpers from './ember-keyboard/register-test-helpers';
import registerPowerDatepickerHelpers from '../../tests/helpers/ember-power-datepicker';

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    keyboardRegisterTestHelpers();
    registerPowerDatepickerHelpers();
    application.injectTestHelpers();
    return application;
  });
}
