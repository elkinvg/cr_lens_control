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
                                console.log("H: " + currentTime.getHours() + "min: " + currentTime.getMinutes());
                                console.log("dt: " + date);
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
                            console.log("render");
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
                                console.log("H: " + currentTime.getHours() + "min: " + currentTime.getMinutes());
                                console.log("dt: " + date);
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
                            console.log("render " + dt.toLocaleString('ru'));
                        }
                    }
                },
                {
                    xtype: 'button',
                    width: 130,
                    text: 'Выбрать',
                    margin: '0 5 0 10',
                    handler: function (th) {
                        var cont = th.up('#timeContainer');
                        var startComp = cont.down('#startDateId').value.getTime() / 1000;
                        var stopComp = cont.down('#stopDateId').value.getTime() / 1000;
                        var otherCont = Ext.ComponentQuery.query('[name=otherCont]')[0];
                        var usLogin = otherCont.down('#userLoginId').value;
                        var statusSel = otherCont.down('#statusSelId').value;

                        var dStore = Ext.data.StoreManager.lookup('logStore');


//                        var startComp = Ext.ComponentQuery.query('[name=startDate]')[0]
//                                .value.getTime()/1000;
//                        var stopComp = Ext.ComponentQuery.query('[name=stopDate]')[0]
//                                .value/1000;
                        var argin = {};
                        argin.starttime = startComp;
                        argin.stoptime = stopComp;
                        argin.login = localStorage.getItem("login");
                        if (argin.login===null)
                            argin.login = 'anon';
                        if (usLogin.length>0)
                            argin.user = usLogin;
                        if (statusSel!==null && 
                                (statusSel==='Ok' || statusSel==='Fault'))
                            argin.status = statusSel;
                        dStore.load({
                            params: {
                                argin: Ext.encode(argin)
                            },
                            callback: function (records, operation, success) {
                                console.log("1");
                            }
                        }
                        );

                    },
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
                            renderer: function (val) {
                                var decodedString = Ext.decode(val);
                                var postf = "";
                                if (decodedString.command !== undefined) {
                                    var argin = decodedString.argin;
                                    var command = decodedString.command;
                                    if (command === 'OffDevice')
                                        var out = 'Выключить';
                                    else if (command === 'OnDevice')
                                        var out = 'Включить';
                                    else if (command === 'OffForAll')
                                        var out = 'Выключить все';
                                    else if (command === 'OnForAll')
                                        var out = 'Включить все';
                                    else if (command === 'SetCurrentLevelForAll') {
                                        var out = 'Установить порог тока для всех';
                                        postf = " В";
                                    }
                                    else if (command === 'SetVoltageLevelForAll') {
                                        var out = 'Установить порог напряжения для всех';
                                        postf = " А";
                                        
                                    }
                                    else if (command === 'SetCurrentLevelForDevice') {
                                        postf = " А";
                                        var out = 'Установить порог тока для ';                                        
                                    }
                                    else if (command === 'SetVoltageLevelForDevice') {
                                        postf = " В";
                                        var out = 'Установить порог напряжения для ';                                        
                                    }
                                    else
                                        var out = command;

                                    if (argin !== undefined) {
                                        if (argin.length === 1)
                                            out += (' : <b>' + argin + postf + '</b>');
                                        if (argin.length === 2) {
                                            out += (argin[0] + '  <b>' + argin[1] + postf + '</b>' );
                                        }
                                        if (typeof argin === 'string') {
                                            out += ('  <b>' + argin + '</b>' );
                                        }
                                        if (typeof argin === 'number') {
                                            out += ('  <b>' + argin + ' ' + postf +  '</b>' );
                                        }
                                    }
                                        
                                    return out;
                                } else
                                    return "unknown formate";
                            }
                        },
                        {
                            text: 'статус',
                            dataIndex: 'status_bool',
                            width: 100,
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


