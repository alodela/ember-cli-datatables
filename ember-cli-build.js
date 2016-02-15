/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */
  app.import(app.bowerDirectory + '/datatables.net/js/jquery.dataTables.min.js');
  app.import(app.bowerDirectory + '/datatables.net-bs/css/dataTables.bootstrap.min.css');
  app.import(app.bowerDirectory + '/datatables.net-bs/js/dataTables.bootstrap.min.js');
  app.import(app.bowerDirectory + '/datatables-keytable/js/dataTables.keyTable.js');

  // app.import(app.bowerDirectory + '/datatables.net-scroller/js/dataTables.scroller.min.js');
  // app.import(app.bowerDirectory + '/datatables.net-scroller-bs/css/scroller.bootstrap.min.css');

  return app.toTree();
};
