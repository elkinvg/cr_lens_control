//var prop = Ext.create('Common_d.Property');

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
        type: 'websocket',
        storeId: 'lensStore',
        // получение адреса ws
        // логин и пароль должны храниться в localStorage
        url: 'ws://' + Ext.create('Common_d.Property').getWsforlens() + 'login=' + localStorage.getItem("login") + '&password=' + localStorage.getItem("password"),
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
    listeners: {
        load: function (store, n) {
                console.log("Data loaded. ");
        },
        
    }    
    //    
    //    
    //    
//    
//    storeId: 'myStore',
//    alias: 'store.lenswsstore',
//    //model: 'lensmodel',
//    model: 'LensControl.model.LensModel',
//    listeners: {
//        load: function (records, store, success) {
//            if (success) {
//                console.log("Data loaded. ");
//            } else {
//                console.log("not success!!!");
//            }
//        }
//    }
            

//    fields: [
////        'timestamp',
//        'device_name',
//        'device_status',
//        'device_state',
////        'volt_measure',
////        'curr_measure',
////        'volt_level',
////        'curr_level'
//    ],
//    proxy: {
//        type: 'websocket',
//        storeId: 'myStore',
//        url: 'ws://127.0.0.1:7890?login=tango&password=tango',
//        reader: {
//            type: 'json' ,
//        }
//    },
//    autoLoad: true,
//    listeners: {
//        load: function (records, store, success) {
//            if (success) {
//                console.log("success!!!");
//            } else {
//                console.log("not success!!!");
//            }
//        },        
//    }

//    extend: 'Ext.data.Store',
//    storeId: 'lenswsStore',
//    alias: 'store.lenswsstore',
//    fields: [
//        'timestamp', 
//        'device_name', 
//        'device_status', 
//        'device_state',
//        'volt_measure',
//        'curr_measure',
//        'volt_level',
//        'curr_level'
//    ],
//    //
//    //
//    //
//    proxy: {
//        type: 'websocket',
//        //storeId: 'testwsStore',
//        url: 'ws://127.0.0.1:7890?login=tango&password=tango',
//        reader: {
//            type: 'json',
//        }
////        rootProperty: 'argout',
////        successProperty: 'readStatus',
//    },
//    autoLoad: true,
//    listeners: {
//        load: function (records, store, success) {
//            if (success) {
//                console.log("success!!!");
//            } else {
//                console.log("not success!!!");
//            }
//        },
//        beforeload: function () {
//            //console.log('BEFORE LOAD');
//        },
//        update: function (store, record, op, modifiedFieldNames) {
//        }
//    },
    
    
});


