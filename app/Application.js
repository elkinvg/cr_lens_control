/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
// Для вывода debug
// GET-> adddress/?dbg=1
var get_params = Ext.urlDecode(location.search.substring(1));
window.onunload = function()
{
//    return confirm('Вы хотите покинуть сайт?')
}
window.onbeforeunload = function(){
//    return confirm('Точно хотите выйти?');
}
if (get_params.dbg === '1') {
    dbg = "";
}

if (get_params.mode === 'ro') {
    mode_cm = "ro";
}

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
        
        if (typeof mode_cm !== 'undefined')
        if (mode_cm === "ro")
        {
            Ext.create({
                xtype: 'app-main'
            });
            return;
        }

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
    //
    //
    //
    onAppUpdate: function () {
                /*Ext.Msg.confirm('Приложение обновилось', 'Приложение обновилось на сервере,<br> перезагрузить?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );*/window.location.reload();
    },
    //
    //
    //
    saveSettInLocalStorage : function (nameOfKey,value) {
        // Для сохранения различных настроек в sett_data из LocalStorage
        var sett_data = localStorage.getItem("sett_data");
        
        if (sett_data===null) {
            sett_data = new Object();
            sett_data[nameOfKey] = value;
            var json =  Ext.util.JSON.encode(sett_data);
            localStorage.setItem("sett_data", json);
        } else {
            try {
                var fromSettData = Ext.util.JSON.decode(sett_data);
                fromSettData[nameOfKey] = value;
                var json = Ext.util.JSON.encode(fromSettData);
                localStorage.setItem("sett_data", json);
            }
            catch (e){}
        }
    },
    //
    //
    //
    getSettFromLocalStorage : function (nameOfKey) {
        var set_data = localStorage.getItem("sett_data");
        
        if (set_data===null)
            return set_data;
        
        try {
            var dataFromSettLS = Ext.util.JSON.decode(set_data);
        }
        catch (e) {
            return null;
        }
        
        var values = dataFromSettLS[nameOfKey];
        
        if (values === undefined)
            return null;
        
        return values;
    }
});
