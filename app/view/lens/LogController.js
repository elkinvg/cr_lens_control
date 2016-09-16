Ext.define('LensControl.view.lens.LogController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.log',
    init: function () {
        var me = this;

        var grid = me.lookupReference('logGrid');

        var user_type = parseInt(localStorage.getItem("user_type"));
        if (isNaN(user_type) || (user_type < 4)) {
            grid.columns.forEach(function (col) {
                if ((col.dataIndex == "user_ip") || (col.dataIndex == "username")) {
                    //col.setVisible(false);
                    col.setHidden(true);
                }
            });
        }

    }
});


