Ext.define('GibsonOS.module.ftp.index.store.View', {
    extend: 'GibsonOS.data.Store',
    alias: ['store.gosModuleFtpIndexContainerStore'],
    proxy: {
        type: 'gosDataProxyAjax',
        url: baseDir + 'ftp/index/read'
    },
    model: 'GibsonOS.module.ftp.index.model.View'
});