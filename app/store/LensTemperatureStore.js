Ext.define('LensControl.store.LensTemperatureStore', {
    extend: 'Ext.data.Store',
    alias: 'store.lenstempstore',
//    config: {
//        //model: 'MyModel',
//        storeId: 'lenstempStore',
//    },
    storeId: 'lenstempStore',
    fields: [
        //'att_conf_id',
        'data_time','time',
        //'recv_time','insert_time',
        'T_7','quality_7','error_desc_7',
        'T_8','quality_8','error_desc_8',
        'T_9','quality_9','error_desc_9',
        'T_10','quality_10','error_desc_10',
        'T_11','quality_11','error_desc_11',
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
        load: function (store, records, success) {
        }
    },
});


