Ext.define('GibsonOS.module.rdm.index.store.Grid', {
    extend: 'GibsonOS.data.Store',
    alias: ['store.gosModuleRdmIndexGridStore'],
    autoLoad: false,
    groupField: 'job',
    pageSize: 100,
    model: 'GibsonOS.module.rdm.index.model.Grid',
    constructor: function(data) {
        this.proxy = {
            type: 'gosDataProxyAjax',
            url: baseDir + 'rdm/index/index',
            extraParams: {
                type: data.gos.data.type,
                auto_refresh: -1
            }
        };

        this.callParent(arguments);
    }
});