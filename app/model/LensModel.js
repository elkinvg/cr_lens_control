Ext.define('LensControl.model.LensModel', {
    extend: 'Ext.data.Model',
    alias: 'model.lensmodel',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'timestamp'},
        {name: 'device_name'},
        {name: 'device_status'},
        {name: 'device_state'},
        {name: 'volt_measure', type: 'float'},
        {name: 'curr_measure', type: 'float'},
        {name: 'volt_level', type: 'float'},
        {name: 'curr_level', type: 'float'}
//        'id',
//        'timestamp',
//        'device_name',
//        'device_status',
//        'device_state',
//        'volt_measure',
//        'curr_measure',
//        'volt_level',
//        'curr_level'
    ],
    proxy: {
        type: 'websocket',
        storeId: 'myStore',
        url: 'ws://127.0.0.1:7890?login=tango&password=tango',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
        listeners: {
        load: function (records, store, success) {
            if (success) {
                if(typeof dbg !== 'undefined') console.log("Data loaded. ");
            } else {
                if(typeof dbg !== 'undefined') console.log("not success!!!");
            }
        }
    }
    
//    proxy: {
//        type: 'websocket',
//        storeId: 'myStore',
//        //store: 'LensControl.store.LensWsStore',
//        url: 'ws://127.0.0.1:7890?login=tango&password=tango',
//        reader: {
//            type: 'json' ,
//        }
//    }
});


