define('yfjs/spa/version', function() {

    var DefVer = '1.0.0-rc.2';

    var VERSION = {
        // ui
        'Loading'              : DefVer,
        // util
        'Ajax'                 : DefVer,
        'App'                  : DefVer,
        'Cookie'               : DefVer,
        'Error'                : DefVer,
        'Event'                : DefVer,
        'Filter'               : DefVer,
        'Layout'               : DefVer,
        'Remote'               : DefVer,
        'Route'                : DefVer,
        'StyleLoader'          : DefVer,
        'Template'             : DefVer,
        'View'                 : DefVer,
        'WebSocket'            : DefVer,
        'Widget'               : DefVer,
        'PathWildcardCompiler' : DefVer
    };

    var ver = function(name) {
        return VERSION[name] || "0.0.0";
    };

    return ver;
});