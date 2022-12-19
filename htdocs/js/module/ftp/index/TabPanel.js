Ext.define('GibsonOS.module.ftp.index.TabPanel', {
    extend: 'GibsonOS.TabPanel',
    alias: ['widget.gosModuleFtpIndexTabPanel'],
    itemId: 'ftpIndexTabPanel',
    border: true,
    initComponent: function() {
        this.items = [{
            xtype: 'gosModuleExplorerIndexPanel',
            title: 'Explorer',
            flex: 0,
            gos: {
                data: {
                    dir: this.gos.data.dir ? this.gos.data.dir : null
                }
            },
            requiredPermission: {
                module: 'explorer',
                task: 'dir'
            }
        },{
            xtype: 'gosModuleFtpIndexPanel',
            title: 'FTP',
            flex: 0,
            requiredPermission: {
                module: 'ftp',
                task: 'index'
            }
        }];

        this.callParent();

        this.down('#explorerDirGrid').itemContextMenu.insert(2, {xtype: 'gosModuleFtpIndexUploadButton'});
        this.down('#explorerDirView32').itemContextMenu.insert(2, {xtype: 'gosModuleFtpIndexUploadButton'});
        this.down('#explorerDirView48').itemContextMenu.insert(2, {xtype: 'gosModuleFtpIndexUploadButton'});
        this.down('#explorerDirView64').itemContextMenu.insert(2, {xtype: 'gosModuleFtpIndexUploadButton'});
        this.down('#explorerDirView128').itemContextMenu.insert(2, {xtype: 'gosModuleFtpIndexUploadButton'});
        this.down('#explorerDirView256').itemContextMenu.insert(2, {xtype: 'gosModuleFtpIndexUploadButton'});
        this.down('#explorerDirTree').itemContextMenu.insert(2, {
            xtype: 'gosModuleFtpIndexUploadButton',
            handler: function(crypt) {
                var menu = this.up('#contextMenu');
                var parent = menu.getParent();
                var record = menu.getRecord();
                var store = parent.getStore();
                var proxy = store.getProxy();
                var extraParams = {};

                var remotePath = null;
                var activeTab = GibsonOS.module.ftp.index.fn.getConnectedFtpNeighbor(parent);

                if (activeTab) {
                    remotePath = activeTab.down('#ftpIndexView').gos.store.getProxy().getReader().jsonData.dir;
                    extraParams = activeTab.down('#ftpIndexView').gos.store.getProxy().extraParams;
                }

                if (remotePath) {
                    GibsonOS.module.ftp.index.fn.upload(record.get('id'), null, remotePath, {
                        id: extraParams.id ? extraParams.id : null,
                        url: extraParams.url ? extraParams.url : null,
                        port: extraParams.port ? extraParams.port : null,
                        protocol: extraParams.protocol ? extraParams.protocol : null,
                        user: extraParams.user ? extraParams.user : null,
                        password: extraParams.password ? extraParams.password : null
                    }, crypt);
                }
            }
        });

        this.down('#explorerDirGrid').removeListener('itemdblclick', GibsonOS.module.explorer.dir.itemDblClick);
        this.down('#explorerDirView32').removeListener('itemdblclick', GibsonOS.module.explorer.dir.itemDblClick);
        this.down('#explorerDirView48').removeListener('itemdblclick', GibsonOS.module.explorer.dir.itemDblClick);
        this.down('#explorerDirView64').removeListener('itemdblclick', GibsonOS.module.explorer.dir.itemDblClick);
        this.down('#explorerDirView128').removeListener('itemdblclick', GibsonOS.module.explorer.dir.itemDblClick);
        this.down('#explorerDirView256').removeListener('itemdblclick', GibsonOS.module.explorer.dir.itemDblClick);

        this.down('#explorerDirGrid').on('itemdblclick', GibsonOS.module.ftp.index.listener.explorerItemDblClick);
        this.down('#explorerDirView32').on('itemdblclick', GibsonOS.module.ftp.index.listener.explorerItemDblClick);
        this.down('#explorerDirView48').on('itemdblclick', GibsonOS.module.ftp.index.listener.explorerItemDblClick);
        this.down('#explorerDirView64').on('itemdblclick', GibsonOS.module.ftp.index.listener.explorerItemDblClick);
        this.down('#explorerDirView128').on('itemdblclick', GibsonOS.module.ftp.index.listener.explorerItemDblClick);
        this.down('#explorerDirView256').on('itemdblclick', GibsonOS.module.ftp.index.listener.explorerItemDblClick);
    }
});