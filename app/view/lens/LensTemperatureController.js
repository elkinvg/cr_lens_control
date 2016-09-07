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
                                    
//                                    var ref = me.lookupReference('chart');
                                    
                                    var Temp = {};
                                    Temp.T_1 = me.lookupReference('T_1'),
                                            Temp.T_2 = me.lookupReference('T_2'),
                                            Temp.T_3 = me.lookupReference('T_3'),
                                            Temp.T_4 = me.lookupReference('T_4'),
                                            Temp.T_5 = me.lookupReference('T_5');
                                    
                                    editTempOut(Temp,'T1');
                                }
                            }
                        }
                );
            },
            interval: 60000 // 1 minute
        };
        var runner = new Ext.util.TaskRunner();
        runner.start(task);
        
    },
//
//
//
    getTemperatureChart: function () {
        // График строится по запросу
        // При Выводе графика без запроса вылезает глюк, если в течении
        // 30 секунд не перейти на вкладку
        var me = this;
        var win = new Ext.Window({
            width: '100%'
            , title: 'Изменение температур системы охлаждения'
            , height: 600
            , draggable: false
            , border: false
            , modal: true
            , resizable: false
            , items: [
                {
                    initComponent: function () {
                        var dStore = Ext.data.StoreManager.lookup('lenstempStore');
                        var ref = this;
                        dStore.load(
                                {
                                    callback: function (records, operation, success) {
                                        if (success) {
                                            var axes0 = ref.axes[0];
                                            if (typeof dbg !== 'undefined')
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
                                });
                    },
                    xtype: 'cartesian',
                    reference: 'chart',
                    width: '100%',
                    height: 500,
                    store: {
                        type: 'lenstempstore'
                    },
                    legend: {
                        docked: 'right'
                    },
                    axes: [{
                            title: 'Температура',
                            type: 'numeric',
                            fields: [
                                'T_1',
                                'T_2',
                                'T_3',
                                'T_4',
                                'T_5',
                            ],
                            //minimum: 18,
                            //maximum: 21,
                            position: 'left',
                            grid: true,
                            //minimum: 0,
                            //renderer: 'onAxisLabelRender'
                            listeners: {
                                rangechange: function (axis, range, eOpts) {
                                },
                            },
                        }, {
                            type: 'category',
                            fields: 'time',
                            position: 'bottom',
                            grid: true,
                            label: {
                                rotate: {
                                    degrees: -45
                                }
                            }
                        },
                    ],
                    series: [
                        {
                            type: 'line',
                            xField: 'time',
                            yField: 'T_1',
                            style: {
                                lineWidth: 4
                            },
                        },
                        {
                            type: 'line',
                            xField: 'time',
                            yField: 'T_2',
                            style: {
                                lineWidth: 4
                            },
                        },
                        {
                            type: 'line',
                            xField: 'time',
                            yField: 'T_3',
                            style: {
                                lineWidth: 4
                            },
                        },
                        {
                            type: 'line',
                            xField: 'time',
                            yField: 'T_4',
                            style: {
                                lineWidth: 4
                            },
                        },
                        {
                            type: 'line',
                            xField: 'time',
                            yField: 'T_5',
                            style: {
                                lineWidth: 4
                            },
                        },
                    ],
                },
            ]
        });
        win.show();
    }

});