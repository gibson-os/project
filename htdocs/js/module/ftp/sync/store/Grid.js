Ext.define('GibsonOS.module.ftp.sync.store.Grid', {
    extend: 'GibsonOS.data.Store',
    alias: ['store.gosModuleFtpSyncGridStore'],
    pageSize: 100,
    model: 'GibsonOS.module.ftp.sync.model.Grid',
    constructor: function(data) {
        this.proxy = {
            type: 'gosDataProxyAjax',
            url: baseDir + 'ftp/sync/index'
        };

        this.callParent(arguments);
    }
});