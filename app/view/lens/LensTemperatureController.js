Ext.define('LensControl.view.lens.LensTemperatureController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lenstemp',

    init: function () {
        var me = this;
        
        var viewSize = Ext.getBody().getViewSize();
        
        if (me.view.xtype === 'lenstemp') {
            var lenstemp_cont_h = me.lookupReference('lenstemp_cont_h');
            var lenstemp_cont_v = me.lookupReference('lenstemp_cont_v');

            var lenstemp_pan = Ext.ComponentQuery.query('[name=lenstemp]')[0];
            
            // Ориентировка выводов с термодатчиков.
            // Если ширина экрана больше высоты расположить последовательно
            // Иначе друг над другом
            if (viewSize.width <= viewSize.height ) {
                lenstemp_cont_h.setHidden(true);
                lenstemp_cont_v.setHidden(false);
            }
            else {
                lenstemp_cont_h.setHidden(false);
                lenstemp_cont_v.setHidden(true);
            }
            
        }
        
        if(typeof dbg !== 'undefined') 
            console.log("init LensTemperatureController");
        
//        var cooling_sys_temp = Ext.getCmp('cooling_sys_temp');
//        cooling_sys_temp.setBodyStyle("background-image:url(resources/images/wallp_new.jpg?random=" + new Date().getTime() + ") !important");
        
        
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
        
        /// Происходит запрос на /cr_conf/scripts/get_data_from_restds.php
        /// В этом скрипте запрос перенаправляется на RESTDS сервер
        /// В БД должны быть прописаны для "alias": "oil_temp"
        ///                                 "host_from_db" : "oil_temp_rest"

        if (me.device_for_req === undefined || me.rest_or_wshost === undefined) {
            var params = {
                "type_req" : "restds_read_attrs",
                "is_first_req": true,
                "attrs": "oil_temperature",
                "host_from_db": "oil_temp_rest",
                "alias": "oil_temp"
            }
        }
        else {
            var params = {
                "type_req" : "restds_read_attrs",
                "attrs": "oil_temperature",
                "device_for_req": me.device_for_req,
                "rest_or_wshost": me.rest_or_wshost
            }
        }

        // Для работы вне института использовать локальный php
        // должен также быть задан GET параметр home
        if(typeof HOME_DEBUG !== 'undefined') {
            var url_for_rest_req = "/cr_conf/home-debug.php";
        }
        else
            var url_for_rest_req = "/cr_conf/scripts/get_data_from_restds.php";

        if (type === "phpscript") {
            Ext.Ajax.request({
                url: url_for_rest_req,
                method: 'GET',
                params: params,
                success: function (ans) {
                    try {
                        var decodedString = Ext.decode(ans.responseText);
                        var temperature = decodedString.data;

                        if (me.device_for_req === undefined || me.rest_or_wshost === undefined) {
                            var tango_device = decodedString.tango_device;
                            var rest_or_wshost = decodedString.rest_or_wshost;

                            if (tango_device === undefined || rest_or_wshost === undefined) {
                                warn_temperature_mess("Неправильные json-данные с сервера<br>нет ключа tango_device или rest_or_wshost");
                                return;
                            }

                            me.device_for_req = tango_device;
                            me.rest_or_wshost = rest_or_wshost;
                        }

                        if (temperature === undefined)
                        {
                            warn_temperature_mess("Неправильные json-данные с сервера<br>нет ключа data или tango_device или rest_or_wshost");
                            return;
                        }

                        // На данный момент с сервера приходят данные с 14 значениями

                        var templength = 14;

                        if (temperature.length !== templength)
                        {
                            warn_temperature_mess("Длина массива данных с температурами должна быть 14");
                            return;
                        }

                        var tempIn = {};
                        for (var i = 0; i < templength; i++){
                            if (i<7) {
                                var key = "T_" + (i+1);
                            }
                            else {
                                var key = "T2_" + (i-6);
                            }
                            tempIn[key] = temperature[i];
                        }
                        if (me.view.xtype === 'lenstemp') {
                            info_temperature_mess();
                        }
                        updateDataTemp(tempIn, type);

                    }
                    catch (e) {
                        warn_temperature_mess("Неправильные json-данные с сервера");
                    }
                },
                failure: function (response) {
                    try {
                        var respData = Ext.JSON.decode(response.responseText);
                        var warn_mess = respData.err_mess;
                    }
                    catch(e){}

                    warn_temperature_mess(warn_mess);
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
        
        function warn_temperature_mess(warning_message) {
            var time_warning_mes = Ext.ComponentQuery.query('[name=warning_mes]');

            if (warning_message === undefined)
                var warning_message = spanWarnMess("Не удалось загрузить данные по температуре");
            else
                var warning_message = spanWarnMess(warning_message);
            Ext.each(time_warning_mes, function (component, index) {
                component.update(warning_message);
                component.setHidden(false);
            });
            
            var info_mes = Ext.ComponentQuery.query('[name=info_temp_mes]');
             Ext.each(info_mes, function (component) {
                component.setHidden(true);
            });

             function spanWarnMess(inpWarnMess) {
                 return '<h3><span style="color:red; font-size:150%">' + inpWarnMess + '</span></h3>'
             }
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
            // if t is xtype
            // Temp - from lookupReference
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
                            
                            if (checkTmp > maxTemp) {
                                var text = '<span style="font-weight:bold; color:red; font-size:300%">' + temperature.toFixed(1) + '</span>';
                            }
                            else {
                                //var text = '<span style="font-weight:bold; color:blue; font-size:300%">' + temperature.toFixed(1) + '</span>';
                                var text = '<span style="font-weight:bold; color:black; font-size:300%">' + temperature.toFixed(1) + '</span>';
                            }
                                


                            
                            value.setText(text, false);
                        });
            };
            
            // Для вывода значения температуры на картинке
            // if t is ARRAY
            // Temp - from Ext.ComponentQuery.query
            function editTempOutByName(t,dataTemp) {
                Ext.Object.each(t,
                        function (key, value) {
                            var temperature = dataTemp[key];
                            var checkTmp = parseInt(temperature, 10);
                            if (isNaN(checkTmp) !== true) {
                                if (checkTmp > maxTemp) {
                                    isHeatTemp = true;
                                }
                            }
                            
                            if (checkTmp > maxTemp) {
                                var text = '<span style="font-weight:bold; color:red; font-size:250%">' + temperature.toFixed(1) + '</span>';
                            }
                            else {
                                //var text = '<span style="font-weight:bold; color:blue; font-size:300%">' + temperature.toFixed(1) + '</span>';
                                var text = '<span style="font-weight:bold; color:black; font-size:250%">' + temperature.toFixed(1) + '</span>';
                            }
                            
                            Ext.each(value, function (component, index) {
                               component.setText(text, false);
                            }); 
                        });
            };

            var Temp2 = {};


            Temp2.T_1 = Ext.ComponentQuery.query('[name=T_1]'),
                    Temp2.T_2 = Ext.ComponentQuery.query('[name=T_2]'),
                    Temp2.T_3 = Ext.ComponentQuery.query('[name=T_3]'),
                    Temp2.T_4 = Ext.ComponentQuery.query('[name=T_4]'),
                    Temp2.T_5 = Ext.ComponentQuery.query('[name=T_5]'),
                    Temp2.T_6 = Ext.ComponentQuery.query('[name=T_6]'),
                    Temp2.T_7 = Ext.ComponentQuery.query('[name=T_7]'),
                    
                    Temp2.T2_1 = Ext.ComponentQuery.query('[name=T2_1]'),
                    Temp2.T2_2 = Ext.ComponentQuery.query('[name=T2_2]'),
                    Temp2.T2_3 = Ext.ComponentQuery.query('[name=T2_3]'),
                    Temp2.T2_4 = Ext.ComponentQuery.query('[name=T2_4]'),
                    Temp2.T2_6 = Ext.ComponentQuery.query('[name=T2_6]'),
                    Temp2.T2_7 = Ext.ComponentQuery.query('[name=T2_7]');

            if (type === "dstore") {
                // Берутся значения из предпоследней итерации
                // так как в последней могут быть значения
                // не для всех датчиков
                var dataTemp = records[records.length - 3].data;
                //editTempOut(Temp,dataTemp);
                editTempOutByName(Temp2,dataTemp);
            }
            else if (type === "phpscript") {
                var dataTemp = records;
                //editTempOut(Temp,dataTemp);
                editTempOutByName(Temp2,dataTemp);
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
                            title: 'напор<br>общий',
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
                            title: 'K2',
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
                            title: 'K3',
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
                            title: 'K1',
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
                            title: 'слив<br>общий',
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
                            title: 'Вода<br>подача',
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
                            title: 'Вода<br>слив',
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
                        else {
                            if (operation.error !== undefined) {
                                try {
                                    var errorMessJson = Ext.JSON.decode(operation.error.response.responseText);
                                    var errorMess = errorMessJson["reason"];
                                    if (errorMess.length === 0)
                                        throw -1;
                                    messageErrorShow(errorMess,500);
                                }
                                catch (e){
                                    messageErrorShow("Неизвестная ошибка с сервера",500);
                                }


                            }
                        }
                        graphbut.enable();
                    }
                });

        function messageErrorShow(message,width) {
            var params = {
                title: 'Ошибка',
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK,
                message: message
            };

            if (width !== undefined && (typeof width === 'number')) {
                params.width = width;
            }

            Ext.Msg.show(params);
        }

         function onSeriesTooltipRender(tooltip, record, item) {
            tooltip.setHtml(item.field + " " + record.get('time') + " " + record.get(item.series.getYField()) + '&deg;C');
        }
    }
});
