import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { generateColumns, generateColumnDefinitions } from '../../helpers/table-builder';
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

  assert.equal(this.$('.dataTables_scrollBody table.dataTable thead th').length, 2);
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

test('it renders table with custom cell render function', function(assert) {
  var columns = generateColumnDefinitions(['Code', 'Name']);
  var data = [];
  
  // Customize cell render
  columns[0].getCellContent = function() {
    return "Custom render 1";
  };
  columns[1].getCellContent = function() {
    return "Custom render 2";
  };

  data.push(Ember.Object.create(server.create('contact')));
  data.push(Ember.Object.create(server.create('contact')));

  this.set('columns', columns);
  this.set('data', data);

  this.render(hbs`{{ember-datatables columns=columns data=data}}`);

  assert.equal(this.$(this.$('table.dataTable tbody td')[0]).text().trim(), "Custom render 1");
  assert.equal(this.$(this.$('table.dataTable tbody td')[1]).text().trim(), "Custom render 2");
});

