Ext.define('GibsonOS.module.ftp.session.Window', {
    extend: 'GibsonOS.Window',
    alias: ['widget.gosModuleFtpSessionWindow'],
    title: 'FTP Verbindungen',
    width: 500,
    height: 295,
    layout: 'border',
    requiredPermission: {
        module: 'ftp',
        task: 'session'
    },
    initComponent: function() {
        this.items = [{
            xtype: 'gosModuleFtpSessionGrid',
            region: 'west',
            flex: 0,
            hideHeaders: true,
            split: true,
            collapsible: true,
            hideCollapseTool: true,
            header: false,
            width: 150
        },{
            xtype: 'gosModuleFtpSessionForm',
            region: 'center'
        }];

        this.callParent();

        var window = this;
        var form = this.down('#ftpSessionForm');
        var grid = this.down('#ftpSessionGrid');

        grid.getSelectionModel().on('selectionchange', function(selectionModel, records, options) {
            var record = records[0];
            form.enable();

            if (form.isDirty()) {
                GibsonOS.MessageBox.show({
                    title: 'Verbindung speichern?',
                    msg: 'Die FTP Verbindung wurde nicht gespeichert. Jetzt speichern?',
                    type: GibsonOS.MessageBox.type.QUESTION,
                    buttons: [{
                        text: 'Ja',
                        handler: function() {
                            form.down('#ftpSessionFormSaveButton').handler();

                            // @todo Danach
                            //form.getForm.findField('password').setValue(null);
                            //form.loadRecord(record);
                        }
                    },{
                        text: 'Nein',
                        handler: function() {
                            form.getForm().findField('password').setValue(null);
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
            grid.down('#ftpSessionGridDeleteButton').enable();
        });
    }
});