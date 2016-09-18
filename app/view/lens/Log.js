Ext.define('LensControl.view.lens.Log', {
    xtype: 'log',
    extend: 'Ext.panel.Panel',
    layout: 'vbox',
    controller: 'log',

    requires: [
        'LensControl.store.LogStore',
        'LensControl.view.lens.LogController'
    ],
    items: [
        {
            xtype: 'fieldcontainer',
            itemId: 'timeContainer',
            fieldLabel: 'Временной диапазон',
            combineErrors: true,
            msgTarget: 'side',
            layout: 'hbox',
            defaults: {
                flex: 1,
                hideLabel: true
            },
            items: [
                {
                    xtype: 'datefield',
                    format: 'd-M-Y H:i',
                    //format: 'dd/MM/yyyy HH:mm',
                    name: 'startDate',
                    itemId: 'startDateId',
                    fieldLabel: 'Start',
                    margin: '0 5 0 0',
                    allowBlank: false,
                    renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:'),
                    listeners: {
                        select: function (dtpIssueDate, date) {
                            try {
                                var currentTime = new Date();

                                // Get a current hours and add with date.
                                date.setHours(0, 0);

                                // Get a current minutes and add with date.
                                //date.setMinutes(currentTime.getMinutes());
                                if(typeof dbg !== 'undefined') console.log("H: " + currentTime.getHours() + "min: " + currentTime.getMinutes());
                                if(typeof dbg !== 'undefined') console.log("dt: " + date);
                                //var dtDateTimeValue = date.dateFormat('dd/MM/yyyy HH:mm');
                                dtpIssueDate.setValue(date);
                            } catch (e) {
                                alert(e.message);
                            }
                        },
                        render: function (th, eOpts) {
                            var dt = new Date();
                            dt.setDate(dt.getDate() - 7);
                            dt.setHours(0, 0);
                            th.setValue(dt);
                        }

                    }
                }, {
                    xtype: 'datefield',
                    name: 'stopDate',
                    itemId: 'stopDateId',
                    fieldLabel: 'End',
                    format: 'd-M-Y H:i',
                    allowBlank: false,
                    listeners: {
                        select: function (dtpIssueDate, date) {
                            try {
                                var currentTime = new Date();

                                // Get a current hours and add with date.
                                date.setHours(23, 59);

                                // Get a current minutes and add with date.
                                //date.setMinutes(currentTime.getMinutes());
                                if(typeof dbg !== 'undefined') console.log("H: " + currentTime.getHours() + "min: " + currentTime.getMinutes());
                                if(typeof dbg !== 'undefined') console.log("dt: " + date);
                                //var dtDateTimeValue = date.dateFormat('dd/MM/yyyy HH:mm');
                                dtpIssueDate.setValue(date);
                            } catch (e) {
                                alert(e.message);
                            }
                        },
                        render: function (th, eOpts) {
                            var dt = new Date();
                            //dt.toLocaleString('ru');
                            dt.setHours(23, 59);
                            dt.toLocaleTimeString();
                            th.setValue(dt);
                            if(typeof dbg !== 'undefined') console.log("render " + dt.toLocaleString('ru'));
                        }
                    }
                },
                {
                    xtype: 'button',
                    width: 130,
                    text: 'Выбрать',
                    margin: '0 5 0 10',
                    handler: 'button_log_handler'
                    //reference: 'heatButton',
                    //handler: 'heatClick'
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            name: 'otherCont',
            fieldLabel: 'Другое',
            layout: 'hbox',
            items: [
                {
                    xtype: 'textfield',
                    itemId: 'userLoginId',
                    fieldLabel: 'Пользователь',
                    width: 200,
                    margin: '0 30 0 0'
                },
                {
                            xtype: 'displayfield',
                            value: 'Статус',
                            width: 30,
                            margin: '0 20 0 10'
                        },
                {
                    xtype: 'combo',
                    itemId: 'statusSelId',
                    width: 100,
                    store: {
                        type: 'array',
                        fields: ['status'],
                        data: [
                            ['Ok'],
                            ['Fault']
                        ]
                    },
                    displayField: 'status',
                
            }
            ]
        },
        {
            title: 'Записи журнала',
            collapsible: false, width: '100%',
            margin: '5 0 0 0',
            items: [
                {
                    xtype: 'grid',
                    reference: 'logGrid',
                    //itemId: 'powersuppliesGrid',
                    store: {
                        type: 'logstore'
                    },
                    columns: [
                        {
                            text: 'Время исполнения',
                            dataIndex: 'comm_timestamp',
                            renderer: Ext.util.Format.dateRenderer('d/M/Y H:i'),
                            width: 160,
                            //flex: 1
                        },
                        {
                            text: 'Пользователь',
                            dataIndex: 'username',
                            width: 120,
                            //flex: 1
                        },
                        {
                            text: 'IP-адрес',
                            dataIndex: 'user_ip',
                            width: 120,
                            //flex: 1
                        },
                        {
                            text: 'команда',
                            dataIndex: 'command_json',
                            flex: 1,
                            renderer: 'command_json_renderer'
                        },
                        {
                            text: 'статус',
                            dataIndex: 'status_bool',
                            width: 100,
                            //flex: 1,
                            renderer: 'status_bool_renderer'
                        }
                    ]
                }
            ]
        }
    ]
}
);


