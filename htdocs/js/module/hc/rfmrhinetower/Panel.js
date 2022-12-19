Ext.define('GibsonOS.module.hc.rfmrhinetower.Panel', {
    extend: 'GibsonOS.Panel',
    alias: ['widget.gosModuleHcRfmrhinetowerPanel'],
    itemId: 'hcRfmrhinetowerPanel',
    layout: 'border',
    requiredPermission: {
        module: 'hc',
        task: 'rfmrhinetower'
    },
    initComponent: function () {
        var me = this;
        var animations = {
            0: 'Test',
            1: 'Stunde',
            2: 'Tag',
            3: 'Monat',
            4: 'Jahr',
            5: 'Leuchtturm',
            6: 'Morgens',
            7: 'Abends',
            8: 'Sonnenaufgang',
            9: 'Sonnenuntergang',
            255: 'Stopp'
        };
        var animationMenu = [];

        Ext.iterate(animations, function(id, name) {
            animationMenu.push({
                text: name,
                gos: {
                    data: {
                        moduleId: me.gos.data.module.id,
                        animationId: id
                    }
                },
                handler: function() {
                    GibsonOS.module.hc.rfmrhinetower.fn.startAnimation(this);
                }
            });
        });

        me.tbar = [{
            itemId: 'hcRfmrhinetowerPanelDateButton',
            text: 'Datum',
            requiredPermission: {
                action: 'setclock',
                permission: GibsonOS.Permission.WRITE
            },
            menu: {
                xtype: 'gosMenuDatePicker',
                itemId: 'hcRfmrhinetowerPanelDatePicker',
                format: 'd.m.Y',
                value: new Date()
            }
        },{
            xtype: 'gosFormTimefield',
            itemId: 'hcRfmrhinetowerPanelTimefield',
            width: 100,
            hideLabel: true,
            format: 'H:i:s',
            value: new Date(),
            requiredPermission: {
                action: 'setclock',
                permission: GibsonOS.Permission.WRITE
            }
        },{
            xtype: 'gosButton',
            itemId: 'hcRfmrhinetowerPanelSetClockButton',
            tooltip: 'Uhrzeit setzen',
            iconCls: 'icon_system system_clock_set',
            requiredPermission: {
                action: 'setclock',
                permission: GibsonOS.Permission.WRITE
            },
            handler: function() {
                var date = me.down('#hcRfmrhinetowerPanelDatePicker').picker.getValue();
                var time = me.down('#hcRfmrhinetowerPanelTimefield').getValue();
                var button = this;

                if (time == null) {
                    return false;
                }

                button.disable();

                GibsonOS.Ajax.request({
                    url: baseDir + 'hc/rfmrhinetower/setclock',
                    params: {
                        id: me.gos.data.module.id,
                        year: date.getYear()+1900,
                        month: date.getMonth(),
                        day: date.getDate()-1,
                        hour: time.getHours(),
                        minute: time.getMinutes(),
                        second: time.getSeconds()
                    },
                    success: function(response) {
                        button.enable();
                        button.toggle(true, true);
                        me.down('#hcRfmrhinetowerPanelTimefield').gos.data.changed = false;
                        me.down('#hcRfmrhinetowerPanelDatePicker').gos.data.changed = false;
                    },
                    failure: function() {
                        button.enable();
                    }
                });
            }
        },{
            xtype: 'gosButton',
            itemId: 'hcRfmrhinetowerPanelShowClockButton',
            tooltip: 'Uhrzeit anzeigen',
            iconCls: 'icon_system system_clock_play',
            enableToggle: true,
            requiredPermission: {
                action: 'showclock',
                permission: GibsonOS.Permission.WRITE
            },
            listeners: {
                toggle: function(button, pressed, options) {
                    button.disable();
                    
                    GibsonOS.Ajax.request({
                        url: baseDir + 'hc/rfmrhinetower/showclock',
                        params: {
                            id: me.gos.data.module.id,
                            show: pressed
                        },
                        success         : function(response) {
                            button.enable();
                        },
                        failure         : function() {
                            button.enable();
                            button.toggle(!pressed, true);
                        }
                    });
                }
            }
        },('-'),{
            xtype: 'gosButton',
            itemId: 'hcRfmrhinetowerPanelViewAnimationButton',
            text: 'Animationen',
            requiredPermission: {
                action: 'playanimation',
                permission: GibsonOS.Permission.WRITE
            },
            menu: animationMenu
        },('-'),{
            xtype: 'gosButton',
            itemId: 'hcRfmrhinetowerPanelStatusButton',
            tooltip: 'Aktualisieren',
            iconCls: 'icon_system system_refresh',
            requiredPermission: {
                action: 'status',
                permission: GibsonOS.Permission.WRITE
            },
            handler: function() {
                var button = this;
                var panel = button.up('#hcRfmrhinetowerPanel');
                var window = this.up('window');
                var getStatus = function() {
                    me.up('window').updateStatus({
                        renew: true,
                        success: function(response) {
                            button.enable();

                            me.fireEvent('updatestatus', window, Ext.decode(response.responseText).data);
                            me.up('window').setUpdateStatus(true);
                            me.down('#hcRfmrhinetowerPanelTimefield').gos.data.changed = false;
                            me.down('#hcRfmrhinetowerPanelDatePicker').gos.data.changed = false;
                        },
                        failure: function() {
                            button.enable();
                        }
                    });
                };
                button.disable();

                if (window.isDirty()) {
                    GibsonOS.MessageBox.show({
                        title: 'Achtung!',
                        msg: 'LED Einstellungen sind nicht gespeichert oder angezeigt. Trotzdem aktualisieren?',
                        type: GibsonOS.MessageBox.type.WARNING,
                        buttons: [{
                            text: 'Ja',
                            handler: function () {
                                window.setDirty(false);
                                getStatus();
                            }
                        }, {
                            text: 'Nein'
                        }]
                    });
                } else {
                    getStatus();
                    button.enable();
                }
            }
        }];
        me.items = [{
            xtype: 'gosModuleHcRfmrhinetowerSvg',
            region: 'center',
            gos: me.gos
        },{
            xtype: 'gosModuleHcRfmrhinetowerLed',
            region: 'east',
            width: 285,
            flex: 0,
            gos: me.gos
        }];

        me.callParent();

        me.down('#hcRfmrhinetowerPanelTimefield').on('change', function(field) {
            field.gos.data.changed = true;
        });
        me.down('#hcRfmrhinetowerPanelDatePicker').picker.on('select', function(field) {
            field.up().gos.data.changed = true;
        });
    }
});