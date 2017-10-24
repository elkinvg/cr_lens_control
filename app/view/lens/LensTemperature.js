var wallp_new_pan = {
            xtype: 'panel',
            width: 485,
            height: 393,
            layout: 'absolute',
            bodyStyle: "background-image:url(resources/images/wallp_new_small.jpg?random=" + new Date().getTime() + ") !important",
            defaultType: 'label',
            items: [
                {
                    name: 'T_1',
                    x: 10,
                    y: 245,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T1</span>'
                },
                {
                    name: 'T_2',
                    x: 144,
                    y: 168,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T2</span>'
                },
                {
                    name: 'T_3',
                    x: 208,
                    y: 208,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T3</span>'
                },
                {
                    name: 'T_4',
                    x: 74,
                    y: 128,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T4</span>'
                },
                {
                    name: 'T_5',
                    x: 144,
                    y: 286,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T5</span>'
                },
                                {
                    name: 'T_6',
                    x: 349,
                    y: 73,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T6</span>'
                },
                {
                    name: 'T_7',
                    x: 349,
                    y: 152,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T7</span>'
                },
                {
                    x: 318, 
                    y: 317,
                    xtype: 'button',
                    reference: 'graphbut',
                    width: 150,
                    text: 'Показать график',
                    handler: 'getTemperatureChart'
                }
            ]
        }
        
var termo_pan = {
            xtype: 'panel',
            width: 788,
            height: 575,
            margin: '30 0 0 0',
            layout: 'absolute',
            bodyStyle: "background-image:url(resources/images/termo_new_0902_small.png) !important",
            defaultType: 'label',
            items: [
                {
                    name: 'T2_1',
                    x: 34,
                    y: 246,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T2_1</span>'
                },
                {
                    name: 'T2_2',
                    x: 437,
                    y: 246,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T2_2</span>'
                },
                {
                    name: 'T2_3',
                    x: 682,
                    y: 246,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T2_3</span>'
                },
                {
                    name: 'T2_4',
                    x: 272,
                    y: 246,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T2_4</span>'
                },
                {
                    name: 'T2_6',
                    x: 150,
                    y: 346,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T2_5(6)</span>'
                },
                                {
                    name: 'T2_7',
                    x: 150,
                    y: 280,
                    html: '<span style="font-weight:bold; color:black; font-size:250%"> T2_6(7)</span>'
                }
            ]
        }



Ext.define('LensControl.view.lens.LensTemperature', {
        extend: 'Ext.panel.Panel',
        //autoScroll: true,
        name: 'lenstemp',
    xtype: 'lenstemp',
    controller: 'lenstemp',
    requires: [
        'Ext.data.Store',
        'LensControl.view.lens.LensTemperatureController',
        'LensControl.store.LensTemperatureStore',
        'Ext.chart.*',
        'Ext.layout.container.Absolute'     
    ],
    items: [
        {
            xtype: 'component',
            anchor: '100%',
            name: 'info_temp_mes',
        },
        {
            xtype: 'component',
            anchor: '100%',
            name: 'warning_mes',
            hidden: true,
            cls: "warn_mess"
//                    html: []
        },
        {
            xtype: 'fieldcontainer',
            margin: '50 20 0 0',
            labelWidth: 320,
            fieldLabel: '<b>изменить значение температуры при котором высылается предупреждение</b>',
            combineErrors: false,
            defaults: {
                hideLabel: true,
                margin: '8 20 0 0'
            },
            layout: {
                type: 'hbox'
            },
            items: [
                {
                    // задание температуры предупреждения
                    reference: 'warning_temp_field',
                    xtype: 'numberfield',
                    minValue: 30,
                    allowBlank: false,
                    maxValue: 90,
                    //value: 0, //value: 9.5,
                    maxLenght: 5,
                    step: 10,
                    width: 100
                },
                {
                    xtype: 'displayfield',
                    value: '<span style="font-size:150%"><b>&deg;C</b></span>',
                    width: 30
                },
                {
                    xtype: 'button',
                    width: 130,
                    text: 'Изменить',
                    handler: 'setMaximumTemperature'
                }
            ]
        },
        {
            xtype:'container',
            //name: 'lenstemph',
            reference: 'lenstemp_cont_h',
            //flex:1,
            layout: 'hbox',
//            autoScroll: true,
            items: [
                wallp_new_pan,
                termo_pan
            ]
        },
        {
            xtype:'container',
            reference: 'lenstemp_cont_v',
            //flex:1,
            layout: 'vbox',
            items: [
                wallp_new_pan,
                termo_pan
            ]
        }
    ]
});