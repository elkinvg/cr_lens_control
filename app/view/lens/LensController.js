Ext.define('LensControl.view.lens.LensController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lens',
    
    init: function () {
        console.log('TestwsController');

        var me = this;

        this.ws = Ext.create('Ext.ux.WebSocket', {
            // получение адреса ws
            // логин и пароль должны храниться в localStorage
            url: 'ws://' + Ext.create('Common_d.Property').getWsforlens() + 'login=' + localStorage.getItem("login") + '&password=' + localStorage.getItem("password"),
            autoReconnect: true,
            autoReconnectInterval: 1000,
            //url: prop.getUrlwstest(),
            listeners: {
                open: function (ws) {
                    console.log('websocket Open');
                },
                message: function (ws, data) {
                    //console.log('getting data');
                    me.getData(data);
                },
                close: function (ws) {
                    console.log('The websocket is closed!');
                },
                error: function (ws, error) {
                    Ext.Error.raise(error);
                },
            }
        });
//        
        Ext.ux.WebSocketManager.register(this.ws);
//        Ext.ux.WebSocketManager.listen ('system shutdown', function (ws, data) {
//            var aaa = data;
//            console.log ('system shutdown!');
//        });
    },
    resizeLensPanel: function () {
        // Изменить размер главной страницы с таблицами.
        // Изменется в начале, когда добавляются таблицы.
        // Также возможны необратимые измененения при зуминге
        var lensGet = Ext.ComponentQuery.query('lens');
        if (lensGet.length === 0) {
            console.log('lensGet.length NULL!');
            return;
        }
        var lensGetHeight = lensGet[0].getHeight();

        if (lensGet[0].maxheightGrid < lensGetHeight) {
            lensGet[0].maxheightGrid = lensGetHeight;
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
            console.log("sendNewValue " + valueField + " from currId");
            command.command = "";
        } else if (gettingItemId === 'voltageId') {
            var valueField = myView.getComponent('voltforall').getValue();
            if (valueField === null)
                return;
            console.log("sendNewValue " + valueField + " from voltageId");
            command.command = "";
        } else
            return;
        
        command.argin = valueField;
        //var valueField = myView.getComponent('voltforall');
//        var valueField2 = myView.getView();//.getForm();//findField('voltforall');
        
        //var abc = Ext.ComponentQuery.query('[name=voltforall]');
        //var getVal = abc[0].getValue();
//        var win = a.up('window'),
//        form = win.down('form');
//        var tmp = me.getView().getForm();//.findField(reg);
        //console.log("sendNewValue");
//        var command = new Object();
//        command.command = commandIn;
//        command.argin = value;
//        var comJson = Ext.util.JSON.encode(command);
//        me.ws.send(comJson);
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
        if (dataIndex === 'volt_level') {
            console.log('volt_level');
        }            
        if (dataIndex === 'curr_level') {
            console.log('curr_level');
            Ext.Msg.show({
                title: 'Изменить порог<br>напряжения источника' + id,
                msg: 'Введите новое значение',
                buttons: Ext.Msg.YESNO,
                buttonText: {
                    yes: "Изменить",
                    no: "Нет"
                },
            });
            
            //Ext.Msg.prompt('Изменить порог<br>напряжения источника' + id, 'Введите новое значение', function (btn, text) {
//                if (btn == 'ok') {
//                    // process text value and close...
//                }
//            });
        }            
        if (dataIndex === 'device_state') {
            var state = record.data.device_state;

            var statFunc = function (state, id, device) {
                if (state === 'ON') {
                    console.log('STATUS ON');
                    var messageIn = 'Источник включён, вы хотите его выключить?';
                    var buttonIn = Ext.Msg.YESNO;
                    var command = new Object();
                    command.command = "OffForDevice";
                    command.argin = device;
                    var buttonIn = Ext.Msg.YESNO;
                    var icon = Ext.Msg.QUESTION;
                    var butText = {
                        yes: "Да",
                        no: "Нет"
                    }
                } else if (state === 'OFF') {
                    console.log('STATUS OFF');
                    var messageIn = 'Источник выключен, вы хотите его включить?';
                    var buttonIn = Ext.Msg.YESNO;
                    var command = new Object();
                    command.command = "OnForDevice";
                    command.argin = device;
                    var buttonIn = Ext.Msg.YESNO;
                    var icon = Ext.Msg.QUESTION;
                    var butText = {
                        yes: "Да",
                        no: "Нет"
                    }
                } else if (state === 'FAULT') {
                    console.log('STATUS FAULT');
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
                            console.log('Yes pressed');
                        } else if (btn === 'no') {
                            console.log('No pressed');
                        }
                    }
                });
            }
            statFunc(state,id);
//            Ext.Msg.show({
//                title: 'Состояние источника ' + id,
//                message: 'Источник выключен, вы хотите его включить?',
//                buttons: Ext.Msg.YESNO,
//                icon: Ext.Msg.QUESTION,
//                fn: function (btn) {
//                    if (btn === 'yes') {
//                        me.ws.send('{"command":"OnForAll"}');
//                        console.log('Yes pressed');
//                    } else if (btn === 'no') {
//                        console.log('No pressed');
//                    }
//                }
//            });
//            console.log('device_state');
//            var command = new Object();
//            command.command = "OnForAll";
//            //this.ws.send('{"command":"OnForAll"}');
//            var com = Ext.util.JSON.encode(command);
//            this.ws.send(com);
            //Ext.ux.WebSocketManager.send('command');
        }

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
    setStatusColor: function (val) {
        // установка цветового индикатора статуса
        if (val === "FAULT")
            return '<span style="color:red; font-size:200%"> &#9899; </span>';
        if (val === "ON")
            return '<span style="color:green; font-size:150%"> &#9899; </span>';
        if (val === "OFF")
            return '<span style="color:orange; font-size:150%"> &#9899; </span>';
    },
    //
    //
    //
    getData: function(data) {
//        var dataFromPs = Ext.JSON.decode(data);
//        var decodedString = Ext.decode(data);
        var mainGrid = this.lookupReference('mainGrid');
        var dataIn = [];
        dataIn.push(["a","b","c","d","e","f"]);
        var sss = mainGrid.getStore();
        //sss.insert(0,dataIn);
        //mainGrid.data = dataIn;
        //mainGrid.data = ;
    },
    //
    //
    //
    ventilatorClick: function (aa, bb, cc) {
        var dataIn = [];
        dataIn.push(["a", "b", "c", "d", "e", "f"]);
        var dataAM = new Object();
        dataAM.as = "sadsd";
        dataAM.ss = "fsdljsdf";
        dataAM.qw = "qwerty";
        dataAM.her = dataIn;
//                Ext.ux.WebSocketManager.broadcast('system shutdown', 'BROADCAST: the system will shutdown in few minutes.');
//                Ext.ux.WebSocketManager.broadcast('system shutdown',dataIn);
        Ext.ux.WebSocketManager.broadcast('system shutdown', dataAM);

        console.log('You clicked the button!');
    },

});

/*
 // for message win
             win = new Ext.Window({
                width: 300
                , height: 150
                , draggable: false
                , border: false
                , modal: true
                , resizable: false
                , items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Text One'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Text Two'
                    },
                    {
                        xtype: 'button',
                        name: 'sampleButton',
                        text: 'Click me',
                        style: 'margin:15px',
                        width: 50
                    }
                ]
            })
            win.show();
 
 */
