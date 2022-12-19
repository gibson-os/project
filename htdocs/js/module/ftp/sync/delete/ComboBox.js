Ext.define('GibsonOS.module.ftp.sync.delete.ComboBox', {
    extend: 'GibsonOS.form.ComboBox',
    alias: ['widget.gosModuleFtpSyncDeleteComboBox'],
    itemId: 'ftpSyncDeleteComboBox',
    name: 'delete',
    fieldLabel: 'Löschen',
    displayField: 'name',
    valueField: 'id',
    store: {
        xtype: 'gosDataStore',
        fields: [{
            name: 'id',
            type: 'string'
        },{
            name: 'name',
            type: 'string'
        }],
        data: [{
            id: 'yes',
            name: 'Ja'
        },{
            id: 'no',
            name: 'Nein'
        },{
            id: 'only',
            name: 'Nur löschen'
        }]
    }
});