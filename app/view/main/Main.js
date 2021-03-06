/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('LensControl.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'LensControl.view.main.LensMainController',
        'LensControl.view.main.LensMainModel',
        //'LensControl.view.lens.Log'
        //'LensControl.view.main.List'
    ],

    controller: 'lensmain',
    viewModel: 'lensmain',
    // http://docs.sencha.com/extjs/6.0.0-classic/guides/getting_started/login_app.html#getting_started-_-login_app_-_step_7_add_viewport_plugin_logout_button
    plugins: 'viewport', 
    

    ui: 'navigation',

    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,
    // установка активного таба
    activeTab: 0,

    header: {
        layout: {
            align: 'stretchmax'
        },
        title: {
            bind: {
                text: '{name}'
            },
            flex: 0
        },
        iconCls: 'fa-th-list'
    },

    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },

    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            //headerPosition: 'left'
            headerPosition: 'top'
        }
    },

    defaults: {
        bodyPadding: 10,
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left'
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    width: 120
                }
            }
        }
    },
    
    items: [
        {
            title: 'Линзы',
            iconCls: 'fa-plug',
            scrollable: true,
            items: [{
                    xtype: 'lens'
                }]
        },
        {
            title: 'Температура',
            iconCls: 'fa-area-chart',
            scrollable: true,
            items: [{
                    xtype: 'lenstemp'
                }]
        },
        {
            title: 'Магниты',
            iconCls: 'fa-area-chart',
            scrollable: true,
            items: [{
                    xtype: 'magntemp'
                }]
        }/*,
        {
            title: 'Журнал',
            reference: 'log_lens',
            scrollable: true,
            iconCls: 'fa-file-text-o',
            items: [{
                    xtype: 'log'
                }]
        }*/
    ]

//    items: [{
//        title: 'Home',
//        iconCls: 'fa-home',
//        // The following grid shares a store with the classic version's grid as well!
//        items: [{
//            xtype: 'mainlist'
//        }]
//    }, {
//        title: 'Users',
//        iconCls: 'fa-user',
//        bind: {
//            html: '{loremIpsum}'
//        }
//    }, {
//        title: 'Groups',
//        iconCls: 'fa-users',
//        bind: {
//            html: '{loremIpsum}'
//        }
//    }, {
//        title: 'Settings',
//        iconCls: 'fa-cog',
//        bind: {
//            html: '{loremIpsum}'
//        }
//    }]
});
