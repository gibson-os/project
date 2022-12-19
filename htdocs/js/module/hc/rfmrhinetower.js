var rfmrhinetowerSettings = null;
var rfmrhinetowerLeds = {};
var rfmrhinetowerSelectedLed = {};
var rfmrhinetowerImageDirty = {};

function rfmrhinetowerView(module, id)
{
    rfmrhinetowerLeds[id] = {};
    rfmrhinetowerSelectedLed[id] = null;
    
    rfmrhinetowerImageDirty[id] = false;
    var checkImageDirty = function(callback) {
        if (rfmrhinetowerImageDirty[id]) {
            Ext.MessageBox.confirm('Bild geändert', 'Bild nicht gespeichert. Wirklich ändern?', function(buttonId) {
                if (buttonId == 'no') {
                    return false;
                }
                
                callback();
                rfmrhinetowerImageDirty[id] = false;
            });
        } else {
            callback();
        }
    }
    
    return new GibsonOS.Panel({
        title: 'Rheinturm',
        id: 'rfmrhinetowerViewPanel' + id,
        layout: 'border',
        requiredPermission: {
            module: 'hc',
            task: 'rfmrhinetower'
        },
        tbar: [{
            id: 'rfmrhinetowerViewDateBtn' + id,
            text: 'Datum',
            requiredPermission: {
                action: 'setclock',
                permission: GibsonOS.Permission.WRITE
            },
            menu: {
                xtype: 'gosMenuDatePicker',
                id: 'rfmrhinetowerViewDate' + id,
                format: 'd.m.Y',
                value: new Date()
            }
        },{
            xtype: 'gosFormTimefield',
            id: 'rfmrhinetowerViewTime' + id,
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
            id: 'rfmrhinetowerViewSetClockBtn' + id,
                iconCls: 'icon_system system_clock_set',
            requiredPermission: {
                action: 'setclock',
                permission: GibsonOS.Permission.WRITE
            },
            handler: function() {
                var date = Ext.getCmp('rfmrhinetowerViewDate' + id).picker.getValue();
                var time = Ext.getCmp('rfmrhinetowerViewTime' + id).getValue();
                var btn = Ext.getCmp('rfmrhinetowerViewSetClockBtn' + id);
                
                if (time == null) {
                    return false;
                }
                
                btn.disable();
                
                GibsonOS.Ajax.request({
                    url: baseDir + 'hc/rfmrhinetower/setclock',
                    params: {
                        id: module.id,
                        year: date.getYear()+1900,
                        month: date.getMonth(),
                        day: date.getDate()-1,
                        hour: time.getHours(),
                        minute: time.getMinutes(),
                        second: time.getSeconds()
                    },
                    success         : function(response) {
                        btn.enable();
                        Ext.getCmp('rfmrhinetowerViewShowClockBtn' + id).toggle(true, true);
                    },
                    failure         : function() {
                        btn.enable();
                        Ext.Msg.alert('Fehler!', 'Uhrzeit konnte nicht gesetzt werden.');
                    }
                });
            }
        },{
            xtype: 'gosButton',
            id: 'rfmrhinetowerViewShowClockBtn' + id,
            iconCls: 'icon_system system_clock_play',
            enableToggle: true,
            requiredPermission: {
                action: 'showclock',
                permission: GibsonOS.Permission.WRITE
            },
            listeners: {
                toggle: function(btn, pressed, options) {
                    btn.disable();

                    GibsonOS.Ajax.request({
                        url: baseDir + 'hc/rfmrhinetower/showclock',
                        params: {
                            id: module.id,
                            show: pressed
                        },
                        success         : function(response) {
                            btn.enable();
                            
                            if (pressed) {
                                Ext.getCmp('rfmrhinetowerViewClockLedBtn' + id).toggle(false, true);
                                Ext.getCmp('rfmrhinetowerPanelHours' + id).disable();
                                Ext.getCmp('rfmrhinetowerPanelMinutes' + id).disable();
                                Ext.getCmp('rfmrhinetowerPanelSeconds' + id).disable();
                            }
                        },
                        failure         : function() {
                            btn.enable();
                            btn.toggle(!pressed, true);
                            Ext.Msg.alert('Fehler!', 'Status konnte nicht aktualisiert werden.');
                        }
                    });
                }
            }
        },('-'),{
            xtype: 'gosButton',
            id: 'rfmrhinetowerViewAnimationBtn' + id,
            text: 'Animationen',
            requiredPermission: {
                action: 'playanimation',
                permission: GibsonOS.Permission.WRITE
            },
            startAnimation: function(animationId) {
                var btn = Ext.getCmp('rfmrhinetowerViewAnimation' + animationId + 'Btn' + id);                    
                btn.disable();

                GibsonOS.Ajax.request({
                    url: baseDir + 'hc/rfmrhinetower/playanimation',
                    params: {
                        id: module.id,
                        animation: animationId
                    },
                    success: function(response) {
                        btn.enable();
                    },
                    failure: function() {
                        btn.enable();
                        Ext.Msg.alert('Fehler!', 'Animation konnte nicht gestartet werden.');
                    }
                });
            },
            menu: [{
                id: 'rfmrhinetowerViewAnimation0Btn' + id,
                text: 'Test',
                handler: function() {
                    Ext.getCmp('rfmrhinetowerViewAnimationBtn' + id).startAnimation(0);
                }
            },{
                id: 'rfmrhinetowerViewAnimation1Btn' + id,
                text: 'Stunde',
                handler: function() {
                    Ext.getCmp('rfmrhinetowerViewAnimationBtn' + id).startAnimation(1);
                }
            },{
                id: 'rfmrhinetowerViewAnimation2Btn' + id,
                text: 'Tag',
                handler: function() {
                    Ext.getCmp('rfmrhinetowerViewAnimationBtn' + id).startAnimation(2);
                }
            },{
                id: 'rfmrhinetowerViewAnimation3Btn' + id,
                text: 'Monat',
                handler: function() {
                    Ext.getCmp('rfmrhinetowerViewAnimationBtn' + id).startAnimation(3);
                }
            },{
                id: 'rfmrhinetowerViewAnimation4Btn' + id,
                text: 'Jahr',
                handler: function() {
                    Ext.getCmp('rfmrhinetowerViewAnimationBtn' + id).startAnimation(4);
                }
            },{
                id: 'rfmrhinetowerViewAnimation5Btn' + id,
                text: 'Leuchtturm',
                handler: function() {
                    Ext.getCmp('rfmrhinetowerViewAnimationBtn' + id).startAnimation(5);
                }
            },{
                id: 'rfmrhinetowerViewAnimation6Btn' + id,
                text: 'Morgens',
                handler: function() {
                    Ext.getCmp('rfmrhinetowerViewAnimationBtn' + id).startAnimation(6);
                }
            },{
                id: 'rfmrhinetowerViewAnimation7Btn' + id,
                text: 'Abends',
                handler: function() {
                    Ext.getCmp('rfmrhinetowerViewAnimationBtn' + id).startAnimation(7);
                }
            },{
                id: 'rfmrhinetowerViewAnimation8Btn' + id,
                text: 'Sonnenaufgang',
                handler: function() {
                    Ext.getCmp('rfmrhinetowerViewAnimationBtn' + id).startAnimation(8);
                }
            },{
                id: 'rfmrhinetowerViewAnimation9Btn' + id,
                text: 'Sonnenuntergang',
                handler: function() {
                    Ext.getCmp('rfmrhinetowerViewAnimationBtn' + id).startAnimation(9);
                }
            },{
                id: 'rfmrhinetowerViewAnimation255Btn' + id,
                text: 'Stopp',
                handler: function() {
                    Ext.getCmp('rfmrhinetowerViewAnimationBtn' + id).startAnimation(255);
                }
            }]
        },('-'),{
            xtype: 'gosButton',
            id: 'rfmrhinetowerViewStatusBtn' + id,
            iconCls: 'icon_system system_refresh',
            requiredPermission: {
                action: 'status',
                permission: GibsonOS.Permission.WRITE
            },
            handler: function() {
                var btn = Ext.getCmp('rfmrhinetowerViewStatusBtn' + id);
                btn.disable();

                GibsonOS.Ajax.request({
                    url: baseDir + 'hc/rfmrhinetower/status',
                    params: {
                        id: module.id,
                        renew: true
                    },
                    success         : function(response) {
                        btn.enable();
                        Ext.getCmp('rfmrhinetowerViewPanel' + id).setStatus(Ext.decode(response.responseText).data);
                    },
                    failure         : function() {
                        btn.enable();
                        Ext.Msg.alert('Fehler!', 'Status konnte nicht aktualisiert werden.');
                    }
                });
            }
        }],
        items: [{
            region: 'center',
            id: 'rfmrhinetowerViewCenter' + id
        },{
            region: 'east',
            layout: 'border',
            id: 'rfmrhinetowerViewEast' + id,
            width: 285,
            flex: 0,
            tbar: [{
                xtype: 'gosButton',
                id: 'rfmrhinetowerViewSetBtn' + id,
                iconCls: 'icon_system system_show',
                requiredPermission: {
                    action: 'set',
                    permission: GibsonOS.Permission.WRITE
                },
                handler: function() {
                    var btn = Ext.getCmp('rfmrhinetowerViewSetBtn' + id);
                    btn.disable();

                    GibsonOS.Ajax.request({
                        url: baseDir + 'hc/rfmrhinetower/set',
                        params: {
                            id: module.id,
                            led_list: Ext.encode(rfmrhinetowerLeds[id])
                        },
                        success: function(response) {
                            btn.enable();
                            
                            if (Ext.getCmp('rfmrhinetowerViewClockLedBtn' + id).pressed) {
                                Ext.getCmp('rfmrhinetowerViewShowClockBtn' + id).toggle(false, true);
                            }
                            
                            rfmrhinetowerImageDirty[id] = false;
                        },
                        failure: function() {
                            btn.enable();
                            Ext.Msg.alert('Fehler!', 'LEDs konnten nicht gesetzt werden. Bitte versuche es erneut.');
                        }
                    });
                }
            },{
                xtype: 'gosButton',
                id: 'rfmrhinetowerViewClockLedBtn' + id,
                iconCls: 'icon_system system_clock_edit',
                enableToggle: true,
                requiredPermission: {
                    action: 'set',
                    permission: GibsonOS.Permission.WRITE
                },
                listeners: {
                    toggle: function(btn, pressed, options) {
                        var keys = {
                            1: [0, 1],
                            3: [0, 1],
                            5: [0, 1, 2, 3, 4],
                            6: [0, 1, 2, 3, 4, 5, 6, 7],
                            7: [0, 1, 2, 3, 4, 5, 6, 7]
                        };
                        
                        var hours = Ext.getCmp('rfmrhinetowerPanelHours' + id);
                        var minutes = Ext.getCmp('rfmrhinetowerPanelMinutes' + id);
                        var seconds = Ext.getCmp('rfmrhinetowerPanelSeconds' + id);
                        
                        if (pressed) {
                            hours.enable();
                            minutes.enable();
                            seconds.enable();
                            
                            for (x = 0; x < 8; x++) {
                                if (typeof(rfmrhinetowerLeds[id][x]) != 'object') {
                                    rfmrhinetowerLeds[id][x] = {};
                                }
                                
                                for (y = 0; y < 8; y++) {
                                    if (typeof(rfmrhinetowerLeds[id][x][y]) != 'object') {
                                        rfmrhinetowerLeds[id][x][y] = {
                                            brightness: 0,
                                            blink: 0
                                        };
                                    }
                                }
                            }
                        } else {
                            hours.disable();
                            minutes.disable();
                            seconds.disable();
                            
                            var newLeds = {};
                            
                            Ext.iterate(keys, function(rowKey, row) {
                                newLeds[rowKey] = {};
                                
                                Ext.iterate(row, function(key) {
                                    newLeds[rowKey][key] = rfmrhinetowerLeds[id][rowKey][key];
                                });
                            });
                            
                            rfmrhinetowerLeds[id] = newLeds;
                        }
                        
                        rfmrhinetowerImageDirty[id] = true;
                    }
                }
            },('-'),{
                id: 'rfmrhinetowerImageLoad' + id,
                xtype: 'gosFormComboBox',
                hideLabel: true,
                width: 100,
                emptyText: 'Laden',
                requiredPermission: {
                    action: 'image',
                    permission: GibsonOS.Permission.READ
                },
                store: {
                    xtype: 'gosDataStore',
                    fields: [{
                        name: 'id',
                        type: 'int'
                    },{
                        name: 'name',
                        type: 'string'
                    }]
                },
                listeners: {
                    select: function(combo, records) {
                        checkImageDirty(function() {
                            GibsonOS.Ajax.request({
                                url: baseDir + 'hc/rfmrhinetower/image',
                                params: {
                                    id: records[0].get('id')
                                },
                                success: function(response) {
                                    Ext.getCmp('rfmrhinetowerImageName' + id).setValue(records[0].get('name'));
                                    Ext.getCmp('rfmrhinetowerBtnImageSave' + id).enable();
                                    Ext.getCmp('rfmrhinetowerBtnImageDelete' + id).enable();
                                    Ext.getCmp('rfmrhinetowerViewEast' + id).setStatus(Ext.decode(response.responseText).data);
                                },
                                failure: function() {
                                    btn.enable();
                                    Ext.Msg.alert('Fehler!', 'Konnte Bild nicht laden.');
                                }
                            });
                        });
                    }
                }
            },('-'),{
                id: 'rfmrhinetowerImageName' + id,
                xtype: 'gosFormTextfield',
                hideLabel: true,
                width: 75,
                enableKeyEvents: true,
                emptyText: 'Name',
                requiredPermission: {
                    action: 'saveimage',
                    permission: GibsonOS.Permission.WRITE
                },
                listeners: {
                    keyup: function(field, event, options) {
                        var saveBtn = Ext.getCmp('rfmrhinetowerBtnImageSave' + id);
                        
                        if (field.getValue().length) {
                            saveBtn.enable();
                        } else {
                            saveBtn.disable();
                        }
                    }
                }
            },{
                id: 'rfmrhinetowerBtnImageSave' + id,
                xtype: 'gosButton',
                iconCls: 'icon_system system_save',
                disabled: true,
                requiredPermission: {
                    action: 'saveimage',
                    permission: GibsonOS.Permission.WRITE
                },
                save: function(name, overwrite) {
                    GibsonOS.Ajax.request({
                        url: baseDir + 'hc/rfmrhinetower/saveimage',
                        params: {
                            id: module.id,
                            name: name,
                            ledList: Ext.encode(rfmrhinetowerLeds[id]),
                            overwrite: overwrite
                        },
                        success: function(response) {
                            var loadField = Ext.getCmp('rfmrhinetowerImageLoad' + id);
                            var data = Ext.decode(response.responseText).data;
                            
                            loadField.getStore().loadData(data.list);
                            loadField.setValue(data.id);
                            
                            rfmrhinetowerImageDirty[id] = false;
                        },
                        failure: function(response) {
                            var data = Ext.decode(response.responseText).data;
                            
                            if (data.overwrite) {
                                Ext.MessageBox.confirm(
                                    'Überschreiben?',
                                    'Es existiert schon ein Bild unter dem Namen "' + name + '". Möchten Sie es überschreiben?',
                                    function(buttonId) {
                                        if (buttonId == 'no') {
                                            return false;
                                        }
                                        
                                        Ext.getCmp('rfmrhinetowerBtnImageSave' + id).save(name, true);
                                    }
                                );
                            } else {
                                var errorMsg = data.msg ? data.msg : 'Bild konnte nicht gespeichert werden.';
                                Ext.MessageBox.alert('Fehler!', errorMsg);
                            }
                        }
                    });
                },
                handler: function() {
                    var name = Ext.getCmp('rfmrhinetowerImageName' + id).getValue();
                    this.save(name, false);
                }
            },{
                id: 'rfmrhinetowerBtnImageDelete' + id,
                xtype: 'gosButton',
                iconCls: 'icon_system system_delete',
                disabled: true,
                requiredPermission: {
                    action: 'deleteimage',
                    permission: GibsonOS.Permission.DELETE
                },
                handler: function() {
                    Ext.MessageBox.confirm('Bild löschen?', 'Möchten Sie das Bild wirklich löchen?', function(btnId) {
                        if (btnId == 'no') {
                            return false;
                        }
                        
                        GibsonOS.Ajax.request({
                            url: baseDir + 'hc/rfmrhinetower/deleteimage',
                            params: {
                                id: module.id,
                                sequenceId: Ext.getCmp('rfmrhinetowerImageLoad' + id).getValue()
                            },
                            success: function(response) {
                                var loadField = Ext.getCmp('rfmrhinetowerImageLoad' + id);
                                var data = Ext.decode(response.responseText).data;
                                
                                loadField.setValue(null);
                                loadField.getStore().loadData(data);
                            },
                            failure: function() {
                                Ext.Msg.alert('Fehler!', 'Bild konnte nicht gelöscht werden.');
                            }
                        });
                    });
                }
            }],
            setStatus: function(ledList) {
                Ext.iterate(ledList, function(x, row) {
                    x = x.substr(1);
                    
                    Ext.iterate(row, function(y, led) {
                        y = y.substr(1);
                        
                        if (typeof(rfmrhinetowerLeds[id][x]) != 'object') {
                            rfmrhinetowerLeds[id][x] = {};
                        }
                    
                        rfmrhinetowerLeds[id][x][y] = {
                            brightness: led.brightness,
                            blink: led.blink
                        };
                        
                        document.getElementById('rfmrhinetowerSvg' + x + y + id).onclick();
                    });
                    
                });
                
                var hours = Ext.getCmp('rfmrhinetowerPanelHours' + id);
                var minutes = Ext.getCmp('rfmrhinetowerPanelMinutes' + id);
                var seconds = Ext.getCmp('rfmrhinetowerPanelSeconds' + id);
                var clockLedBtn = Ext.getCmp('rfmrhinetowerViewClockLedBtn' + id);
                
                if (Ext.Object.getSize(ledList) == 8) {
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
            },
            items: [{
                xtype: 'gosTabPanel',
                region: 'center',
                autoHeight: true,
                deferredRender: false,
                items: [{
                    xtype: 'gosPanel',
                    title: 'Korb',
                    autoHeight: true,
                    autoScroll: true,
                    items: [{
                        xtype: 'gosFormFieldset',
                        title: 'Oben',
                        data: [],
                        tpl: new Ext.XTemplate(
                            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="165">',
                                '<circle cx="130" cy="80" r="80" style="stroke: #000; fill: #999;" />',
                                '<circle cx="80" cy="60" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg63' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 6, 3, 0, 0, 15)" />',
                                '<circle cx="110" cy="30" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg62' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 6, 2, 0, 0, 15)" />',
                                '<circle cx="150" cy="30" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg61' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 6, 1, 0, 0, 15)" />',
                                '<circle cx="180" cy="60" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg60' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 6, 0, 0, 0, 15)" />',
                                '<circle cx="80" cy="105" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg64' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 6, 4, 0, 0, 15)" />',
                                '<circle cx="110" cy="135" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg65' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 6, 5, 0, 0, 15)" />',
                                '<circle cx="150" cy="135" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg66' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 6, 6, 0, 0, 15)" />',
                                '<circle cx="180" cy="105" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg67' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 6, 7, 0, 0, 15)" />',
                            '</svg>'
                        )
                    },{
                        xtype: 'gosFormFieldset',
                        title: 'Unten',
                        data: [],
                        tpl: new Ext.XTemplate(
                            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="165">',
                                '<circle cx="130" cy="80" r="80" style="stroke: #000; fill: #999;" />',
                                '<circle cx="80" cy="60" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg73' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 7, 3, 15, 15, 15)" />',
                                '<circle cx="110" cy="30" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg72' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 7, 2, 15, 15, 15)" />',
                                '<circle cx="150" cy="30" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg71' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 7, 1, 15, 15, 15)" />',
                                '<circle cx="180" cy="60" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg70' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 7, 0, 15, 15, 15)" />',
                                '<circle cx="80" cy="105" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg74' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 7, 4, 15, 15, 15)" />',
                                '<circle cx="110" cy="135" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg75' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 7, 5, 15, 15, 15)" />',
                                '<circle cx="150" cy="135" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg76' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 7, 6, 15, 15, 15)" />',
                                '<circle cx="180" cy="105" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg77' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 7, 7, 15, 15, 15)" />',
                            '</svg>'
                        )
                    }]
                },{
                    xtype: 'gosPanel',
                    title: 'Flugfeuer',
                    autoHeight: true,
                    autoScroll: true,
                    items: [{
                        xtype: 'gosFormFieldset',
                        title: 'Spitze',
                        data: [],
                        tpl: new Ext.XTemplate(
                            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="165">',
                                '<circle cx="130" cy="10" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg50' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 5, 0, 15, 0, 0)" />',
                                '<rect x="115" y="15" width="30" height="40" style="fill: #F00;" />',
                                '<rect x="115" y="55" width="30" height="50" style="fill: #FFF;" />',
                                '<rect x="115" y="105" width="30" height="50" style="fill: #F00;" />',
                            '</svg>'
                        )
                    },{
                        xtype: 'gosFormFieldset',
                        title: 'Oben',
                        data: [],
                        tpl: new Ext.XTemplate(
                            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="165">',
                                '<circle cx="130" cy="80" r="80" style="stroke: #000; fill: #999;" />',
                                '<circle cx="75" cy="20" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg51' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 5, 1, 15, 0, 0)" />',
                                '<circle cx="185" cy="20" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg52' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 5, 2, 15, 0, 0)" />',
                                '<circle cx="185" cy="140" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg53' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 5, 3, 15, 0, 0)" />',
                                '<circle cx="75" cy="140" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg54' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 5, 4, 15, 0, 0)" />',
                            '</svg>'
                        )
                    },{
                        xtype: 'gosFormFieldset',
                        title: 'Unten',
                        data: [],
                        tpl: new Ext.XTemplate(
                            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="165">',
                                '<circle cx="130" cy="80" r="80" style="stroke: #000; fill: #999;" />',
                                '<circle cx="75" cy="20" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg31' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 3, 1, 15, 0, 0)" />',
                                '<circle cx="185" cy="20" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg30' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 3, 0, 15, 0, 0)" />',
                                '<circle cx="75" cy="140" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg11' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 1, 1, 15, 0, 0)" />',
                                '<circle cx="185" cy="140" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg10' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 1, 0, 15, 0, 0)" />',
                            '</svg>'
                        )
                    }]
                },{
                    xtype: 'gosPanel',
                    id: 'rfmrhinetowerPanelHours' + id,
                    title: 'Stunden',
                    autoHeight: true,
                    autoScroll: true,
                    disabled: true,
                    items: [{
                        xtype: 'gosFormFieldset',
                        title: 'Zehner',
                        data: [],
                        tpl: new Ext.XTemplate(
                            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="80">',
                                '<rect x="105" y="0" width="50" height="80" style="stroke: #000; fill: #999;" />',
                                '<circle cx="130" cy="25" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg55' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 5, 5, 15, 15, 0)" />',
                                '<circle cx="130" cy="55" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg56' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 5, 6, 15, 15, 0)" />',
                            '</svg>'
                        )
                    },{
                        xtype: 'gosFormFieldset',
                        title: 'Einer',
                        data: [],
                        tpl: new Ext.XTemplate(
                            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="290">',
                                '<rect x="105" y="0" width="50" height="290" style="stroke: #000; fill: #999;" />',
                                '<circle cx="130" cy="25" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg57' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 5, 7, 15, 15, 0)" />',
                                '<circle cx="130" cy="55" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg40' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 4, 0, 15, 15, 0)" />',
                                '<circle cx="130" cy="85" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg41' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 4, 1, 15, 15, 0)" />',
                                '<circle cx="130" cy="115" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg42' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 4, 2, 15, 15, 0)" />',
                                '<circle cx="130" cy="145" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg43' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 4, 3, 15, 15, 0)" />',
                                '<circle cx="130" cy="175" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg44' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 4, 4, 15, 15, 0)" />',
                                '<circle cx="130" cy="205" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg45' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 4, 5, 15, 15, 0)" />',
                                '<circle cx="130" cy="235" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg46' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 4, 6, 15, 15, 0)" />',
                                '<circle cx="130" cy="265" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg47' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 4, 7, 15, 15, 0)" />',
                            '</svg>'
                        )
                    }]
                },{
                    xtype: 'gosPanel',
                    id: 'rfmrhinetowerPanelMinutes' + id,
                    title: 'Minuten',
                    autoHeight: true,
                    autoScroll: true,
                    disabled: true,
                    items: [{
                        xtype: 'gosFormFieldset',
                        title: 'Zehner',
                        data: [],
                        tpl: new Ext.XTemplate(
                            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="170">',
                                '<rect x="105" y="0" width="50" height="170" style="stroke: #000; fill: #999;" />',
                                '<circle cx="130" cy="25" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg32' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 3, 2, 15, 15, 0)" />',
                                '<circle cx="130" cy="55" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg33' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 3, 3, 15, 15, 0)" />',
                                '<circle cx="130" cy="85" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg34' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 3, 4, 15, 15, 0)" />',
                                '<circle cx="130" cy="115" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg35' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 3, 5, 15, 15, 0)" />',
                                '<circle cx="130" cy="145" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg36' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 3, 6, 15, 15, 0)" />',
                            '</svg>'
                        )
                    },{
                        xtype: 'gosFormFieldset',
                        title: 'Einer',
                        data: [],
                        tpl: new Ext.XTemplate(
                            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="290">',
                                '<rect x="105" y="0" width="50" height="290" style="stroke: #000; fill: #999;" />',
                                '<circle cx="130" cy="25" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg37' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 3, 7, 15, 15, 0)" />',
                                '<circle cx="130" cy="55" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg20' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 2, 0, 15, 15, 0)" />',
                                '<circle cx="130" cy="85" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg21' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 2, 1, 15, 15, 0)" />',
                                '<circle cx="130" cy="115" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg22' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 2, 2, 15, 15, 0)" />',
                                '<circle cx="130" cy="145" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg23' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 2, 3, 15, 15, 0)" />',
                                '<circle cx="130" cy="175" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg24' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 2, 4, 15, 15, 0)" />',
                                '<circle cx="130" cy="205" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg25' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 2, 5, 15, 15, 0)" />',
                                '<circle cx="130" cy="235" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg26' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 2, 6, 15, 15, 0)" />',
                                '<circle cx="130" cy="265" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg27' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 2, 7, 15, 15, 0)" />',
                            '</svg>'
                        )
                    }]
                },{
                    xtype: 'gosPanel',
                    id: 'rfmrhinetowerPanelSeconds' + id,
                    title: 'Sekunden',
                    autoHeight: true,
                    autoScroll: true,
                    disabled: true,
                    items: [{
                        xtype: 'gosFormFieldset',
                        title: 'Zehner',
                        data: [],
                        tpl: new Ext.XTemplate(
                            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="170">',
                                '<rect x="105" y="0" width="50" height="170" style="stroke: #000; fill: #999;" />',
                                '<circle cx="130" cy="25" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg12' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 1, 2, 15, 15, 0)" />',
                                '<circle cx="130" cy="55" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg13' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 1, 3, 15, 15, 0)" />',
                                '<circle cx="130" cy="85" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg14' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 1, 4, 15, 15, 0)" />',
                                '<circle cx="130" cy="115" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg15' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 1, 5, 15, 15, 0)" />',
                                '<circle cx="130" cy="145" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg16' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 1, 6, 15, 15, 0)" />',
                            '</svg>'
                        )
                    },{
                        xtype: 'gosFormFieldset',
                        title: 'Einer',
                        data: [],
                        tpl: new Ext.XTemplate(
                            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="290">',
                                '<rect x="105" y="0" width="50" height="290" style="stroke: #000; fill: #999;" />',
                                '<circle cx="130" cy="25" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg17' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 1, 7, 15, 15, 0)" />',
                                '<circle cx="130" cy="55" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg00' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 0, 0, 15, 15, 0)" />',
                                '<circle cx="130" cy="85" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg01' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 0, 1, 15, 15, 0)" />',
                                '<circle cx="130" cy="115" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg02' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 0, 2, 15, 15, 0)" />',
                                '<circle cx="130" cy="145" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg03' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 0, 3, 15, 15, 0)" />',
                                '<circle cx="130" cy="175" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg04' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 0, 4, 15, 15, 0)" />',
                                '<circle cx="130" cy="205" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg05' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 0, 5, 15, 15, 0)" />',
                                '<circle cx="130" cy="235" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg06' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 0, 6, 15, 15, 0)" />',
                                '<circle cx="130" cy="265" r="10" class="hc_rfmrhinetower_svg_led" id="rfmrhinetowerSvg07' + id + '" onclick="rfmrhinetowerSelectLed(\'' + id + '\', 0, 7, 15, 15, 0)" />',
                            '</svg>'
                        )
                    }]
                }]
            },{
                region: 'south',
                height: 60,
                flex: 0,
                padding: 5,
                items: [{
                    xtype: 'gosFormNumberfield',
                    id: 'rfmrhinetowerBrightnessBtn' + id,
                    fieldLabel: 'Helligkeit',
                    maxValue: 15,
                    disabled: true,
                    requiredPermission: {
                        action: 'set',
                        permission: GibsonOS.Permission.WRITE
                    },
                    listeners: {
                        change: function(field, newValue, oldValue, options) {
                            var x = rfmrhinetowerSelectedLed[id][0];
                            var y = rfmrhinetowerSelectedLed[id][1];
                            var red = rfmrhinetowerSelectedLed[id][2];
                            var green = rfmrhinetowerSelectedLed[id][3];
                            var blue = rfmrhinetowerSelectedLed[id][4];
                            var color = '#';
                            
                            rfmrhinetowerLeds[id][x][y].brightness = newValue;
                            rfmrhinetowerImageDirty[id] = true;
                            
                            color += parseInt((red/15)*newValue).toString(16);
                            color += parseInt((green/15)*newValue).toString(16);
                            color += parseInt((blue/15)*newValue).toString(16);
                            document.getElementById('rfmrhinetowerSvg' + x + y + id).style.fill = color;
                        }
                    }
                },{
                    xtype: 'gosFormNumberfield',
                    id: 'rfmrhinetowerBlinkBtn' + id,
                    fieldLabel: 'Blinken',
                    maxValue: 7,
                    disabled: true,
                    requiredPermission: {
                        action: 'set',
                        permission: GibsonOS.Permission.WRITE
                    },
                    listeners: {
                        change: function(field, newValue, oldValue, options) {
                            var x = rfmrhinetowerSelectedLed[id][0];
                            var y = rfmrhinetowerSelectedLed[id][1];
                            
                            rfmrhinetowerLeds[id][x][y].blink = newValue;
                            rfmrhinetowerImageDirty[id] = true;
                        }
                    }
                }]
            }]
        }],
        setStatus: function(data) {
            Ext.getCmp('rfmrhinetowerViewEast' + id).setStatus(data.ledList);            
            Ext.getCmp('rfmrhinetowerViewShowClockBtn' + id).toggle(data.clock.show, true);
            Ext.getCmp('rfmrhinetowerImageLoad' + id).getStore().loadData(data.images);
        },
        listeners: {
            afterrender: function(panel, options) {
                var setTime = function() {
                    if (
                        !Ext.getCmp('rfmrhinetowerViewTime' + id) ||
                        !Ext.getCmp('rfmrhinetowerViewDate' + id).picker
                    ) {
                        return false;
                    }
                    
                    var date = new Date();
                    Ext.getCmp('rfmrhinetowerViewTime' + id).setValue(date);
                    Ext.getCmp('rfmrhinetowerViewDate' + id).picker.setValue(date);
                    
                    setTimeout(setTime, 900);
                };
                setTime();
                
                var getStatus = function() {
                    GibsonOS.Ajax.request({
                        url: baseDir + 'hc/rfmrhinetower/status',
                        params: {
                            id: module.id
                        },
                        success: function(response) {
                            var data = Ext.decode(response.responseText).data;
                            panel.setStatus(data);
                        },
                        failure: function(response) {
                        }
                    });
                };
                getStatus();
            }
        }
    });
}

function rfmrhinetowerSelectLed(id, x, y, red, green, blue)
{
    var brightness = Ext.getCmp('rfmrhinetowerBrightnessBtn' + id);
    var blink = Ext.getCmp('rfmrhinetowerBlinkBtn' + id);
    
    brightness.enable();
    blink.enable();
    
    rfmrhinetowerSelectedLed[id] = [x, y, red, green, blue];
    var red = rfmrhinetowerSelectedLed[id][2];
    var green = rfmrhinetowerSelectedLed[id][3];
    var blue = rfmrhinetowerSelectedLed[id][4];
    var color = '#';
    
    color += parseInt((red/15)*rfmrhinetowerLeds[id][x][y].brightness).toString(16);
    color += parseInt((green/15)*rfmrhinetowerLeds[id][x][y].brightness).toString(16);
    color += parseInt((blue/15)*rfmrhinetowerLeds[id][x][y].brightness).toString(16);
    
    brightness.setRawValue(rfmrhinetowerLeds[id][x][y].brightness);
    document.getElementById('rfmrhinetowerSvg' + x + y + id).style.fill = color;
    blink.setRawValue(rfmrhinetowerLeds[id][x][y].blink);
}