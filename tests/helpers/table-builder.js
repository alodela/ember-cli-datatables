import Ember from 'ember';

function generateColumns(columnNames) {
  return Ember.A(Ember.A(columnNames).map(columnName => { 
    return { title: columnName, data: columnName.toLowerCase() }; 
  }));
}

export { generateColumns };
