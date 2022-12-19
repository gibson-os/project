Ext.define('GibsonOS.module.rdm.index.Grid', {
    extend: 'GibsonOS.grid.Panel',
    alias: ['widget.gosModuleRdmIndexGrid'],
    viewConfig: {
        loadMask: false
    },
    features: [{
        ftype: 'gosGridFeatureGrouping',
        startCollapsed: false
    }],
    multiSelect: true,
    initComponent: function() {
        var grid = this;

        this.itemId = 'rdmIndexGrid' + this.gos.data.type;
        this.store = new GibsonOS.module.rdm.index.store.Grid({
            gos: {
                data: this.gos.data
            },
            listeners: {
                load: function(store, records, successful, operation, options) {
                    var app = grid.up('#app');
                    var autoRefresh = store.getProxy().getReader().jsonData.auto_refresh;
                    var speed = store.getProxy().getReader().jsonData.speed;
                    var btnRefresh = app.down('#rdmIndexRefreshButton');

                    if (btnRefresh) {
                        if (autoRefresh == 1) {
                            btnRefresh.toggle(true);
                        } else {
                            btnRefresh.toggle(false);
                        }
                    }

                    if (speed > 0) {
                        var speedText = transformSize(speed);

                        app.setTitle('Remote Download Manager (' + speedText + '/s)');
                        app.taskBarButton.setText('Remote Download Manager (' + speedText + '/s)');

                        //var content = statusFrame.innerHTML;
                        //content = '<div class="rdm_index_status_bar" style="background-position: 0px ' + result + 'px;" title="' + speedText + '/s"></div>' + content;
                    } else {
                        app.setTitle('Remote Download Manager');
                        app.taskBarButton.setText('Remote Download Manager');
                    }
                }
            }
        });
        this.columns = [{
            header: 'Name',
            dataIndex: 'name',
            flex: 1
        },{
            header: 'Größe',
            dataIndex: 'size',
            align: 'right',
            renderer: function(value) {
                return transformSize(value);
            }
        },{
            header: 'Übertragen',
            dataIndex: 'downloaded',
            align: 'right',
            renderer: function(value) {
                return transformSize(value);
            }
        },{
            header: 'Fortschritt',
            xtype: 'gosGridColumnProgressBar'
        },{
            header: 'Dauer',
            dataIndex: 'elapsed',
            align: 'right',
            renderer: function(value) {
                var date = new Date(((23 * 60 * 60) + value) * 1000);
                return Ext.Date.format(date, 'H:i:s');
            }
        },{
            header: 'Übrig',
            dataIndex: 'remaining',
            align: 'right',
            renderer: function(value) {
                var date = new Date(((23 * 60 * 60) + value) * 1000);
                return Ext.Date.format(date, 'H:i:s');
            }
        },{
            header: 'Geschwindigkeit',
            dataIndex: 'speed',
            align: 'right',
            renderer: function(value) {
                return transformSize(value) + '/s';
            }
        },{
            header: 'URL',
            dataIndex: 'url',
            flex: 1
        }];
        this.dockedItems = [{
            xtype: 'gosToolbar',
            dock: 'top',
            items: [{
                xtype: 'gosButton',
                itemId: 'rdmIndexRefreshButton',
                iconCls: 'icon_system system_refresh',
                enableToggle: true,
                listeners: {
                    toggle: function(button, pressed, options) {
                        var store = grid.getStore();

                        if (pressed) {
                            store.getProxy().extraParams.auto_refresh = 1;
                            grid.gos.data.autoRefresh = window.setInterval(function() {
                                store.load();
                            }, 3000);
                        } else {
                            store.getProxy().extraParams.auto_refresh = 0;
                            window.clearInterval(grid.gos.data.autoRefresh);
                        }

                        store.load();
                    },
                    destroy: function(button, options) {
                        window.clearInterval(grid.gos.data.autoRefresh);
                    }
                }
            },{
                xtype: 'gosButton',
                itemId: 'rdmIndexDeleteButton',
                iconCls: 'icon_system system_delete',
                disabled: true,
                handler: function() {
                    var button = this;
                    var grid = this.up('grid');
                    var records = grid.getSelectionModel().getSelection();
                    var downloads = [];

                    Ext.iterate(records, function(record) {
                        downloads.push(record.get('id'));
                    });

                    GibsonOS.module.rdm.index.fn.delete(downloads, function(response) {
                        grid.getStore().remove(records);
                        button.disable();
                    });
                }
            },('->'),{
                xtype: 'gosToolbarTextItem',
                html: '<div id="rdmIndexStatus' + this.gos.data.type + '" class="rdm_status_frame"></div>'
            }]
        },{
            xtype: 'gosToolbarPaging',
            store: this.store,
            displayMsg: 'Downloads {0} - {1} von {2}',
            emptyMsg: 'Keine Downloads vorhanden'
        }];

        this.callParent();

        this.on('activate', function(grid, options) {
            grid.getStore().load();
        });

        this.on('selectionchange', function(selection, records, options) {
            var button = grid.down('#rdmIndexDeleteButton');

            if (selection.getCount() == 0) {
                button.disable();
            } else {
                button.enable();
            }
        });
    }
});