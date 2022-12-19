Ext.define('GibsonOS.module.ftp.session.AutoComplete', {
    extend: 'GibsonOS.form.AutoComplete',
    alias: ['widget.gosModuleFtpSessionAutoComplete'],
    itemId: 'ftpSessionAutoComplete',
    url: baseDir + 'ftp/session/autoComplete',
    model: 'GibsonOS.module.ftp.session.model.Grid',
    requiredPermission: {
        module: 'ftp',
        task: 'session',
        action: 'autoComplete',
        permission: GibsonOS.Permission.READ
    }
});