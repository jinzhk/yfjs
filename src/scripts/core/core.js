(function(window, undefined) {
    "use strict";

    var YFjs = {};

    YFjs.VERSION = '0.8.0+20170311';

    // 判断浏览器版本
    YFjs.browser = (function() {
        //ie11: Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; InfoPath.3; rv:11.0) like Gecko
        //ie9 : Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)
        //ie8 : Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)
        //ie7 : Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.3; Tablet PC 2.0; .NET4.0E; .NET4.0C)
        //Firefox : Mozilla/5.0 (Windows NT 6.1; rv:20.0) Gecko/20100101 Firefox/20.0
        //Chrome  : Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22
        //Opera   : Opera/9.80  (Windows NT 6.1; Edition IBIS) Presto/2.12.388 Version/12.14
        //Safari  : Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2
        var userAgent = (function() {
            try {
                return window.navigator.userAgent;
            } catch (e) {
                return '';
            }
        })();

        var browser = {
            ie: false,
            ie55: false,
            ie6: false,
            ie7: false,
            ie8: false,
            ie9: false,
            ie10: false,
            ie11: false,
            edge: false,
            ff: false,
            safari: false,
            chrome: false,
            opera: false
        };

        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
        var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
        var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
        var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

        var version;

        if (isEdge) {
            browser.ie = 'edge';
            browser.edge = true;
        } else if (isIE) {
            var reIE = /MSIE (\d+\.\d+);/;
            if (version = userAgent.match(reIE)) {
                version = parseFloat(version[1]);
            }
            version = version || 0.1;
            switch (version) {
                case 5.5:
                    browser.ie55 = true;
                    break;
                case 6.0:
                    browser.ie6 = true;
                    break;
                case 7.0:
                    browser.ie7 = true;
                    break;
                case 8.0:
                    browser.ie8 = true;
                    break;
                case 9.0:
                    if (!window.innerWidth) {
                        browser.ie8 = true;
                    } else {
                        browser.ie9 = true;
                    }
                    break;
                case 10.0:
                    browser.ie10 = true;
                    break;
                case 11.0:
                    browser.ie11 = true;
                    break;
                default:
                    break;
            }
            browser.ie = version;
        } else if (isFF) {
            var reFF = /Firefox\/(\d+(?:\.\d+)+)/;
            if (version = userAgent.match(reFF)) {
                version = parseFloat(version[1]);
            }
            browser.ff = version || 0.1;
        } else if (isChrome) {
            var reChrome = /Chrome\/(\d+(?:\.\d+)+)/;
            if (version = userAgent.match(reChrome)) {
                version = parseFloat(version[1]);
            }
            browser.chrome = version || 0.1;
        } else if (isSafari) {
            var reSafari = /Safari\/(\d+(?:\.\d+)+)/;
            if (version = userAgent.match(reSafari)) {
                version = parseFloat(version[1]);
            }
            browser.safari = version || 0.1;
        } else if (isOpera) {
            var reOpera = /Opera\/(\d+(?:\.\d+)+)/;
            if (version = userAgent.match(reOpera)) {
                version = parseFloat(version[1]);
            }
            browser.opera = version || 0.1;
        } else if (isIE11()) {
            // IE11
            browser.ie11 = true;
            browser.ie = 11;
        }

        return browser;

        function isIE11() {
            if (!!window.ActiveXObject || "ActiveXObject" in window)
                return true;
            else
                return false;
        }
    })();

    var document = document || window.document;

    // base href
    var baseHref = function() {
        // Create
        var
            baseElements = document.getElementsByTagName('base'),
            baseElement = null,
            baseHref = '';

        // Test for Base Element
        if ( baseElements.length === 1 ) {
            // Prepare for Base Element
            baseElement = baseElements[0];
            baseHref = baseElement.href.replace(/[^\/]+$/,'');
        }

        // Adjust trailing slash
        baseHref = baseHref.replace(/\/+$/,'');
        if ( baseHref ) baseHref += '/';

        // Return
        return baseHref;
    }();

    var protocol = document.location.protocol || '';
    var host = document.location.hostname || document.location.host || '';
    var port = document.location.port == null ? '' : document.location.port + '';
    var domain = function() {
        var domain;

        var portEnds = ':' + port,
            posPortEnd = host.indexOf(portEnds);

        if (posPortEnd == host.length - portEnds.length) {
            host = host.substring(0, posPortEnd);
        }

        if (port.length) {
            domain = host + portEnds;
        } else {
            domain = host;
        }

        return domain;
    }();

    // 根路径
    var rootUrl = function() {
        var root = protocol + '//' + domain;
        if (root === '//') {
            root = '';
        }
        root += '/';
        return root;
    }();

    var scripts = function() {
        var scripts;
        try {
            scripts = document.getElementsByTagName("script") || [];
        } catch (e) {
            scripts = [];
        }
        return scripts;
    };

    var mainScriptData;

    var scriptDataList = ['data-main', 'data-base', 'data-require-base', 'data-cache'];

    var mainScript = function() {
        var script;
        if ('currentScript' in document) {
            script = document.currentScript;
        }
        if (!script) {
            var _scripts = scripts(), scriptData, scriptDataItem;
            for (var i=_scripts.length-1; i>-1; i--) {
                script = _scripts[i];
                for (var j=0; j<scriptDataList.length; j++) {
                    scriptDataItem = scriptDataList[i];
                    scriptData = script.getAttribute(scriptDataItem);
                    if (scriptData != null) {
                        if (scriptDataItem == 'data-main') {
                            mainScriptData = scriptData;
                        }
                        break;
                    }
                }
                if (scriptData != null) break;
            }
            if (!script) {
                script = _scripts[_scripts.length-1];
            }
        } else {
            mainScriptData = script.getAttribute('data-main');
        }
        return script;
    }();

    // 是否开启模块缓存。不启用缓存时则在引入模块时添加时间戳标记，防止浏览器缓存模块内容
    try {
        YFjs.mdCache = mainScript.getAttribute('data-cache');
        if (YFjs.mdCache != null) {
            YFjs.mdCache = eval(YFjs.mdCache);
        } else {
            YFjs.mdCache = undefined;
        }
    } catch (e) {
        YFjs.mdCache = undefined;
    }

    // 当前应用 baseUrl
    YFjs.baseUrl = function() {
        var base;
        try {
            base = mainScript.getAttribute('data-base');
        } catch (e) {
            base = null;
        }
        if (base == null) {
            base = baseHref;
        }
        return getUrl(base, rootUrl);
    }();

    // 框架模块 baseUrl
    YFjs.baseMd = function() {
        var mainUrl;
        try {
            mainUrl = mainScript.src || '';
        } catch (e) {
            mainUrl = '';
        }
        mainUrl = mainUrl.split('/');
        mainUrl.pop();
        mainUrl = mainUrl.length ? mainUrl.join('/')  + '/' : '';
        return getUrl(mainUrl);
    }();

    // 自定义模块 baseUrl
    YFjs.baseRq = function() {
        var rqPath;
        try {
            rqPath = mainScript.getAttribute('data-require-base');
        } catch (e) {
            rqPath = null;
        }
        return getUrl(rqPath);
    }();

    try {
        YFjs.timestamp = new Date().getTime();
    } catch (e) {
        YFjs.timestamp = "nowTime";
    }

    function getUrl(path, relativeUrl) {
        var url;

        if (relativeUrl == null) {
            relativeUrl = YFjs.baseUrl;
        }

        path = path == null ? "" : (path + "").replace(/(^\s*)|(\s*$)/g, "");

        if (path.length) {
            if (/^\/\/(?!\/)/.test(path)) {
                path = protocol + path;
            }
            if (/^((?:(?:https?|s?ftp):)|(?:file:\/))\/\//.test(path)) {
                url = path;
            } else {
                if (/^\//.test(path)) {
                    relativeUrl = rootUrl;
                }
                path = path.replace(/^\/+/, "");
                if (!/\/$/.test(relativeUrl)) {
                    relativeUrl += "/";
                }
                url = relativeUrl + path;
            }
        } else {
            url = relativeUrl;
        }

        if (url == null) {
            url = "";
        }

        url = url.replace(/\/+$/, "");

        return url;
    }

    // fix media query
    if(Modernizr && !Modernizr.mq('only all')) {
        require(['respond']);
    }

    window.YFjs = YFjs;

})(this);