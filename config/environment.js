'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'ember-todo',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    emberKeyboard: {
      listeners: ['keyUp', 'keyDown', 'keyPress'],
    },

    flashMessageDefaults: {
      injectionFactories: [],
      preventDuplicates: true,
      types: ['success', 'error'],
    },

    showdown: {
      excludeTrailingPunctuationFromURLs: true,
      literalMidWordAsterisks: true,
      literalMidWordUnderscores: true,
      simplifiedAutoLink: true,
      strikethrough: true,
    },

    mirageLogging: typeof process.env.MIRAGE_LOGGING !== 'undefined' ? !!process.env.MIRAGE_LOGGING : false,
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['ember-cli-mirage'] = {
      enabled: !!process.env.MIRAGE_ENABLED,
    };
    ENV.mirageLogging = typeof process.env.MIRAGE_LOGGING !== 'undefined' ? !!process.env.MIRAGE_LOGGING : true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    if (typeof process.env.MIRAGE_LOGGING !== 'undefined') {
      ENV.mirageLogging = !!process.env.MIRAGE_LOGGING;
    } else {
      ENV.mirageLogging = process.env.CI ? false : true;
    }
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
