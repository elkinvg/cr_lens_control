Ext.define('LensControl.view.lens.LensTemperature', {
    extend: 'Ext.panel.Panel',
    xtype: 'lenstemp',
    controller: 'lenstemp',
    requires: [
        'Ext.data.Store',
        'LensControl.view.lens.LensTemperatureController',
        'LensControl.store.LensTemperatureStore',
    ],
//    store: {
//        type: 'lenstempstore'
//    },
    items: [
        {
            xtype: 'gridpanel',
            collapsible: true,
            store: ['lenstempstore'],
//            store: {
//                type: 'lenstempstore'
//            },
            columns: [
                {text: 'Регистр/Флаг', flex: 0.3, dataIndex: 'att_conf_id'},
                {text: 'Значение', flex: 0.3, dataIndex: 'insert_time'},
                {text: 'Описание', flex: 1, dataIndex: 'error_desc'}
            ]
        }
    ],
});