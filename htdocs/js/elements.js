Ext.USE_NATIVE_JSON = true;

Ext.grid.plugin.RowEditing.override({
    setColumnField: function(column, field) {
        let me = this,
            editor = me.getEditor();

        editor.removeColumnEditor(column);
        Ext.grid.plugin.RowEditing.superclass.setColumnField.apply(this, arguments);
        me.getEditor().addFieldsForColumn(column, true);
        me.getEditor().insertColumnEditor(column);
    }
});

var GibsonOS = {
    activeApp: null,
    withoutFailure: false,
    MessageBox: {
        show: function(data, request) {
            var title = data.title ? data.title : 'Fehler!';
            var msg = data.msg ? data.msg : 'Es ist ein Fehler aufgetreten!';
            var type = null;
            var params = [];

            if (request) {
                type = 'ajax';

                if (request.xtype) {
                    if (request.xtype == 'gosFormActionAction') {
                        type = 'form';
                    }
                }
            }

            if (
                type == 'ajax' &&
                request &&
                !request.params
            ) {
                request.params = {};
            }

            if (data.extraParameters) {
                params = data.extraParameters;
            }

            if (
                data.type &&
                data.type == GibsonOS.MessageBox.type.PROMPT
            ) {
                var prompt = Ext.MessageBox;
                prompt.buttonText = {
                    ok: data.okText ? data.okText : 'OK',
                    cancel: data.cancelText ? data.cancelText : 'Abbrechen'
                };

                return prompt.prompt(title, msg, function(buttonId, text) {
                    if (buttonId != 'ok') {
                        return false;
                    }

                    if (
                        request &&
                        data.promptParameter
                    ) {
                        params[data.promptParameter] = text;

                        if (type == 'ajax') {
                            Ext.Object.merge(request.params, params);
                            GibsonOS.Ajax.request(request);
                        } else if (type == 'form') {
                            request.form.submit({
                                xtype: 'gosFormActionAction',
                                url: request.url,
                                params: params
                            });
                        }
                    }
                }, window, data.multiline ? data.multiline : false, data.value ? data.value : '');
            } else {
                var buttons = [];
                var config = {
                    title: title,
                    msg: msg,
                    icon: Ext.MessageBox.ERROR
                };

                if (data.buttons) {
                    Ext.iterate(data.buttons, function(button) {
                        buttons.push({
                            text: button.text,
                            handler: function() {
                                if (button.handler) {
                                    button.handler(button, request);
                                }

                                if (request) {
                                    if (
                                        button.sendRequest !== false &&
                                        (
                                            button.parameter ||
                                            button.sendRequest
                                        )
                                    ) {
                                        if (typeof(button.value) != 'undefined') {
                                            params[button.parameter] = button.value;
                                        }

                                        if (type == 'ajax') {
                                            Ext.Object.merge(request.params, params);
                                            GibsonOS.Ajax.request(request);
                                        } else if (type == 'form') {
                                            request.form.submit({
                                                xtype: 'gosFormActionAction',
                                                url: request.url,
                                                params: params
                                            });
                                        }
                                    }

                                    if (button.callSuccess) {
                                        request.success();
                                    }

                                    if (button.callFailure) {
                                        request.success();
                                    }
                                }

                                messageBox.close();
                            }
                        });
                    });
                } else {
                    buttons.push({
                        text: 'OK',
                        handler: function() {
                            messageBox.close();
                        }
                    });
                }

                switch (data.type) {
                    case GibsonOS.MessageBox.type.INFO:
                        config.icon = Ext.MessageBox.INFO;
                        break;
                    case GibsonOS.MessageBox.type.WARNING:
                        config.icon = Ext.MessageBox.WARNING;
                        break;
                    case GibsonOS.MessageBox.type.QUESTION:
                        config.icon = Ext.MessageBox.QUESTION;
                        break;
                }

                var messageBox = new Ext.window.MessageBox({
                    buttons: buttons,
                    buttonAlign: 'center'
                }).show(config);

                return messageBox;
            }
        },
        type: {
            INFO: 0,
            WARNING: 1,
            ERROR: 2,
            QUESTION: 3,
            PROMPT: 4
        }
    },
    Ajax: {
        request: function(request) {
            if (!request.withoutFailure) {
                var failureFn = null;

                if (request.failure) {
                    failureFn = request.failure;
                }

                request.failure = function(response, options) {
                    var responseText = null;
                    var data = null;
                    
                    if (response.responseText) {
                        responseText = Ext.decode(response.responseText);
                        data = responseText.data;
                    }

                    if (data) {
                        if (
                            data.buttons &&
                            request.messageBox &&
                            (
                                request.messageBox.buttonHandler ||
                                request.messageBox.sendRequest
                            )
                        ) {
                            for (let i = 0; i < data.buttons.length; i++) {
                                if (request.messageBox.buttonHandler) {
                                    data.buttons[i].handler = function() {
                                        request.messageBox.buttonHandler(data.buttons[i], response);
                                    }
                                }

                                if (typeof(request.messageBox.sendRequest) != 'undefined') {
                                    data.buttons[i].sendRequest = request.messageBox.sendRequest;
                                }
                            }
                        }

                        GibsonOS.MessageBox.show(data, request);
                    }
                    
                    if (response.status === 200) {
                        GibsonOS.checkResponseForLogin(responseText);
                    }

                    if (failureFn) {
                        failureFn(response, options);
                    }
                };
            }
            
            var successFn = request.success ? request.success : function() {};
            request.success = function(response, options) {
                const responseText = Ext.decode(response.responseText, true);

                if (responseText === null || responseText.success) {
                    successFn(response, options);
                } else if (request.failure) {
                    request.failure(response, options);
                }
            };
            
            Ext.Ajax.request(request);
        }
    },
    Permission: {
        INHERIT: 0,
        DENIED: 1,
        READ: 2,
        WRITE: 4,
        DELETE: 8,
        MANAGE: 16
    },
    define: function(index, value) {
        var level = null;
        var parts = index.split('.');

        for (var i = 0; i < parts.length-1; i++) {
            if (!level) {
                if (!eval(parts[i])) {
                    eval('var ' + parts[i] + ' = {}');
                }

                level = parts[i];
            } else {
                if (!eval(level + '.' + parts[i])) {
                    eval(level + '.' + parts[i] + ' = {}');
                }

                level += '.' + parts[i];
            }
        }

        var section = eval(level);
        section[parts[parts.length-1]] = value;
    },
    checkResponseForLogin: function(data) {
        if (
            data &&
            data.data &&
            data.data.login
        ) {
            document.location.href = '/';
        }
    },
    checkResponseForErrorMessage: function(data, request) {
        if (
            data &&
            data.failure &&
            data.data &&
            data.data.msg
        ) {
            GibsonOS.MessageBox.show(data.data, request);
        }
    },
    getGosPart: function(add) {
        if (typeof(add) != 'object') {
            add = {};
        }

        add.data = {};

        return add;
    },
    dropZones: {
        zones: {},
        add: function(element, dropZone) {
            GibsonOS.dropZones.zones[element.id] = Ext.create('Ext.dd.DropZone', element, dropZone);

            return dropZone;
        }
    }
};

Ext.define('GibsonOS.Window', {
    extend: 'Ext.window.Window',
    alias: ['widget.gosWindow'],
    title: 'Window',
    border: false,
    frame: false,
    shadow: false,
    dirty: false,
    layout: 'fit',
    buttonAlign: 'center',
    renderTo: 'extBody',
    checkLogin: true,
    autoShow: true,
    defaults: {
        xtype: 'gosPanel'
    },
    gos: GibsonOS.getGosPart(),
    setDirty: function(dirty) {
        this.dirty = dirty;
    },
    isDirty: function() {
        return this.dirty;
    },
    initComponent: function() {
        this.callParent();
        var permissions = [];
        var permissionsAjax = {};
        
        var getItemPermissions = function(element, permission) {
            if (!element) {
                return false;
            }
            
            if (!Ext.isObject(permission)) {
                permission = {
                    module: null,
                    task: null,
                    action: null,
                    permission: permission
                };
            }
            
            if (Ext.isObject(element.requiredPermission)) {
                permission = {
                    element: element,
                    module: element.requiredPermission.module ? element.requiredPermission.module : permission.module,
                    task: element.requiredPermission.task ? element.requiredPermission.task : permission.task,
                    action: element.requiredPermission.action ? element.requiredPermission.action : permission.action,
                    permission: element.requiredPermission.permission ? element.requiredPermission.permission : permission.permission
                };
                
                if (permission.permission > GibsonOS.Permission.DENIED) {
                    permissions.push(permission);
                    
                    if (!Ext.isObject(permissionsAjax[permission.module])) {
                        permissionsAjax[permission.module] = {
                            permissionRequired: false,
                            items: {}
                        };
                    }
                    
                    if (permission.task) {
                        if (!Ext.isObject(permissionsAjax[permission.module].items[permission.task])) {
                            permissionsAjax[permission.module].items[permission.task] = {
                                permissionRequired: false,
                                items: {}
                            };
                        }
                    
                        if (permission.action) {
                            permissionsAjax[permission.module].items[permission.task].items[permission.action] = {
                                permissionRequired: true
                            }
                        } else {
                            permissionsAjax[permission.module].items[permission.task].permissionRequired = true;
                        }
                    } else {
                        permissionsAjax[permission.module].permissionRequired = true;
                    }
                }
            }
            
            if (
                element.items &&
                element.items.items
            ) {
                Ext.iterate(element.items.items, function(item) {
                    getItemPermissions(item, permission);
                });
            }

            if (
                element.dockedItems &&
                element.dockedItems.items
            ) {
                Ext.iterate(element.dockedItems.items, function(item) {
                    getItemPermissions(item, permission);
                });
            }
            
            if (
                element.menu &&
                element.menu.items &&
                element.menu.items.items
            ) {
                Ext.iterate(element.menu.items.items, function(item) {
                    getItemPermissions(item, permission);
                });
            }

            if (
                element.itemContextMenu &&
                element.itemContextMenu.items &&
                element.itemContextMenu.items.items
            ) {
                Ext.iterate(element.itemContextMenu.items.items, function(item) {
                    getItemPermissions(item, permission);
                });
            }

            if (
                element.containerContextMenu &&
                element.containerContextMenu.items &&
                element.containerContextMenu.items.items
            ) {
                Ext.iterate(element.containerContextMenu.items.items, function(item) {
                    getItemPermissions(item, permission);
                });
            }
        };
        getItemPermissions(this);
        
        var getPermission = function(permission, permissions) {
            if (!permission.action) {
                if (!permission.task) {
                    return permissions[permission.module].permission;
                }
                
                return permissions[permission.module].items[permission.task].permission;
            }

            return permissions[permission.module].items[permission.task].items[permission.action].permission;
        };
        
        GibsonOS.Ajax.request({
            url: baseDir + 'core/setting/window',
            withoutFailure: true,
            params: {
                id: this.getId(),
                requiredPermissions: Ext.encode(permissionsAjax)
            },
            success: function(response, options) {
                var data = Ext.decode(response.responseText).data;
                
                if (data.permissions) {
                    Ext.iterate(permissions, function(permission) {
                        if ((getPermission(permission, data.permissions) & permission.permission) == permission.permission) {
                            return true;
                        }

                        permission.element.disable();
                        permission.element.suspendEvents();
                        permission.element.enable = function() {};
                    });
                }
                
                if (data.settings) {
                    if (data.settings.height) {
                        this.setHeight(data.settings.height);
                    }
                    
                    if (data.settings.width) {
                        this.setWidth(data.settings.width);
                    }
                    
                    if (
                        data.settings.top &&
                        data.settings.left
                    ) {
                        this.setPosition(data.settings.top, data.settings.left);
                    }
                }
            }
        });
    }
});

Ext.define('GibsonOS.App', {
    extend: 'GibsonOS.Window',
    alias: ['widget.gosApp'],
    renderTo: 'desktop',
    itemId: 'app',
    resizable: true,
    maximizable: true,
    minimizable: true,
    appIcon: 'icon_default',
    taskBarButton: null,
    dataUpdateActive: false,
    dataUpdateDelay: 500,
    setUpdateData: function(updateData) {
        this.dataUpdateActive = updateData;
    },
    isDataUpdateActive: function() {
        return this.dataUpdateActive;
    },
    updateData: function(options) {
        var me = this;

        if (!me.dataUrl) {
            return false;
        }

        if (
            !options.params &&
            me.dataParams
        ) {
            options.params = me.dataParams;
        }

        var updateFn = function() {
            me.updateData(options);
        };

        if (me.isDataUpdateActive()) {
            GibsonOS.Ajax.request({
                url: me.dataUrl,
                params: options.params ? options.params : null,
                success: function (response) {
                    me.fireEvent('updatestatus', me, Ext.decode(response.responseText).data);

                    if (typeof(options.success) == 'function') {
                        options.success();
                    }
                },
                failure: function () {
                    if (typeof(options.failure) == 'function') {
                        options.failure();
                    }
                }
            });
        } else if (typeof(options.notActive) == 'function') {
            options.notActive();
        }
    },
    initComponent: function() {
        var me = this;

        if (Ext.getCmp(me.id + 'Window')) {
            me.autoShow = false;
        }

        me.callParent();

        if (Ext.getCmp(me.id + 'Window')) {
            me.destroy();
        } else {
            me.appId = me.id;
            me.id = me.id + 'Window';
            me.iconCls = 'icon16 ' + me.appIcon;

            Ext.getCmp('taskbar').add({
                appId: me.appId,
                icon: me.appIcon,
                xtype: 'gosTaskbarButton',
                text: me.title
            });
            me.taskBarButton = Ext.getCmp(me.appId + 'TaskBarButton');
        }

        me.on('close', function() {
            me.taskBarButton.destroy();
            me.dataUpdateActive = false;
        });
        me.on('minimize', function() {
            me.taskBarButton.toggle(false);
            me.hide();
        });
        me.on('activate', function() {
            me.taskBarButton.toggle(true);
            GibsonOS.activeApp = me.appId;
        });
        me.on('focus', function() {
            me.taskBarButton.toggle(true);
            GibsonOS.activeApp = me.appId;
        });
        me.on('updatedata', function() {
            me.enable();
        });
        me.on('afterrender', function() {
            var updateData = function() {
                me.updateData({
                    success: function () {
                        setTimeout(updateData, me.dataUpdateDelay);
                    },
                    failure: function () {
                        setTimeout(updateData, me.dataUpdateDelay);
                    },
                    notActive: function () {
                        setTimeout(updateData, me.dataUpdateDelay);
                    }
                });
            };
            updateData();
        });
    }
});

Ext.define('GibsonOS.Panel', {
    extend: 'Ext.Panel',
    alias: ['widget.gosPanel'],
    border: false,
    frame: false,
    plain: true,
    flex: 1,
    defaults: {
        xtype: 'gosPanel'
    },
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.View', {
    extend: 'Ext.view.View',
    alias: ['widget.gosView'],
    border: false,
    frame: false,
    plain: true,
    flex: 1,
    itemContextMenu: false,
    containerContextMenu: false,
    gos: GibsonOS.getGosPart(),
    initComponent: function() {
        var view = this;

        if (
            this.gos &&
            this.gos.data &&
            this.gos.data.extraParams &&
            this.getStore() &&
            this.getStore().getProxy()
        ) {
            Ext.iterate(this.gos.data.extraParams, function (parameter, value) {
                view.getStore().getProxy().setExtraParam(parameter, value);
            });
        }

        this.callParent();

        if (this.itemContextMenu) {
            this.itemContextMenu = new GibsonOS.contextMenu.ContextMenu({
                items: this.itemContextMenu,
                parent: this
            });
        }

        this.on('itemcontextmenu', function(view, record, item, index, event, options) {
            var selectionModel = view.getSelectionModel();
            var found = false;

            Ext.iterate(selectionModel.getSelection(), function(selRecord) {
                if (selRecord == record) {
                    found = true;
                    return false;
                }
            });

            if (!found) {
                selectionModel.select([record]);
            }

            if (this.itemContextMenu) {
                this.itemContextMenu.record = record;
                event.stopEvent();
                this.itemContextMenu.showAt(event.getXY());
            }
        }, this, {
            priority: 999
        });

        if (this.containerContextMenu) {
            this.containerContextMenu = new GibsonOS.contextMenu.ContextMenu({
                items: this.containerContextMenu,
                parent: this
            });
        }

        this.on('containercontextmenu', function(view, event, options) {
            if (this.containerContextMenu) {
                event.stopEvent();
                this.containerContextMenu.showAt(event.getXY());
            }
        });
    }
});

Ext.define('GibsonOS.TabPanel', {
    extend: 'Ext.TabPanel',
    alias: ['widget.gosTabPanel'],
    border: false,
    frame: false,
    plain: true,
    flex: 1,
    activeTab: 0,
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.contextMenu.ContextMenu', {
    extend: 'Ext.menu.Menu',
    alias: ['widget.gosContextMenu'],
    border: false,
    itemId: 'contextMenu',
    parent: null,
    record: null,
    gos: GibsonOS.getGosPart(),
    getParent: function() {
        return this.parent;
    },
    getRecord: function() {
        return this.record;
    },
    initComponent: function() {
        var me = this;
        me.callParent();

        // Default soll dbl click funcktion werden und fett geschrieben werden.
        me.items.each(function(item) {
            if (
                item.gos &&
                item.gos.default
            ) {
                return true;
            }
        });

        var recursiveIterate = function(menu, func) {
            menu.items.each(function(item) {
                func(item);

                if (item.menu) {
                    recursiveIterate(item.menu, func);
                }
            });
        };

        me.on('beforeshow', function(menu, options) {
            recursiveIterate(menu, function(item) {
                item.fireEvent('beforeshowparentmenu', item, menu);
            });
        });
        me.on('show', function(menu, options) {
            recursiveIterate(menu, function(item) {
                item.fireEvent('showparentmenu', item, menu);
            });
        });
        me.on('beforehide', function(menu, options) {
            recursiveIterate(menu, function(item) {
                item.fireEvent('beforehideparentmenu', item, menu);
            });
        });
        me.on('hide', function(menu, options) {
            recursiveIterate(menu, function(item) {
                item.fireEvent('hideparentmenu', item, menu);
            });
        });
    }
});

Ext.define('GibsonOS.toolbar.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: ['widget.gosToolbar'],
    border: false
});

Ext.define('GibsonOS.toolbar.Paging', {
    extend: 'Ext.toolbar.Paging',
    alias: ['widget.gosToolbarPaging'],
    border: false,
    dock: 'bottom',
    displayInfo: true,
    beforePageText: 'Seite',
    afterPageText: 'von {0}',
    displayMsg: 'Einträge {0} - {1} von {2}',
    emptyMsg: 'Keine Einträge vorhanden'
});

Ext.define('GibsonOS.toolbar.TextItem', {
    extend: 'Ext.toolbar.TextItem',
    alias: ['widget.gosToolbarTextItem'],
    border: false
});

Ext.define('GibsonOS.form.Panel', {
    extend: 'Ext.form.Panel',
    alias: ['widget.gosFormPanel'],
    buttonAlign: 'center',
    frame: true,
    flex: 1,
    defaults: {
        xtype: 'gosPanel'
    },
    gos: GibsonOS.getGosPart(),
    initComponent: function() {
        this.callParent();
        var formPanel = this;

        this.getForm().on('actioncomplete', function(form, action, options) {
            var responseText = Ext.decode(action.response.responseText);
            GibsonOS.checkResponseForLogin(responseText);
            GibsonOS.checkResponseForErrorMessage(responseText, action);

            form.getFields().each(function(field) {
                field.originalValue = field.getValue();
            });
        }, this, {
            priority: 999
        });
        this.getForm().on('actionfailed', function(form, action, options) {
            var responseText = Ext.decode(action.response.responseText);
            GibsonOS.checkResponseForLogin(responseText);
            GibsonOS.checkResponseForErrorMessage(responseText, action);
        }, this, {
            priority: 999
        });
    }
});

Ext.define('GibsonOS.form.Fieldset', {
    extend: 'Ext.form.FieldSet',
    alias: ['widget.gosFormFieldset'],
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.form.Hidden', {
    extend: 'Ext.form.Hidden',
    alias: ['widget.gosFormHidden'],
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.form.Display', {
    extend: 'Ext.form.Display',
    alias: ['widget.gosFormDisplay'],
    fieldLabel: 'Display',
    anchor: '100%',
    border: false,
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.form.TextField', {
    extend: 'Ext.form.TextField',
    alias: ['widget.gosFormTextfield'],
    fieldLabel: 'Text Field',
    anchor: '100%',
    border: false,
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.form.TextArea', {
    extend: 'Ext.form.TextArea',
    alias: ['widget.gosFormTextArea'],
    fieldLabel: 'Text Area',
    anchor: '100%',
    border: false,
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.form.HtmlEditor', {
    extend: 'Ext.form.HtmlEditor',
    alias: ['widget.gosFormHtmlEditor'],
    fieldLabel: 'HTML Editor',
    anchor: '100%',
    border: false,
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.form.TimeField', {
    extend: 'Ext.form.field.Time',
    alias: ['widget.gosFormTimefield'],
    fieldLabel: 'Time Field',
    anchor: '100%',
    format: 'H:i',
    increment: 15,
    border: false,
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.form.NumberField', {
    extend: 'Ext.form.field.Number',
    alias: ['widget.gosFormNumberfield'],
    fieldLabel: 'Number Field',
    minValue: 0,
    anchor: '100%',
    border: false,
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.form.ComboBox', {
    extend: 'Ext.form.ComboBox',
    alias: ['widget.gosFormComboBox'],
    anchor: '100%',
    border: false,
    queryMode: 'local',
    displayField: 'name',
    valueField: 'id',
    editable: false,
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.form.AutoComplete', {
    extend: 'GibsonOS.form.ComboBox',
    alias: ['widget.gosFormAutoComplete'],
    editable: true,
    queryMode: 'remote',
    queryParam: 'name',
    queryParamId: 'id',
    minChars: 2,
    store: {
        xtype: 'gosDataStore',
        autoLoad: false,
        proxy: {
            type: 'gosDataProxyAjax',
            reader: {
                type: 'gosDataReaderJson'
            }
        }
    },
    gos: GibsonOS.getGosPart(),
    initComponent: function() {
        this.store.model = this.model;
        this.store.proxy.url = this.url;

        if (this.params) {
            this.store.proxy.extraParams = this.params;
        }

        this.callParent();
        
        if (this.value) {
            this.setValueById(this.value);
        }
    },
    setValueById: function(value) {
        var combo = this;
        var params = {};

        if (!value) {
            combo.setValue(value);
            return true;
        }

        if (combo.params) {
            params = combo.params;
        } else {
            combo.params = params;
        }

        params[combo.queryParamId] = value;

        combo.getStore().getProxy().extraParams = params;
        combo.getStore().load(function(records, operation, success) {
            combo.select(records[0]);

            delete params[combo.queryParamId];
        });
    }
});

Ext.define('GibsonOS.form.Checkbox', {
    extend: 'Ext.form.field.Checkbox',
    alias: ['widget.gosFormCheckbox'],
    anchor: '100%',
    border: false,
    inputValue: 1
});

Ext.define('GibsonOS.form.Date', {
    extend: 'Ext.form.field.Date',
    alias: ['widget.gosFormDate'],
    anchor: '100%',
    border: false
});

Ext.define('GibsonOS.form.File', {
    extend: 'Ext.form.field.File',
    alias: ['widget.gosFormFile'],
    anchor: '100%',
    border: false
});

Ext.define('GibsonOS.form.Picker', {
    extend: 'Ext.form.field.Picker',
    alias: ['widget.gosFormPicker'],
    anchor: '100%',
    border: false
});

Ext.define('GibsonOS.form.Picker.Color', {
    extend: 'GibsonOS.form.Picker',
    alias: ['widget.gosFormPickerColor'],
    createPicker: function() {
        var formPicker = this;

        return new GibsonOS.picker.Color({
            height: 110,
            floating: true,
            listeners: {
                select: function(picker, selColor) {
                    formPicker.setValue(selColor);
                }
            }
        });
    }
});

Ext.define('GibsonOS.form.action.Action', {
    extend: 'Ext.form.action.Action',
    alias: ['widget.gosFormActionAction'],
    waitTitle: 'Bitte warten!',
    waitMsg: 'Warten Sie bitte bis der Vorgang abgeschlossen ist.',
    failure: function(form, action) {
        checkSuccess(action.result);
    }
});

Ext.define('GibsonOS.Button', {
    extend: 'Ext.Button',
    alias: ['widget.gosButton'],
    tooltipType: 'title',
    border: false,
    gos: {
        parentWithFunction: null,
        function: null
    },
    handler: function() {
        let me = this;

        if (!me.gos.function) {
            return;
        }

        let parent = me.gos.parentWithFunction;

        if (parent === null) {
            parent = me.up('toolbar').up();
        }

        if (parent) {
            parent.gos.function[me.gos.function]();
        }
    }
});

Ext.define('GibsonOS.AddButton', {
    extend: 'GibsonOS.Button',
    alias: ['widget.gosAddButton'],
    iconCls: 'system_icon icon_add',
    gos: {
        function: 'add'
    }
});

Ext.define('GibsonOS.DeleteButton', {
    extend: 'GibsonOS.Button',
    alias: ['widget.gosDeleteButton'],
    iconCls: 'system_icon icon_delete',
    gos: {
        function: 'delete'
    }
});

Ext.define('GibsonOS.ShowButton', {
    extend: 'GibsonOS.Button',
    alias: ['widget.gosShowButton'],
    gos: {
        function: 'show'
    }
});

Ext.define('GibsonOS.taskbar.Button', {
    extend: 'GibsonOS.Button',
    alias: ['widget.gosTaskbarButton'],
    icon: 'icon_default',
    enableToggle: true,
    pressed: true,
    gos: GibsonOS.getGosPart(),
    handler: function(button) {
        var window = Ext.getCmp(button.appId + 'Window');
        
        if (window.isHidden()) {
            window.show();
        } else if (GibsonOS.activeApp != button.appId) {
            window.show();
        } else {
            window.hide();
        }
    },
    listeners: {
        toggle: function(button) {
            if (
                GibsonOS.activeApp &&
                GibsonOS.activeApp != button.appId &&
                Ext.getCmp(GibsonOS.activeApp + 'TaskBarButton')
            ) {
                Ext.getCmp(GibsonOS.activeApp + 'TaskBarButton').toggle(false);
            }
        }
    },
    initComponent: function() {
        this.iconCls = 'icon16 ' + this.icon;
        this.id = this.appId + 'TaskBarButton';
        this.callParent();
        
        if (
            GibsonOS.activeApp &&
            Ext.getCmp(GibsonOS.activeApp + 'TaskBarButton')
        ) {
            Ext.getCmp(GibsonOS.activeApp + 'TaskBarButton').toggle(false);
        }
    }
});

Ext.define('GibsonOS.startMenu.Button', {
    extend: 'Ext.menu.Item',
    alias: ['widget.gosStartMenuButton'],
    cls: 'startmenu_button',
    anchor: '100%'
});

Ext.define('GibsonOS.tree.Panel', {
    extend: 'Ext.tree.Panel',
    alias: ['widget.gosTreePanel'],
    border: false,
    frame: false,
    plain: true,
    flex: 1,
    rootVisible: false,
    itemContextMenu: false,
    containerContextMenu: false,
    gos: GibsonOS.getGosPart(),
    initComponent: function() {
        var panel = this;

        if (
            this.gos &&
            this.gos.data &&
            this.gos.data.extraParams &&
            this.getStore() &&
            this.getStore().getProxy()
        ) {
            Ext.iterate(this.gos.data.extraParams, function(parameter, value) {
                panel.getStore().getProxy().setExtraParam(parameter, value);
            });
        }

        this.callParent();

        if (this.itemContextMenu) {
            this.itemContextMenu = new GibsonOS.contextMenu.ContextMenu({
                items: this.itemContextMenu,
                parent: this
            });
        }

        this.on('itemcontextmenu', function(tree, record, item, index, event, options) {
            if (this.itemContextMenu) {
                this.itemContextMenu.record = record;
                event.stopEvent();
                this.itemContextMenu.showAt(event.getXY());
            }
        });

        if (this.containerContextMenu) {
            this.containerContextMenu = new GibsonOS.contextMenu.ContextMenu({
                items: this.containerContextMenu,
                parent: this
            });
        }

        this.on('containercontextmenu', function(tree, event, options) {
            if (this.containerContextMenu) {
                event.stopEvent();
                this.containerContextMenu.showAt(event.getXY());
            }
        });
    }
});

Ext.define('GibsonOS.data.TreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: ['store.gosDataTreeStore'],
    defaultRootProperty: 'data',
    /* autoLoad würde Einträge duplizieren */
    autoLoad: false,
    root: {},
    gos: GibsonOS.getGosPart({
        autoReload: false,
        autoReloadDelay: 500
    }),
    constructor: function(data) {
        var me = this;
        var isLoaded = false;
        var lastRequest = null;

        if (
            data &&
            data.gosData &&
            data.gosData.extraParams &&
            me.proxy
        ) {
            me.proxy.extraParams = data.gosData.extraParams;
        }

        if (
            data &&
            data.gos &&
            data.gos.data &&
            data.gos.data.extraParams &&
            me.proxy
        ) {
            me.proxy.extraParams = data.gos.data.extraParams;
        }

        var autoLoad = me.autoLoad;
        me.autoLoad = false;

        me.callParent(arguments);

        me.gos.cancelLoad = function() {
            Ext.Ajax.abort(lastRequest);
        };

        me.on('beforeload', function() {
            if (lastRequest) {
                me.gos.cancelLoad();
            }

            lastRequest = Ext.Ajax.getLatest();
        });
        me.on('load', function(store, operation, options) {
            var data = store.getProxy().getReader().jsonData;
            isLoaded = true;
            GibsonOS.checkResponseForLogin(data);
            GibsonOS.checkResponseForErrorMessage(data, store);
            store.getRootNode().expand();
            lastRequest = null;
        }, me, {
            priority: 999
        });

        /* Workaround: autoLoad dupliziert Einträge */
        if (autoLoad) {
            me.load();
        }

        var reloadFunction = function() {
            if (
                !me.gos.autoReload ||
                !isLoaded
            ) {
                setTimeout(reloadFunction, me.gos.autoReloadDelay);
                return true;
            }

            me.load({
                callback: function() {
                    setTimeout(reloadFunction, me.gos.autoReloadDelay);
                }
            });
        };
        reloadFunction();

        return me;
    }
});

Ext.define('GibsonOS.data.Store', {
    extend: 'Ext.data.Store',
    alias: ['store.gosDataStore'],
    remoteSort: true,
    autoLoad: true,
    gos: GibsonOS.getGosPart({
        autoReload: false,
        autoReloadDelay: 500
    }),
    constructor: function(data) {
        var me = this;
        var isLoaded = false;
        var lastRequest = null;

        if (
            data &&
            data.gosData &&
            data.gosData.extraParams &&
            me.proxy
        ) {
            me.proxy.extraParams = data.gosData.extraParams;
        }

        if (
            data &&
            data.gos &&
            data.gos.data &&
            data.gos.data.extraParams &&
            me.proxy
        ) {
            me.proxy.extraParams = data.gos.data.extraParams;
        }

        me.callParent(arguments);

        if (!me.gos) {
            me.gos = {};
        }

        me.gos.cancelLoad = function() {
            Ext.Ajax.abort(lastRequest);
        };

        me.on('beforeload', function() {
            if (lastRequest) {
                me.gos.cancelLoad();
            }

            lastRequest = Ext.Ajax.getLatest();
        });
        me.on('load', function(store, operation, options) {
            var data = store.getProxy().getReader().jsonData;
            isLoaded = true;
            GibsonOS.checkResponseForLogin(data);
            GibsonOS.checkResponseForErrorMessage(data, store);
            lastRequest = null;
        }, me, {
            priority: 999
        });

        var reloadFunction = function() {
            if (
                !me.gos.autoReload ||
                !isLoaded
            ) {
                setTimeout(reloadFunction, me.gos.autoReloadDelay);
                return true;
            }

            me.load({
                callback: function() {
                    setTimeout(reloadFunction, me.gos.autoReloadDelay);
                }
            });
        };
        reloadFunction();

        return me;
    }
});

Ext.define('GibsonOS.data.proxy.Ajax', {
    extend: 'Ext.data.proxy.Ajax',
    alias: ['proxy.gosDataProxyAjax'],
    reader: {
        type: 'gosDataReaderJson'
    },
    actionMethods: {
        create: 'POST',
        read: 'POST',
        update: 'POST',
        destroy: 'POST'
    }
});

Ext.define('GibsonOS.data.reader.Json', {
    extend: 'Ext.data.reader.Json',
    alias: ['reader.gosDataReaderJson'],
    type: 'json',
    root: 'data',
    totalProperty: 'total'
});

Ext.define('GibsonOS.data.Model', {
    extend: 'Ext.data.Model',
    alias: ['widget.gosDataModel']
});

Ext.define('GibsonOS.grid.Panel', {
    extend: 'Ext.grid.Panel',
    alias: ['widget.gosGridPanel'],
    border: false,
    flex: 1,
    itemContextMenu: false,
    containerContextMenu: false,
    gos: GibsonOS.getGosPart(),
    initComponent: function() {
        var grid = this;

        if (
            this.gos &&
            this.gos.data &&
            this.gos.data.extraParams &&
            this.getStore() &&
            this.getStore().getProxy()
        ) {
            Ext.iterate(this.gos.data.extraParams, function(parameter, value) {
                grid.getStore().getProxy().setExtraParam(parameter, value);
            });
        }

        var defaultAutoReload = false;

        if (this.getStore()) {
            defaultAutoReload = this.getStore().gos.autoReload;
        }

        this.callParent();

        var activateAutoReload = function() {
            if (this.getStore()) {
                this.getStore().gos.autoReload = defaultAutoReload;
            }
        };
        this.on('enable', activateAutoReload);
        this.on('show', activateAutoReload);

        var deactivateAutoReload = function() {
            if (this.getStore()) {
                defaultAutoReload = this.getStore().gos.autoReload;
                this.getStore().gos.autoReload = false;
            }
        };
        this.on('close', deactivateAutoReload);
        this.on('hide', deactivateAutoReload);
        this.on('destroy', deactivateAutoReload);
        this.on('disable', deactivateAutoReload);

        if (this.itemContextMenu) {
            this.itemContextMenu = new GibsonOS.contextMenu.ContextMenu({
                items: this.itemContextMenu,
                parent: this
            });
        }

        this.on('itemcontextmenu', function(grid, record, item, index, event, options) {
            if (this.itemContextMenu) {
                this.itemContextMenu.record = record;
                event.stopEvent();
                this.itemContextMenu.showAt(event.getXY());
            }
        });

        if (this.containerContextMenu) {
            this.containerContextMenu = new GibsonOS.contextMenu.ContextMenu({
                items: this.containerContextMenu,
                parent: this
            });
        }

        this.on('containercontextmenu', function(grid, event, options) {
            if (this.containerContextMenu) {
                event.stopEvent();
                this.containerContextMenu.showAt(event.getXY());
            }
        });

        if (this.down('gosToolbarPaging')) {
            this.getStore().on('add', function (store, records) {
                store.totalCount += records.length;
                grid.down('gosToolbarPaging').onLoad();
            }, this, {
                priority: 999
            });

            this.getStore().on('remove', function (store) {
                store.totalCount--;
                grid.down('gosToolbarPaging').onLoad();
            }, this, {
                priority: 999
            });
        }
    }
});

Ext.define('GibsonOS.grid.feature.Grouping', {
    extend: 'Ext.grid.feature.Grouping',
    alias: ['feature.gosGridFeatureGrouping'],
    groupHeaderTpl: '{name} ({rows.length})',
    startCollapsed: true
});

Ext.define('GibsonOS.grid.plugin.CellEditing', {
    extend: 'Ext.grid.plugin.CellEditing',
    alias: 'plugin.gosGridPluginCellEditing',
    clicksToEdit: 1
});

Ext.define('GibsonOS.grid.column.ProgressBar', {
    extend: 'Ext.grid.column.Template',
    alias: 'widget.gosGridColumnProgressBar',
    tpl: [
        '<div class="gibsonProgressFrame">',
        '<div class="gibsonProgressBar" style="width: {percent}%;">{percent}%</div>',
        '</div>'
    ]
});

Ext.define('GibsonOS.grid.column.ComboBoxEditor', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.gosGridColumnComboBoxEditor',
    renderer: function(value, metaData) {
        return this.columns[metaData.columnIndex].getEditor().getDisplayValue();
    }
});

Ext.define('GibsonOS.view.View', {
    extend: 'Ext.view.View',
    alias: ['widget.gosViewView'],
    border: false,
    loadMask: true,
    flex: 1,
    multiSelect: true,
    trackOver: true,
    overItemCls: 'x-item-over',
    autoScroll: true
});

Ext.define('GibsonOS.chart.Chart', {
    extend: 'Ext.chart.Chart',
    alias: ['widget.gosChartChart'],
    border: false,
    style: 'background: #FFF',
    animate: true
});

Ext.define('GibsonOS.chart.axis.Numeric', {
    extend: 'Ext.chart.axis.Numeric',
    alias: ['axis.gosChartAxisNumeric'],
    grid: {
        odd: {
            opacity: 1,
            fill: '#DDD',
            stroke: '#BBB'
        }
    }
});

Ext.define('GibsonOS.chart.axis.Time', {
    extend: 'Ext.chart.axis.Time',
    alias: ['axis.gosChartAxisTime'],
    grid: {
        odd: {
            opacity: 1,
            fill: '#DDD',
            stroke: '#BBB'
        }
    }
});

Ext.define('GibsonOS.chart.series.Line', {
    extend: 'Ext.chart.series.Line',
    alias: ['series.gosChartSeriesLine']
});

Ext.define('GibsonOS.menu.DatePicker', {
    extend: 'Ext.menu.DatePicker',
    alias: ['widget.gosMenuDatePicker'],
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.picker.Time', {
    extend: 'Ext.picker.Time',
    alias: ['widget.gosPickerTime'],
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.picker.Color', {
    extend: 'Ext.picker.Color',
    alias: ['widget.gosPickerColor'],
    gos: GibsonOS.getGosPart()
});

Ext.define('GibsonOS.ProgressBar', {
    extend: 'Ext.ProgressBar',
    alias: ['widget.gosProgressBar']
});