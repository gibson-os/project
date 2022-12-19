function hcModuleView(module)
{
    if (
        GibsonOS.module.hc[module.helper] &&
        typeof(GibsonOS.module.hc[module.helper].App) === 'function'
    ) {
        Ext.create('GibsonOS.module.hc.' + module.helper + '.App', {
            gos: {
                data: {
                    module: module
                }
            }
        });
        return;
    }

    var id = Ext.id();
    var settings = null;
    
    if (typeof(eval(module.helper + 'Settings')) === 'function') {
        settings = [{
            type:'gear',
            tooltip: 'Einstellungen',
            handler: function(){
                new GibsonOS.Window({
                    title: 'Homecontrol Modul ' + module.name + ' Einstellungen',
                    id: 'hcModuleSettingsWindow' + id,
                    width: 300,
                    autoHeight: true,
                    items: [
                        eval(module.helper + 'Settings(module, "' + id + '")')
                    ]
                }).show();
            }
        }];
    }
    
    new GibsonOS.App({
        title: 'Homecontrol Modul: ' + module.name,
        id: 'hcModuleViewWindow' + id,
        width: module.settings && module.settings.width ? module.settings.width : 700,
        height: module.settings && module.settings.height ? module.settings.height : 400,
        maximizable: module.settings && module.settings.maximizable ? module.settings.maximizable : true,
        minimizable: module.settings && module.settings.minimizable ? module.settings.minimizable : true,
        closable: module.settings && module.settings.closable ? module.settings.closable : true,
        resizable: module.settings && module.settings.resizable ? module.settings.resizable : true,
        appIcon: module.settings && module.settings.icon ? module.settings.icon : 'icon_homecontrol',
        tools: settings,
        items: [{
            xtype: 'gosTabPanel',
            items: [
                eval(module.helper + 'View(module, "' + id + '")'),
                {
                    xtype: 'gosModuleHcIndexLogGrid',
                    gos: {
                        data: {
                            extraParams: {
                                module: module.id
                            }
                        }
                    }
                }
            ]
        }]
    }).show();
}
