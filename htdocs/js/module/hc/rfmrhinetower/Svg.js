Ext.define('GibsonOS.module.hc.rfmrhinetower.Svg', {
    extend: 'GibsonOS.Panel',
    alias: ['widget.gosModuleHcRfmrhinetowerSvg'],
    itemId: 'hcRfmrhinetowerSvg',
    requiredPermission: {
        module: 'hc',
        task: 'rfmrhinetower'
    },
    initComponent: function () {
        var me = this;

        this.callParent();
    }
});