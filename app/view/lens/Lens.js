Ext.define('LensControl.view.lens.Lens', {
    //extend: 'Ext.grid.Panel',
    extend: 'Ext.panel.Panel',
//    extend: 'Ext.form.Panel',
    xtype: 'lens',
//    title: 'Источники питания',
    maxheightGrid: 0,
    requires: [
        'Common_d.Property',
        'LensControl.view.lens.LensController',
        'Ext.ux.WebSocket',
//        'Ext.ux.WebSocketManager',
        'Ext.ux.data.proxy.WebSocket',
        'LensControl.store.LensWsStore',
        'LensControl.model.LensModel',
        'Ext.layout.container.Border'
    ],
    listeners: {
        resize: function (a, b, c, d, e, f) {
            if(typeof dbg !== 'undefined') console.log("form resize h= " + c);
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
            title: 'Установка значeний',
            region: 'west',
            floatable: false,
            //margin: '0 0 0 0',
            width: 500,minWidth: 500,maxWidth: 500,
//            width: 470,
//            minWidth: 470,
//            maxWidth: 600,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            items: [
                {
//            xtype: 'panel',
                    xtype: 'fieldset',
                    //reference: 'panelForAll',
                    style: 'background-color: #fafafa;',
                    title: 'Управление всеми источниками',
                    reference: 'onOffPanel',
                    width: '100%',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            itemId: 'currId',
                            fieldLabel: '<b>Порог тока для всех</b>',
                            labelWidth: 120,
                            combineErrors: false,
                            defaults: {
                                hideLabel: true,
                                margin: '0 20 0 0',
                            },
                            layout: {
                                type: 'hbox',
                            },
                            items: [
                                {
                                    // задание тока
                                    name: 'currforall',
                                    itemId: 'currforall',
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    allowBlank: false,
                                    value: 0.0,//value: 5.5,
                                    maxValue: 80,
                                    maxLenght: 5,
                                    step: 0.1,//step: 0.5,
                                    width: 100,
                                },
                                {
                                    xtype: 'displayfield',
                                    value: '<b>А',
                                    width: 30
                                },
                                {
                                    xtype: 'button',
                                    width: 130,
                                    text: 'Установить',
                                    handler: 'sendNewValue'
                                }
                            ]

                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '<b>Порог напряжения для всех</b>',
                            itemId: 'voltageId',
                            labelWidth: 120,
                            combineErrors: false,
                            defaults: {
                                hideLabel: true,
                                margin: '0 20 0 0',
                            },
                            layout: {
                                type: 'hbox',
                            },
                            items: [
                                {
                                    // задание напряжения
                                    name: 'voltforall',
                                    itemId: 'voltforall',
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    allowBlank: false,
                                    maxValue: 60,
                                    value: 0,//value: 9.5,
                                    maxLenght: 5,
                                    step: 1,
                                    width: 100
                                },
                                {
                                    xtype: 'displayfield',
                                    value: '<b>В',
                                    width: 30
                                },
                                {
                                    xtype: 'button',
                                    width: 130,
                                    text: 'Установить',
                                    handler: 'sendNewValue'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            //margin: '10 10 10 10',
                            //flex: 1,
                            //height: 100,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            defaults: {
                                margin: '10 10 10 10',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    commandtype: 'on',
                                    width: 130,
                                    text: 'Включить все',
                                    handler: 'onOrOffAllDevice'
                                            //handler: 'sendNewValue'
                                },
                                {
                                    xtype: 'button',
                                    commandtype: 'off',
                                    width: 130,
                                    text: 'Выключить все',
                                    handler: 'onOrOffAllDevice'
                                            //handler: 'sendNewValue'
                                }
                            ]
                        }
                    ]
                },
                // {
                //     xtype: 'fieldset',
                //     style: 'background-color: #fafafa;',
                //     title: 'Дополнительные настройки',
                //     width: '100%',
                //     layout: {
                //         type: 'vbox',
                //         align: 'stretch',
                //     },
                // }
            ]
        },
        {
            title: 'Источники питания',
            reference: 'powersupplies',
            itemId: 'powersupplies',
            collapsible: false,
            region: 'center',
            margin: '5 0 0 0',
            items: [
                {
                    xtype: 'displayfield',
                    fieldLabel: '<b>Последнее обновление</b>',
                    //title: 'X <b>секунд назад</b>',
                    value: '<b>X</b> секунд назад',
                    reference: 'updateTime'
                },
                {
                    xtype: 'grid',
                    reference: 'mainGrid',
                    itemId: 'powersuppliesGrid',

                    listeners: {
                        cellclick: 'cellClickProc',
                        resize: 'resizeLensPanel',
                    },
                    store: {
                        type: 'lenswsstore'
                    },
                    columns: [
                        {
                            text: 'Id', dataIndex: 'id',
                            renderer: 'bold',
                            flex: 0.5
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
        }
    ]
});