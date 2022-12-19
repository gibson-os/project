function getJsonValue(json, key)
{
	if (
		json &&
		json[key]
	) {
		return json[key];
	} else {
		return null;
	}
}

let sizeUnits = ['B', 'KB', 'MB', 'GB', 'TB'];

function transformSize(size)
{
    let i = 0;
    
    for(;size >= 1024;i++)
    {
        if (i === sizeUnits.length) {
            break;
        }

        size /= 1024;
    }
    
    return Math.round(size * 100) / 100 + " " + sizeUnits[i];
}

let timeUnits = ['s', 'm', 'h'];

function transformSeconds(seconds, secondsRound = false) {
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds -= minutes * 60;
    minutes -= hours * 60;

    if (secondsRound !== false) {
        const round = secondsRound === 0 ? 1 : 10^secondsRound;
        seconds *= round;
        seconds = Math.round(seconds)
        seconds /= round;
    }

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds;
}

function checkSuccess(result)
{
    if (result.success) {
        return true;
    }
    
    if (result.data.error) {
        Ext.Msg.alert('Fehler!', result.data.error);
    }
    
    return false;
}

let chromeCast = {
    available: false,
    connected: false,
    buttons: [],
    Session: null,
    Media: null,
    itemsInView: {},
    receiverAppId: '1EEA092A',
    connect: function(onConnect) {
        if (chromeCast.connected) {
            onConnect();
            return true;
        }

        chrome.cast.requestSession(
            function(session) {
                chromeCast.connected = true;
                Ext.iterate(chromeCast.buttons, function(button) {
                    button.fireEvent('chromecastConnect', button);
                });

                onConnect();
            },
            function(error) {
                chromeCast.connected = false;
            }
        );
    }
};

function initializeCastApi()
{
    if (!cast) {
        return;
    }

    let receiverAppId = chromeCast.receiverAppId;

    if (!receiverAppId) {
        receiverAppId = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
    }

    const player = new cast.framework.RemotePlayer();
    const playerController = new cast.framework.RemotePlayerController(player);
    playerController.addEventListener(cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED, (event) => {
        const contentId = instance.getCurrentSession().getMediaSession().media.contentId;

        if (chromeCast.itemsInView[contentId]) {
            Ext.iterate(chromeCast.itemsInView[contentId], (record) => {
                record.set('position', event.value);
            });
        }
        console.log(event);
    });

    const instance = cast.framework.CastContext.getInstance();
    instance.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, (event) => {
        console.log(event);
        switch (event.sessionState) {
            case cast.framework.SessionState.SESSION_STARTED:
            case cast.framework.SessionState.SESSION_RESUMED:
                console.log('chromecast connected');
                chromeCast.connected = true;
                Ext.iterate(chromeCast.buttons, function(button) {
                    button.fireEvent('chromecastConnect', button);
                });
                instance.getCurrentSession().sendMessage('urn:x-cast:net.itronom.gibson', {
                    type: 'user',
                    user: gosUser
                });

                break;
            case cast.framework.SessionState.SESSION_ENDED:
                console.log('chromecast disconnected');
                chromeCast.connected = false;
                Ext.iterate(chromeCast.buttons, function(button) {
                    button.fireEvent('chromecastDisconnect', button);
                });

                break;
        }
    });
    instance.addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED, (event) => {
        console.log(event);
        switch (event.castState) {
            case cast.framework.CastState.NO_DEVICES_AVAILABLE:
                console.log('chromecast not available');
                chromeCast.available = false;
                Ext.iterate(chromeCast.buttons, function(button) {
                    button.fireEvent('chromecastNotAvailable', button);
                });

                break;
            case cast.framework.CastState.NOT_CONNECTED:
                console.log('chromecast available');
                chromeCast.available = true;
                Ext.iterate(chromeCast.buttons, function(button) {
                    button.fireEvent('chromecastAvailable', button);
                });

                break;
            case cast.framework.CastState.CONNECTED:
                console.log('chromecast connected');
                chromeCast.available = true;
                chromeCast.connected = true;
                Ext.iterate(chromeCast.buttons, function(button) {
                    button.fireEvent('chromecastConnect', button);
                });

                break;
        }
    });
    instance.setOptions({
        receiverApplicationId: receiverAppId,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
        androidReceiverCompatible: true
    });
}

function toHex(number) {
    let hex = number.toString(16);

    return (hex.length%2) ? '0' + hex : hex;
}