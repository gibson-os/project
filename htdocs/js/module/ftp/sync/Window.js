Ext.define('GibsonOS.module.ftp.sync.Window', {
    extend: 'GibsonOS.Window',
    alias: ['widget.gosModuleFtpSyncWindow'],
    title: 'FTP Synchronisierung',
    width: 500,
    height: 295,
    layout: 'border',
    requiredPermission: {
        module: 'ftp',
        task: 'sync'
    },
    initComponent: function() {
        var me = this;

        me.items = [{
            xtype: 'gosModuleFtpSyncGrid',
            region: 'west',
            flex: 0,
            hideHeaders: true,
            split: true,
            collapsible: true,
            hideCollapseTool: true,
            header: false,
            width: 150
        },{
            xtype: 'gosModuleFtpSyncForm',
            region: 'center'
        }];

        me.callParent();

        var form = this.down('#ftpSyncForm');
        var grid = this.down('#ftpSyncGrid');

        grid.getSelectionModel().on('selectionchange', function(selectionModel, records, options) {
            var record = records[0];
            form.enable();

            if (form.isDirty()) {
                GibsonOS.MessageBox.show({
                    title: 'Synchronisation speichern?',
                    msg: 'Die FTP Synchronisation wurde nicht gespeichert. Jetzt speichern?',
                    type: GibsonOS.MessageBox.type.QUESTION,
                    buttons: [{
                        text: 'Ja',
                        handler: function() {
                            form.down('#ftpSyncFormSaveButton').handler();
                        }
                    },{
                        text: 'Nein',
                        handler: function() {
                            form.loadRecord(record);

                            form.getForm().getFields().each(function(field) {
                                field.originalValue = field.getValue();
                            });
                        }
                    }]
                });
            } else {
                form.loadRecord(record);
            }
        });
        grid.getStore().on('remove', function(store, record, index, isMove, options) {
            if (record.get('id') == form.getForm().findField('id').getValue()) {
                form.disable();
            }
        });
        form.getForm().on('actioncomplete', function(form, action, options) {
            var data = Ext.decode(action.response.responseText).data;
            var record = grid.getSelectionModel().getSelection()[0];

            Ext.iterate(data, function(key, value) {
                record.set(key, value);
            });

            record.commit();
            grid.down('#ftpSyncGridDeleteButton').enable();
        });
    }
});