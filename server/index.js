// To use it create some files under `mocks/`
// e.g. `server/mocks/ember-hamsters.js`
//
// module.exports = function(app) {
//   app.get('/ember-hamsters', function(req, res) {
//     res.send('hello');
//   });
// };

module.exports = function(app) {
  let globSync = require('glob').sync;
  let proxies = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require);

  // Log proxy requests
  let morgan = require('morgan');
  app.use(morgan('dev'));

  proxies.forEach((route) => route(app));
};
