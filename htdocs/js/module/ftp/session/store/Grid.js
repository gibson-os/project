Ext.define('GibsonOS.module.ftp.session.store.Grid', {
    extend: 'GibsonOS.data.Store',
    alias: ['store.gosModuleFtpSessionGridStore'],
    proxy: {
        type: 'gosDataProxyAjax',
        url: baseDir + 'ftp/session/index'
    },
    model: 'GibsonOS.module.ftp.session.model.Grid'
});