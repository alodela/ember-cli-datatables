import Ember from 'ember';
import layout from '../templates/components/ember-datatables';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'table',
  classNames: ['table', 'table-striped', 'table-bordered'],

  columns: [],  
  searching: false,
  ordering: false,
  data: null,
  scrollY: 200,

  // _resolvedContent is an intermediate property between content and rows
  // This allows content to be a plain array or a promise resolving to an array
  _resolvedData: Ember.computed('data', {
    get: function() {
      var _this = this;
      var value = [];

      var data = this.get('data');
      if (data && data.then)
      {
        // content is a promise
        data.then(function(resolvedData) {
          // when the promise resolves, set this property so it gets cached
          _this.set('_resolvedData', resolvedData);

          // if the promise resolves immediately, set `value` so we return
          // the resolved value and not []
          value = resolvedData;
        });

        // returns [] if the promise doesn't resolve immediately, or
        // the resolved value if it's ready
        return value;
      }
      else
      {
        // content is not a promise
        return data;
      }
    }
  }),

  resolvedDataChanged: Ember.observer('_resolvedData', function() {
    this.$().DataTable().draw();
  }),

  dataSource: function() {
    var _this = this;

    return function( data, callback ) {
      var resolvedData = Ember.A(_this.get('_resolvedData') || []);

      // Get DS.Model array if DS.RecordArray is received
      if (typeof resolvedData.toArray === 'function') {
        resolvedData = resolvedData.toArray();
      }

      callback({
        draw: data.draw,
        data: resolvedData,
        recordsTotal: resolvedData.get('length'),
        recordsFiltered: resolvedData.get('length')
      });
    };
  },

  didInsertElement: function() {
    var columns = this.get('columns') || Ember.A();
    var columnsDefinition = [];
    
    columns.forEach(function(col) {
      if (typeof col.getColumnDefinition === 'function') {
        columnsDefinition.push(col.getColumnDefinition());
      } else {
        columnsDefinition.push(col);
      }
    });

    this.$().DataTable({
      columns: columnsDefinition,
      "columnDefs": [{
        "targets": "_all",
        "data": function ( row, type, val, meta ) {
          // if (type == 'display') {
          return row.get(meta.settings.aoColumns[meta.col].contentPath);
          // }
        }
      }],
      ajax: this.dataSource(),
      serverSide: true,
      searching: this.get('searching'),
      ordering: this.get('ordering'),
      paging: true,
      scroller: true,
      scrollY: this.get('scrollY'),
      lengthChange: false
    });
  }
});
