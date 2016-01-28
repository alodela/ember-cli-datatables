import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { generateColumns } from '../../helpers/table-builder';
import startMirage from '../../helpers/setup-mirage-for-integration';

// var App;
// var store;

moduleForComponent('ember-datatables', 'Integration | Component | ember datatables', {
  integration: true,
  setup: function() {
    startMirage(this.container);
    // store = this.container.lookup('service:store');
  }
});

test('it renders basic table', function(assert) {
  this.set('columns', generateColumns(['Code', 'Name']));

  this.render(hbs`{{ember-datatables columns=columns}}`);

  assert.equal(this.$('div.dataTables_scrollHead table.dataTable thead th').length, 2);
});

test('it renders records from array', function(assert) {
  this.set('columns', generateColumns(['Code', 'Name']));
  this.set('data', server.createList('contact', 2));

  this.render(hbs`{{ember-datatables columns=columns data=data}}`);

  assert.equal(this.$('table.dataTable tbody tr').length, 2);
});

test('it renders records from promise', function(assert) {
  var store = {
    findAll: function() {
      return new Ember.RSVP.Promise(function(resolve) {
        resolve(server.createList('contact', 10));
      });
    }
  };
  
  this.set('columns', generateColumns(['Code', 'Name']));
  this.set('data', store.findAll('contact'));

  this.render(hbs`{{ember-datatables columns=columns data=data}}`);

  assert.equal(this.$('table.dataTable tbody tr').length, 10);
});

/*test('it renders', function(assert) {*/
  
  //// Set any properties with this.set('myProperty', 'value');
  //// Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  //this.render(hbs`{{ember-datatables}}`);

  //assert.equal(this.$().text().trim(), '');

  //// Template block usage:" + EOL +
  //this.render(hbs`
    //{{#ember-datatables}}
      //template block text
    //{{/ember-datatables}}
  //`);

  //assert.equal(this.$().text().trim(), 'template block text');
/*});*/