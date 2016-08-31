Ext.define('LensControl.view.lens.LensTemperatureController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lenstemp',

    init: function () {
        console.log("init LensTemperatureController");
        
        var dStore = Ext.data.StoreManager.lookup('lenstempStore');
        var ref = this.lookupReference('chart');
        var axes0 = ref.axes[0];
//        axes0.setMinimum(-5);
//        axes0.setMaximum(100);

        dStore.load();

        //myStore.load();
        
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
        
    }
});