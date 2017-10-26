Ext.define('LensControl.view.lens.LensTemperature_magn', {
    extend: 'Ext.panel.Panel',
    xtype: 'magntemp',
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
            hidden: true,
            cls: "warn_mess"
//                    html: []
        },
        {
            xtype: 'fieldcontainer',
            margin: '5 20 0 0',
            labelWidth: 280,
            cls: 'temperature_mess',
            fieldLabel: '<b>Значение температуры, при котором высылается предупреждение </b>',
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
                    xtype: 'displayfield',
                    value: '<span style="font-size:150%"><b>' + LensControl.conf.Constants.ALARM_TEMPERATURE + ' &deg;C</b></span>',
                    width: 50
                },
                {
                    xtype: 'label',
                    width: 280,
                    html: '<b>Значение температуры, при котором источники автоматически отключаются</b>'
                },
                {
                    xtype: 'displayfield',
                    value: '<span style="font-size:150%"><b>' + LensControl.conf.Constants.MAX_TEMPERATURE + ' &deg;C</b></span>',
                    width: 50
                }
            ]
        },
        {
            xtype: 'panel',
            width: 700,
            height: 562,
            layout: 'absolute',
            hidden: true,
            bodyStyle: "background-image:url(resources/images/wallp_new.jpg) !important",
            defaultType: 'label',
            items: [
                {
                    name: 'T_1',
                    x: 26,
                    y: 355,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T1</span>'
                },
                {
                    name: 'T_2',
                    x: 216,
                    y: 245,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T2</span>'
                },
                {
                    name: 'T_3',
                    x: 304,
                    y: 302,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T3</span>'
                },
                {
                    name: 'T_4',
                    x: 109,
                    y: 186,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T4</span>'
                },
                {
                    name: 'T_5',
                    x: 214,
                    y: 415,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T5</span>'
                },
                {
                    name: 'T_6',
                    x: 514,
                    y: 120,
                    html: '<span style="font-weight:bold; color:black; font-size:300%"> T6</span>'
                },
                {
                    name: 'T_7',
                    x: 514,
                    y: 216,
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
        {
            xtype: 'panel',
            width: 788,
            height: 575,
            margin: '30 0 0 0',
            layout: 'absolute',
            bodyStyle: "background-image:url(resources/images/termo_new_0902_small.png) !important",
            defaultType: 'label',
            items: [
                {
                    reference: 'T2_1',
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
    ]
});