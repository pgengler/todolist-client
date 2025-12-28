'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');
  const { setConfig } = await import('@warp-drive/build-config');

  let app = new EmberApp(defaults, {
    'ember-simple-auth': {
      useSessionSetupMethod: true,
    },
  });

  setConfig(app, __dirname, {
    deprecations: {
      DEPRECATE_TRACKING_PACKAGE: false,
    },
  });

  return compatBuild(app, buildOnce, {
    staticAppPaths: ['mirage']
  });
};
