Ext.define('LensControl.store.LensWsStore', {
    extend: 'Ext.data.Store',
    alias: 'store.lenswsstore',
    fields: [
        'timestamp',
        'device_name',
        'device_status',
        'device_state',
        'volt_measure',
        'curr_measure',
        'volt_level',
        'curr_level'
    ],

    storeId: 'lensStore',
    
    proxy: {
        //type: 'websocket',
        type: 'memory',
        storeId: 'lensStore',

        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },  
});

//bck

        // получение адреса ws
        // логин и пароль должны храниться в localStorage
        //url: 'ws://' + Ext.create('Common_d.Property').getWsforlens() + 'login=' + localStorage.getItem("login") + '&password=' + localStorage.getItem("password"),

//    listeners: {
////        load: function (store, n) {
////                if(typeof dbg !== 'undefined') console.log("Data loaded. ");
////        },
//    }  