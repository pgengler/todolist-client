/* global self */
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    {
      handler: 'silence',
      matchMessage: /A value was injected implicitly on the 'store' property of an instance of <ember-todo@session:main::(.+?)>/,
    },
    {
      handler: 'silence',
      matchMessage: /A value was injected implicitly on the 'session' property of an instance of <ember-todo@service:session::(.+?)>/,
    },
    {
      handler: 'silence',
      matchMessage: /A value was injected implicitly on the 'destinationElementId' property of an instance of <ember-todo@service:modal-dialog::(.+?)>, overwriting the original value which was null./,
    },
    { handler: 'silence', matchId: 'ember-metal.get-with-default' },
    { handler: 'silence', matchId: 'manager-capabilities.modifiers-3-13' },
    { handler: 'silence', matchId: 'this-property-fallback' },
    { handler: 'silence', matchId: 'routing.transition-methods' },
  ],
};
