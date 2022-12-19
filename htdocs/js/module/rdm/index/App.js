Ext.define('GibsonOS.module.rdm.index.App', {
    extend: 'GibsonOS.App',
    alias: ['widget.gosModuleRdmIndexApp'],
    id: 'rdm',
    title: 'Remote Download Manager',
    appIcon: 'icon_rdm',
    width: 700,
    height: 300,
    initComponent: function() {
        this.items = [{
            xtype: 'gosModuleRdmIndexTabPanel'
        }];

        this.callParent();
    }
});