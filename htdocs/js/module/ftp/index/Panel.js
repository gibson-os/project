Ext.define('GibsonOS.module.ftp.index.Panel', {
    extend: 'GibsonOS.Panel',
    alias: ['widget.gosModuleFtpIndexPanel'],
    itemId: 'ftpIndexPanel',
    layout: 'border',
    initComponent: function() {
        var panel = this;

        this.gos.data.path = [];
        this.gos.data.decryptedPath = [];
        this.gos.data.homePath = '/';
        this.gos.data.dirHistory = [];
        this.gos.data.dirHistoryPointer = -1;
        this.gos.data.updateBottomBar = function() {
            var view = panel.down('#ftpIndexView');

            panel.down('#ftpIndexSize').setText('Größe: ' + transformSize(view.gos.data.fileSize));
            panel.down('#ftpIndexFiles').setText('Dateien: ' + view.gos.data.fileCount);
            panel.down('#ftpIndexDirs').setText('Ordner: ' + view.gos.data.dirCount);
        };

        this.items = [{
            xtype: 'gosPanel',
            region: 'center',
            layout: 'border',
            itemId: 'ftpIndexPanelCenter',
            disabled: true,
            tbar: [{
                xtype: 'gosButton',
                itemId: 'ftpIndexBackButton',
                iconCls: 'icon_system system_back',
                requiredPermission: {
                    action:'read',
                    permission: GibsonOS.Permission.READ
                },
                disabled: true,
                handler: function() {
                    var panel = this.up('#ftpIndexPanel');

                    if (panel.gos.data.dirHistoryPointer > 0) {
                        panel.gos.data.dirHistoryPointer--;

                        var viewStore = panel.down('#ftpIndexView').gos.store;
                        viewStore.getProxy().extraParams.dir = panel.gos.data.dirHistory[panel.gos.data.dirHistoryPointer];
                        viewStore.load();
                    }
                }
            },{
                xtype: 'gosButton',
                itemId: 'ftpIndexNextButton',
                iconCls: 'icon_system system_next',
                requiredPermission: {
                    action:'read',
                    permission: GibsonOS.Permission.READ
                },
                disabled: true,
                handler: function() {
                    var panel = this.up('#ftpIndexPanel');

                    if (panel.gos.data.dirHistoryPointer < panel.gos.data.dirHistory.length-1) {
                        panel.gos.data.dirHistoryPointer++;

                        var viewStore = panel.down('#ftpIndexView').gos.store;
                        viewStore.getProxy().extraParams.dir = panel.gos.data.dirHistory[panel.gos.data.dirHistoryPointer];
                        viewStore.load();
                    }
                }
            },{
                xtype: 'gosButton',
                itemId: 'ftpIndexUpButton',
                iconCls: 'icon_system system_up',
                requiredPermission: {
                    action:'read',
                    permission: GibsonOS.Permission.READ
                },
                handler: function() {
                    var panel = this.up('#ftpIndexPanel');

                    if (panel.gos.data.path.length > 1) {
                        var pathString = '';

                        for (var i = 0; i < panel.gos.data.path.length-1; i++) {
                            pathString += panel.gos.data.path[i] + '/';
                        }

                        var viewStore = panel.down('#ftpIndexView').gos.store;
                        viewStore.getProxy().extraParams.dir = pathString;
                        viewStore.load();
                    }
                }
            },('-'),{
                xtype: 'gosPanel',
                itemId: 'ftpIndexPath',
                frame: false,
                plain: false,
                flex: 0
            },('->'),{
                xtype: 'gosFormTextfield',
                itemId: 'ftpIndexSearch',
                enableKeyEvents: true,
                hideLabel: true,
                gos: {
                    data: {
                        searchActive: false,
                        stopSearch: false
                    }
                }
            },{
                xtype: 'gosButton',
                itemId: 'ftpIndexViewButton',
                iconCls: 'icon_system system_view_details',
                menu: [{
                    text: 'Sehr Kleine Symbole',
                    iconCls: 'icon_system system_view_very_small_icons',
                    handler: function() {
                        var panel = this.up('#ftpIndexPanel');
                        panel.down('#ftpIndexView48').hide();
                        panel.down('#ftpIndexView64').hide();
                        panel.down('#ftpIndexView128').hide();
                        panel.down('#ftpIndexView256').hide();
                        panel.down('#ftpIndexGrid').hide();
                        panel.down('#ftpIndexView32').show();
                        panel.down('#ftpIndexView32').fireEvent('selectionchange', view.down('#ftpIndexView32').getSelectionModel());
                    }
                },{
                    text: 'Kleine Symbole',
                    iconCls: 'icon_system system_view_small_icons',
                    handler: function() {
                        var panel = this.up('#ftpIndexPanel');
                        panel.down('#ftpIndexView32').hide();
                        panel.down('#ftpIndexView64').hide();
                        panel.down('#ftpIndexView128').hide();
                        panel.down('#ftpIndexView256').hide();
                        panel.down('#ftpIndexGrid').hide();
                        panel.down('#ftpIndexView48').show();
                        panel.down('#ftpIndexView48').fireEvent('selectionchange', view.down('#ftpIndexView48').getSelectionModel());
                    }
                },{
                    text: 'Mittlere Symbole',
                    iconCls: 'icon_system system_view_middle_icons',
                    handler: function() {
                        var panel = this.up('#ftpIndexPanel');
                        panel.down('#ftpIndexView32').hide();
                        panel.down('#ftpIndexView48').hide();
                        panel.down('#ftpIndexView128').hide();
                        panel.down('#ftpIndexView256').hide();
                        panel.down('#ftpIndexGrid').hide();
                        panel.down('#ftpIndexView64').show();
                        panel.down('#ftpIndexView64').fireEvent('selectionchange', view.down('#ftpIndexView64').getSelectionModel());
                    }
                },{
                    text: 'Große Symbole',
                    iconCls: 'icon_system system_view_big_icons',
                    handler: function() {
                        var panel = this.up('#ftpIndexPanel');
                        panel.down('#ftpIndexView32').hide();
                        panel.down('#ftpIndexView48').hide();
                        panel.down('#ftpIndexView64').hide();
                        panel.down('#ftpIndexView256').hide();
                        panel.down('#ftpIndexGrid').hide();
                        panel.down('#ftpIndexView128').show();
                        panel.down('#ftpIndexView128').fireEvent('selectionchange', view.down('#ftpIndexView128').getSelectionModel());
                    }
                },{
                    text: 'Sehr Große Symbole',
                    iconCls: 'icon_system system_view_very_big_icons',
                    handler: function() {
                        var panel = this.up('#ftpIndexPanel');
                        panel.down('#ftpIndexView32').hide();
                        panel.down('#ftpIndexView48').hide();
                        panel.down('#ftpIndexView64').hide();
                        panel.down('#ftpIndexView128').hide();
                        panel.down('#ftpIndexGrid').hide();
                        panel.down('#ftpIndexView256').show();
                        panel.down('#ftpIndexView256').fireEvent('selectionchange', view.down('#ftpIndexView256').getSelectionModel());
                    }
                },{
                    text: 'Liste',
                    iconCls: 'icon_system system_view_details',
                    handler: function() {
                        var panel = this.up('#ftpIndexPanel');
                        panel.down('#ftpIndexView32').hide();
                        panel.down('#ftpIndexView48').hide();
                        panel.down('#ftpIndexView64').hide();
                        panel.down('#ftpIndexView128').hide();
                        panel.down('#ftpIndexView256').hide();
                        panel.down('#ftpIndexGrid').show();
                        panel.down('#ftpIndexGrid').fireEvent('selectionchange', view.down('#ftpIndexGrid').getSelectionModel());
                    }
                }]
            }],
            items: [{
                xtype: 'gosModuleFtpIndexContainer',
                region: 'center',
                flex: 0,
                gos: {
                    data: {
                        dir: this.gos.data.dir
                    }
                }
            },{
                xtype: 'gosModuleFtpIndexTree',
                region: 'west',
                flex: 0,
                collapsible: true,
                split: true,
                width: 250,
                hideCollapseTool: true,
                header: false,
                listeners: {
                    itemclick: function(tree, record, item, index, event, options) {
                        var panel = tree.up('#ftpIndexPanel');
                        panel.gos.data.dirHistory.dirHistory = panel.gos.data.dirHistory.slice(0, panel.gos.data.dirHistoryPointer+1);

                        var viewStore = panel.down('#ftpIndexView').gos.store;
                        viewStore.getProxy().setExtraParam('dir', record.data.id);
                        viewStore.load();
                    }
                }
            },{
                xtype: 'gosModuleFtpIndexTransferTabPanel',
                region: 'south',
                flex: 0,
                collapsible: true,
                split: true,
                height: 200,
                hideCollapseTool: true,
                collapsed: true,
                header: false
            }]
        }];

        var keyUpListener = function(field, event) {
            var toolBar = field.up();

            if (event.getKey() == Ext.EventObject.RETURN) {
                this.up('gosToolbar').down('#ftpIndexConnectButton').toggle();
            } else if (
                toolBar.down('#ftpIndexIdField').getValue() &&
                (
                event.getKey() > 31 ||
                event.getKey() == 8
                )
            ) {
                toolBar.down('#ftpIndexIdField').setValue(null);
                toolBar.down('#ftpIndexLocalPathField').setValue(null);
                toolBar.down('#ftpIndexPasswordField').setValue(null);
            }
        };

        this.dockedItems = [{
            xtype: 'gosToolbar',
            dock: 'top',
            items: [{
                xtype: 'gosModuleFtpSessionAutoComplete',
                width: 120,
                hideLabel: true,
                emptyText: 'Verbindung',
                listeners: {
                    select: function(combo, records, options) {
                        var record = records[0];
                        var toolBar = combo.up();

                        toolBar.down('#ftpIndexIdField').setValue(record.get('id'));
                        toolBar.down('#ftpIndexLocalPathField').setValue(record.get('localPath'));
                        toolBar.down('#ftpIndexUrlField').setValue(record.get('url'));
                        toolBar.down('#ftpIndexPortField').setValue(record.get('port'));
                        toolBar.down('#ftpIndexProtocolField').setValue(record.get('protocol'));
                        toolBar.down('#ftpIndexUserField').setValue(record.get('user'));
                        toolBar.down('#ftpIndexPasswordField').setValue(record.get('hasPassword') ? 'Password' : null);
                    }
                }
            },{
                iconCls: 'icon_system system_save',
                requiredPermission: {
                    action: 'save',
                    permission: GibsonOS.Permission.WRITE + GibsonOS.Permission.MANAGE
                },
                handler: function() {
                    new GibsonOS.module.ftp.session.Window();
                }
            },('-'),{
                xtype: 'gosFormHidden',
                itemId: 'ftpIndexIdField'
            },{
                xtype: 'gosFormHidden',
                itemId: 'ftpIndexLocalPathField'
            },{
                xtype: 'gosModuleFtpSessionProtocolComboBox',
                itemId: 'ftpIndexProtocolField',
                hideLabel: true,
                width: 70,
                emptyText: 'Protokoll',
                enableKeyEvents: true,
                listeners: {
                    keyup: keyUpListener,
                    afterrender: function(combo) {
                        var store = combo.getStore();

                        store.remove(store.getById('amazondrive'));
                    }
                }
            },{
                xtype: 'gosFormTextfield',
                itemId: 'ftpIndexUrlField',
                hideLabel: true,
                width: 70,
                emptyText: 'URL',
                enableKeyEvents: true,
                listeners: {
                    keyup: keyUpListener
                }
            },{
                xtype: 'gosFormNumberfield',
                itemId: 'ftpIndexPortField',
                hideLabel: true,
                width: 50,
                emptyText: 'Port',
                enableKeyEvents: true,
                listeners: {
                    keyup: keyUpListener
                }
            },{
                xtype: 'gosFormTextfield',
                itemId: 'ftpIndexUserField',
                hideLabel: true,
                width: 90,
                emptyText: 'Benutzername',
                enableKeyEvents: true,
                listeners: {
                    keyup: keyUpListener
                }
            },{
                xtype: 'gosFormTextfield',
                itemId: 'ftpIndexPasswordField',
                hideLabel: true,
                width: 80,
                inputType: 'password',
                emptyText: 'Passwort',
                enableKeyEvents: true,
                listeners: {
                    keyup: keyUpListener
                }
            }, {
                itemId: 'ftpIndexConnectButton',
                text: 'Verbinden',
                enableToggle: true,
                requiredPermission: {
                    permission: GibsonOS.Permission.READ
                },
                listeners: {
                    toggle: function (button, pressed) {
                        var autoCompleteField = panel.down('#ftpSessionAutoComplete');
                        var idField = panel.down('#ftpIndexIdField');
                        var localPathField = panel.down('#ftpIndexLocalPathField');
                        var urlField = panel.down('#ftpIndexUrlField');
                        var portField = panel.down('#ftpIndexPortField');
                        var protocolField = panel.down('#ftpIndexProtocolField');
                        var userField = panel.down('#ftpIndexUserField');
                        var passwordField = panel.down('#ftpIndexPasswordField');
                        var syncButton = panel.down('#ftpSyncButton');

                        if (pressed) {
                            autoCompleteField.disable();
                            urlField.disable();
                            portField.disable();
                            protocolField.disable();
                            userField.disable();
                            passwordField.disable();
                            syncButton.enable();

                            var store = panel.down('#ftpIndexView').gos.store;
                            var proxy = store.getProxy();

                            proxy.setExtraParam('id', idField.getValue());
                            proxy.setExtraParam('url', urlField.getValue());
                            proxy.setExtraParam('port', portField.getValue());
                            proxy.setExtraParam('protocol', protocolField.getValue());
                            proxy.setExtraParam('user', userField.getValue());
                            proxy.setExtraParam('password', passwordField.getValue());
                            proxy.setExtraParam('dir', null);

                            var treeStore = panel.down('#ftpIndexTree').getStore();
                            var treeProxy = treeStore.getProxy();

                            treeProxy.setExtraParam('id', idField.getValue());
                            treeProxy.setExtraParam('url', urlField.getValue());
                            treeProxy.setExtraParam('port', portField.getValue());
                            treeProxy.setExtraParam('protocol', protocolField.getValue());
                            treeProxy.setExtraParam('user', userField.getValue());
                            treeProxy.setExtraParam('password', passwordField.getValue());
                            treeProxy.setExtraParam('dir', null);

                            panel.down('#ftpIndexTransferTabPanel').items.each(function (item) {
                                var transferStore = item.getStore();
                                var transferProxy = transferStore.getProxy();

                                transferProxy.setExtraParam('id', idField.getValue());
                                transferProxy.setExtraParam('url', urlField.getValue());
                                transferProxy.setExtraParam('port', portField.getValue());
                                transferProxy.setExtraParam('protocol', protocolField.getValue());
                                transferProxy.setExtraParam('user', userField.getValue());
                                transferProxy.setExtraParam('password', passwordField.getValue());

                                if (
                                    item.up().getCollapsed() === false &&
                                    item.isVisible()
                                ) {
                                    transferStore.load();
                                }
                            });

                            store.load();
                            var activeTab = GibsonOS.module.ftp.index.fn.getActiveNeighborTab(panel);

                            if (
                                activeTab &&
                                activeTab.getXType() == 'gosModuleExplorerIndexPanel' &&
                                localPathField.getValue()
                            ) {
                                var localStore = activeTab.down('#explorerIndexView').gos.store;
                                var localProxy = localStore.getProxy();

                                if (localProxy.extraParams.dir != localPathField.getValue()) {
                                    localProxy.setExtraParam('dir', localPathField.getValue());
                                    localStore.load();
                                }
                            }
                        } else {
                            panel.down('#ftpIndexPanelCenter').disable();

                            autoCompleteField.enable();
                            idField.enable();
                            urlField.enable();
                            portField.enable();
                            protocolField.enable();
                            userField.enable();
                            passwordField.enable();
                            syncButton.disable();
                        }
                    }
                }
            },('-'),{
                xtype: 'gosModuleFtpSyncButton',
                disabled: true
            }]
        },{
            xtype: 'gosToolbar',
            dock: 'bottom',
            items: [{
                itemId: 'ftpIndexSize',
                xtype: 'gosToolbarTextItem',
                text: 'Größe: 0 ' + sizeUnits[0]
            },('-'),{
                itemId: 'ftpIndexFiles',
                xtype: 'gosToolbarTextItem',
                text: 'Dateien: 0'
            },('-'),{
                itemId: 'ftpIndexDirs',
                xtype: 'gosToolbarTextItem',
                text: 'Ordner: 0'
            },{
                xtype: 'tbseparator',
                itemId: 'ftpIndexUploadSeparator',
                hidden: true
            },{
                xtype: 'progressbar',
                itemId: 'ftpIndexUploadFile',
                hidden: true,
                width: 250
            },{
                xtype: 'progressbar',
                itemId: 'ftpIndexUploadTotal',
                hidden: true,
                width: 150
            }]
        }];

        this.callParent();

        var selectionChange = function(selection, records) {
            panel.down('#ftpIndexGrid').getSelectionModel().select(records, false, true);
            panel.down('#ftpIndexView32').getSelectionModel().select(records, false, true);
            panel.down('#ftpIndexView48').getSelectionModel().select(records, false, true);
            panel.down('#ftpIndexView64').getSelectionModel().select(records, false, true);
            panel.down('#ftpIndexView128').getSelectionModel().select(records, false, true);
            panel.down('#ftpIndexView256').getSelectionModel().select(records, false, true);
        };

        this.down('#ftpIndexGrid').on('selectionchange', selectionChange);
        this.down('#ftpIndexView32').on('selectionchange', selectionChange);
        this.down('#ftpIndexView48').on('selectionchange', selectionChange);
        this.down('#ftpIndexView64').on('selectionchange', selectionChange);
        this.down('#ftpIndexView128').on('selectionchange', selectionChange);
        this.down('#ftpIndexView256').on('selectionchange', selectionChange);

        this.down('#ftpIndexSearch').on('keyup', function(textfield) {
            var search = textfield.getValue().toLowerCase();
            var viewStore = panel.down('#ftpIndexView').gos.store;

            if (textfield.gos.data.searchActive) {
                textfield.gos.data.stopSearch = true;
            } else {
                textfield.gos.data.stopSearch = false;
                textfield.gos.data.searchActive = true;
            }

            viewStore.each(function(record) {
                if (textfield.gos.data.stopSearch) {
                    textfield.gos.data.stopSearch = false;
                    textfield.gos.data.searchActive = false;
                    return false;
                }

                if (record.get('name').toLowerCase().indexOf(search) == -1) {
                    record.set('hidden', true);
                } else {
                    record.set('hidden', false);
                }
            });

            textfield.gos.data.searchActive = false;
        });
        this.down('#ftpIndexView').gos.store.on('beforeload', function(store, operation, options) {
            panel.down('#ftpIndexSearch').setValue(null);
        });
        this.down('#ftpIndexView').gos.store.on('load', function(store, operation, options) {
            var data = store.getProxy().getReader().jsonData;

            if (data.failure) {
                panel.down('#ftpIndexConnectButton').toggle(false);
            } else if (data.success) {
                var dir = store.getProxy().getReader().jsonData.dir;

                panel.down('#ftpIndexPanelCenter').enable();

                panel.gos.data.dir = dir;
                panel.gos.data.path = store.getProxy().getReader().jsonData.path;
                panel.gos.data.decryptedPath = store.getProxy().getReader().jsonData.decryptedPath;
                panel.gos.data.updateBottomBar();

                var toolbarPath = panel.down('#ftpIndexPath');
                toolbarPath.removeAll();

                for (var i = 0; i < panel.gos.data.path.length; i++) {
                    toolbarPath.add({
                        xtype: 'gosButton',
                        text: panel.gos.data.decryptedPath[i] + '/',
                        gos : {
                            encryptedName: panel.gos.data.path[i]
                        },
                        listeners: {
                            click: function(button, event, options) {
                                var pathString = '';

                                for (var i = 0; i < toolbarPath.items.items.length; i++) {
                                    var item = toolbarPath.items.items[i];
                                    pathString += item.gos.encryptedName + '/';

                                    if (item.id == button.id) {
                                        break;
                                    }
                                }

                                panel.gos.data.dirHistory = panel.gos.data.dirHistory.slice(0, panel.gos.data.dirHistoryPointer+1);
                                store.getProxy().extraParams.dir = pathString;
                                store.load();
                            }
                        }
                    });
                }

                // Dir History
                if (
                    panel.gos.data.dirHistory.length == 0 ||
                    (
                    dir != panel.gos.data.dirHistory[panel.gos.data.dirHistory.length-1] &&
                    panel.gos.data.dirHistory.length-1 == panel.gos.data.dirHistoryPointer
                    )
                ) {
                    panel.gos.data.dirHistory.push(dir);
                    panel.gos.data.dirHistoryPointer++;
                }

                if (panel.gos.data.dirHistoryPointer == panel.gos.data.dirHistory.length-1) {
                    panel.down('#ftpIndexNextButton').disable();
                } else {
                    panel.down('#ftpIndexNextButton').enable();
                }

                if (panel.gos.data.dirHistoryPointer == 0) {
                    panel.down('#ftpIndexBackButton').disable();
                } else {
                    panel.down('#ftpIndexBackButton').enable();
                }

                // Tree
                var tree = panel.down('#ftpIndexTree');
                var node = tree.getStore().getNodeById(dir);

                if (!node) {
                    tree.getStore().getProxy().setExtraParam('dir', dir);
                    tree.getStore().load();
                } else {
                    tree.getSelectionModel().select(node, false, true);
                    tree.getView().focusRow(node);
                }
            }
        });
    }
});