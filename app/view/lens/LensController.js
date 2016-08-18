Ext.define('LensControl.view.lens.LensController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lens',
    init: function () {
        console.log('TestwsController');
        var me= this;
        
        var ws = Ext.create('Ext.ux.WebSocket', {
            url: 'ws://elkin-jinr.ddns.net:7890?login=tango&password=tango',
            autoReconnect: true ,
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
                    console.log ('The websocket is closed!');
                },
                error: function (ws, error) {
                    Ext.Error.raise (error);
                } ,
            }
        });
//        
        Ext.ux.WebSocketManager.register(ws);
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
    cellClickProc: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts)
    {
        // получение номера источника и свойства id для колонок
        var id = record.id;
        var dataIndex = grid.headerCt.getGridColumns()[cellIndex].dataIndex;
        if (dataIndex === 'volt_level')
            console.log('volt_level');
        if (dataIndex === 'curr_level')
            console.log('curr_level');
        if (dataIndex === 'device_state')
            console.log('device_state');
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

