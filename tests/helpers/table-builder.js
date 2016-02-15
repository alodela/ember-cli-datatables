import Ember from 'ember';
import ColumnDefinition from 'ember-cli-datatables/components/column-definition';

function generateColumns(columnNames) {
  return Ember.A(Ember.A(columnNames).map(columnName => { 
    return { title: columnName, data: columnName.toLowerCase() }; 
  }));
}

function generateColumnDefinitions(columnNames) {
  return Ember.A(Ember.A(columnNames).map(columnName => { 
    return ColumnDefinition.create({ columnName: columnName, contentPath: columnName.toLowerCase() }); 
  }));
}

export { generateColumns, generateColumnDefinitions };
