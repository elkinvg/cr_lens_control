Ext.define('LensControl.view.lens.LensController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lens',
    
    init: function () {
        if(typeof dbg !== 'undefined') console.log('TestwsController');

        var me = this;
        // store сейчас определяется как memory.
        // Заменено type: 'websocket' на type: 'memory'
        // type: 'websocket' брался из 'Ext.ux.WebSocketManager'
        // При определении store как websocket приходилось открывать два сокета
        // Один для заполнения таблиц, другой для отправления команд на сервер
        var storeMem = Ext.data.StoreManager.get("lensStore");
        
        
        this.ws = Ext.create('Ext.ux.WebSocket', {
            // получение адреса websocket
            // логин и пароль должны храниться в localStorage
            url: 'ws://' + Ext.create('Common_d.Property').getWsforlens() + 'login=' + localStorage.getItem("login") + '&password=' + localStorage.getItem("password"),
            autoReconnect: true,
            autoReconnectInterval: 1000,
            //url: prop.getUrlwstest(),
            listeners: {
                open: function (ws) {
                    if(typeof dbg !== 'undefined') console.log('websocket Open');
                },
                message: function (ws, data) {
                    //здесь принимаются данные с сервера и записываются в Store
                    var dataForStore = data.data;
                    if (dataForStore !== undefined ) {
                        if(typeof dbg !== 'undefined') console.log("Data from powersupplies loaded. ");
                        storeMem.loadData(dataForStore);
                    } else {
                        if(typeof dbg !== 'undefined') console.log("No data from powersupplies. ");
                    }                    
                    me.getData(data);
                },
                close: function (ws) {
                    if(typeof dbg !== 'undefined') console.log('The websocket is closed!');
                },
                error: function (ws, error) {
                    if (Array.isArray(error)) {
                        error.arr.forEach(function(item, i, arr) {
                            if(typeof dbg !== 'undefined') console.log(item);
                        });
                    }
                    //Ext.Error.raise(error);
                },
            }
        });
        
        var taskTime = {
            run: function () {
                // Для оповещения об обрыве соединения, или обновления данных
                // с вэбсокета
                // timeUpdWs объявленf глобально в Application.js
                // timeUpdWs обновляется при загрузке данных с Вэбсокета
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
            lensGet[0].maxheightGrid = lensGetHeight + 100;
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
        } else if (gettingItemId === 'voltageId') {
            var valueField = myView.getComponent('voltforall').getValue();
            if (valueField === null)
                return;
            if(typeof dbg !== 'undefined') console.log("sendNewValue " + valueField + " from voltageId");
            command.command = "SetVoltageLevelForAll";
        } else
            return;
        
        command.argin = valueField;
        var comJson = Ext.util.JSON.encode(command);
        me.ws.send(comJson);
        
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
                }
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
        var commandtype = button.commandtype;
        var command = new Object();
        if (commandtype === 'on') {
            command.command = 'OnForAll';
        } else if (commandtype === 'off') {
            command.command = 'OffForAll';
        } else
            return;
        
        var comJson = Ext.util.JSON.encode(command);
        this.ws.send(comJson);
        
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
                    var errMsg = "У пользователя " + user + " нет прав \n на выполнение этой операции.<br>Для получение прав свяжитесь с администратором"
                    Ext.Msg.show({
                        title: decodedData.error,
                        message: errMsg,
                        icon: Ext.Msg.ERROR,
                        buttons: Ext.Msg.OK,
                    });
                }
            }
            return;
        }
        
        if (data.event === "read") {
            var size = data.data.length;
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
            
            if (size===0) {
                stateOv.setTitle("Источники питания. " + '<span style="color:red; font-size:200%"> &#9899; </span>' + " Данных нет");
                return;
            }
            
            var isAllFault = data.data.every(isFault);
            if (isAllFault)
                onOffPanel.disable();
            else
                onOffPanel.enable();
            
            if (isSomeFault) {
                stateOv.setTitle("Источники питания. " + '<span style="color:red; font-size:200%"> &#9899; </span>');
                return;
            }
            var isSomeOff = data.data.some(isOff);
            if (isSomeOff) {
                stateOv.setTitle("Источники питания. " + '<span style="color:orange; font-size:200%"> &#9899; </span>');
                return;
            }
            
            // здесь если все источники имеют состояние ставится зелёный идикатор
            stateOv.setTitle("Источники питания. " + '<span style="color:green; font-size:200%"> &#9899; </span>');
            
            
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
                        margin: '10 0 0 10',
                    },
                    layout: {
                        type: 'hbox',
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

});
