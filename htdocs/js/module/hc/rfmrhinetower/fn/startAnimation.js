GibsonOS.define('GibsonOS.module.hc.rfmrhinetower.fn.startAnimation', function(button) {
    button.disable();

    GibsonOS.Ajax.request({
        url: baseDir + 'hc/rfmrhinetower/playanimation',
        params: {
            id: button.gos.data.moduleId,
            animation: button.gos.data.animationId
        },
        success: function(response) {
            button.enable();
        },
        failure: function() {
            button.enable();
        }
    });
});