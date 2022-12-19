Ext.define('GibsonOS.module.hc.rfmrhinetower.led.Seconds', {
    extend: 'GibsonOS.Panel',
    alias: ['widget.gosModuleHcRfmrhinetowerLedSeconds'],
    itemId: 'hcRfmrhinetowerLedSeconds',
    autoHeight: true,
    autoScroll: true,
    requiredPermission: {
        module: 'hc',
        task: 'rfmrhinetower'
    },
    initComponent: function () {
        var me = this;
        var id = Ext.id();

        me.items = [{
            xtype: 'gosFormFieldset',
            itemId: 'hcRfmrhinetowerLedSecondsTen',
            title: 'Zehner',
            data: [],
            tpl: new Ext.XTemplate(
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="170">',
                '<rect x="105" y="0" width="50" height="170" style="stroke: #000; fill: #999;" />',
                '<circle cx="130" cy="25" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 1, "y": 2, "r": 15, "g": 15}\' />',
                '<circle cx="130" cy="55" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 1, "y": 3, "r": 15, "g": 15}\' />',
                '<circle cx="130" cy="85" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 1, "y": 4, "r": 15, "g": 15}\' />',
                '<circle cx="130" cy="115" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 1, "y": 5, "r": 15, "g": 15}\' />',
                '<circle cx="130" cy="145" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 1, "y": 6, "r": 15, "g": 15}\' />',
                '</svg>'
            )
        },{
            xtype: 'gosFormFieldset',
            itemId: 'hcRfmrhinetowerLedSecondsOne',
            title: 'Einer',
            data: [],
            tpl: new Ext.XTemplate(
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="290">',
                '<rect x="105" y="0" width="50" height="290" style="stroke: #000; fill: #999;" />',
                '<circle cx="130" cy="25" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 1, "y": 7, "r": 15, "g": 15}\' />',
                '<circle cx="130" cy="55" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 0, "y": 0, "r": 15, "g": 15}\' />',
                '<circle cx="130" cy="85" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 0, "y": 1, "r": 15, "g": 15}\' />',
                '<circle cx="130" cy="115" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 0, "y": 2, "r": 15, "g": 15}\' />',
                '<circle cx="130" cy="145" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 0, "y": 3, "r": 15, "g": 15}\' />',
                '<circle cx="130" cy="175" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 0, "y": 4, "r": 15, "g": 15}\' />',
                '<circle cx="130" cy="205" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 0, "y": 5, "r": 15, "g": 15}\' />',
                '<circle cx="130" cy="235" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 0, "y": 6, "r": 15, "g": 15}\' />',
                '<circle cx="130" cy="265" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 0, "y": 7, "r": 15, "g": 15}\' />',
                '</svg>'
            )
        }];

        me.callParent();
    }
});