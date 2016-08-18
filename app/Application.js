/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('LensControl.Application', {
    extend: 'Ext.app.Application',
    
    name: 'LensControl',
    
    login: localStorage.getItem("login"),
    passw: localStorage.getItem("password"),
    
    //requires: [
    views: [
        'Login.view.login.LoginCheck',
        'LensControl.view.main.Main'
    ],

    stores: [
        // TODO: add global / shared stores here
    ],
    
    launch: function () {
        // TODO - Launch the application
        // launch - вызывается, когда application подгружает все необходимые классы
        if (this.login === null || this.passw === null) {
            var app = 'logincheck';
        } else {
            var app = 'app-main';
        }
        Ext.create({
            xtype: app
        });
    },
    
    init: function () {
        console.log("communication");
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
