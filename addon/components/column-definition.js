import Ember from 'ember';

export default Ember.Object.extend({

  // Name displayed in the header
  columnName: undefined,

  // Path of the content for this cell
  contentPath: undefined,

  // Get options for Datatable column definition
  getColumnDefinition: function() {
    return {
      title: this.get('columnName'),
      contentPath: this.get('contentPath')
    };
  }

});
