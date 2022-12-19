Ext.define('GibsonOS.module.ftp.index.store.Tree', {
    extend: 'GibsonOS.data.TreeStore',
    alias: ['store.gosModuleFtpIndexTreeStore'],
    proxy: {
        type: 'gosDataProxyAjax',
        url: baseDir + 'ftp/index/dirList'
    },
    constructor: function(data) {
        this.callParent(arguments);

        this.on('load', function(store, node, records, successful) {
            if (node.isRoot()) {
                var node = store.getNodeById(store.getProxy().extraParams.dir);
            }

            data.gos.data.tree.getSelectionModel().select(node, false, true);
            data.gos.data.tree.getView().focusRow(node);
        });

        return this;
    }
});