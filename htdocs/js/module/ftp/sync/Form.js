Ext.define('GibsonOS.module.ftp.sync.Form', {
    extend: 'GibsonOS.form.Panel',
    alias: ['widget.gosModuleFtpSyncForm'],
    itemId: 'ftpSyncForm',
    trackResetOnLoad: true,
    disabled: true,
    requiredPermission: {
        module: 'ftp',
        task: 'sync'
    },
    initComponent: function() {
        var me = this;

        me.items = [{
            xtype: 'gosFormHidden',
            name: 'id'
        },{
            xtype: 'fieldcontainer',
            fieldLabel: 'Lokales Verzeichnis',
            layout: 'hbox',
            defaults: {
                hideLabel: true
            },
            items: [{
                xtype: 'gosFormTextfield',
                name: 'localPath',
                flex: 1,
                margins: '0 5 0 0'
            },{
                xtype: 'gosButton',
                text: '...',
                handler: function() {
                    GibsonOS.module.explorer.dir.fn.dialog(me.getForm().findField('localPath'));
                }
            }]
        },{
            xtype: 'fieldcontainer',
            fieldLabel: 'FTP Verzeichnis',
            layout: 'hbox',
            defaults: {
                hideLabel: true
            },
            items: [{
                xtype: 'gosFormTextfield',
                name: 'remotePath',
                flex: 1,
                margins: '0 5 0 0'
            },{
                xtype: 'gosButton',
                text: '...',
                handler: function() {
                    var remotePathField = me.getForm().findField('remotePath');
                    var remotePath = remotePathField.getValue();

                    var dialog = new GibsonOS.module.ftp.index.Dialog({
                        gos: {
                            data: {
                                id: me.getForm().findField('id').getValue()
                            }
                        }
                    });
                    dialog.down('#gosModuleFtpIndexDialogOkButton').handler = function() {
                        var record = dialog.down('gosModuleFtpIndexTree').getSelectionModel().getSelection()[0];
                        remotePathField.setValue(record.get('id'));
                        dialog.close();
                    }
                }
            }]
        },{
            xtype: 'gosModuleFtpSyncIntervalComboBox'
        },{
            xtype: 'gosModuleFtpSyncDirectionComboBox'
        },{
            xtype: 'gosModuleFtpSyncDeleteComboBox'
        },{
            xtype: 'gosFormCheckbox',
            name: 'crypt',
            inputValue: true,
            fieldLabel: 'Verschlüsseln',
            boxLabel: 'Ordner und Dateien auf dem entfernten System verschlüsseln'
        },{
            xtype: 'gosFormCheckbox',
            name: 'active',
            inputValue: true,
            fieldLabel: 'Aktiviert'
        }];

        me.buttons = [{
            text: 'Speichern',
            itemId: 'ftpSyncFormSaveButton',
            requiredPermission: {
                action:'save',
                permission: GibsonOS.Permission.MANAGE + GibsonOS.Permission.WRITE
            },
            handler: function() {
                me.getForm().submit({
                    xtype: 'gosFormActionAction',
                    url: baseDir + 'ftp/syn/save',
                    success: function(form, action) {
                        GibsonOS.MessageBox.show({
                            title: 'Gespeichert!',
                            msg: 'FTP Synchronisation wurde erfolgreich gespeichert!',
                            type: GibsonOS.MessageBox.type.INFO
                        });
                    }
                })
            }
        }];

        me.callParent();

        me.down('gosModuleFtpSyncDirectionComboBox').on('change', function(combo, value) {
            var disable = false;

            if (value == 'sync') {
                disable = true;
            }

            me.getForm().findField('delete').setDisabled(disable);
        });
    }
});