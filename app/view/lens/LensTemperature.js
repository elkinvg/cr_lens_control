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
                        'T_1', 
                        'T_2',
                        'T_3',
                        'T_4',
                        'T_5',
                    ],
                    //minimum: 18,
                    //maximum: 21,
                    position: 'left',
                    grid: true,
                    //minimum: 0,
                    //renderer: 'onAxisLabelRender'
                    listeners: {
                        rangechange: function (axis, range, eOpts) {
                        },
                    },
                }, {
                    type: 'category',
                    fields: 'time',
                    position: 'bottom',
                    grid: true,
                    label: {
                        rotate: {
                            degrees: -45
                        }
                    }
                },
            ],
            series: [
                {
                    type: 'line',
                    xField: 'time',
                    yField: 'T_1',
                    style: {
                        lineWidth: 4
                    },
                },
                {
                    type: 'line',
                    xField: 'time',
                    yField: 'T_2',
                    style: {
                        lineWidth: 4
                    },
                },
                {
                    type: 'line',
                    xField: 'time',
                    yField: 'T_3',
                    style: {
                        lineWidth: 4
                    },
                },
                {
                    type: 'line',
                    xField: 'time',
                    yField: 'T_4',
                    style: {
                        lineWidth: 4
                    },
                },
                {
                    type: 'line',
                    xField: 'time',
                    yField: 'T_5',
                    style: {
                        lineWidth: 4
                    },
                },
            ],
        }
    ],
});

//            listeners: {
//                initialize: function (me, eOpts) {
//                    console.log("INIIIT");
//                    Ext.getStore('lenstempStore').load({
//                        callback: function (records, operation, success) {
//                            console.log("init charts");
////                            var data = records[0].data;
////                            var axes = me.getAxes();
////                            var SampleValuesAxis = axes[0];
////                            SampleValuesAxis.setMinimum(data.minimum);
////                            SampleValuesAxis.setMaximum(data.maximum);
//                        },
//                        scope: this
//                    });
//                }
//            },