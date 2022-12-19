Ext.define('GibsonOS.module.ftp.sync.interval.ComboBox', {
    extend: 'GibsonOS.form.ComboBox',
    alias: ['widget.gosModuleFtpSyncIntervalComboBox'],
    itemId: 'ftpSyncIntervalComboBox',
    name: 'interval',
    fieldLabel: 'Intervall',
    displayField: 'name',
    valueField: 'id',
    store: {
        xtype: 'gosDataStore',
        fields: [{
            name: 'id',
            type: 'string'
        },{
            name: 'name',
            type: 'string'
        }],
        data: [{
            id: 'hourly',
            name: 'Stündlich'
        },{
            id: 'daily',
            name: 'Täglich'
        },{
            id: 'weekly',
            name: 'Wöchentlich'
        },{
            id: 'monthly',
            name: 'Monatlich'
        },{
            id: 'yearly',
            name: 'Jährlich'
        }]
    }
});