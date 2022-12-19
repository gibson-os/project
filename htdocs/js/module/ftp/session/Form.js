Ext.define('GibsonOS.module.ftp.session.Form', {
    extend: 'GibsonOS.form.Panel',
    alias: ['widget.gosModuleFtpSessionForm'],
    itemId: 'ftpSessionForm',
    trackResetOnLoad: true,
    disabled: true,
    requiredPermission: {
        module: 'ftp',
        task: 'session'
    },
    initComponent: function() {
        var me = this;

        me.items = [{
            xtype: 'gosFormHidden',
            name: 'id'
        },{
            xtype: 'gosFormTextfield',
            name: 'name',
            fieldLabel: 'Name'
        },{
            xtype: 'gosModuleFtpSessionProtocolComboBox',
            value: 'ftp'
        },{
            xtype: 'fieldcontainer',
            fieldLabel: 'URL',
            layout: 'hbox',
            defaults: {
                hideLabel: true
            },
            items: [{
                xtype: 'gosFormTextfield',
                name: 'url',
                flex: 1,
                margins: '0 5 0 0'
            },{
                xtype: 'gosFormNumberfield',
                name: 'port',
                width: 50,
                emptyText: 'Port'
            }]
        },{
            xtype: 'gosFormTextfield',
            name: 'user',
            fieldLabel: 'Benutzer'
        },{
            xtype: 'gosFormTextfield',
            inputType: 'password',
            name: 'password',
            fieldLabel: 'Passwort'
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
                                dir: remotePath ? remotePath : null,
                                id: me.getForm().findField('id').getValue(),
                                url: me.getForm().findField('url').getValue(),
                                port: me.getForm().findField('port').getValue(),
                                protocol: me.getForm().findField('protocol').getValue(),
                                user: me.getForm().findField('user').getValue(),
                                password: me.getForm().findField('password').getValue()
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
            xtype: 'gosFormCheckbox',
            name: 'onlyForThisUser',
            inputValue: true,
            fieldLabel: 'Zugriff',
            boxLabel: 'Nur für den aktuellen Benutzer'
        }];

        me.buttons = [{
            text: 'Speichern',
            itemId: 'ftpSessionFormSaveButton',
            requiredPermission: {
                action:'save',
                permission: GibsonOS.Permission.MANAGE + GibsonOS.Permission.WRITE
            },
            handler: function() {
                me.getForm().submit({
                    xtype: 'gosFormActionAction',
                    url: baseDir + 'ftp/session/save',
                    success: function(form, action) {
                        var data = Ext.decode(action.response.responseText).data;

                        if (data.authenticationUrl) {
                            location.href = data.authenticationUrl;
                        } else {
                            GibsonOS.MessageBox.show({
                                title: 'Gespeichert!',
                                msg: 'FTP Verbindung wurde erfolgreich gespeichert!',
                                type: GibsonOS.MessageBox.type.INFO
                            });
                        }
                    }
                })
            }
        }];

        me.callParent();

        me.down('gosModuleFtpSessionProtocolComboBox').on('change', function(combo, value) {
            var disable = false;

            if (value == 'amazondrive') {
                disable = true;
            }

            me.getForm().findField('url').setDisabled(disable);
            me.getForm().findField('port').setDisabled(disable);
            me.getForm().findField('user').setDisabled(disable);
            me.getForm().findField('password').setDisabled(disable);
            me.getForm().findField('remotePath').setDisabled(disable);
        });
    }
});