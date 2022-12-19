Ext.define('GibsonOS.module.ftp.session.protocol.ComboBox', {
    extend: 'GibsonOS.form.ComboBox',
    alias: ['widget.gosModuleFtpSessionProtocolComboBox'],
    itemId: 'ftpSessionProtocolComboBox',
    name: 'protocol',
    fieldLabel: 'Protokoll',
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
            id: 'ftp',
            name: 'FTP'
        },{
            id: 'sftp',
            name: 'SFTP'
        },{
            id: 'webdav',
            name: 'WebDAV'
        },{
            id: 'amazondrive',
            name: 'Amazon Drive'
        }]
    }
});