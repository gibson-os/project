Ext.define('GibsonOS.module.ftp.index.App', {
    extend: 'GibsonOS.App',
    alias: ['widget.gosModuleFtpIndexApp'],
    title: 'FTP',
    appIcon: 'icon_exe',
    width: 1200,
    height: 600,
    layout: 'border',
    requiredPermission: {
        module: 'ftp',
        task: 'index'
    },
    initComponent: function() {
        var app = this;

        this.items = [{
            xtype: 'gosModuleFtpIndexTabPanel',
            itemId: 'ftpIndexTabPanelLeft',
            region: 'center',
            gos: {
                data: {
                    dir: this.gos.data.dir ? this.gos.data.dir : null,
                    side: 'left'
                }
            }
        },{
            xtype: 'gosModuleFtpIndexTabPanel',
            itemId: 'ftpIndexTabPanelRight',
            region: 'east',
            activeTab: 1,
            gos: {
                data: {
                    dir: this.gos.data.dir ? this.gos.data.dir : null,
                    side: 'right'
                }
            }
        }];
        this.id = 'gosModuleFtpIndexApp' + Ext.id();

        this.callParent();
    }
});