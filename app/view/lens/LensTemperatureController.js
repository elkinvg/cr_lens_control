Ext.define('LensControl.view.lens.LensTemperatureController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lenstemp',

    init: function () {
        var me = this;
        if(typeof dbg !== 'undefined') 
            console.log("init LensTemperatureController");
        
        var dStore = Ext.data.StoreManager.lookup('lenstempStore');
        dStore.load();
        
        var task = {
            run: function () {


                dStore.load(
                        {
                            callback: function (records, operation, success) {
                                if (success) {
                                    // Для вывода значения температуры на картинке
                                    function editTempOut(t, refOrText) {
                                        // Берутся значения из предпоследней итерации
                                        // так как в последней могут быть значения
                                        // не для всех датчиков
                                        var dataTemp = records[records.length - 3].data;

                                        Ext.Object.each(t,
                                                function (key, value) {
                                                    var temperature = dataTemp[key];
                                                    var text = '<span style="font-weight:bold; color:blue; font-size:300%">' + temperature + '</span>';
                                                    value.setText(text, false);
                                                });
                                    };
                                    
                                    var ref = me.lookupReference('chart');
                                    
                                    var Temp = {};
                                    Temp.T_1 = me.lookupReference('T_1'),
                                            Temp.T_2 = me.lookupReference('T_2'),
                                            Temp.T_3 = me.lookupReference('T_3'),
                                            Temp.T_4 = me.lookupReference('T_4'),
                                            Temp.T_5 = me.lookupReference('T_5');
                                    
                                    editTempOut(Temp,'T1');
                                    
                                    
                                    var axes0 = ref.axes[0];
                                    if(typeof dbg !== 'undefined') 
                                        console.log("store with Temperature Loaded!");
                                    var ss = records[records.length - 1];
                                    var dataFrom = ss.data;
                                    if (dataFrom === undefined) {
                                        console.log("Store: dataFrom===undefined");
                                        return;
                                    }
                                    // Устанавливаются минимум и максимум для
                                    // ординаты, для лучшего отбражения графика
                                    // по умолчанию, не всегда добавляется пробел
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