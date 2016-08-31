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
        'data_time',
        //'recv_time','insert_time',
        'value_r_7','quality_7','error_desc_7',
        'value_r_8','quality_8','error_desc_8',
        'value_r_9','quality_9','error_desc_9',
        'value_r_10','quality_10','error_desc_10',
        'value_r_11','quality_11','error_desc_11',
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
                
                var getData = store;
                var length = store.length;
                this.generateNewStore(store);
                console.log("TemperatureData loaded.");
            } else {
                console.log("not success!!!");
            }
        }
    },
    generateNewStore: function (store) {
//        var a = this;
//        var dataFrom = store;
//        a.loadData([],false);
//        
//        Ext.Object.each(dataFrom, function (key, value) {
//            a.add({
//                name: key,
//                value: value,
//                description: 'описание регистров при необходимости может быть добавлено',
//                //readStatus: readStatus,
//                id: key
//            });  // посмотреть про использование id
//        });
//        var bb = a;
    }
});


