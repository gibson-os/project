var desktopStore = null;

Ext.onReady(function()
{
    Ext.define('desktop', {
        extend: 'GibsonOS.data.Model',
        fields: [{
            name: 'text',
            type: 'string'
        },{
            name: 'icon',
            type: 'string'
        },{
            name: 'thumb',
            type: 'string'
        },{
            name: 'customIcon',
            type: 'int'
        },{
            name: 'module',
            type: 'string'
        },{
            name: 'task',
            type: 'string'
        },{
            name: 'action',
            type: 'string'
        },{
            name: 'params',
            type: 'object'
        }]
    });

    var saveDesktop = function() {
        var records = [];
        
        Ext.getCmp('desktop').getStore().each(function(record) {
            records.push(record.getData());
        });
        
        GibsonOS.Ajax.request({
            url: baseDir + 'core/desktop/save',
            params: {
                items: Ext.encode(records)
            }
        });
    };

    var desktopStore = new GibsonOS.data.Store({
        model: 'desktop',
        autoLoad: true,
        proxy: {
            type: 'gosDataProxyAjax',
            url: baseDir + 'core/desktop/index',
            reader: {
                type: 'gosDataReaderJson',
                root: 'data.desktop'
            }
        }
    });

	new GibsonOS.Panel({
	    renderTo: 'extBody',
        id: 'desktopContainer',
	    height: window.innerHeight,
	    items: [{
            xtype: 'gosView',
	        id: 'desktop',
            height: window.innerHeight-25,
	        border: false,
            flex: 0,
            autoHeight: true,
            store: desktopStore,
            multiSelect: false,
            singleSelect: true,
            trackOver: true,
            itemSelector: 'div.desktop_item',
            selectedItemCls: 'desktop_item_selected',
            overItemCls: 'desktop_item_hover',
            selectedRecord: null,
            dblClickAction: false,
            activeDropZone: null,
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="desktop_item" title="{text}">',
                        '<tpl if="thumb">',
                            '<div class="desktop_item_icon icon64" style="background-image: url(data:image/png;base64,{thumb});"></div>',
                        '<tpl else>',
                            '<div class="desktop_item_icon icon64 <tpl if="customIcon &gt; 0">customIcon{customIcon}<tpl else>{icon}</tpl>"></div>',
                        '</tpl>',
                        '<div class="desktop_item_name">{text}</div>',
                    '</div>',
                '</tpl>'
            ),
            itemContextMenu: [{
                text: 'Öffnen',
                handler: function() {
                    var desktop = Ext.getCmp('desktop');
                    var record = this.up('menu').record;
                    var functionName = record.get('module');
                    var params = '';

                    functionName += record.get('task').charAt(0).toUpperCase() + record.get('task').slice(1);
                    functionName += record.get('action').charAt(0).toUpperCase() + record.get('action').slice(1);

                    if (record.get('params')) {
                        params = Ext.encode(record.get('params'));
                    }

                    eval(functionName + '(' + params + ');');
                }
            },{
                id: 'desktopRenameBtn',
                text: 'Umbennen',
                handler: function() {
                    var desktop = Ext.getCmp('desktop').renameItem(this.up('menu').record);
                }
            },{
                text: 'Löschen',
                iconCls: 'icon_system system_delete',
                handler: function() {
                    var desktop = Ext.getCmp('desktop');
                    desktop.getStore().remove(this.up('menu').record);
                    saveDesktop();
                }
            },{
                text: 'Icon ändern',
                handler: function() {
                }
            }],
            renameItem: function(record) {
                Ext.MessageBox.prompt('Neuer Name', 'Neuer Name', function(btn, text) {
                    if (btn == 'ok') {
                        record.set('text', text);
                        saveDesktop();
                    }
                }, window, false, record.get('text'));
            },
            listeners: {
                render: function(view) {
                    view.dragZone = Ext.create('Ext.dd.DragZone', view.getEl(), {
                        getDragData: function(event) {
                            var sourceElement = event.getTarget(view.itemSelector, 10), clone;

                            if (sourceElement) {
                                var record = view.getRecord(sourceElement);

                                clone = sourceElement.cloneNode(true);

                                return view.dragData = {
                                    sourceEl: sourceElement,
                                    repairXY: Ext.fly(sourceElement).getXY(),
                                    ddel: clone,
                                    move: record,
                                    shortcut: record.getData()
                                };
                            }
                        },
                        getRepairXY: function() {
                            return this.dragData.repairXY;
                        }
                    });
                    view.dropZone = Ext.create('Ext.dd.DropZone', view.getEl(), {
                        getTargetFromEvent: function(event) {
                            if (event.getTarget('.x-window') != null) {
                                let target = null;

                                Ext.iterate(GibsonOS.dropZones.zones, function(elementId, dropZone) {
                                    target = dropZone.getTargetFromEvent(event);

                                    if (!target) {
                                        return true;
                                    }

                                    view.activeDropZone = dropZone;

                                    return false;
                                });

                                if (!target) {
                                    view.activeDropZone = null;
                                }

                                return target;
                            }

                            view.activeDropZone = null;

                            if (event.getTarget('.desktop_item') != null) {
                                return event.getTarget('.desktop_item');
                            }

                            return event.getTarget('#desktop');
                        },
                        onNodeOver : function(target, dd, event, data) {
                            if (view.activeDropZone) {
                                return view.activeDropZone.onNodeOver(target, dd, event, data);
                            }

                            if (data.shortcut) {
                                return Ext.dd.DropZone.prototype.dropAllowed;
                            }

                            view.activeDropZone = null;

                            return Ext.dd.DropZone.prototype.dropNotAllowed;
                        },
                        onNodeDrop: function(target, dd, event, data) {
                            if (view.activeDropZone) {
                                return view.activeDropZone.onNodeDrop(target, dd, event, data);
                            }

                            if (!data.shortcut) {
                                return;
                            }

                            if (data.move) {
                                view.getStore().remove(data.move);
                            }

                            var record = view.getRecord(target);

                            if (event.getTarget('.desktop_item') != null) {
                                var pos = view.getStore().indexOf(record);
                                view.getStore().insert(pos, data.shortcut);
                            } else {
                                view.getStore().add(data.shortcut);
                            }

                            saveDesktop();
                        }
                    });
                },
                deselect: function(viewModel, record, options) {
                    Ext.getCmp('desktop').selectedRecord = null;
                },
                itemclick: function(view, record, item, index, event, options) {
                    if (record != view.selectedRecord) {
                        view.selectedRecord = record;
                    } else {
                        view.dblClickAction = false;

                        setTimeout(function () {
                            if (!view.dblClickAction) {
                                view.renameItem(record);
                            }
                        }, 500);

                    }
                },
                itemdblclick: function(view, record, item, index, event, options) {
                    view.dblClickAction = true;

                    var functionName = record.get('module');
                    var params = '';

                    functionName += record.get('task').charAt(0).toUpperCase() + record.get('task').slice(1);
                    functionName += record.get('action').charAt(0).toUpperCase() + record.get('action').slice(1);

                    if (record.get('params')) {
                        params = Ext.encode(record.get('params'));
                    }

                    if (eval('typeof(' + functionName + ') == "function"')) {
                        // @todo Alter weg. Sollte so bald wie möglich raus
                        eval(functionName + '(' + params + ');');
                    } else {
                        var params = '';

                        if (record.get('params')) {
                            params = '{gos: {data: ' + Ext.encode(record.get('params')) + '}}';
                        }

                        functionName = 'GibsonOS.module.' + record.get('module') + '.'
                                     + record.get('task') + '.App';

                        if (eval('typeof(' + functionName + ') == "function"')) {
                            eval('new ' + functionName + '(' + params + ');');
                        } else {
                            GibsonOS.MessageBox.show({msg: 'Modul wurde nicht gefunden!'});
                        }
                    }
                }
            }
	    }],
	    bbar: [{
            xtype: 'gosButton',
            id: 'startmenu',
            iconCls: 'icon16 icon_logo',
            menu: [{
                xtype: 'gosStartMenuButton',
                text: 'Programme',
                menu: [],
                listeners: {
                    render: function(btn) {
                        Ext.iterate(desktopStore.getProxy().getReader().jsonData.data.apps, function(app) {
                            btn.menu.add({
                                xtype: 'gosStartMenuButton',
                                text: app.text,
                                iconCls: 'icon16 ' + app.icon,
                                handler: function() {
                                    var functionName = app.module;
                                    functionName += app.task.charAt(0).toUpperCase() + app.task.slice(1);
                                    functionName += app.action.charAt(0).toUpperCase() + app.action.slice(1);

                                    if (eval('typeof(' + functionName + ') == "function"')) {
                                        eval(functionName + '();');
                                    } else {
                                        functionName = 'GibsonOS.module.' + app.module + '.'
                                                     + app.task + '.App';

                                        if (eval('typeof(' + functionName + ') == "function"')) {
                                            eval('new ' + functionName + '();');
                                        } else {
                                            GibsonOS.MessageBox.show({msg: 'Modul wurde nicht gefunden!'});
                                        }
                                    }
                                },
                                listeners: {
                                    render: function(btn) {
                                        btn.dragZone = Ext.create('Ext.dd.DragZone', btn.getEl(), {
                                            getDragData: function(event) {
                                                var sourceElement = event.getTarget();

                                                if (sourceElement) {
                                                    var clone = sourceElement.cloneNode(true);
                                                    return btn.dragData = {
                                                        sourceEl: sourceElement,
                                                        repairXY: Ext.fly(sourceElement).getXY(),
                                                        ddel: clone,
                                                        shortcut: app
                                                    };
                                                }
                                            },
                                            getRepairXY: function() {
                                                return this.dragData.repairXY;
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    }
                }
            },{
                xtype: 'gosStartMenuButton',
                text: 'Verwaltung',
                menu: [{
                    xtype: 'gosStartMenuButton',
                    text: 'Benutzer',
                    iconCls: 'icon16 icon_user',
		            handler: function() {
                        new GibsonOS.module.core.user.App();
		            }
                },{
                    xtype: 'gosStartMenuButton',
                    text: 'Module',
                    iconCls: 'icon16 icon_modules',
                    handler: function() {
                        new GibsonOS.module.core.module.App();
                    }
                },{
                    xtype: 'gosStartMenuButton',
                    text: 'Icons',
                    handler: function() {
                        new GibsonOS.module.core.icon.App();
                    }
                },{
                    xtype: 'gosStartMenuButton',
                    text: 'Cronjobs',
                    handler: function() {
                        new GibsonOS.module.core.cronjob.App();
                    }
                },{
                    xtype: 'gosStartMenuButton',
                    text: 'Events',
                    handler: function() {
                        new GibsonOS.module.core.event.App();
                    }
                }]
            },{
                xtype: 'gosStartMenuButton',
                text: 'Einstellungen',
                iconCls: 'icon16 icon_settings',
                handler: function() {
                    new GibsonOS.module.core.user.setting.App();
                }
            },('-'),{
                xtype: 'gosStartMenuButton',
                text: 'Logout',
                iconCls: 'icon_system system_exit',
                handler: function() {
                    document.location = baseDir + 'core/user/logout';
                }
            }]
        },('-'),{
            xtype: 'gosPanel',
		    id: 'quicklaunch',
		    frame: false,
		    plain: false,
		    flex: 0
        },('-'),{
            xtype: 'gosPanel',
		    id: 'taskbar',
		    frame: false,
		    plain: false,
		    flex: 0
        },('->'),('-'),{
            xtype: 'gosButton',
            id: 'clock',
            enableToggle: true,
            timeDifference: 0,
            setTime: function() {
                var btn = Ext.getCmp('clock');
                var clockWindow = Ext.getCmp('clockWindow');
                var localDate = new Date();
                var showDate = new Date(localDate.getTime() + btn.timeDifference);
                
                btn.setText(Ext.Date.format(showDate, 'H:i'));
                
                if (clockWindow) {
                    clockWindow.update({
                        date: Ext.Date.format(showDate, 'l, d.m.Y (W)'),
                        time: Ext.Date.format(showDate, 'H:i:s'),
                        sunrise: Ext.Date.format(new Date(serverDate.sunrise*1000), 'H:i'),
                        sunset: Ext.Date.format(new Date(serverDate.sunset*1000), 'H:i')
                    });
                }
                
                setTimeout(btn.setTime, 250);
            },
            listeners: {
                render: function(btn) {
                    var localDate = new Date();
                    
                    btn.timeDifference = parseInt((serverDate.now - (localDate.getTime()/1000))*1000);
                    btn.setTime();
                },
                toggle: function(btn, pressed, options) {
                    if (pressed) {
                        new GibsonOS.Window({
                            id: 'clockWindow',
                            width: 145,
                            autoHeight: true,
                            plain: true,
                            header: false,
                            data: [],
                            tpl: new Ext.XTemplate(
                                '<div id="clockDate">{date}</div>',
                                '<div id="clockTime">{time}</div>',
                                '<div id="clockSunrise">Sonnenaufgang: {sunrise}</div>',
                                '<div id="clockSunset">Sonnenuntergang: {sunset}</div>'
                            )
                        }).show();
                    } else {
                        Ext.getCmp('clockWindow').close();
                    }
                }
            }
        }]
	});

    window.onresize = function(event) {
        Ext.getCmp('desktopContainer').setHeight(window.innerHeight);
        Ext.getCmp('desktopContainer').setWidth(window.innerWidth);
        Ext.getCmp('desktop').setHeight(window.innerHeight-25);
        Ext.getCmp('desktop').setWidth(window.innerWidth);
    };

    sessionRefresh = function() {
        GibsonOS.Ajax.request({
            url: baseDir + 'core/user/sessionRefresh',
            success: function() {
                setTimeout(sessionRefresh, 60000);
            }
        });
    };

    sessionRefresh();
});
