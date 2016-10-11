Ext.define('LensControl.view.lens.LogController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.log',
    init: function () {
        var me = this;
        var oc = Ext.ComponentQuery.query('[name=otherCont]')[0];
        var userLoginId = oc.getComponent('userLoginId');

        var grid = me.lookupReference('logGrid');
        
        // Проверка по user_type
        // Если user_type < 4 не выводить колонки user_ip и username
        // Данные для этого типа юзера приходят в формате user_ip='x.x.x.x'
        // username='null'
        
        var user_type = parseInt(localStorage.getItem("user_type"));
        if (isNaN(user_type) || (user_type < 4)) {
            userLoginId.setHidden(true);
            grid.columns.forEach(function (col) {
                if ((col.dataIndex == "user_ip") || (col.dataIndex == "username")) {
                    //col.setVisible(false);
                    col.setHidden(true);
                }
            });
        }

    },
    //
    //
    //
    command_json_renderer: function (val) {
        // Вывод историй команд 

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
            } else if (command === 'SetVoltageLevelForAll') {
                var out = 'Установить порог напряжения для всех';
                postf = " А";

            } else if (command === 'SetCurrentLevelForDevice') {
                postf = " А";
                var out = 'Установить порог тока для ';
            } else if (command === 'SetVoltageLevelForDevice') {
                postf = " В";
                var out = 'Установить порог напряжения для ';
            } else
                var out = command;

            if (argin !== undefined) {
                if (argin.length === 1)
                    out += (' : <b>' + argin + postf + '</b>');
                if (argin.length === 2) {
                    out += (argin[0] + '  <b>' + argin[1] + postf + '</b>');
                }
                if (typeof argin === 'string') {
                    out += ('  <b>' + argin + '</b>');
                }
                if (typeof argin === 'number') {
                    out += ('  <b>' + argin + ' ' + postf + '</b>');
                }
            }

            return out;
        } else
            return "unknown formate";
    },
    //
    //
    //
    status_bool_renderer: function (val) {
        // набор символов http://unicode-table.com/ru/#26D4
        // &#9899; - закрашенный круг
        // &#9940; - знак стоп
        // back  return '<span style="color:green; font-size:150%"> &#9899; </span>'; // or red
        
        if (val === "1")
            return '<img src="resources/images/Ok.ico" height="20" width="20">';
        else
            return '<img src="resources/images/Cancel.ico" height="20" width="20">';

    },
    //
    //
    //
    button_log_handler: function (th) {
        // Получение данных из sql.
        // Обработка введенных фильтров. 
        // Получить журнал от startDateId ... до stopDateId 
        // statusSel - фильтр по статусу выполнения команды
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
        if (argin.login === null)
            argin.login = 'anon';
        if (usLogin.length > 0)
            argin.user = usLogin;
        if (statusSel !== null &&
                (statusSel === 'Ok' || statusSel === 'Fault'))
            argin.status = statusSel;
        dStore.load({
            params: {
                argin: Ext.encode(argin)
            },
            callback: function (records, operation, success) {
                if(typeof dbg !== 'undefined') console.log("1");
            }
        }
        );

    },
});


