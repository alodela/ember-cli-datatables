import Ember from 'ember';

export default Ember.Object.extend({

  // Name displayed in the header
  columnName: undefined,

  // Path of the content for this cell
  contentPath: undefined,

  render: undefined,

  // Override to use a custom view for table cells.
	tableCellViewClass: 'table-cell',

  width: '100px',

  // Get options for Datatable column definition
  getColumnDefinition: function() {
    return {
      title: this.get('columnName'),
      contentPath: this.get('contentPath'),
      width: this.get('width'),
      className: this.get('className')
    };
  },

  // Override to customize column get data from each object.
  getCellContent: function(row) {
    var path = this.get('contentPath');
    Ember.assert("You must either provide a contentPath or override " +
                 "getCellContent in your column definition", path != null);
    return Ember.get(row, path);
  },

  // Override to update row object value
  // Recommended to make this a function which takes (row, value) and updates
  // the row value.
  setCellContent: Ember.K

});
