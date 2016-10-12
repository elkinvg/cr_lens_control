Ext.define('LensControl.store.LogStore', {
    extend: 'Ext.data.Store',
    alias: 'store.logstore',
    storeId: 'logStore',
    fields: [
        {name: 'comm_timestamp', type: 'date'/*, dateFormat: 'd-M-Y H:i'*/},
        {name: 'username'},
        {name: 'user_ip'},
        {name: 'command_json'},
        {name: 'status_bool'}
    ],
    proxy: {
        method: 'POST',
        url: '/cr_conf/log_from_lens_control.php',
        type: 'ajax',
        autoLoad: true,
        actionMethods : {
            read    : 'POST'
        },
        //paramsAsJson:true,
        
        reader: {
            rootProperty: 'data',
            successProperty: 'success',
            type: 'json'
        }
    }
});
    


