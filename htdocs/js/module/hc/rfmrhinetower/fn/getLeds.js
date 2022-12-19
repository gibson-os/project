GibsonOS.define('GibsonOS.module.hc.rfmrhinetower.fn.getLeds', function(panel) {
    var ledPanelItemIds = [
        'hcRfmrhinetowerLedTowerBasketTop',
        'hcRfmrhinetowerLedTowerBasketBottom',
        'hcRfmrhinetowerLedFlyingSparksSpire',
        'hcRfmrhinetowerLedFlyingSparksTop',
        'hcRfmrhinetowerLedFlyingSparksBottom'
    ];

    if (panel.down('#hcRfmrhinetowerLedClockButton').pressed) {
        ledPanelItemIds.push(
            'hcRfmrhinetowerLedHoursTen',
            'hcRfmrhinetowerLedHoursOne',
            'hcRfmrhinetowerLedMinutesTen',
            'hcRfmrhinetowerLedMinutesOne',
            'hcRfmrhinetowerLedSecondsTen',
            'hcRfmrhinetowerLedSecondsOne'
        );
    }

    var data = {};

    Ext.iterate(ledPanelItemIds, function(itemId) {
        var ledPanel = panel.down('#' + itemId);
        var circles = ledPanel.getEl().dom.getElementsByTagName('circle');

        Ext.iterate(circles, function (circle) {
            if (!circle.hasAttribute('gos')) {
                return true;
            }

            var gosData = Ext.decode(circle.getAttribute('gos'));

            if (!data[gosData.x]) {
                data[gosData.x] = {};
            }

            data[gosData.x][gosData.y] = {
                brightness: gosData.brightness,
                blink: gosData.blink
            };
        });
    });

    return data;
});