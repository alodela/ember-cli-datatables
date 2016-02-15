/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-datatables',

  included: function(app) {
    app.import('app/styles/ember-datatables.css');

    this._super.included(app);
    
    app.import(app.bowerDirectory + '/datatables.net/js/jquery.dataTables.min.js');
    app.import(app.bowerDirectory + '/datatables.net-bs/css/dataTables.bootstrap.min.css');
    app.import(app.bowerDirectory + '/datatables.net-bs/js/dataTables.bootstrap.min.js');
    app.import(app.bowerDirectory + '/datatables.net-fixedheader/js/dataTables.fixedHeader.min.js');
    app.import(app.bowerDirectory + '/datatables.net-fixedheader-bs/css/fixedHeader.bootstrap.min.css');
    app.import(app.bowerDirectory + '/datatables-keytable/js/dataTables.keyTable.js');
  }
};
