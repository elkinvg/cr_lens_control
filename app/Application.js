/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
dbg = "";
Ext.define('LensControl.Application', {
    extend: 'Ext.app.Application',
    
    name: 'LensControl',
    
    login: localStorage.getItem("login"),
    passw: localStorage.getItem("password"),
    randident: localStorage.getItem("rand_ident"),
    userandident: localStorage.getItem("use_rand_ident"),
    
    //requires: [
    views: [
        'Login.view.login.LoginCheck',
        'Login.view.login.RandIdentCheck',
        'LensControl.view.main.Main',
        'LensControl.view.lens.LensTemperature',
        'LensControl.view.lens.Lens'
    ],
//    requires: [
//        'LensControl.store.LensTemperatureStore',
//    ],

    stores: [
        // TODO: add global / shared stores here
        'LensTemperatureStore','LogStore'
    ],
    
    launch: function () {
        // Для смены сепаратора чисел. Стоит русская локализация, 
        // для неё по умолчанию ','
        
        Ext.util.Format.decimalSeparator = '.';

        // TODO - Launch the application
        // launch - вызывается, когда application подгружает все необходимые классы
        if (this.login === null || this.passw === null) {
            var app = 'logincheck';
        } else {
            if (parseInt(this.userandident) === 1) {
                if (this.randident === null)
                    var app = 'randidentcheck';
                else
                    var app = 'app-main';
            } else
                var app = 'app-main';
        }
        Ext.create({
            xtype: app
        });
    },
    
    init: function () {
        if(typeof dbg !== 'undefined') console.log("communication");
        var dt = new Date();
        timeUpdWs = dt.getTime()/1000 | 0;
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Приложение обновилось', 'Приложение обновилось на сервере, перезагрузить?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
