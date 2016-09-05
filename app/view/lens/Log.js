Ext.define('LensControl.view.lens.Log', {
    xtype: 'log',
    extend: 'Ext.panel.Panel',
    layout: 'vbox',
    requires : [
        'LensControl.store.LogStore'
    ],
    items: [
        {
        xtype: 'fieldcontainer',
        fieldLabel: 'Временной диапазон',
        combineErrors: true,
        msgTarget : 'side',
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
                    fieldLabel: 'Start',
                    margin: '0 5 0 0',
                    allowBlank: false,
                    renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:'),
                    listeners: {
                        select: function (dtpIssueDate, date) {
                            try {
                                var currentTime = new Date();

                                // Get a current hours and add with date.
                                date.setHours(currentTime.getHours());

                                // Get a current minutes and add with date.
                                date.setMinutes(currentTime.getMinutes());
                                console.log("H: " + currentTime.getHours() + "min: " + currentTime.getMinutes());
                                console.log("dt: " + date);
                                //var dtDateTimeValue = date.dateFormat('dd/MM/yyyy HH:mm');
                                dtpIssueDate.setValue(date);
                            } catch (e) {
                                alert(e.message);
                            }
                        }
                    }
                }, {
                    xtype: 'datefield',
                    name: 'endDate',
                    fieldLabel: 'End',
                    allowBlank: false
                },
                {
                    xtype: 'button',
                    width: 130,
                    text: 'Выбрать',
                    margin: '0 5 0 10',
                    handler: function (a,b,c,d) {
                        var dStore = Ext.data.StoreManager.lookup('logStore');
                        console.log('log_button_click');
                        dStore.load();
                    },
                    //reference: 'heatButton',
                    //handler: 'heatClick'
                }
            ]
    },
    {
        title: 'Записи журнала',
        collapsible: false,width: '100%',
        margin: '5 0 0 0',
        items: [
            {
            xtype: 'grid',
            //reference: 'mainGrid',
            //itemId: 'powersuppliesGrid',
            store: {
                type: 'logstore'
            },
            columns: [
                {
                    text: 'Время исполнения',
                    dataIndex: 'comm_timestamp',
                    renderer: Ext.util.Format.dateRenderer('d/m/Y H:i'),
                    width    : 160,
                    //flex: 1
                },
                {
                    text: 'Пользователь',
                    dataIndex: 'username',
                    width    : 120,
                    //flex: 1
                },
                {
                    text: 'IP-адрес',
                    dataIndex: 'user_ip',
                    width    : 120,
                    //flex: 1
                },
                {
                    text: 'команда',
                    dataIndex: 'command_json',
                    flex: 1,
                    renderer: function (val) {
                        var decodedString = Ext.decode(val);
                        if (decodedString.command !== undefined) {
                            var argin = decodedString.argin;
                            var command = decodedString.command;
                            if (command==='OffDevice')
                                var out = 'Выключить';
                            else if (command==='OnDevice')
                                var out = 'Включить';
                            else if (command==='OffForAll')
                                var out = 'Выключить все';
                            else if (command==='OnForAll')
                                var out = 'Включить все';
                            else
                                var out = command;
                            
                            if (argin!== undefined)
                                out += (' : <b>' + argin + '</b>');
                            return out;
                        }
                        else
                            return "unknown formate";
                    }
                },
                {
                    text: 'статус',
                    dataIndex: 'status_bool',
                    width    : 100,
                    //flex: 1,
                    renderer: function (val) {
                        if (val === "1")
                            return '<span style="color:green; font-size:150%"> &#9899; </span>';
                        else
                            return '<span style="color:red; font-size:150%"> &#9899; </span>';
                        
                    }
                }
            ]
        }
        ]
    }
    ]
}
);


