Ext.define('GibsonOS.module.hc.rfmrhinetower.led.TowerBasket', {
    extend: 'GibsonOS.Panel',
    alias: ['widget.gosModuleHcRfmrhinetowerLedTowerBasket'],
    itemId: 'hcRfmrhinetowerLedTowerBasket',
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
            itemId: 'hcRfmrhinetowerLedTowerBasketTop',
            title: 'Oben',
            data: [],
            tpl: new Ext.XTemplate(
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="165">',
                '<circle cx="130" cy="80" r="80" style="stroke: #000; fill: #999;" />',
                '<circle cx="80" cy="60" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 6, "y": 3, "b": 15}\' />',
                '<circle cx="110" cy="30" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 6, "y": 2, "b": 15}\' />',
                '<circle cx="150" cy="30" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 6, "y": 1, "b": 15}\' />',
                '<circle cx="180" cy="60" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 6, "y": 0, "b": 15}\' />',
                '<circle cx="80" cy="105" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 6, "y": 4, "b": 15}\' />',
                '<circle cx="110" cy="135" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 6, "y": 5, "b": 15}\' />',
                '<circle cx="150" cy="135" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 6, "y": 6, "b": 15}\' />',
                '<circle cx="180" cy="105" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 6, "y": 7, "b": 15}\' />',
                '</svg>'
            )
        },{
            xtype: 'gosFormFieldset',
            itemId: 'hcRfmrhinetowerLedTowerBasketBottom',
            title: 'Unten',
            data: [],
            tpl: new Ext.XTemplate(
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="165">',
                '<circle cx="130" cy="80" r="80" style="stroke: #000; fill: #999;" />',
                '<circle cx="80" cy="60" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 7, "y": 3, "r": 15, "g": 15, "b": 15}\' />',
                '<circle cx="110" cy="30" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 7, "y": 2, "r": 15, "g": 15, "b": 15}\' />',
                '<circle cx="150" cy="30" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 7, "y": 1, "r": 15, "g": 15, "b": 15}\' />',
                '<circle cx="180" cy="60" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 7, "y": 0, "r": 15, "g": 15, "b": 15}\' />',
                '<circle cx="80" cy="105" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 7, "y": 4, "r": 15, "g": 15, "b": 15}\' />',
                '<circle cx="110" cy="135" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 7, "y": 5, "r": 15, "g": 15, "b": 15}\' />',
                '<circle cx="150" cy="135" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 7, "y": 6, "r": 15, "g": 15, "b": 15}\' />',
                '<circle cx="180" cy="105" r="10" class="hc_rfmrhinetower_svg_led" gos=\'{"x": 7, "y": 7, "r": 15, "g": 15, "b": 15}\' />',
                '</svg>'
            )
        }];

        me.callParent();
    }
});