Ext.define('GibsonOS.module.hc.rfmrfmrhinetower.led.Form', {
    extend: 'GibsonOS.form.Panel',
    alias: ['widget.gosModuleHcRfmrhinetowerLedForm'],
    itemId: 'hcRfmrhinetowerLedForm',
    requiredPermission: {
        module: 'hc',
        task: 'rfmrhinetower',
        action: 'set',
        permission: GibsonOS.Permission.WRITE
    },
    initComponent: function () {
        var me = this;

        me.items = [{
            xtype: 'gosFormNumberfield',
            itemId: 'hcRfmrhinetowerLedFormBrightness',
            fieldLabel: 'Helligkeit',
            maxValue: 15
        },{
            xtype: 'gosFormNumberfield',
            itemId: 'hcRfmrhinetowerLedFormBlink',
            fieldLabel: 'Blinken',
            maxValue: 7
        }];

        me.callParent();
    }
});