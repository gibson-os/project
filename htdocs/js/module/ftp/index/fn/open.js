GibsonOS.define('GibsonOS.module.ftp.index.fn.open', function(store, dir) {
    var proxy = store.getProxy();

    proxy.extraParams.dir = dir;
    store.load();
});