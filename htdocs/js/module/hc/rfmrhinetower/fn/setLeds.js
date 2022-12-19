GibsonOS.define('GibsonOS.module.hc.rfmrhinetower.fn.setLeds', function(panel) {
    var brightnessField = panel.down('#hcRfmrhinetowerLedFormBrightness');
    var blinkField = panel.down('#hcRfmrhinetowerLedFormBlink');
    var ledPanelItemIds = [
        'hcRfmrhinetowerLedTowerBasketTop',
        'hcRfmrhinetowerLedTowerBasketBottom',
        'hcRfmrhinetowerLedFlyingSparksSpire',
        'hcRfmrhinetowerLedFlyingSparksTop',
        'hcRfmrhinetowerLedFlyingSparksBottom',
        'hcRfmrhinetowerLedHoursTen',
        'hcRfmrhinetowerLedHoursOne',
        'hcRfmrhinetowerLedMinutesTen',
        'hcRfmrhinetowerLedMinutesOne',
        'hcRfmrhinetowerLedSecondsTen',
        'hcRfmrhinetowerLedSecondsOne'
    ];

    Ext.iterate(ledPanelItemIds, function(itemId) {
        var ledPanel = panel.down('#' + itemId);
        var circles = ledPanel.getEl().dom.getElementsByTagName('circle');

        Ext.iterate(circles, function(circle) {
            if (!circle.hasAttribute('gos')) {
                return true;
            }

            circle.onclick = function() {
                var gosData = Ext.decode(circle.getAttribute('gos'));

                panel.down('#hcRfmrhinetowerLedForm').enable();
                brightnessField.gos.element = circle;
                brightnessField.setValue(gosData.brightness);
                brightnessField.gos.element = circle;
                blinkField.setValue(gosData.blink);
            };

            panel.on('updatestatus', function (window, data) {
                var gosData = Ext.decode(circle.getAttribute('gos'));
                var brightness = 0;
                var blink = 0;
                var update = false;

                if (
                    data.ledList['l' + gosData.x] &&
                    data.ledList['l' + gosData.x]['l' + gosData.y]
                ) {
                    var ledData = data.ledList['l' + gosData.x]['l' + gosData.y];
                    brightness = ledData.brightness;
                    blink = ledData.blink;
                }

                if (gosData.brightness != brightness) {
                    gosData.brightness = brightness;
                    update = true;

                    GibsonOS.module.hc.rfmrhinetower.fn.setColor(circle, brightness);
                }

                if (gosData.blink != blink) {
                    gosData.blink = blink;
                    update = true;
                }

                if (update) {
                    circle.setAttribute('gos', Ext.encode(gosData));
                }
            });
        });
    });
});