/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('LensControl.view.main.LensMainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.lensmain',
    
    init: function() {
        if (typeof mode_cm !== 'undefined') {
            if (mode_cm === "ro")
            {
                var app_main = Ext.ComponentQuery.query('app-main');
                app_main[0].remove(app_main[0].lookupReference('log_lens'));
            }
        }
    },

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    }
});
