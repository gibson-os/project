GibsonOS.define('GibsonOS.module.rdm.index.fn.delete', function(downloads, success) {
    var msg = 'Möchten Sie den Download wirklich löschen?';
    var errorMsg = 'Download konnte nicht gelöscht werden!';

    if (downloads.length > 1) {
        msg = 'Möchten Sie die ' + downloads.length + ' Downloads wirklich löschen?';
        errorMsg = 'Downloads konnten nicht gelöscht werden!';
    }

    GibsonOS.MessageBox.show({
        title: 'Wirklich löschen?',
        msg: msg,
        type: GibsonOS.MessageBox.type.QUESTION,
        buttons: [{
            text: 'Ja',
            sendRequest: true
        },{
            text: 'Nein'
        }]
    },{
        url: baseDir + 'rdm/index/delete',
        params: {
            'downloads[]': downloads
        },
        success: function(response) {
            success(response);
        }
    });
});