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
    {
      handler: 'silence',
      matchMessage: /The `html` property was used in a template for the `ember-cli-showdown\/templates\/components\/markdown-to-html.hbs` component without using `this`./,
    },
    {
      handler: 'silence',
      matchMessage: /The `(.+?)` property path was used in a template for the `ember-modal-dialog\/templates\/components\/modal-dialog.hbs` component without using `this`./,
    },
    {
      handler: 'silence',
      matchMessage: /The `(.+?)` property (path )?was used in (a|the) template for the `ember-modal-dialog\/templates\/components\/basic-dialog.hbs` component without using `this`./,
    },
    {
      handler: 'silence',
      matchMessage: /The `(.+?)` property path was used in a template for the `ember-wormhole\/templates\/components\/ember-wormhole.hbs` component without using `this`./,
    },
    {
      handler: 'silence',
      matchMessage: /The `(.+?)` property path was used in a template for the `ember-power-calendar\/templates\/components\/power-calendar\/nav.hbs` component without using `this`/,
    },
    { handler: 'silence', matchId: 'manager-capabilities.modifiers-3-13' },
  ],
};
