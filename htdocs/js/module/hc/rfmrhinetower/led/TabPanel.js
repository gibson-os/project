Ext.define('GibsonOS.module.hc.rfmrhinetower.led.TabPanel', {
    extend: 'GibsonOS.TabPanel',
    alias: ['widget.gosModuleHcRfmrhinetowerLedTabPanel'],
    itemId: 'hcRfmrhinetowerLedTabPanel',
    autoHeight: true,
    deferredRender: false,
    requiredPermission: {
        module: 'hc',
        task: 'rfmrhinetower'
    },
    initComponent: function () {
        var me = this;

        me.items = [{
            xtype: 'gosModuleHcRfmrhinetowerLedTowerBasket',
            title: 'Korb',
            gos: me.gos
        },{
            xtype: 'gosModuleHcRfmrhinetowerLedFlyingSparks',
            title: 'Flugfeuer',
            gos: me.gos
        },{
            xtype: 'gosModuleHcRfmrhinetowerLedHours',
            title: 'Stunden',
            gos: me.gos,
            disabled: true
        },{
            xtype: 'gosModuleHcRfmrhinetowerLedMinutes',
            title: 'Minuten',
            gos: me.gos,
            disabled: true
        },{
            xtype: 'gosModuleHcRfmrhinetowerLedSeconds',
            title: 'Sekunden',
            gos: me.gos,
            disabled: true
        }];

        me.callParent();
    }
});