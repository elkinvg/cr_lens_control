/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
//Ext.Loader.setConfig ({
//    enabled: true ,
//    paths: {
//        'Ext.ux.WebSocket': '/components/ext.ux.websocket/WebSocket.js' ,
//        'Ext.ux.WebSocketManager': '/components/ext.ux.websocket/WebSocketManager.js'
//    }
//});

Ext.application({
    name: 'LensControl',

    extend: 'LensControl.Application',

    requires: [
        'LensControl.view.main.Main'
    ],

    // The name of the initial view to create. With the classic toolkit this class
    // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
    // modern toolkit, the main view will be added to the Viewport.
    //
    //mainView: 'LensControl.view.main.Main'
	
    //-------------------------------------------------------------------------
    // Most customizations should be made to LensControl.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
});
