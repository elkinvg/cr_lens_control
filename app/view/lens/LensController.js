Ext.define('LensControl.view.lens.LensController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lens',
    
    init: function () {
        if(typeof dbg !== 'undefined') console.log('TestwsController');

        var me = this;
        
        this.ws = Ext.create('Ext.ux.WebSocket', {
            // получение адреса websocket
            // логин и пароль должны храниться в localStorage
            url: 'ws://' + Ext.create('Common_d.Property').getWsforlens() + 'login=' + localStorage.getItem("login") + '&password=' + localStorage.getItem("password"),
            //url: 'ws://' + Ext.create('Common_d.Property').getWsforlens(),
            autoReconnect: true,
            autoReconnectInterval: 1000,
            //url: prop.getUrlwstest(),
            listeners: {
                open: function (ws) {
                    if(typeof dbg !== 'undefined') console.log('websocket Open');
                },
                message: function (ws, data) {                   
                    me.getData(data);
                },
                close: function (ws) {
                    if(typeof dbg !== 'undefined') console.log('The websocket is closed!');
                },
                error: function (ws, error) {
                    if (Array.isArray(error)) {
//                        error.arr.forEach(function(item, i, arr) {
//                            if(typeof dbg !== 'undefined') console.log(item);
//                        });

                        error.forEach(function (item, i, arr) {
                            var err = item.error;
                            var type_req = item.type_req;
                            if (err !== undefined &&
                                    type_req !== undefined) {
                                if (err === "Permission denied") {
                                    var user = localStorage.getItem("login");
                                    var errMsg = "У пользователя " + user + " нет прав \n на выполнение этой операции.<br>Для получение прав свяжитесь с администратором"
                                    Ext.Msg.show({
                                        title: err,
                                        message: errMsg,
                                        icon: Ext.Msg.ERROR,
                                        buttons: Ext.Msg.OK
                                    });
                                }
                            }
                        });
                    }
                    //Ext.Error.raise(error);
                }
            }
        });
        
        var taskTime = {
            run: function () {
                // Для оповещения об обрыве соединения, или обновления данных
                // с вэбсокета
                // timeUpdWs объявлен глобально в Application.js
                // timeUpdWs обновляется при загрузке данных атрибутов с Вэбсокета
                // timeUpdCom обновляется здесь
                var timeUpdCom = new Date().getTime() / 1000 | 0;
                var timeDiff = timeUpdCom - timeUpdWs;
                var newVal = '';

                var displayUpd = me.lookupReference('updateTime');

                if (timeDiff > 10) {
                    displayUpd.show();
                    newVal = '<span style="color:red; font-size:200%"><b>' +
                            timeDiff + '</b></span>';
                } else
                    displayUpd.hide();

                newVal = newVal + ' секунд назад';
                var displayUpd = me.lookupReference('updateTime');
                displayUpd.setValue(newVal);
//                console.log("timeUpdCom: " + timeUpdCom + " | timeUpdWs: " + timeUpdWs);
            },
            interval: 10000 // 10 seconds
        };
        
        var runner = new Ext.util.TaskRunner();
        runner.start(taskTime);
//        
        //Ext.ux.WebSocketManager.register(this.ws);
//        Ext.ux.WebSocketManager.listen ('system shutdown', function (ws, data) {
//            var aaa = data;
//            console.log ('system shutdown!');
//        });
    },
    resizeLensPanel: function (out,width,height) {
        // Изменить размер главной страницы с таблицами.
        // Изменется в начале, когда добавляются таблицы.
        // Также возможны необратимые измененения при зуминге
        var lensGet = Ext.ComponentQuery.query('lens');
        if (lensGet.length === 0) {
            if(typeof dbg !== 'undefined') console.log('lensGet.length NULL!');
            return;
        }
        var lensGetHeight = out.getHeight();
        
        //console.log("lensGet[0].maxheightGrid " + lensGet[0].maxheightGrid);

        if (lensGet[0].maxheightGrid < lensGetHeight) {
            lensGet[0].maxheightGrid = lensGetHeight + 200;
            lensGet[0].setMinHeight(lensGet[0].maxheightGrid);
        }
    },    
    //
    //
    //
//    sendNewValue: function (value, commandIn) {
    sendNewValue: function (button) {
        // отправить на сервер новые значения пороговых тока или напряжения 
        // для всех подключённых источников
        var me = this;
        var myView = button.up('container');
        if (myView === undefined)
            return;
        var gettingItemId = myView.getItemId();
        var command = new Object();
        if (gettingItemId === 'currId') {
            var valueField = myView.getComponent('currforall').getValue();
            if (valueField === null)
                return;
            if(typeof dbg !== 'undefined') console.log("sendNewValue " + valueField + " from currId");
            command.command = "SetCurrentLevelForAll";
            var titleMsg = "Установка порогового значения тока";
            var messageIn = "Установить порог для всех источников в " + valueField + " A?";
        } else if (gettingItemId === 'voltageId') {
            var valueField = myView.getComponent('voltforall').getValue();
            if (valueField === null)
                return;
            if(typeof dbg !== 'undefined') console.log("sendNewValue " + valueField + " from voltageId");
            command.command = "SetVoltageLevelForAll";
            var messageIn = "Установить порог для всех источников в " + valueField + " В?";
            var titleMsg = "Установка порогового значения напряжения";
        } else
            return;
        
        command.argin = valueField;
        var comJson = Ext.util.JSON.encode(command);
        
        Ext.Msg.show({
            title: titleMsg,
            icon: Ext.Msg.QUESTION,
            buttons: Ext.Msg.YESNO,
            message: messageIn,
            buttonText: { yes: "Да", no: "Нет"},
            fn: function (btn) {
                if (btn === 'yes') {
                    me.ws.send(comJson);
                }
            }
            
        });
        
//        me.ws.send(comJson);
        
        //var valueField = myView.getComponent('voltforall');
//        var valueField2 = myView.getView();//.getForm();//findField('voltforall');     
        //var abc = Ext.ComponentQuery.query('[name=voltforall]');
        //var getVal = abc[0].getValue();
//        var win = a.up('window'),
//        form = win.down('form');
//        var tmp = me.getView().getForm();//.findField(reg);
    },
    //
    //
    //
    cellClickProc: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts)
    {
        // получение номера источника и свойства id для колонок

        //var msgbox = new NumberPrompt().prompt('Quantity', 'Enter a number', function (btn, text) {});
        
        var me = this;
        var id = record.id;
        var device = record.data.device_name;
        var dataIndex = grid.headerCt.getGridColumns()[cellIndex].dataIndex;
        var state = record.data.device_state;
        if (state === "FAULT") {
            statFunc(state,id,device);
            return;
        }
        if (dataIndex === 'volt_level') {
            var inputData = new Object();
            
            inputData.id = id;
            inputData.device = device;
            inputData.title = 'Порог напряжения источника ' + id;
            inputData.titleForValue = '<b>В';
            inputData.forFieldLabel = '<b>Порог напряжения</b>';
            inputData.value = record.data.volt_level;
            inputData.maxValue = 40;
            inputData.minValue = 0;
            inputData.step = 1.0;
            inputData.command = "SetVoltageLevelForDevice";
            
            me.changeLevel(inputData);
            if(typeof dbg !== 'undefined') console.log('volt_level');
        }            
        if (dataIndex === 'curr_level') {
            
            var inputData = new Object();
            
            inputData.id = id;
            inputData.device = device;
            inputData.title = 'Порог тока источника ' + id;
            inputData.titleForValue = '<b>А';
            inputData.forFieldLabel = '<b>Порог тока</b>';
            inputData.value = record.data.curr_level;
            inputData.maxValue = 80;
            inputData.minValue = 0;
            inputData.step = 0.1;
            inputData.command = "SetCurrentLevelForDevice";
            
            me.changeLevel(inputData);
            if(typeof dbg !== 'undefined') console.log('curr_level');
        }            
        if (dataIndex === 'device_state') {
            //var state = record.data.device_state;
            statFunc(state,id,device);
        }
        
        function statFunc(state, id, device) {
            if (state === 'ON') {
                if(typeof dbg !== 'undefined') console.log('STATUS ON');
                var messageIn = 'Источник включён, вы хотите его выключить?';
                var buttonIn = Ext.Msg.YESNO;
                var command = new Object();
                command.command = "OffDevice";
                command.argin = device;
                var buttonIn = Ext.Msg.YESNO;
                var icon = Ext.Msg.QUESTION;
                var butText = {
                    yes: "Да",
                    no: "Нет"
                }
            } else if (state === 'OFF') {
                if(typeof dbg !== 'undefined') console.log('STATUS OFF');
                var messageIn = 'Источник выключен, вы хотите его включить?';
                var buttonIn = Ext.Msg.YESNO;
                var command = new Object();
                command.command = "OnDevice";
                command.argin = device;
                var buttonIn = Ext.Msg.YESNO;
                var icon = Ext.Msg.QUESTION;
                var butText = {
                    yes: "Да",
                    no: "Нет"
                };
            } else if (state === 'FAULT') {
                if(typeof dbg !== 'undefined') console.log('STATUS FAULT');
                var messageIn = 'связь с Источником ' + id + ' нарушена';
                var buttonIn = Ext.Msg.OK;
                var icon = Ext.Msg.ERROR;
                //return;
            }
            Ext.Msg.show({
                title: 'Состояние источника ' + id,
                message: messageIn,
                buttons: buttonIn,
                icon: icon,
                buttonText: butText,
                fn: function (btn) {
                    if (btn === 'yes') {
                        var comJson = Ext.util.JSON.encode(command);
                        me.ws.send(comJson);
                        if(typeof dbg !== 'undefined') console.log('Yes pressed');
                    } else if (btn === 'no') {
                        if(typeof dbg !== 'undefined') console.log('No pressed');
                    }
                }
            });
        };

    },
    //
    //
    //
    bold: function (val) {
        // изменить жирность текста
        return "<b>" + val + "</b>";
    },
    //
    //
    //
    boldnnum: function (val) {
        // изменить жирность текста
        return "<b>" + val.toFixed(3) + "</b>";
    },
    //
    //
    //
    setStatusColor: function (val, meta) {
        // установка цветового индикатора статуса
        if (val === "FAULT")
            meta.style = "background-color:red;";
            //return '<span style="color:red; font-size:150%"> &#9899; </span>';
        if (val === "ON")
            meta.style = "background-color:green;";
            //return '<span style="color:green; font-size:150%"> &#9899; </span>';
        if (val === "OFF")
            meta.style = "background-color:orange;";
            //return '<span style="color:orange; font-size:150%"> &#9899; </span>';
        
        return "";
    
    },
    //
    //
    //
    onOrOffAllDevice: function (button) {
        var me = this;
        var commandtype = button.commandtype;
        var command = new Object();
        var messageIn = "";
        if (commandtype === 'on') {
            command.command = 'OnForAll';
            messageIn = "Вы хотите включить нагрузку <br>на всех источниках? ";
        } else if (commandtype === 'off') {
            command.command = 'OffForAll';
            messageIn = "Вы хотите выключить нагрузку <br>на всех источниках? ";
        } else
            return;
        
        var comJson = Ext.util.JSON.encode(command);
        
        Ext.Msg.show({
            title: "Включение/выключение всех источников",
            icon: Ext.Msg.QUESTION,
            buttons: Ext.Msg.YESNO,
            message: messageIn,
            buttonText: {yes: "Да", no: "Нет"},
            fn: function (btn) {
                if (btn === 'yes') {
                    me.ws.send(comJson);
                }
            }

        });
        
//        this.ws.send(comJson);
        
    },
    //
    //
    //
    getData: function(data) {
        var me = this;
        
        if (typeof data === 'string') {            
            try {
                var decodedData = Ext.util.JSON.decode(data);
            }
            catch (e) {return;}
            
            if (decodedData.error !== undefined) {
                if (typeof dbg !== 'undefined')
                    console.log("Error: " + decodedData.error);
                if (decodedData.error === "Permission denied") {
                    var user = localStorage.getItem("login");
                    var errMsg = "У пользователя " + user + " нет прав \n на выполнение этой операции.<br>Для получение прав свяжитесь с администратором";
                    Ext.Msg.show({
                        title: decodedData.error,
                        message: errMsg,
                        icon: Ext.Msg.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
            return;
        }
        
                
        // store сейчас определяется как memory.
        // Заменено type: 'websocket' на type: 'memory'
        // type: 'websocket' брался из 'Ext.ux.WebSocketManager'
        // При определении store как websocket приходилось открывать два сокета
        // Один для заполнения таблиц, другой для отправления команд на сервер
        var storeMem = Ext.data.StoreManager.get("lensStore");
        
        //здесь принимаются данные с сервера и затем записываются в Store
        var dataForStore = data.data;
        if (dataForStore !== undefined) {
            if (typeof dbg !== 'undefined')
                console.log("Data from powersupplies loaded. ");
            //storeMem.loadData(dataForStore);
        } else {
            if (typeof dbg !== 'undefined')
                console.log("No data from powersupplies. ");
        } 
        
        var dt_event = data.event;
        var dt_type_req = data.type_req;
        
        // Данные записываются в store, только если dt_type_req === "attribute"

        if (dt_event === "read" && dt_type_req === "attribute") {
            storeMem.loadData(dataForStore);
            var size = data.data.length;
            
            // timeUpdWs объявлен глобально в Application.js
            // timeUpdWs обновляется при загрузке данных атрибутов с Вэбсокета
            timeUpdWs = new Date().getTime()/1000 | 0;
            function isFault(number) {
                if (number.device_state === 'FAULT')
                    return true;
                else
                    return false;
            };
            function isOff(number) {
                if (number.device_state === 'OFF')
                    return true;
                else
                    return false;
            };
            // Выставляет красный индикатор в Title если хотя бы один Fault
            var isSomeFault = data.data.some(isFault);
            
            var stateOv = me.lookupReference('powersupplies');
            var onOffPanel = me.lookupReference('onOffPanel');
            var otherSettPanel = me.lookupReference('otherSettPanel');
            
            // набор символов http://unicode-table.com/ru/#26D4
            // &#9899; - закрашенный круг
            // &#9940; - знак стоп
            // &#9606; - знак прямоугольник
            
            if (size===0) {
                stateOv.setTitle("Источники питания. " + '<img src="resources/images/Cancel.ico" height="20" width="20">' + " Данных нет");
                return;
            }
            
            var isAllFault = data.data.every(isFault);
            if (isAllFault) {
                onOffPanel.disable();
                otherSettPanel.disable();
            }
            else {
                onOffPanel.enable();
                otherSettPanel.enable();
            }
            
            if (isSomeFault) {
                stateOv.setTitle("Источники питания. " + '<img src="resources/images/Cancel.ico" height="20" width="20">'); // &#9899; || &#9940; || &#9679;
                return;
            }
            var isSomeOff = data.data.some(isOff);
            if (isSomeOff) {
                stateOv.setTitle("Источники питания. " + '<img src="resources/images/Knob_Orange.ico" height="20" width="20">');
                return;
            }
            
            // back
            // //stateOv.setTitle("Источники питания. " + '<span style="color:red; font-size:200%"> &#9899; </span>'); // &#9899; || &#9940; || &#9679; color:red; color:orange; color:green;
            
            // здесь если все источники имеют состояние ставится зелёный идикатор
            stateOv.setTitle("Источники питания. " + '<img src="resources/images/Ok.ico" height="20" width="20">');
            
            
        }
    },
    //
    //
    //
    changeLevel: function(inputData) {
        var me = this;
        var win = new Ext.Window({    
            width: 300
            , height: 170
            , title: inputData.title
            , draggable: false
            , border: false
            , modal: true
            , resizable: false
            //, layout: 'vbox'
            , layout: {
                type: 'vbox',
                align: 'center'
            }
            , items: [
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: inputData.forFieldLabel,
                    labelWidth: 120,
                    combineErrors: false,
                    defaults: {
                        hideLabel: true,
                        margin: '10 0 0 10'
                    },
                    layout: {
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            reference: 'testField',
                            minValue: inputData.minValue,
                            allowBlank: false,
                            value: inputData.value,
                            maxValue: inputData.maxValue,
                            maxLenght: 5,
                            step: inputData.step,
                            maxWidth: 100
                        },
                        {
                            xtype: 'displayfield',
                            value: inputData.titleForValue,
                            width: 30
                        }
                    ]
                },
                {
                    xtype: 'button',
                    name: 'sampleButton',
                    text: 'Установить',
                    style: 'margin:15px',
                    maxWidth: 150,
                    handler: function() {
                        var view = win.down('numberfield');
                        var newvalue = view.getValue();
                        var command = new Object();
                        command.command = inputData.command;
                        var argin = new Array();
                        argin.push(inputData.device);
                        argin.push(newvalue);
                        command.argin = argin;
                        var comJson = Ext.util.JSON.encode(command);
                        me.ws.send(comJson);
                        win.close();
                        if(typeof dbg !== 'undefined') console.log("changed Level");
                    }
                }
            ]
        });
        win.show();
    },
    //
    //
    //
    saveLevels: function () {
        // Сохранение установленных порогов
        // Данные сохраняются на сервере в формате json
        
        var me = this;
        if(typeof dbg !== 'undefined') console.log('save levels');
        
        var mainGrid = me.lookupReference('mainGrid');
        var store = mainGrid.getStore();
        
        var undef = false;
        var hasFault = false; // Есть ли девайсы с состоянием FAULT
        var hasNotFault = false; // Есть ли хотя бы один с состоянием не FAULT
        
        var valueOfLevels = new Array();

        store.data.each(function (item, index, totalItems) {
            var dataFrom =  item.data;
            if (dataFrom === undefined) {
                undef = true;
                return;
            }
            var gdata = {};
            gdata.device_name = dataFrom.device_name;
            gdata.device_state = dataFrom.device_state;
            gdata.volt_level = dataFrom.volt_level;
            gdata.curr_level = dataFrom.curr_level;
            
            
            Ext.iterate( gdata ,function(key, value){
                if (value === undefined)
                    undef = true;
            });

            if (gdata.device_state === "FAULT") {
                hasFault = true;
            }
            if (gdata.device_state === "ON" || gdata.device_state === "OFF") {
                hasNotFault = true;
            }
            valueOfLevels.push(gdata);
        });
        
        if (undef) {
            me.messageErrorShow("Ошибка при чтении данных с таблицы");
            return;
        }
        
        
        if (!hasNotFault) {
            me.messageErrorShow('Нет соединения ни с одним источником');
            return;
        }
        
        if (hasFault) {
            Ext.Msg.show({
                title: 'Предупреждение',
                icon: Ext.Msg.QUESTION,
                buttons: Ext.Msg.YESNO,
                message: 'Имеются не подключенные источники.<br> Записать значения с имеющихся,',
                buttonText: {yes: "Да", no: "Нет"},
                fn: function (btn) {
                    clickSaveLevels(btn);
                }
            });
        } else {
            Ext.Msg.show({
                title: 'Сохранение порогов',
                icon: Ext.Msg.QUESTION,
                buttons: Ext.Msg.YESNO,
                message: 'Сохранить значения порогов со всех источников?',
                buttonText: {yes: "Да", no: "Нет"},
                fn: function (btn) {
                    clickSaveLevels(btn);
                }
            });
        }
        
        function clickSaveLevels(btn) {
            if (btn === 'no') {
                return;
            } else if (btn === 'yes') {
                // Включение в массив данных только с подключённых истоников
                var positiveArr = valueOfLevels.filter(function (dt) {
                    return (dt.device_state !== "FAULT") ? true : false;
                });

                 // Добавлен Ext.Ajax.request({})
                 // Возможно также попробовать сохранение не в БД,а в файл, или файлы
                 // Тогда при чтении будет считываться json файл
                Ext.Msg.prompt('Name', 'Введите имя для файла:', function (btn, text) {
                    if (btn == 'ok') {
                        var jsonInp = Ext.JSON.encode(positiveArr);
                        var user = localStorage.getItem("login");
                        text = text.replace(/ /ig,'_');
                        Ext.Ajax.request({
                            url: '/cr_conf/lens_control_save_levels.php',
                            method: 'POST',
                            params: {
                                login: user,
                                values_json: jsonInp,
                                filename: text
                            },
                            success: function (ans) {
                                if (typeof dbg !== 'undefined')
                                    console.log("save_levels success");
                            },
                            failure: function (ans) {
                                if (typeof dbg !== 'undefined')
                                    console.log("save_levels failure");
                                me.messageErrorShow('Не удалось сохранить');
                            }
                        });
                    }
                });


            }
        }
        

    },
    //
    //
    //
    loadLevels: function () {
        // Загрузка установленных порогов
        var me = this;
        if(typeof dbg !== 'undefined') console.log('loadLevels');
        var user = localStorage.getItem("login");
        
        Ext.Ajax.request({
            url: '/cr_conf/lens_control_save_levels.php',
            method: 'POST',
            params: {
                login: user,
                action: 'get_confs'
            },
            success: function (ans) {
                if(typeof dbg !== 'undefined') console.log("get_levels success");
                try {
                    var respText = Ext.JSON.decode(ans.responseText);
                }
                catch (e) {
                    return;
                }
                var arr = new Array();
                Ext.iterate(respText, function (item, index, totalItems) {
                    // Здесь используется два варианта для разных выводов из php
                    // Второй добавлен после добавления в php сортировки массива
                    // по имени файла, и по количеству элементов
                    try {
                        if (index.indexOf(".json") !== -1) {
                            forIndOf(item, index);
                        }
                    } catch (e) {
                        try {
                            if (item.indexOf(".json") !== -1) {
                                forIndOf(index, item);
                            }
                        } catch (e) {}
                    }
                    
                    function forIndOf(ind, filename) {
                        var inpArr = new Array();
                        inpArr.push(ind);
                        inpArr.push(filename);
                        arr.push(inpArr);
                    }
                    
                });
                
                if (arr.length === 0 ) {
                    Ext.Msg.show({
                        title: 'Сообщение',
                        //icon: Ext.Msg.ALERT,
                        buttons: Ext.Msg.OK,
                        message: 'Нет сохранённых значений на сервере'
                    });
                    return;
                }
                
                // Если данные загрузились открывается новое окно с перечнем 
                // сохранённых json-файлов
                // А также содержанием этих файлов
                var win2 = new Ext.Window({
                    //reference: 'winLevelsMes',
                    name: 'winLevelsMes',
                    width: 600,
                    height: 500,
                    bodyPadding: 10,
                    title: 'Установка сохранённых значений для порогов',
                    modal: true,
                    //resizable: false,
                    scrollable: true,
                    //html: respHtml,
                    tbar: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            //margin: '10 0 10 0',
                            name: 'savingCont',
                            items: [
                                {
                                    //margin: '0 10 0 0',
                                    xtype: 'displayfield',
                                    value: '<b>Список сохранённых:</b>',
                                    width: 150
                                },
                                {
                                    xtype: 'combo',
                                    itemId: 'savingLevels',
                                    width: 200,
                                    store: {
                                        type: 'array',
                                        fields: ['id', 'jsonfiles'],
                                        data: arr
                                    },
                                    valueField: 'id',
                                    displayField: 'jsonfiles',
                                    listeners: {
                                        select: function (th, selected) {
                                            //console.log('select');
                                            var user = localStorage.getItem("login");
                                            var savingLevels = selected.data.jsonfiles;
                                            Ext.Ajax.request({
                                                url: '/cr_conf/lens_control_save_levels.php',
                                                method: 'POST',
                                                params: {
                                                    login: user,
                                                    action: 'load_confs',
                                                    json_file: savingLevels
                                                },
                                                success: function (ans) {
                                                    //console.log("true");
                                                    var winLevelsMes = Ext.ComponentQuery.query('[name=winLevelsMes]')[0];
                                                    var respHtml = "";
                                                    try {
                                                        var respData = Ext.JSON.decode(ans.responseText);
                                                    } catch (e) {
                                                        winLevelsMes.update("No Data");
                                                        return;
                                                    }
                                                    var space = '&nbsp;&nbsp;&nbsp;';
                                                    
                                                    var respDataObj = new Object();
                                                    Ext.each(respData, function (fromDevice, index) {
                                                        var device_name = fromDevice.device_name;
                                                        var volt_level = fromDevice.volt_level;
                                                        var curr_level = fromDevice.curr_level;
                                                        if (device_name === undefined
                                                                || volt_level === undefined
                                                                || curr_level === undefined)
                                                            return;
                                                        var device_name_shrt = device_name;
                                                        var indOf = device_name.indexOf('_');
                                                        if (indOf !== -1 )
                                                            device_name_shrt = device_name.substring(indOf+1);
                                                            
                                                        respHtml += "<b>Источник:<span style='color:blue;'>" + space + device_name_shrt + space
                                                                + "</span> Порог для напряжения:   <span style='color:blue;'>" + space + volt_level + space
                                                                + "</span>" + " Порог для тока:    <span style='color:blue;'>" + space + curr_level + space + "</b></span><br>";
                                                        var gdata = {};
                                                        gdata.volt_level = volt_level;
                                                        gdata.curr_level = curr_level;
                                                        respDataObj[device_name] = gdata;
                                                    
                                                    });
                                                    winLevelsMes.update(respHtml);
//                                                    winLevelsMes.respData = respData;
                                                    // Сохранение respDataObj для дальнейшего использования
                                                    // При нажатии клавиши установить
                                                    winLevelsMes.respDataObj = respDataObj;
                                                    //winLevelsMes.html(respHtml);
                                                },
                                                failure: function (ans) {
                                                    if(typeof dbg !== 'undefined') console.log("Failure from action=load_confs");
                                                    //console.log("false");
                                                }
                                            });
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            //margin: '0 5 0 5',
                            width: 100,
                            xtype: 'button',
                            text: 'Установить',
                            //itemId: 'save',
                            //iconCls: 'save',
                            handler: function () {
                                var winLevelsMes = Ext.ComponentQuery.query('[name=winLevelsMes]')[0];
//                                var respData = winLevelsMes.respData;
                                var respDataObj = winLevelsMes.respDataObj;
                                win2.close();
                                
                                var mainGrid = me.lookupReference('mainGrid');
                                var store = mainGrid.getStore();
                                var valueOfLevels = new Array();
                                
                                //var levels = {};
                                
                                // Дальше идёт получение значений установленных levels, для отбора 
                                // только изменяемых. 
                                store.data.each(function (item, index, totalItems) {
                                    var dataFrom =  item.data;
                                    if (dataFrom === undefined) {
                                        undef = true;
                                        return;
                                    }
                                    var d_n = dataFrom.device_name;
                                    if (d_n === undefined )
                                        return;
                                    var gdata = {};
                                    gdata.device_name = dataFrom.device_name;
                                    gdata.volt_level = dataFrom.volt_level;
                                    gdata.curr_level = dataFrom.curr_level;
                                    
                                    valueOfLevels.push(gdata);
                                    //levels[dataFrom.device_name] = gdata;
                                });
                                
//                                if (respData === undefined)
//                                    return;
                                
                                if (respDataObj === undefined)
                                    return;
                                
                                // Создания массива источников, в которых будут изменены значения
                                var changedLevels = valueOfLevels.filter(function (dt) {
                                    if (dt.volt_level === -1 || dt.curr_level === -1)
                                        return false;
                                    
                                    if (dt.volt_level === undefined || dt.curr_level === undefined)
                                        return false;
                                    
                                    var newValues = respDataObj[dt.device_name];
                                    
                                    if (newValues===undefined)
                                        return false;
                                    
                                    // Проверка наличия volt_level,curr_level в установке новых значений
                                    if (newValues.volt_level === undefined ||
                                            newValues.curr_level === undefined)
                                        return false;
                                    
                                    // Проверка старых значений, если все новые значения равны старым
                                    // Сигнал источнику послан не будет
                                    if (newValues.volt_level === dt.volt_level &&
                                            newValues.curr_level === dt.curr_level)
                                        return false;
                                    
                                    dt.volt_level = newValues.volt_level;
                                    dt.curr_level = newValues.curr_level;
                                    
                                    return true;
                                });
                                
                                if (changedLevels.length === 0)
                                    return;
                                
                                // Если есть изменяемые значения отправить сигналы 
                                // на источники с установкой новых порогов
                                var command = new Object();
                                command.command = "SetCurrentVoltageLevelsForDevice";
                                
                                Ext.each(changedLevels, function (fromDevice, index) {
                                    var inpArray = new Array();
                                    //device name
                                    inpArray.push(fromDevice.device_name);
                                    // Current level
                                    inpArray.push(fromDevice.curr_level);
                                    // Voltage level
                                    inpArray.push(fromDevice.volt_level);
                                    command.argin = inpArray;
                                    var comJson = Ext.util.JSON.encode(command);
                                    me.ws.send(comJson);
                                });
                            }
                        },
                        {
                            //margin: '0 5 0 5',
                            width: 100,
                            xtype: 'button',
                            text: 'Отмена',
                            //itemId: 'cancel',
                            //iconCls: 'cancel',
                            handler: function () {
                                win2.close();
                            }
                        }
                    ]
                });
                win2.show();
            },
            failure: function (ans) {
                //console.log("get_levels failure");
                try {
                    var respText = Ext.JSON.decode(ans.responseText);
                    var outMes = respText.reason;
                    if (outMes === undefined)
                       outMes = "Неизвестная ошибка";
                }
                catch (e) {
                    var outMes = "Неизвестная ошибка";
                }
                me.messageErrorShow(outMes);
                
            }
        });
    },
    //
    //
    //
    messageErrorShow: function (message) {
        Ext.Msg.show({
            title: 'Ошибка',
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK,
            message: message
        });
    }
});
