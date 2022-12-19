Ext.define('GibsonOS.module.hc.rfmrhinetower.App', {
    extend: 'GibsonOS.module.hc.module.App',
    alias: ['widget.gosModuleHcRfmrhinetowerApp'],
    title: 'Rheinturm',
    appIcon: 'icon_rhinetower',
    width: 600,
    height: 500,
    initComponent: function () {
        var me = this;

        me.dataUpdateActive = true;
        me.dataUrl = baseDir + 'hc/rfmrhinetower/status';
        me.dataParams = {
            id: me.gos.data.module.id,
            renew: false
        };

        me.items = [{
            xtype: 'gosModuleHcRfmrhinetowerPanel',
            title: 'Rheinturm',
            gos: me.gos
        }];

        me.on('beforeclose', function() {
            if (
                me.isDirty() &&
                !me.closeDirty
            ) {
                GibsonOS.MessageBox.show({
                    title: 'Achtung!',
                    msg: 'LED Einstellungen sind nicht gespeichert oder angezeigt. Trotzdem schließen?',
                    type: GibsonOS.MessageBox.type.WARNING,
                    buttons: [{
                        text: 'Ja',
                        handler: function() {
                            me.closeDirty = true;
                            me.close();
                        }
                    },{
                        text: 'Nein'
                    }]
                });
            } else {
                return true;
            }

            return false;
        });

        me.callParent();

        me.on('afterrender', function() {
            var setTime = function () {
                var dateField = me.down('#hcRfmrhinetowerPanelDatePicker');
                var timeField = me.down('#hcRfmrhinetowerPanelTimefield');

                if (
                    !timeField ||
                    !dateField.picker
                ) {
                    return false;
                }

                if (
                    !timeField.gos.data.changed &&
                    !dateField.gos.data.changed
                ) {
                    var date = new Date();

                    timeField.suspendEvent('change');
                    timeField.setValue(date);
                    timeField.resumeEvent('change');

                    dateField.picker.setValue(date);
                }

                setTimeout(setTime, 900);
            };
            setTime();

            GibsonOS.module.hc.rfmrhinetower.fn.setLeds(me);
        });
        me.on('updatestatus', function(window, data) {
            var hours = me.down('#hcRfmrhinetowerLedHours');
            var minutes = me.down('#hcRfmrhinetowerLedMinutes');
            var seconds = me.down('#hcRfmrhinetowerLedSeconds');
            var clockLedBtn = me.down('#hcRfmrhinetowerLedClockButton');

            if (data.clock) {
                me.down('#hcRfmrhinetowerPanelShowClockButton').toggle(data.clock.show, true);
            }

            if (Ext.Object.getSize(data.ledList) == 8) {
                hours.enable();
                minutes.enable();
                seconds.enable();
                clockLedBtn.toggle(true, true);
            } else {
                hours.disable();
                minutes.disable();
                seconds.disable();
                clockLedBtn.toggle(false, true);
            }
        });
    }
});