Ext.define('GibsonOS.module.ftp.sync.Button', {
    extend: 'GibsonOS.Button',
    alias: ['widget.gosModuleFtpSyncButton'],
    itemId: 'ftpSyncButton',
    iconCls: 'icon_system system_sync',
    requiredPermission: {
        module: 'ftp',
        task: 'sync',
        action: 'index',
        permission: GibsonOS.Permission.READ
    },
    handler: function() {
        new GibsonOS.module.ftp.sync.Window();
    }
});