/*jshint node:true*/
module.exports = {
  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall: function() {
    return this.addBowerPackagesToProject([
    	{ name: 'datatables.net', target: '~1.10.10' }, 
    	{ name: 'datatables.net-bs', target: '~1.10.10' },
      { name: 'datatables.net-fixedheader', target: '~3.1.0' },
      { name: 'datatables.net-fixedheader-bs', target: '~3.1.0' },
      { name: 'datatables-keytable', target: '~2.1.0' }
      // { name: 'datatables.net-scroller', target: '~1.4.0' },
      // { name: 'datatables.net-scroller-bs', target: '~1.4.0' }
	  ]);
  }
};
