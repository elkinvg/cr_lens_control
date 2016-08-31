Ext.define('LensControl.view.lens.LensTemperature', {
    extend: 'Ext.panel.Panel',
    xtype: 'lenstemp',
    controller: 'lenstemp',
    requires: [
        'Ext.data.Store',
        'LensControl.view.lens.LensTemperatureController',
        'LensControl.store.LensTemperatureStore',
        'Ext.chart.*'
    ],
//    store: {
//        type: 'lenstempstore'
//    },
items: [{
        xtype: 'cartesian',
        reference: 'chart',
        width: '100%',
        height: 500,
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
                        'value_r_7', 
                        'value_r_8',
                        'value_r_9',
                        'value_r_10',
                        'value_r_11',
                    ],
                    //minimum: 18,
                    //maximum: 21,
                    position: 'left',
                    grid: true,
                    //minimum: 0,
                    //renderer: 'onAxisLabelRender'
                }, {
                    type: 'category',
                    fields: 'data_time',
                    position: 'bottom',
                    grid: true,
                    label: {
                        rotate: {
                            degrees: -45
                        }
                    }
                }],
            series: [
                {
                    type: 'line',
                    xField: 'data_time',
                    yField: 'value_r_7',
                    style: {
                        lineWidth: 4
                    },
                },
                {
                    type: 'line',
                    xField: 'data_time',
                    yField: 'value_r_8',
                    style: {
                        lineWidth: 4
                    },
                },
                {
                    type: 'line',
                    xField: 'data_time',
                    yField: 'value_r_9',
                    style: {
                        lineWidth: 4
                    },
                },
                {
                    type: 'line',
                    xField: 'data_time',
                    yField: 'value_r_10',
                    style: {
                        lineWidth: 4
                    },
                },
                {
                    type: 'line',
                    xField: 'data_time',
                    yField: 'value_r_11',
                    style: {
                        lineWidth: 4
                    },
                },
            ],

        
        }],
//    items: [
//        {
//            xtype: 'gridpanel',
//            collapsible: true,
//            //store: ['lenstempstore'],
////            store: {
////                type: 'lenstempstore'
////            },
//            columns: [
//                {text: 'Регистр/Флаг', flex: 0.3, dataIndex: 'att_conf_id'},
//                {text: 'Значение', flex: 0.3, dataIndex: 'insert_time'},
//                {text: 'Описание', flex: 1, dataIndex: 'error_desc'}
//            ]
//        }
//    ],
});