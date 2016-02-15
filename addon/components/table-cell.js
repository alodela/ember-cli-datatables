import Ember from 'ember';
import layout from '../templates/components/table-cell';

export default Ember.Component.extend({
  layout: layout,

  row: null,
  column: null,

  init: function() {
    this._super();
    this.contentPathDidChange();
    this.contentDidChange();
  },

  contentDidChange: function() {
    this.notifyPropertyChange('cellContent');
  },

  contentPathWillChange: Ember.beforeObserver(function() {
    var contentPath = this.get('column.contentPath');
    if (contentPath) {
      this.removeObserver("row." + contentPath, this,
          this.contentDidChange);
    }
  }, 'column.contentPath'),

  contentPathDidChange: Ember.beforeObserver(function() {
    var contentPath = this.get('column.contentPath');
    if (contentPath) {
      this.addObserver("row." + contentPath, this,
          this.contentDidChange);
    }
  }, 'column.contentPath'),

  cellContent: Ember.computed('row.isLoaded', 'column', {
    get() {
      var row = this.get('row');
      var column = this.get('column');
      if (!row || !column) {
        return;
      }
      return column.getCellContent(row);
    },
    set(key, value) {
      var row = this.get('row');
      var column = this.get('column');
      if (!row || !column) {
        return;
      }
      column.setCellContent(row, value);
      return value;
    }
  })

  // didInsertElement: function() {
  //   Ember.run.scheduleOnce('afterRender', this, function () {
  //     this.$(window).resize();
  //   });
  // }
});
