import Ember from 'ember';
import layout from '../templates/components/ember-datatables';

export default Ember.Component.extend(Ember.Evented, {
  layout: layout,
  tagName: 'table',
  classNames: ['table', 'table-striped', 'table-bordered'],
  attributeBindings: ['tabIndex'],

  table: null,
  fixedHeader: null,
  columns: [],  
  cells: [],
  searching: false,
  ordering: false,
  data: null,
  scrollY: false,
  autoWidth: true,
  headerOffset: 0,
  paging: false,
  autofocus: false,

  dataTablesColumnDefs: Ember.A(),
  dataTablesColumns: Ember.K,

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

  resolvedDataChanged: Ember.observer('_resolvedData.[]', function() {
    // Ember.run.once(this, 'redraw');
    Ember.run.scheduleOnce('afterRender', this, 'redraw');
  }),

  redraw: function() {
    var scrollPos = Ember.$(window).scrollTop();
    var table = this.get('table')
    var header = table.fixedHeader;

    this.removeAllChildren(); 
    this.$().DataTable().draw();

    var _this = this;

    setTimeout(function() {
      Ember.$(window).scrollTop(scrollPos);
      header.adjust();
      _this.selectRow(_this.$().find('tbody tr:first-child'));
      if (_this.get('autofocus')) {
        table.cell(':eq(0)').focus();
      }
    }, 500);
  },

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

  willInsertElement: function() {
    var columns = this.get('columns') || Ember.A();
    var columnsDefinition = Ember.A();
    var columnDefs = Ember.A();

    this.set('cells', Ember.A());
    var _this = this;
    
    columns.forEach(function(col, idx) {
      if (typeof col.getColumnDefinition === 'function') {
        columnsDefinition.push(col.getColumnDefinition());

        columnDefs.push({
          targets: idx,
          createdCell: function( cell, cellData, rowData ) {
            var view = col.getCellView(_this, rowData);
            if (view) {
              view.appendTo(_this.$(cell));
            }
            return "";
          },  
          data: function (row) {
            return col.getCellContent(row);
          }
        });
      } else {
        columnsDefinition.push(col);
      }
    });

    this.set('dataTablesColumns', columnsDefinition);
    this.set('dataTablesColumnDefs', columnDefs);
  },

  didInsertElement: function() {
    var columnsDefinition = this.get('dataTablesColumns');
    var customDefs = this.get('dataTablesColumnDefs');

    // Bind events
    if (this.get('notifier')) {
      this.get('notifier').on('resize', this, 'onResize');
    }

    var table = this.$().DataTable({
      ajax: this.dataSource(),
      autoWidth: this.get('autoWidth'),
      columnDefs: customDefs,
      columns: columnsDefinition,
      fixedHeader: {
        headerOffset: this.get('headerOffset')
      },
      info: false,
      lengthChange: false,
      ordering: this.get('ordering'),
      paging: this.get('paging'),
      searching: this.get('searching'),
      serverSide: true,
      scrollY: this.get('scrollY'),
      deferRender: true,
      keys: true,
      language: {
        emptyTable: "No hay información disponible"
      }
    });

    var _this = this;

    table
      .on('key-focus', function(e, datatable, cell) {
        _this.selectRow(Ember.$(datatable.row(cell.index().row).node()));
      })
      .on('key', function(e, datatable, key, cell, originalEvent) {
        _this.move(key);
      })


    this.$().on('click', 'tbody tr', function(evt) {
      _this.selectRow(Ember.$(evt.currentTarget));
    });

    this.set('table', table);
  },

  willDestroyElement: function() {
    var table = this.get('table');

    if (this.get('notifier')) {
      this.get('notifier').off('resize', this, 'onResize');
    }

    table.off('key');
    table.off('key-focus');

    table.destroy();
  },

  prevRow: function() {
    this.move('up');
  },

  nextRow: function() {
    this.move('down');
  },

  move: function(key) {
    var selected      = this.getSelectedRow();
    var tbody         = this.$().find('tbody');
    var row           = null;

    switch(key) {
      case 'up':
        row = selected.prev();
        if (row.length === 0) {
          row = tbody.find('tr:last-child');
        }
        this.selectRow(row);
        break;
      case 'down':
        row = selected.next();
        if (row.length === 0) {
          row = tbody.find('tr:first-child');
        }
        this.selectRow(row);
        break;
      case 13:
        this.sendAction('enter');
        break;
    }
  },

  getSelectedRow: function() {
    return this.$().find('tr.selected:first');
  },

  selectRow: function(row) {
    var selected = this.getSelectedRow();
    if (selected) { selected.removeClass('selected'); }

    if (row) {
      this._selectedRow = selected = row;
      if (selected) {
        selected.addClass('selected');
        var selectedData = this.$().DataTable().row(row).data();
        
        this.sendAction('select', selectedData);
      }
    }   
  },

  onResize: function() {
    // this.redraw(false);
  }
});