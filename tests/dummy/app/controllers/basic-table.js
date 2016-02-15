import Ember from 'ember';
import ColumnDefinition from 'ember-cli-datatables/components/column-definition';

export default Ember.Controller.extend({
  columns: Ember.computed(function() {
    var codeColumn = ColumnDefinition.create({
      columnName: 'Code',
      contentPath: 'code',
      width: '200px'
    });
    var nameColumn = ColumnDefinition.create({
      columnName: 'Name',
      contentPath: 'name',
      width: '300px'
    });
    return [codeColumn, nameColumn];
  })
});
