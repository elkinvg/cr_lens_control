Ext.define('LensControl.store.LensStore', {
    extend: 'Ext.data.Store',
    storeId: 'lensStore',
    model: 'LensControl.model.LensModel',
    data: [{
            //timestamp: 'asas',
            device_name: 'asas',
            //device_status: 'sdsd',
            device_state: 'sddddd',
            volt_measure: 'sd',
            curr_measure: 'sdssadsd',
            volt_level: 'sdssadsd',
            curr_level: 'sdssadsd'
        }]
});