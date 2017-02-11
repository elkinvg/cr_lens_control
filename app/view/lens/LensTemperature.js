Ext.define('LensControl.view.lens.LensTemperature', {
    extend: 'Ext.panel.Panel',
    xtype: 'lenstemp',
    controller: 'lenstemp',
    requires: [
        'Ext.data.Store',
        'LensControl.view.lens.LensTemperatureController',
        'LensControl.store.LensTemperatureStore',
        'Ext.chart.*',
        'Ext.layout.container.Absolute'
        
    ],
//    store: {
//        type: 'lenstempstore'
//    },
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
            hidden: true
//                    html: []
        },
        {
            xtype: 'panel',
            width: 700,
            height: 562,
            layout: 'absolute',
            //id:'cooling_sys_temp',
            bodyStyle: "background-image:url(resources/images/wallp_new.jpg?random=" + new Date().getTime() + ") !important",
	//bodyStyle: "background-image:url(resources/images/wallp_new.jpg) !important",
            defaultType: 'label',
            items: [
                {
                    reference: 'T_1',
                    x: 26,
                    y: 355,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T1</span>'
                },
                {
                    reference: 'T_2',
                    x: 216,
                    y: 245,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T2</span>'
                },
                {
                    reference: 'T_3',
                    x: 304,
                    y: 302,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T3</span>'
                },
                {
                    reference: 'T_4',
                    x: 109,
                    y: 186,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T4</span>'
                },
                {
                    reference: 'T_5',
                    x: 214,
                    y: 415,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T5</span>'
                },
                                {
                    reference: 'T_6',
                    /*x: 514,
                    y: 120,*/
                    x: 514,
                    y: 108,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T6</span>'
                },
                {
                    reference: 'T_7',
                    /*x: 514,
                    y: 216,*/
                    x: 514,
                    y: 220,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T7</span>'
                },
                {
                    x: 490, 
                    y: 450,
                    xtype: 'button',
                    reference: 'graphbut',
                    width: 150,
                    text: 'Показать график',
                    handler: 'getTemperatureChart'
                }
            ]
        },
//        {
//            xtype: 'button',
//            reference: 'graphbut',
//            width: 150,
//            text: 'Показать график',
//            handler: 'getTemperatureChart',
//        },
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
            xtype: 'panel',
            /*width: 526,
            height: 734,*/
            /*width: 595,
            height: 365,*/
            width: 1125,
            height: 822,
            margin: '30 0 0 0',
            layout: 'absolute',
//            bodyStyle: "background-image:url(resources/images/termo_new_png.png) !important",
            bodyStyle: "background-image:url(resources/images/termo_new_0902.png) !important",
            defaultType: 'label',
            items: [
                {
                    reference: 'T2_1',
                    /*x: 54,
                    y: 395,*/
                    /*x: 165,
                    y: 150,*/
                    x: 56,
                    y: 355,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T2_1</span>'
                },
                {
                    reference: 'T2_2',
                    /*x: 216,
                    y: 138,*/
                    /*x: 330,
                    y: 150,*/
                    x: 630,
                    y: 355,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T2_2</span>'
                },
                {
                    reference: 'T2_3',
                    /*x: 216,
                    y: 242,*/
                    /*x: 330,
                    y: 236,*/
                    x: 980,
                    y: 355,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T2_3</span>'
                },
                {
                    reference: 'T2_4',
                    /*x: 380,
                    y: 393,*/
                    /*x: 165,
                    y: 236,*/
                    x: 392,
                    y: 355,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T2_4</span>'
                },
                {
                    reference: 'T2_6',
                    x: 218,
                    y: 499,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T2_5(6)</span>'
                },
                                {
                    reference: 'T2_7',
                    x: 218,
                    y: 404,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T2_6(7)</span>'
                }/*,
                {
                    reference: 'T_7',
                    x: 514,
                    y: 216,
                    html: '<span style="font-weight:bold; color:blue; font-size:300%"> T7</span>'
                },
                {
                    x: 490, 
                    y: 450,
                    xtype: 'button',
                    reference: 'graphbut',
                    width: 150,
                    text: 'Показать график',
                    handler: 'getTemperatureChart'
                }*/
            ]
        },
    ]
});
