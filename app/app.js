import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'ember-todo/config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import { registerDateLibrary } from 'ember-power-calendar';
import DateUtils from 'ember-power-calendar-date-fns';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

registerDateLibrary(DateUtils);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
registerDateLibrary(DateUtils);
