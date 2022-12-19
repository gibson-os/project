GibsonOS.define('GibsonOS.module.ftp.index.fn.getConnectedFtpNeighbor', function(view) {
    var activeTab = GibsonOS.module.ftp.index.fn.getActiveNeighborTab(view);

    if (activeTab) {
        if (activeTab.getXType() == 'gosModuleFtpIndexPanel') {
            if (!activeTab.down('#ftpIndexConnectButton').pressed) {
                GibsonOS.MessageBox.show({msg: 'FTP nicht verbunden!'});

                return false;
            }

            return activeTab;
        }
    }

    return false;
});