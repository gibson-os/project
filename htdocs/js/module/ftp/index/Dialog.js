Ext.define('GibsonOS.module.ftp.index.Dialog', {
    extend: 'GibsonOS.Window',
    alias: ['widget.gosModuleFtpIndexDialog'],
    title: 'FTP Ordner auswählen',
    width: 300,
    height: 400,
    buttonAlign: 'center',
    requiredPermission: {
        module: 'ftp',
        task: 'index'
    },
    initComponent: function() {
        this.items = [{
            xtype: 'gosModuleFtpIndexTree',
            gos: {
                data: {
                    dir: this.gos.data && this.gos.data.dir ? this.gos.data.dir : null
                }
            }
        }];
        this.buttons = [{
            text: 'OK',
            itemId: 'gosModuleFtpIndexDialogOkButton'
        }];

        this.callParent();

        var store = this.down('gosModuleFtpIndexTree').getStore();
        var proxy = store.getProxy();

        if (
            this.gos.data.id &&
            this.gos.data.id > 0
        ) {
            proxy.setExtraParam('id', this.gos.data.id);
        } else {
            proxy.setExtraParam('url', this.gos.data.url);
            proxy.setExtraParam('port', this.gos.data.port);
            proxy.setExtraParam('protocol', this.gos.data.protocol);
            proxy.setExtraParam('user', this.gos.data.user);
            proxy.setExtraParam('password', this.gos.data.password);
        }

        proxy.setExtraParam('dir', this.gos.data.dir ? this.gos.data.dir : null);

        store.load();
    }
});