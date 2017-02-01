Ext.define('LensControl.view.lens.LensTemperatureController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lenstemp',

    init: function () {
        var me = this;
        if(typeof dbg !== 'undefined') 
            console.log("init LensTemperatureController");
        
        
        var dStore = Ext.data.StoreManager.lookup('lenstempStore');
        dStore.load();
        
        // установка первоначального значения для numberfield с температурой 
        var maxTempDefault = 40;
        var warn_temp = LensControl.app.getSettFromLocalStorage("warning_temperature");
        var warning_temp_field = me.lookupReference('warning_temp_field');
        if (warn_temp === undefined ||
                warn_temp === null) {
            var maxTemp = maxTempDefault;
        } else {
            var maxTemp = warn_temp;
        }
        warning_temp_field.setValue(maxTemp);
        
        var task = {
            run: function () {
                me.loadStoreWithTemperature("phpscript"); 
            },
            //interval: 60000 // 1 minute
            interval: 3000 // 3 seconds
        };
        var runner = new Ext.util.TaskRunner();
        runner.start(task);
        
    },
    //
    //
    //
    loadStoreWithTemperature: function (type) {
        
        var me = this;        
        
        var warn_temp = LensControl.app.getSettFromLocalStorage("warning_temperature");
        
        /*if (type === "dstore") {
            var dStore = Ext.data.StoreManager.lookup('lenstempStore');

            dStore.load(
                    {
                        callback: function (records, operation, success) {
                            if (success) {
                                updateDataTemp(records, type);
                            } else {
                                var time_warning_mes = Ext.ComponentQuery.query('[name=warning_mes]');
                                var warning_message = '<h3><span style="color:red; font-size:150%"> Не удалось загрузить данные по температуре.</span></h3>';

                                Ext.each(time_warning_mes, function (component, index) {
                                    component.setHidden(false);
                                    component.update(warning_message);
                                });
                            }
                        }
                    }
            );
        }
        else*/ 
        if (type === "phpscript") {
            Ext.Ajax.request({
                //url: '/cr_conf/scripts/reading_of_oil_temp.php',
                url: '/cr_conf/termo/reading_of_oil_temp.php',
                method: 'GET',
                success: function (ans) {       
                    try {
                        var decodedString = Ext.decode(ans.responseText);
                        var success = decodedString.success;
                        if (success === true) {
                            var temperature = decodedString.argout;
                            if (temperature === undefined) {
                                //me.loadStoreWithTemperature("dstore");
                                warn_temperature_mess();
                            }
                            else {
                                info_temperature_mess();
                                updateDataTemp(temperature, type);
                            }
                        }
                        else
                            warn_temperature_mess();
                    } catch (e) {
                        warn_temperature_mess();
                        //me.loadStoreWithTemperature("dstore");
                    }
                },
                failure: function (ans) {
                    /*var type = "dstore";
                    me.loadStoreWithTemperature(type);*/
                    warn_temperature_mess();
                }
            });
        }
        
        function info_temperature_mess() {
            var info_mes = Ext.ComponentQuery.query('[name=info_temp_mes]');
            Ext.each(info_mes, function (component, index) {
                var even_iter = component.even_iter;
                if (even_iter === undefined) {
                    component.even_iter = 1;
                    var info_message = '<h3><span style="color:blue"> Данные по температуре обновились</span></h3>';
                }
                else {
                    if (component.even_iter === 1) {
                        var info_message = '<h3><span style="color:green"> Данные по температуре обновились</span></h3>';
                        component.even_iter = 2;
                    } else if (component.even_iter === 2) {
                        var info_message = '<h3><span style="color:blue"> Данные по температуре обновились</span></h3>';
                        component.even_iter = 1;
                    }
                }
                
                component.update(info_message);
                component.setHidden(false);
            });
        }
        
        function warn_temperature_mess() {
            var time_warning_mes = Ext.ComponentQuery.query('[name=warning_mes]');
            var warning_message = '<h3><span style="color:red; font-size:150%"> Не удалось загрузить данные по температуре</span></h3>';
            Ext.each(time_warning_mes, function (component, index) {
                component.update(warning_message);
                component.setHidden(false);
            });
            
            var info_mes = Ext.ComponentQuery.query('[name=info_temp_mes]');
             Ext.each(info_mes, function (component) {
                component.setHidden(true);
            });
        }
        
        function updateDataTemp(records, type) {
            // Для проверки температуры
            var isHeatTemp = false;
            var maxTempDefault = 40;

            // Максимальная температура.
            // После превышения этой температуры выводится 
            // Предупреждающее сообщение
            if (warn_temp === undefined ||
                    warn_temp === null) {
                var maxTemp = maxTempDefault;
            } else {
                var maxTemp = warn_temp;
            }



            // Для вывода значения температуры на картинке
            function editTempOut(t,dataTemp) {
                Ext.Object.each(t,
                        function (key, value) {
                            var temperature = dataTemp[key];
                            var checkTmp = parseInt(temperature, 10);
                            if (isNaN(checkTmp) !== true) {
                                if (checkTmp > maxTemp) {
                                    isHeatTemp = true;
                                }
                            }


                            var text = '<span style="font-weight:bold; color:blue; font-size:300%">' + temperature + '</span>';
                            value.setText(text, false);
                        });
            }
            ;

//                                    var ref = me.lookupReference('chart');

            var Temp = {};
            Temp.T_1 = me.lookupReference('T_1'),
                    Temp.T_2 = me.lookupReference('T_2'),
                    Temp.T_3 = me.lookupReference('T_3'),
                    Temp.T_4 = me.lookupReference('T_4'),
                    Temp.T_5 = me.lookupReference('T_5'),
                    Temp.T_6 = me.lookupReference('T_6'),
                    Temp.T_7 = me.lookupReference('T_7'),
                    
                    Temp.T2_1 = me.lookupReference('T2_1'),
                    Temp.T2_2 = me.lookupReference('T2_2'),
                    Temp.T2_3 = me.lookupReference('T2_3'),
                    Temp.T2_4 = me.lookupReference('T2_4');

            if (type === "dstore") {
                // Берутся значения из предпоследней итерации
                // так как в последней могут быть значения
                // не для всех датчиков
                var dataTemp = records[records.length - 3].data;
                editTempOut(Temp,dataTemp);
            }
            else if (type === "phpscript") {
                var dataTemp = records;
                editTempOut(Temp,dataTemp);
            }
            
            
            var warning_message = '<h3><span style="color:red; font-size:150%"> Превышена допустимая температура!!!</span></h3>'
                    + '<p><b>Проверьте показания термодатчиков</b></p>';
            var powersupplies = Ext.ComponentQuery.query('[name=name_powersupplies]')[0];
            // Вывод сообщения если превышена максимальная температура

            var warning_mes = Ext.ComponentQuery.query('[name=warning_mes]');
            Ext.each(warning_mes, function (component, index) {
                if (isHeatTemp) {
                    component.setHidden(false);
                    component.update(warning_message);
                } else {
                    component.setHidden(true);
                }
            });

            if (type === "phpscript") {
                return;
            }
            // Дополнительные данные содержатся в store
            // В последнем элементе массива records.length - 1

            var lastRec = records[records.length - 1];
            var dataFrom = lastRec.data;
            if (dataFrom === undefined) {
                console.log("Store: dataFrom===undefined");
                return;
            }
            if (dataFrom.last_timestamp === undefined ||
                    dataFrom.now_timestamp === undefined)
                return;

            // Вывод сообщения если данные не обновлялись 
            // больше time_dif_max секунд
            var time_dif_max = 120;
            var time_difference = dataFrom.now_timestamp - dataFrom.last_timestamp;
            var time_warning_mes = Ext.ComponentQuery.query('[name=warning_mes]');
            warning_message = '<h3><span style="color:red; font-size:150%"> Данные по температуре не обновлялись ' + time_difference + ' секунд</span></h3>';

            Ext.each(time_warning_mes, function (component, index) {

                if (time_difference > time_dif_max) {
                    component.setHidden(false);
                    component.update(warning_message);
                } else {
                    if (!isHeatTemp) {
                        component.setHidden(true);
                    }
                }
            });
        }
    },
//
//
//
    
    setMaximumTemperature: function () {
        var me = this;
        var warning_temp_field = me.lookupReference('warning_temp_field');
        if (warning_temp_field === undefined || warning_temp_field === null)
            return;
        
        var value = warning_temp_field.getValue();
        
        if (value === null)
            return;
        
        var maxVal = warning_temp_field.maxValue;
        var minVal = warning_temp_field.minValue;
        
        if (value < minVal || value > maxVal )
            return;
        
        LensControl.app.saveSettInLocalStorage('warning_temperature',value);
        
        // Загружается Store, для того, чтобы убрать или выставить
        // оповещения о превышении температуры
        me.loadStoreWithTemperature();
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
                    xtype: 'cartesian',
                    reference: 'chart', 
                    name: 'chart',
                    width: '100%',
                    height: 500,
                    interactions: 'crosshair',
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
                                'T_6',
                                'T_7'
                            ],
                            //minimum: 18,
                            //maximum: 21,
                            position: 'left',
                            grid: true,
                            //minimum: 0,
                            //renderer: 'onAxisLabelRender'
                            listeners: {
                                rangechange: function (axis, range, eOpts) {
                                }
                            }
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
                        }
                    ],
                    series: [
                        {
                            type: 'line',
                            xField: 'time',
                            yField: 'T_1',
                            style: {
                                lineWidth: 4
                            },
                            tooltip: {
                                trackMouse: true,
                                renderer: onSeriesTooltipRender
                            }
                        },
                        {
                            type: 'line',
                            xField: 'time',
                            yField: 'T_2',
                            style: {
                                lineWidth: 4
                            },
                            tooltip: {
                                trackMouse: true,
                                renderer: onSeriesTooltipRender
                            }
                        },
                        {
                            type: 'line',
                            xField: 'time',
                            yField: 'T_3',
                            style: {
                                lineWidth: 4
                            },
                            tooltip: {
                                trackMouse: true,
                                renderer: onSeriesTooltipRender
                            }
                        },
                        {
                            type: 'line',
                            xField: 'time',
                            yField: 'T_4',
                            style: {
                                lineWidth: 4
                            },
                            tooltip: {
                                trackMouse: true,
                                renderer: onSeriesTooltipRender
                            }
                        },
                        {
                            type: 'line',
                            xField: 'time',
                            yField: 'T_5',
                            style: {
                                lineWidth: 4
                            },
                            tooltip: {
                                trackMouse: true,
                                renderer: onSeriesTooltipRender
                            }
                        },
                        {
                            type: 'line',
                            xField: 'time',
                            yField: 'T_6',
                            style: {
                                lineWidth: 4
                            },
                            tooltip: {
                                trackMouse: true,
                                renderer: onSeriesTooltipRender
                            }
                        },
                        {
                            type: 'line',
                            xField: 'time',
                            yField: 'T_7',
                            style: {
                                lineWidth: 4
                            },
                            tooltip: {
                                trackMouse: true,
                                renderer: onSeriesTooltipRender
                            }
                        }
                    ]
                },
                {
                    xtype: 'button',
                    text: 'Закрыть',
                    margin: '0 0 0 100',
                    width: 150,
                    handler: function() {
                        win.close();
                    }
                }
            ]
        });

        // установить disable для кнопки, пока не загрузятся данные
        var graphbut = me.lookupReference('graphbut');
        graphbut.disable();

        var dStore = Ext.data.StoreManager.lookup('lenstempStore');

        var ref = Ext.ComponentQuery.query('[name=chart]')[0];
        // График показывается только пи успешной загрузке store
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
                            win.show();
                        }
                        graphbut.enable();
                    }
                });

         function onSeriesTooltipRender(tooltip, record, item) {
            tooltip.setHtml(item.field + " " + record.get('time') + " " + record.get(item.series.getYField()) + '&deg;C');
        }
    }
});