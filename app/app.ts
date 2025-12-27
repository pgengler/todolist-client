import Application from '@ember/application';
import compatModules from '@embroider/virtual/compat-modules';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'ember-todo/config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import { registerDateLibrary } from 'ember-power-calendar';
import DateUtils from 'ember-power-calendar-date-fns';
import setupInspector from '@embroider/legacy-inspector-support/ember-source-4.12';
import '@warp-drive/ember/install';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

registerDateLibrary(DateUtils);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
  inspector = setupInspector(this);
}

loadInitializers(App, config.modulePrefix, compatModules);
registerDateLibrary(DateUtils);
