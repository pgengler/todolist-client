/* global self */
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  throwOnUnhandled: true,
  workflow: [
    // ember-data:deprecate-early-static is happening because of ember-cli-mirage
    { handler: 'silence', matchId: 'ember-data:deprecate-early-static' },
  ],
};
