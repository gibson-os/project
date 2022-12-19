Ext.define('GibsonOS.module.hc.rfmrhinetower.led.FlyingSparks', {
    extend: 'GibsonOS.Panel',
    alias: ['widget.gosModuleHcRfmrhinetowerLedFlyingSparks'],
    itemId: 'hcRfmrhinetowerLedFlyingSparks',
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
            itemId: 'hcRfmrhinetowerLedFlyingSparksSpire',
            title: 'Spitze',
            data: [],
            tpl: new Ext.XTemplate(
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="165">',
                '<circle cx="130" cy="10" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 5, "y": 0, "r": 15}\' />',
                '<rect x="115" y="15" width="30" height="40" style="fill: #F00;" />',
                '<rect x="115" y="55" width="30" height="50" style="fill: #FFF;" />',
                '<rect x="115" y="105" width="30" height="50" style="fill: #F00;" />',
                '</svg>'
            )
        },{
            xtype: 'gosFormFieldset',
            itemId: 'hcRfmrhinetowerLedFlyingSparksTop',
            title: 'Oben',
            data: [],
            tpl: new Ext.XTemplate(
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="165">',
                '<circle cx="130" cy="80" r="80" style="stroke: #000; fill: #999;" />',
                '<circle cx="75" cy="20" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 5, "y": 1, "r": 15}\' />',
                '<circle cx="185" cy="20" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 5, "y": 2, "r": 15}\' />',
                '<circle cx="185" cy="140" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 5, "y": 3, "r": 15}\' />',
                '<circle cx="75" cy="140" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 5, "y": 4, "r": 15}\' />',
                '</svg>'
            )
        },{
            xtype: 'gosFormFieldset',
            itemId: 'hcRfmrhinetowerLedFlyingSparksBottom',
            title: 'Unten',
            data: [],
            tpl: new Ext.XTemplate(
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="165">',
                '<circle cx="130" cy="80" r="80" style="stroke: #000; fill: #999;" />',
                '<circle cx="75" cy="20" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 3, "y": 1, "r": 15}\' />',
                '<circle cx="185" cy="20" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 3, "y": 0, "r": 15}\' />',
                '<circle cx="75" cy="140" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 1, "y": 1, "r": 15}\' />',
                '<circle cx="185" cy="140" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 1, "y": 0, "r": 15}\' />',
                '</svg>'
            )
        }];

        me.callParent();
    }
});