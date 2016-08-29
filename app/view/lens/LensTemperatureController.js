Ext.define('LensControl.view.lens.LensTemperatureController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lenstemp',

    init: function () {
        console.log("init LensTemperatureController");
        
        
//        var myStore = Ext.create('Ext.data.Store', {
//            storeId: 'lenstempStore',
//            fields: [
//                'att_conf_id',
//                'data_time',
//                'recv_time',
//                'insert_time',
//                'value_r',
//                'quality',
//                'error_desc'
//            ],
//            autoload: true,
//            proxy: {
//                method: 'GET',
//                url: '/cr_conf/oil_temperature.php',
//                type: 'ajax',
//                reader: {
//                    rootProperty: 'data',
//                    successProperty: 'success',
//                    type: 'json'
//                }
//            },
//            listeners: {
//                load: function (records, store, success) {
//                    if (success) {
//                        console.log("TemperatureData loaded.");
//                    } else {
//                        console.log("not success!!!");
//                    }
//                }
//            }
//        });
        
        var dStore = Ext.data.StoreManager.lookup('lenstempStore');
        var a=2;
        //myStore.load();
        
        
//                var myStore = Ext.create('Ext.data.Store', {
//            config: {
//                //model: 'MyModel',
//                storeId: 'lenstempStore',
//            },
////    storeId: 'tempStore',
//            fields: [
//                'att_conf_id',
//                'data_time',
//                'recv_time',
//                'insert_time',
//                'value_r',
//                'quality',
//                'error_desc'
//            ],
//            autoload: true,
//            proxy: {
//                storeId: 'lenstempStore',
//                //method: 'GET',
//                url: '/cr_conf/oil_temperature.php',
//                type: 'ajax',
////        rootProperty: 'data',
////        successProperty: 'success'
//                reader: {
//                    type: 'json',
//                    rootProperty: 'data',
//                    successProperty: 'success'
//                }
//            },
//            listeners: {
//                load: function (records, store, success) {
//                    if (success) {
//                        console.log("TemperatureData loaded.");
//                    } else {
//                        console.log("not success!!!");
//                    }
//                }
//            }
//        });
        
//        dStore = dStore.load(
//                {
//                    callback: function (records, operation, success) {
//
//                    }
//                }
//        );
//        var task = {
//            run: function () {
//                var dStore = Ext.data.StoreManager.lookup('tempStore');
//                dStore = dStore.load(
//                        {
//                            callback: function (records, operation, success) {
//                                var a = 5;
//                            }
//                        });
//            },
//            interval: 5000 // 5 second
//        };
//        var runner = new Ext.util.TaskRunner();
//        runner.start(task);
                        
                
//        Ext.Ajax.request({
//            url: '/cr_conf/oil_temperature.php',
////            rootProperty: 'argout',
//            method: 'GET',
////            type: 'ajax',
//            proxy: {
//                type: 'ajax',
//                rootProperty: 'data',
//                successProperty: 'success',
//            },
////            method: 'POST',
//            timeout: 2000,
//            disableCaching: false,
////            params: {
////                argin: input
////            },
//            success: function (response, opts) {
//                var obj = Ext.decode(response.responseText);
//                //console.dir(obj);
//                console.log(obj);
//            },
//            failure: function (response, opts) {
//                console.log('server-side failure with status code ' + response.status);
//            }
//        });
        
    }
});