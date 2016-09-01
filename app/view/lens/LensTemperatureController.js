Ext.define('LensControl.view.lens.LensTemperatureController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lenstemp',

    init: function () {
        var me = this;
        if(typeof dbg !== 'undefined') 
            console.log("init LensTemperatureController");
        
//        var dStore = Ext.data.StoreManager.lookup('lenstempStore');
//        var ref = this.lookupReference('chart');
//        var axes0 = ref.axes[0];
//        axes0.setMinimum(-5);
//        axes0.setMaximum(100);
        var dStore = Ext.data.StoreManager.lookup('lenstempStore');
        dStore.load();
        
        var task = {
            run: function () {


                dStore.load(
                        {
                            callback: function (records, operation, success) {
                                if (success) {
                                    var ref = me.lookupReference('chart');
                                    var axes0 = ref.axes[0];
                                    if(typeof dbg !== 'undefined') 
                                        console.log("store with Temperature Loaded!");
                                    var ss = records[records.length - 1];
                                    var dataFrom = ss.data;
                                    if (dataFrom === undefined) {
                                        console.log("Store: dataFrom===undefined");
                                        return;
                                    }
                                    var minT = dataFrom['min_T'];
                                    var maxT = dataFrom['max_T'];
                                    if (minT === undefined || maxT === undefined) {
                                        return;
                                    }

                                    axes0.setMaximum(parseFloat(maxT) + 2);
                                    if (minT !== 0) {
                                        axes0.setMinimum(parseFloat(minT) - 2);
                                    }
                                }
                            }
                        }
                );
            },
            interval: 60000 // 1 minute
        };
        var runner = new Ext.util.TaskRunner();
        runner.start(task);
        
    }
});