Ext.define('GibsonOS.module.hc.rfmrhinetower.Led', {
    extend: 'GibsonOS.Panel',
    alias: ['widget.gosModuleHcRfmrhinetowerLed'],
    itemId: 'hcRfmrhinetowerLed',
    layout: 'border',
    requiredPermission: {
        module: 'hc',
        task: 'rfmrhinetower'
    },
    initComponent: function () {
        var me = this;

        me.tbar = [{
            xtype: 'gosButton',
            itemId: 'hcRfmrhinetowerLedSetButton',
            tooltip: 'Anzeigen',
            iconCls: 'icon_system system_show',
            requiredPermission: {
                action: 'set',
                permission: GibsonOS.Permission.WRITE
            },
            handler: function() {
                var button = this;
                button.disable();

                GibsonOS.Ajax.request({
                    url: baseDir + 'hc/rfmrhinetower/set',
                    params: {
                        id: me.gos.data.module.id,
                        leds: Ext.encode(GibsonOS.module.hc.rfmrhinetower.fn.getLeds(me)),
                        withClock: me.down('#hcRfmrhinetowerLedClockButton').pressed
                    },
                    success: function(response) {
                        button.enable();
                        me.up('window').setDirty(false);
                        me.up('window').setUpdateStatus(true);
                    },
                    failure: function() {
                        button.enable();
                    }
                });
            }
        },{
            xtype: 'gosButton',
            itemId: 'hcRfmrhinetowerLedClockButton',
            tooltip: 'Uhrzeit LEDs bearbeiten',
            iconCls: 'icon_system system_clock_edit',
            enableToggle: true,
            requiredPermission: {
                action: 'set',
                permission: GibsonOS.Permission.WRITE
            },
            listeners: {
                toggle: function(btn, pressed) {
                    me.up('window').setUpdateStatus(false);

                    var hours = me.down('#hcRfmrhinetowerLedHours');
                    var minutes = me.down('#hcRfmrhinetowerLedMinutes');
                    var seconds = me.down('#hcRfmrhinetowerLedSeconds');

                    if (pressed) {
                        hours.enable();
                        minutes.enable();
                        seconds.enable();
                    } else {
                        hours.disable();
                        minutes.disable();
                        seconds.disable();
                    }
                }
            }
        },('-'),{
            xtype: 'gosFormAutoComplete',
            itemId: 'hcRfmrhinetowerLedImageLoad',
            hideLabel: true,
            width: 180,
            emptyText: 'Laden',
            enableKeyEvents: true,
            url: baseDir + 'hc/rfmrhinetower/autocomplete',
            queryParamId: 'sequenceId',
            model: 'GibsonOS.module.hc.callback.model.AutoComplete',
            requiredPermission: {
                action: 'autocomplete',
                permission: GibsonOS.Permission.READ
            },
            listeners: {
                select: function(combo, records) {
                    var window = me.up('window');
                    var loadImage = function() {
                        GibsonOS.Ajax.request({
                            url: baseDir + 'hc/rfmrhinetower/image',
                            params: {
                                imageId: records[0].get('id')
                            },
                            success: function(response) {
                                var panel = me.up('#hcRfmrhinetowerPanel');
                                panel.up('window').setUpdateStatus(false);
                                panel.fireEvent('updatestatus', me.up('window'), {ledList: Ext.decode(response.responseText).data});

                                me.down('#hcRfmrhinetowerLedImageDeleteButton').enable();
                                me.down('#hcRfmrhinetowerLedImageSaveButton').enable();
                                me.down('#hcRfmrhinetowerLedForm').disable();
                            }
                        });
                    };

                    if (window.isDirty()) {
                        GibsonOS.MessageBox.show({
                            title: 'Achtung!',
                            msg: 'LED Einstellungen sind nicht gespeichert oder angezeigt. Trotzdem laden?',
                            type: GibsonOS.MessageBox.type.WARNING,
                            buttons: [{
                                text: 'Ja',
                                handler: function() {
                                    window.setDirty(false);
                                    loadImage();
                                }
                            },{
                                text: 'Nein'
                            }]
                        });
                    } else {
                        loadImage();
                    }
                },
                keyup: function(field, event, options) {
                    var saveBtn = me.down('#hcRfmrhinetowerLedImageSaveButton');
                    me.down('#hcRfmrhinetowerLedImageDeleteButton').disable();

                    if (field.getValue()) {
                        saveBtn.enable();
                    } else {
                        saveBtn.disable();
                    }
                }
            }
        },{
            xtype: 'gosButton',
            itemId: 'hcRfmrhinetowerLedImageSaveButton',
            tooltip: 'Bild speichern',
            iconCls: 'icon_system system_save',
            disabled: true,
            requiredPermission: {
                action: 'saveimage',
                permission: GibsonOS.Permission.WRITE
            },
            handler: function() {
                var loadField = me.down('#hcRfmrhinetowerLedImageLoad');

                GibsonOS.Ajax.request({
                    url: baseDir + 'hc/rfmrhinetower/saveimage',
                    params: {
                        id: me.gos.data.module.id,
                        name: loadField.getRawValue(),
                        leds: Ext.encode(GibsonOS.module.hc.rfmrhinetower.fn.getLeds(me))
                    },
                    success: function(response) {
                        var data = Ext.decode(response.responseText).data;
                        loadField.setValueById(data.id);
                        me.down('#hcRfmrhinetowerLedImageDeleteButton').enable();
                        me.up('window').setDirty(false);
                    }
                });
            }
        },{
            xtype: 'gosButton',
            itemId: 'hcRfmrhinetowerLedImageDeleteButton',
            tooltip: 'Bild löschen',
            iconCls: 'icon_system system_delete',
            disabled: true,
            requiredPermission: {
                action: 'deleteimage',
                permission: GibsonOS.Permission.DELETE
            },
            handler: function() {
                var button = this;
                var loadField = me.down('#hcRfmrhinetowerLedImageLoad');

                GibsonOS.MessageBox.show({
                    title: 'Bild löschen?',
                    msg: 'Möchten Sie das Bild ' + loadField.getRawValue() + ' wirklich löchen?',
                    type: GibsonOS.MessageBox.type.QUESTION,
                    buttons: [{
                        text: 'Ja',
                        handler: function() {
                            GibsonOS.Ajax.request({
                                url: baseDir + 'hc/rfmrhinetower/deleteimage',
                                params: {
                                    id: me.gos.data.module.id,
                                    sequenceId: loadField.getValue()
                                },
                                success: function(response) {
                                    button.disable();
                                    loadField.setValue(null);
                                    loadField.getStore().load();
                                }
                            });
                        }
                    },{
                        text: 'Nein'
                    }]
                });
            }
        }];
        me.items = [{
            xtype: 'gosModuleHcRfmrhinetowerLedTabPanel',
            region: 'center',
            gos: me.gos
        },{
            xtype: 'gosModuleHcRfmrhinetowerLedForm',
            region: 'south',
            gos: me.gos,
            autoHeight: true,
            flex: 0,
            disabled: true
        }];

        me.callParent();

        me.down('#hcRfmrhinetowerLedFormBrightness').on('change', function(field, brightness) {
            GibsonOS.module.hc.rfmrhinetower.fn.setColor(field.gos.element, brightness);
            var gosData = Ext.decode(field.gos.element.getAttribute('gos'));

            if (gosData.brightness != brightness) {
                me.up('window').setDirty(true);
                me.up('window').setUpdateStatus(false);

                gosData.brightness = brightness;
                field.gos.element.setAttribute('gos', Ext.encode(gosData));
            }
        });
    }
});