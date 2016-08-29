Ext.define('LensControl.store.LensTemperatureStore', {
    extend: 'Ext.data.Store',
    alias: 'store.lenstempstore',
//    config: {
//        //model: 'MyModel',
//        storeId: 'lenstempStore',
//    },
    storeId: 'lenstempStore',
    fields: [
        'att_conf_id',
        'data_time',
        'recv_time',
        'insert_time',
        'value_r',
        'quality',
        'error_desc'
    ],
    autoload: true,
    proxy: {
        method: 'GET',
        url: '/cr_conf/oil_temperature.php',
        type: 'ajax',
        reader: {
            rootProperty: 'data',
            successProperty: 'success',
            type: 'json'
        }
    },
    listeners: {
        load: function (records, store, success) {
            if (success) {
                console.log("TemperatureData loaded.");
            } else {
                console.log("not success!!!");
            }
        }
    }
});


