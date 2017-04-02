import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

import './drag-and-drop';
import './qunit-assertions';
import keyboardRegisterTestHelpers from './ember-keyboard/register-test-helpers';
import registerPowerDatepickerHelpers from '../../tests/helpers/ember-power-datepicker';

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    keyboardRegisterTestHelpers();
    registerPowerDatepickerHelpers();
    application.injectTestHelpers();
  });

  return application;
}
