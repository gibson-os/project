GibsonOS.define('GibsonOS.module.ftp.index.fn.getActiveNeighborTab', function(view) {
    var itemId = view.up('gosModuleFtpIndexTabPanel').getItemId();
    var neighbor = null;

    if (itemId.search(/left/i) > -1) {
        neighbor = view.up('#app').down('#ftpIndexTabPanelRight');
    } else if (itemId.search(/right/i) > -1) {
        neighbor = view.up('#app').down('#ftpIndexTabPanelLeft');
    }

    if (!neighbor) {
        return false;
    }

    return neighbor.getActiveTab();
});