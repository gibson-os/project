Ext.define('GibsonOS.module.ftp.index.store.Transfer', {
    extend: 'GibsonOS.data.Store',
    alias: ['store.gosModuleFtpIndexTransferStore'],
    autoLoad: false,
    pageSize: 100,
    model: 'GibsonOS.module.ftp.index.model.Transfer',
    constructor: function(data) {
        this.proxy = {
            type: 'gosDataProxyAjax',
            url: baseDir + 'ftp/index/transfer',
            extraParams: {
                type: data.gos.data.type,
                autoRefresh: -1
            }
        };

        this.callParent(arguments);
    }
});