Ext.define('GibsonOS.module.ftp.index.transfer.TabPanel', {
    extend: 'GibsonOS.TabPanel',
    alias: ['widget.gosModuleFtpIndexTransferTabPanel'],
    activeTab: 0,
    itemId: 'ftpIndexTransferTabPanel',
    requiredPermission: {
        module: 'ftp',
        task: 'index'
    },
    initComponent: function() {
        this.items = [{
            xtype: 'gosModuleFtpIndexTransferGrid',
            title: 'Aktiv',
            gos: {
                data: {
                    type: 'active'
                }
            }
        },{
            xtype: 'gosModuleFtpIndexTransferGrid',
            title: 'Fertig',
            gos: {
                data: {
                    type: 'finished'
                }
            }
        },{
            xtype: 'gosModuleFtpIndexTransferGrid',
            title: 'Fehlerhaft',
            gos: {
                data: {
                    type: 'error'
                }
            }
        }];

        this.callParent();

        var clearAutoRefresh = function(panel) {
            if (panel.gos.data.autoRefresh) {
                panel.down('#ftpIndexTransferRefreshButton').toggle(false, true);
                window.clearInterval(panel.gos.data.autoRefresh);
            }
        };

        this.on('tabchange', function(tabPanel, newCard, oldCard, options) {
            clearAutoRefresh(oldCard);
        });
        this.on('collapse', function(tabPanel, options) {
            clearAutoRefresh(tabPanel.getActiveTab());
        });
    }
});