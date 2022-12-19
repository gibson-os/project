Ext.define('GibsonOS.module.rdm.index.TabPanel', {
    extend: 'GibsonOS.TabPanel',
    alias: ['widget.gosModuleRdmIndexTabPanel'],
    activeTab: 0,
    initComponent: function() {
        this.items = [{
            xtype: 'gosModuleRdmIndexGrid',
            title: 'Aktiv',
            gos: {
                data: {
                    type: 'active'
                }
            }
        },{
            xtype: 'gosModuleRdmIndexGrid',
            title: 'Wartend',
            gos: {
                data: {
                    type: 'wait'
                }
            }
        },{
            xtype: 'gosModuleRdmIndexGrid',
            title: 'Fertig',
            gos: {
                data: {
                    type: 'downloaded'
                }
            }
        },{
            xtype: 'gosModuleRdmIndexGrid',
            title: 'Fehlerhaft',
            gos: {
                data: {
                    type: 'error'
                }
            }
        },{
            xtype: 'gosModuleRdmIndexGrid',
            title: 'Gestoppt',
            gos: {
                data: {
                    type: 'stoped'
                }
            }
        }];

        this.callParent();
    }
});