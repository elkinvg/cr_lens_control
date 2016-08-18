Ext.define('LensControl.view.lens.Lens', {
    //extend: 'Ext.grid.Panel',
    extend: 'Ext.panel.Panel',
//    extend: 'Ext.form.Panel',
    xtype: 'lens',
//    title: 'Источники питания',
    maxheightGrid: 0,
    requires: [
        'LensControl.view.lens.LensController',
        'Ext.ux.WebSocket',
        'Ext.ux.WebSocketManager',
        'Ext.ux.data.proxy.WebSocket',
        'LensControl.store.LensWsStore',
        'LensControl.model.LensModel',
        'Ext.layout.container.Border'
    ],
    listeners: {
        resize: function (a, b, c, d, e, f) {
            var ass = this;
            console.log("form resize h= " + c);
        }
    },
    bodyBorder: false,
    defaults: {
        collapsible: true,
        split: true,
        bodyPadding: 10
    },
    layout: 'border',
    width: '100%',
    height: 800,
//    layout: {
//layout: 'border',
//    },
    controller: 'lens',
    items: [
        {
            title: 'Установка значаний',
            region: 'west',
            floatable: false,
            margin: '5 0 0 0',
            //width: 125,
            minWidth: 400,
            maxWidth: 600,
            //html: '<p>Secondary content like navigation links could go here</p>'
        },
        {
            title: 'Источники питания',
            collapsible: false,
            region: 'center',
            margin: '5 0 0 0',
            items: [
                {
                    xtype: 'grid',
                    reference: 'mainGrid',
//            width: "60%",
                    //width: '70%',
                    //width: '50%',
                    //collapsible: true,
//            selModel: {
//    selType: 'cellmodel',
//    mode   : 'MULTI'
//},
//            store: Ext.data.StoreManager.lookup('lensStore'),
                    //store: Ext.data.StoreManager.lookup('lenswsstore'),
                    //store: 'lensStore',
                    //store: 'myStore',
                    //store: store1,
//            listeners: {
//                resize: 'resizeLensPanel',
//                cellclick: 'cellClickProc'
//            },
                    listeners: {
                        cellclick: 'cellClickProc',
                        resize: function (a, b, c, d, e, f) {
                            var ass = this;
                            //console.log("RESIZEEE = " + c);
                            var lensGet = Ext.ComponentQuery.query('lens');
                            var lensGetHeight = lensGet[0].getHeight();
                            lensGet[0].setMinHeight(c+100);
                        }
                    },
                    store: {
                        type: 'lenswsstore'
                    },
                    columns: [
                        {
                            text: 'Id', dataIndex: 'id',
                            renderer: 'bold',
                            flex: 1
                        },
                        {
                            text: 'Напряжение (В)', dataIndex: 'volt_measure',
                            renderer: 'bold',
                            flex: 1
                        },
                        {
                            text: 'Ток (А)', dataIndex: 'curr_measure',
                            renderer: 'bold',
                            flex: 1
                        },
                        {
                            text: 'Порог<br>напряжения (В)', dataIndex: 'volt_level',
                            renderer: 'bold',
                            flex: 1
                        },
                        {
                            text: 'Порог<br>тока (А)', dataIndex: 'curr_level',
                            renderer: 'bold',
                            flex: 1
                        },
                        {
                            text: 'Состояние<br>источника', dataIndex: 'device_state',
                            flex: 1,
                            renderer: 'setStatusColor'
                        },
                    ],
                },
            ]
                    //html: '<h2>Main Page</h2><p>This is where the main content would go</p>'
        }
    ]
});

/*
 
 {
 xtype: 'grid',
 reference: 'mainGrid',
 width: "60%",
 //width: '70%',
 //width: '50%',
 //collapsible: true,
 //            selModel: {
 //    selType: 'cellmodel',
 //    mode   : 'MULTI'
 //},
 //            store: Ext.data.StoreManager.lookup('lensStore'),
 //store: Ext.data.StoreManager.lookup('lenswsstore'),
 //store: 'lensStore',
 //store: 'myStore',
 //store: store1,
 listeners: {
 resize: 'resizeLensPanel',
 cellclick: 'cellClickProc'
 },
 store: {
 type: 'lenswsstore'
 },
 columns: [
 {
 text: 'Id', dataIndex: 'id',
 renderer: 'bold', 
 flex: 1
 },
 {
 text: 'Напряжение (В)', dataIndex: 'volt_measure',
 renderer: 'bold', 
 flex: 1
 },
 {
 text: 'Ток (А)', dataIndex: 'curr_measure',
 renderer: 'bold', 
 flex: 1
 },
 {
 text: 'Порог<br>напряжения (В)', dataIndex: 'volt_level',
 renderer: 'bold', 
 flex: 1
 },
 {
 text: 'Порог<br>тока (А)', dataIndex: 'curr_level',
 renderer: 'bold', 
 flex: 1
 },
 {
 text: 'Состояние<br>источника', dataIndex: 'device_state', 
 flex: 1,
 renderer: 'setStatusColor'
 },
 ],
 },
 {
 xtype: 'panel',
 //xtype: 'fieldset',
 title: 'Состояние элементов защиты <span style="color:red; font-size:150%"> &#9899; </span>',
 //            maxHeight: 300,
 //            width: "40%",
 minWidth: 300,
 //            margin: '20 20 20 20',
 }
 
 */



//        {
//            xtype: 'button',
//            width: 130,
//            text: 'Вентилятор',
//            reference: 'ventilatorButton',
////            handler: function () {
////                var dataIn = [];
////                dataIn.push(["a", "b", "c", "d", "e", "f"]);
////                var dataAM = new Object();
////                dataAM.as = "sadsd";
////                dataAM.ss = "fsdljsdf";
////                dataAM.qw = "qwerty";
////                dataAM.her = dataIn;
//////                Ext.ux.WebSocketManager.broadcast('system shutdown', 'BROADCAST: the system will shutdown in few minutes.');
//////                Ext.ux.WebSocketManager.broadcast('system shutdown',dataIn);
////                Ext.ux.WebSocketManager.broadcast('system shutdown',dataAM);
////
////                //console.log('You clicked the button!');
////            }
//            handler: 'ventilatorClick'
//        },
//        {
//            xtype: 'button',
//            width: 130,
//            text: 'Вентилятор2',
//            //reference: 'ventilatorButton',
//            handler: function () {
//                var dataIn = [];
//                dataIn.push(["a", "b", "c", "d", "e", "f"]);
//                var dataAM = new Object();
//                dataAM.as = "sadsd";
//                dataAM.ss = "fsdljsdf";
//                dataAM.qw = "qwerty";
//                dataAM.her = dataIn;
////                Ext.ux.WebSocketManager.broadcast('system shutdown', 'BROADCAST: the system will shutdown in few minutes.');
////                Ext.ux.WebSocketManager.broadcast('system shutdown',dataIn);
//                Ext.ux.WebSocketManager.broadcast('ventilatorClick', dataIn);
//
//                //console.log('You clicked the button!');
//            }
//            //handler: 'ventilatorClick'
//        },