/**
 * 全局辅助工具
 */
define('yfjs/spa/util/helpers', (function(root) {
    var deps = ['jquery'];
    // json shim
    if (typeof root.JSON !== "undefined") {
        define('json', function() {return root.JSON});
    }
    deps.push('json');
    // es5 shim
    if (!Object.defineProperty) {
        deps.push('es5-shim');
    }
    return deps;
})(this), function($, JSON) {

    var window = window || this || {},
        document = document || window.document || {};

    !document.location && (document.location = {});

    // 当前访问协议、主机、端口、域名等
    var PROTOCOL = document.location.protocol || '';
    var HOST = document.location.hostname || document.location.host || '';
    var PORT = document.location.port == null ? '' : document.location.port + '';
    var DOMAIN = function() {
        var domain;

        var portEnds = ':' + PORT,
            posPortEnd = HOST.indexOf(portEnds);

        if (posPortEnd == HOST.length - portEnds.length) {
            HOST = HOST.substring(0, posPortEnd);
        }

        if (PORT.length) {
            domain = HOST + portEnds;
        } else {
            domain = HOST;
        }

        return domain;
    }();
    var ROOT_URL = function() {
        var rootUrl = PROTOCOL + '//' + DOMAIN;

        if (rootUrl === '//') {
            rootUrl = '';
        }

        rootUrl += '/';

        return rootUrl;
    }();

    // 公用正则表达式
    var REGEXP_PROTOCOL_START        = /^((?:(?:https?|s?ftp):)|(?:file:\/))\/\//,
        REGEXP_PROTOCOL              = /((?:(?:https?|s?ftp):)|(?:file:\/))\/\//g,
        REGEXP_SECURE_PROTOCOL_START = /^((?:https|sftp):)\/\//,
        REGEXP_PROTOCOL_WS_START     = /^(wss?:)\/\//,
        REGEXP_DSLASH_START          = /^\/\/(?!\/)/,
        REGEXP_PORT_END              = /:(\d+)$/,
        REGEXP_SLASH_START           = /^\/+/,
        REGEXP_SLASH_END             = /\/+$/,
        REGEXP_HASH_START            = /^#/,
        REGEXP_HASH_PATH_START       = /^#\//,
        REGEXP_PATH_HASH_START       = /^\/#/,
        REGEXP_RELATIVE_START        = /^\.+\//,
        REGEXP_URL_IMPORT            = /url\s*\(([^\)]+)\)/g,
        REGEXP_QUOTA_START           = /^('|")/,
        REGEXP_QUOTA_END             = /('|")$/,
        REGEXP_REST_PARAM            = /\{([^\}]+)\}/g,
        REGEXP_FUNCTION              = /function\s*\(([^\)]*)\)/;

    var __undef__,
        __op__ = Object.prototype,
        __ap__ = Array.prototype,
        __sp__ = String.prototype;

    var __hasOwn = __op__.hasOwnProperty,
        __isProto = __op__.isPrototypeOf,
        __hasProto = function() {
            var has;
            try {
                has = __hasOwn.apply(this.prototype, arguments);
            } catch (e) {
                has = false;
            }
            return has;
        },
        __ostring = __op__.toString,
        __aslice = __ap__.slice,
        __asplice = __ap__.splice;

    var otype = function(o) {
        return __ostring.call(o).slice(8, -1).toLowerCase();
    };

    var trim = function(s) {
        if (typeof __sp__.trim === "function" && !__sp__.trim.call("\uFEFF\xA0")) {
            return s == null ? "" : __sp__.trim.call(s);
        }
        return s == null ? "" : (s + "").replace(/(^\s*)|(\s*$)/g, "");
    };

    var trimLeft = function(s) {
        if (typeof __sp__.trimLeft === "function" && !__sp__.trim.call("\uFEFF\xA0")) {
            return s == null ? "" : __sp__.trimLeft.call(s);
        }
        return s == null ? "" : (s + "").replace(/(^\s*)/g, "");
    };

    var trimRight = function(s) {
        if (typeof __sp__.trimRight === "function" && !__sp__.trim.call("\uFEFF\xA0")) {
            return s == null ? "" : __sp__.trimRight.call(s);
        }
        return s == null ? "" : (s + "").replace(/(\s*$)/g, "");
    };

    var getRequireUrl = function(path) {
        path = trim(path);
        var rqUrl;
        try {
            rqUrl = trim(require.toUrl(path));
            if (REGEXP_SLASH_START.test(rqUrl)) {
                rqUrl = ROOT_URL + rqUrl.replace(REGEXP_SLASH_START, "");
            }
            // 去除参数
            var posQuery = rqUrl.indexOf('?');
            if (posQuery > -1) {
                rqUrl = rqUrl.substring(0, posQuery);
            }
        } catch (e) {
            rqUrl = path;
        }
        return rqUrl;
    };

    var getProtocol = function(url) {
        url = trim(url);
        var match = url.match(REGEXP_PROTOCOL_START), protocol;
        if (match != null) {
            protocol = match[1];
        }
        return protocol || '';
    };

    var getDomain = function(url) {
        url = trim(url);
        var domain;
        if (REGEXP_PROTOCOL_START.test(url)) {
            domain = url.replace(REGEXP_PROTOCOL_START, "");
        } else if (REGEXP_DSLASH_START.test(url)) {
            domain = url.replace(REGEXP_DSLASH_START, "");
        }
        if (domain != null) {
            domain = domain.replace(REGEXP_SLASH_START, "");
            var posSlash = domain.indexOf('/');
            if (posSlash > -1) {
                domain = domain.substring(0, posSlash);
            }
            domain = domain.toLowerCase();
        }
        return domain || '';
    };

    var is$ = function (o) {
        return o && o instanceof $;
    };

    var isDom = function(o) {
        var type = otype(o);
        return type === "window" || type === "global" || o === window || type === "htmldocument" || o === document || /^html(\w+)element$/.test(otype(o));
    };

    var inArray = function() {
        return $.inArray.apply($, arguments);
    };

    /**
     * Define a property.
     * @param obj {Object} 设置属性的对象
     * @param key {String} 设置属性名
     * @param val {*}      设置值
     * @param descriptor {Object} 描述符
     *        - writable: 如果为false，属性的值就不能被重写。默认为 true
     *        - get: 一旦目标属性被访问就会调回此方法，并将此方法的运算结果返回用户。
     *        - set: 一旦目标属性被赋值，就会调回此方法。
     *        - enumerable: 是否能在for...in循环中遍历出来或在Object.keys中列举出来。 默认为 true
     *        - configurable: 如果为false，则任何尝试删除目标属性或修改属性以下特性（writable, configurable, enumerable）的行为将被无效化。 默认为 true
     *        - 键名以双下划线开头和结尾对时，writable、enumerable、configurable 都默认为 false
     * @returns {Object}
     */
    var def = function (obj, key, val, descriptor) {

        if (obj == null) {
            try {
                obj = Object.create(null);
            } catch (e) {
                obj = {};
            }
        }

        key = trim(key + '');

        if (key.length <= 0) return obj;

        try {
            var _descriptor;
            if (/^__(.+)__$/.test(key)) {
                // 自动处理私有属性
                _descriptor = {
                    enumerable: false,
                    writable: false,
                    configurable: false
                };
            } else {
                _descriptor = {
                    enumerable: true,
                    writable: true,
                    configurable: true
                }
            }
            if (typeof descriptor !== "object") {
                descriptor = {value: val};
            } else {
                descriptor = $.extend({}, descriptor, {value: val});
            }
            if (!obj || typeof obj[key] === "undefined") {
                descriptor = $.extend({}, _descriptor, descriptor);
            }
            Object.defineProperty(obj, key, descriptor);
        } catch (e) {
            if (obj != null) {
                obj[key] = val;
            }
        }

        return obj;
    };

    var isDeferred = function(o) {
        if (!o || typeof(o) !== "object") return false;
        return (
            typeof(o.resolve) === "function"
            && typeof(o.reject) === "function"
            && typeof(o.done) === "function"
            && typeof(o.fail) === "function"
            && typeof(o.then) === "function"
            && typeof(o.always) === "function"
            && typeof(o.promise) === "function"
        );
    };

    var isPromise = function(o) {
        if (!o || typeof(o) !== "object") return false;
        return (
            typeof(o.done) === "function"
            && typeof(o.fail) === "function"
            && typeof(o.then) === "function"
            && typeof(o.always) === "function"
        );
    };

    /*!
     * 计算字符串的hash
     */
    var I64BIT_TABLE =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');

    var hash = function(input) {
        var retValue = '';

        if (!input || !input.length) return retValue;

        var i = input.length - 1;

        if (isNaN(i)) return retValue;

        var hash = 5381;

        if (typeof input === "string") {
            for (; i > -1; i--)
                hash += (hash << 5) + input.charCodeAt(i);
        } else {
            for (; i > -1; i--)
                hash += (hash << 5) + input[i];
        }

        var value = hash & 0x7FFFFFFF;

        do {
            retValue += I64BIT_TABLE[value & 0x3F];
        } while(
            value >>= 6
        );

        return retValue;
    };

    /**
     * 模拟 requestAnimationFrame
     * @param callback {Function} 回调函数
     * @param args     {Array}    可选。回调函数参数
     * @param period   {Number}   可选。触发时间，单位毫秒(ms)，默认为 1000/60
     * @returns {requestAnimationFrame.context}
     */
    var requestAnimationFrame = function(callback, args, period) {

        if (typeof callback !== "function") return this;

        if (arguments.length < 3) {
            if (typeof args === "number") {
                period = args;
            }
        }

        args = normalizeArgs(args);
        period = normalizePeriod(period);

        (function(self, args, period) {
            setTimeout(function() {
                callback.apply(self, args);
            }, period);
        })(this, args, period);

        function normalizeArgs(args) {
            var _args;
            if (otype(args) !== "array") {
                if (typeof args === "undefined") {
                    _args = [];
                } else {
                    _args = [args];
                }
            } else {
                _args = args;
            }
            return _args;
        }

        function normalizePeriod(period) {
            if (typeof period !== "number" || !period) {
                period = 1000 / 60;
            }
            if (period < 0) {
                period = 0;
            }
            return period;
        }

        return this;
    };

    var _ = {
        // vars
        __undef__: __undef__,
        __op__: __op__,
        __ap__: __ap__,
        // utils
        __hasOwn: __hasOwn,
        __hasProto: __hasProto,
        __ostring: __ostring,
        __aslice: __aslice,
        __asplice: __asplice,
        // json util
        JSON: JSON,
        // define property
        def: def,
        // 递归设置属性（处理设置对象为数组的情况）
        setPropsRecursive: function(rewrite, o, props, descriptor) {
            if (!_.isBoolean(rewrite)) {
                descriptor = props;
                props = o;
                o = rewrite;
                rewrite = true;
            }
            if (o != null && props != null) {
                var doSetProps = function(o) {
                    if (otype(o) === "array") {
                        for (var i=0; i < o.length; i++) {
                            o[i] = doSetProps(o[i]);
                        }
                    } else if (typeof props === "object") {
                        for (var key in props) {
                            if (_.isUndef(o[key]) || rewrite) {
                                o = def(o, key, props[key], descriptor);
                            }
                        }
                    }
                    return o;
                };
                o = doSetProps(o);
            }
            return o;
        },
        // path 转换为 id
        encodeIdFromURI: function(path) {
            var id = trim(path);
            if (id) {
                try {
                    id = encodeURI(id)
                } catch (e) {}
                id = id
                    .replace(REGEXP_SLASH_START, "")
                    .replace(REGEXP_SLASH_END, "")
                    .replace(/\/+/g, "—")
                    .replace(/\.+/g, "&sdot;");
            }
            return id;
        },
        // id 还原为 path
        decodeIdToPath: function(id) {
            var path = trim(id);
            if (path) {
                path = path
                    .replace(/&sdot;/g, ".")
                    .replace(/—/g, "/");
                path = '/' + path;
                try {
                    path = decodeURI(path);
                } catch (e) {}
            }
            return path;
        },
        // pathId 转换为易读易写的css样式短语
        stylePathId: function(id) {
            id = trim(id)
                .replace(/—/g, "-");
            return id;
        },
        // 设置器
        configurator: function(defaults) {

            defaults = defaults || {};

            return function(key, val) {
                if (key != null) {
                    if (typeof key === "object") {
                        $.extend(true, defaults, key);
                    } else if (typeof key === "number") {
                        if (!isNaN(key)) {
                            defaults[key] = val;
                        }
                    } else {
                        key = trim(key);
                        if (key.length > 0) {
                            defaults[key] = val;
                        }
                    }
                }
                return this;
            };
        },
        setter: function(defaults, proto) {
            !defaults && (defaults = {});
            !proto && (proto = {});

            return function(key, val) {
                var self = this, res = true;

                !self && (self = {});
                !self.__options__ && _.def(self, '__options__', {});
                !self.__const_props__ && _.def(self, '__const_props__', []);

                key = trim(key);

                if (key.length > 0) {
                    if (__hasOwn.call(defaults, key)) {
                        if (_.isUndef(val)) {
                            delete self.__options__[key];
                        } else {
                            def(self.__options__, key, val);
                        }
                    } else if (
                        !__hasProto.call(proto, key)
                        && inArray(key, self.__const_props__) < 0
                    ) {
                        if (__hasOwn.call(self.__options__, key)) {
                            delete self.__options__[key];
                        }
                        var setProp = function(key, val, level) {
                            level = level || 0;

                            if (level > 1000) return;

                            if ($.isPlainObject(val)) {
                                def(this, key, val);
                                for (var _key in val) {
                                    if (__hasOwn.call(val, _key))
                                        def(this, key, setProp.call(val, _key, val[_key], level + 1));
                                }
                            } else {
                                if ($.isFunction(val)) {
                                    var caller = function() {
                                        var context = this.context,
                                            _caller = this.caller,
                                            args = __aslice.call(arguments);
                                        return context.applyOption(_caller, args);
                                    };
                                    val = caller.bind({
                                        context: self,
                                        caller: val
                                    });
                                    val.name = key;
                                }
                                def(this, key, val);
                            }
                            return this;
                        };
                        setProp.call(self, key, val);
                    } else {
                        res = false;
                    }
                }
                return res;
            };
        },
        getter: function(defaults, proto) {
            !defaults && (defaults = {});
            !proto && (proto = {});

            return function(key) {
                var self = this;

                !self && (self = {});
                !self.__options__ && _.def(self, '__options__', {});
                !self.__const_props__ && _.def(self, '__const_props__', []);

                key = trim(key);

                if (key.length > 0) {
                    if (__hasOwn.call(defaults, key)) {
                        return self.__options__[key];
                    } else if(
                        !__hasProto.call(proto, key)
                        && inArray(key, self.__const_props__) < 0
                    ) {
                        return self[key];
                    } else {
                        return __undef__;
                    }
                } else {
                    return __undef__;
                }
            };
        },
        optionSetter: function(defaults) {

            defaults = defaults || {};

            return function(key, val) {

                key = trim(key);

                if (key.length > 0 && __hasOwn.call(defaults, key) && this && this.__options__) {
                    def(this.__options__, key, val);
                }

                return this;
            };
        },
        optionGetter: function() {
            return function(name) {
                var val;

                name = _.trim(name);

                if (name.length > 0 && this && this.__options__) {
                    val = this.__options__[name];
                }

                return val;
            };
        },
        optionsGetter: function() {
            return function(options) {
                if (this && this.__options__) {
                    return $.extend(true, {}, this.__options__, options);
                } else {
                    return $.extend(true, {}, options);
                }
            };
        },
        stateUpdater: function(STATE, STATE_INDEX) {

            STATE = STATE || {};
            STATE_INDEX = STATE_INDEX || {};

            return function(label) {
                label = normalizeStateLabel(label);

                var self = this || {}, res = false;

                var stateIndex = STATE_INDEX[label], stateLabel;

                if (stateIndex != null) {
                    if (stateIndex !== self.__state_index__) {
                        if (self.__state__ != null) {
                            res = _.extend(true, {}, self.__state__);
                        } else {
                            res = null;
                        }
                    } else {
                        res = false;
                    }
                    _.def(self, '__state_index__', stateIndex);
                    stateLabel = STATE[stateIndex];
                    if (stateLabel != null) {
                        _.def(self.__state__, 'label', stateLabel);
                    }
                }

                return res;
            };
        },
        stateIndexGetter: function(STATE, STATE_INDEX) {

            STATE = STATE || {};
            STATE_INDEX = STATE_INDEX || {};

            return function(label_or_index) {
                var index;
                if (_.notNull(label_or_index)) {
                    label_or_index = _.trim(label_or_index);
                    if (!_.isEmpty(label_or_index)) {
                        var label = STATE[label_or_index];
                        if (_.isUndef(label)) {
                            label = label_or_index;
                        }
                        label = _.normalizeStateLabel(label);
                        index = STATE_INDEX[label];
                    }
                } else {
                    index = this.__state_index__;
                }
                return index;
            };
        },
        normalizeStateLabel: normalizeStateLabel,
        stateSetter: function(state, stateOrg) {

            stateOrg = stateOrg || {};

            return function(key, val) {
                if (state && _.notNull(key)) {
                    if (_.isObject(key)) {
                        for (var k in key) {
                            if (_.isUndef(stateOrg[k])) {
                                state[k] = key[k];
                            }
                        }
                    } else {
                        key = _.trim(key);
                        if (key.length > 0 && _.isUndef(stateOrg[key])) {
                            state[key] = val;
                        }
                    }
                }
                return this;
            };
        },
        stateGetter: function(state) {
            return function(key) {
                var val;
                if (state) {
                    if (_.isUndef(key)) {
                        val = state;
                    } else {
                        key = _.trim(key);
                        if (key.length > 0) {
                            val = state[key];
                        }
                    }
                    val = copyValue(val);
                }
                return val;
            };
        },
        stateReplacement: function(stateKey, replacement, descriptor) {
            var self = this || {};

            stateKey = stateKey || "__state__";
            replacement = replacement || {};

            def(self, stateKey, {}, descriptor);

            def(self[stateKey], '__normalized__', true);

            if (replacement.__reload_page__) {
                def(self[stateKey], '__reload_page__', true);
            }

            for (var key in replacement) {
                _.def(self[stateKey], key, replacement[key], {
                    writable: false,
                    configurable: (key === "label") ? true : false
                });
            }

            return this;
        },
        errorMaker: function(error, context) {
            return function (id, option, originalError) {

                context = context || this;

                option = error.normalizeOption(option);
                option.level = error['LEVEL_' + context.__error_ns__];

                var err = error.make(id, option, originalError);

                err.context = context;

                return err;
            };
        },
        // 获取应用相对路径
        getRelativePath: function(path, relativePath, bRelativeApp) {

            path = trim(path) || trim(relativePath) || "/";

            if (typeof bRelativeApp !== "boolean") {
                bRelativeApp = true;
            }

            if (REGEXP_DSLASH_START.test(path)) {
                path = PROTOCOL + path;
            }

            if (!REGEXP_PROTOCOL_START.test(path)) {
                // relative app.js
                if (bRelativeApp && !REGEXP_SLASH_START.test(path)) {
                    var rqUrl = getRequireUrl();
                    if (!REGEXP_SLASH_END.test(rqUrl)) {
                        rqUrl += "/";
                    }
                    path = rqUrl + path;
                }
                // relative relativePath
                if (!REGEXP_PROTOCOL_START.test(path) && relativePath) {
                    path = path.replace(REGEXP_SLASH_START, "");
                    if (!REGEXP_SLASH_END.test(relativePath)) {
                        relativePath += "/";
                    }
                    path = relativePath + path;
                }
            }

            if (!REGEXP_SLASH_END.test(path)) {
                path += "/";
            }

            return path;
        },
        // 获取 require 文件路径
        getRequireUrl: getRequireUrl,
        // 校验元素参数的合法性：String、DOM、jQuery
        validElement: function(element) {
            if (element == null) return false;
            return typeof(element) === "string" || is$(element) || isDom(element);
        },
        returnFalse: function() {
            return false;
        },
        returnTrue: function() {
            return true;
        },
        increaseId: function(id) {
            id = trim(id);
            var gapStr = '-',
                posGap = id.lastIndexOf(gapStr);
            if (posGap > -1) {
                id = id.substring(posGap + 1);
            }
            id = (parseInt(id) || 0) + 1;
            if (id > Number.MAX_SAFE_INTEGER) {
                id = id + gapStr + 1;
            }
            return trim(id);
        },
        normalizeArrOption: function(option) {
            if (otype(option) !== "array") {
                if (option != null) {
                    option = [option];
                } else {
                    option = [];
                }
            }
            return option;
        },
        html2str: function(html) {
            if (is$(html)) {
                var htmlText = '';
                html.each(function() {
                    var $this = $(this);
                    htmlText += ($this.prop('outerHTML') || $this.text() || '');
                });
                html = htmlText;
            }
            return trim(html);
        },
        disposeDeferred: function(o, reject) {
            var doDispose = function(o, level) {
                level = level || 0;

                if (level > 1000) return o;

                if (o != null && o.__deferred__ != null) {
                    o = doDispose(o.__deferred__, level + 1);

                    if (otype(o.__deferred__) === "array") {
                        level = level + 1;
                        for (var i=0; i<o.__deferred__.length; i++) {
                            o.__deferred__[i] = doDispose(o.__deferred__[i], level);
                            if (isDeferred(o.__deferred__[i]) && reject !== false) {
                                o.__deferred__[i].reject();
                            }
                        }
                    } else if (isDeferred(o.__deferred__)) {
                        if (reject !== false) {
                            o.__deferred__.reject();
                            def(o.__deferred__, '__rejected__', true, {
                                configurable: true
                            });
                        } else {
                            delete o.__deferred__.__rejected__;
                        }
                    }

                    delete o.__deferred__;
                }

                return o;
            };
            return doDispose(o);
        },
        assignDeferred: function(o, deferred) {
            if (o != null) {
                var descriptor = {
                    writable: false,
                    enumerable: false,
                    configurable: true
                };
                if (_.isArray(deferred)) {
                    def(o, '__deferred__', [], descriptor);
                    for (var i=0; i<deferred.length; i++) {
                        if (isDeferred(deferred[i])) {
                            o.__deferred__.push(deferred[i]);
                        }
                    }
                } else if (isDeferred(deferred)) {
                    def(o, '__deferred__', deferred, descriptor);
                }
            }
            return o;
        },
        copyValue: copyValue,
        requestAnimationFrame: requestAnimationFrame,
        // regexp
        REGEXP_PROTOCOL_START        : REGEXP_PROTOCOL_START,
        REGEXP_SECURE_PROTOCOL_START : REGEXP_SECURE_PROTOCOL_START,
        REGEXP_PROTOCOL_WS_START     : REGEXP_PROTOCOL_WS_START,
        REGEXP_PORT_END              : REGEXP_PORT_END,
        REGEXP_DSLASH_START          : REGEXP_DSLASH_START,
        REGEXP_SLASH_START           : REGEXP_SLASH_START,
        REGEXP_SLASH_END             : REGEXP_SLASH_END,
        REGEXP_HASH_START            : REGEXP_HASH_START,
        REGEXP_HASH_PATH_START       : REGEXP_HASH_PATH_START,
        REGEXP_PATH_HASH_START       : REGEXP_PATH_HASH_START,
        REGEXP_RELATIVE_START        : REGEXP_RELATIVE_START,
        REGEXP_URL_IMPORT            : REGEXP_URL_IMPORT,
        REGEXP_QUOTA_START           : REGEXP_QUOTA_START,
        REGEXP_QUOTA_END             : REGEXP_QUOTA_END,
        REGEXP_REST_PARAM            : REGEXP_REST_PARAM,
        REGEXP_FUNCTION              : REGEXP_FUNCTION
    };

    // 对外公开工具方法
    _.Exports = {
        // dom
        window: window,
        document: document,
        docRoot: document.documentElement || {},
        docBody: document.body || {},
        // local url
        LOCAL_PROTOCOL : PROTOCOL,
        LOCAL_HOST     : HOST,
        LOCAL_PORT     : PORT,
        LOCAL_DOMAIN   : DOMAIN,
        LOCAL_ROOT     : ROOT_URL,
        // string trim
        trim: trim,
        trimLeft: trimLeft,
        trimRight: trimRight,
        // types
        otype: otype,
        is$: is$,
        isDom: isDom,
        isDeferred: isDeferred,
        isPromise: isPromise,
        isUndef: function (o) {
            return typeof(o) === "undefined";
        },
        // null
        eqNull: function(o) {
            return null === o;
        },
        // undefined 或 null
        isNull: function (o) {
            return null == o;
        },
        // 非 undefined 和 null
        notNull: function(o) {
            return null != o;
        },
        isNumber: function(o) {
            return typeof(o) === "number";
        },
        isBoolean: function(o) {
            return typeof(o) === "boolean";
        },
        isString: function (o) {
            return typeof(o) === "string";
        },
        isObject: function (o) {
            return typeof(o) === "object";
        },
        isPlainObject: function (o) {
            return $.isPlainObject(o);
        },
        isArray: function (o) {
            return otype(o) === "array";
        },
        isFunction: function (o) {
            return typeof(o) === "function";
        },
        isEmpty: function (o) {
            if (o == null) return true;
            // empty string ?
            if (typeof(o) !== "object") {
                return trim(o).length <= 0;
            }
            // empty array ?
            if (otype(o) === "array") {
                return o.length <= 0;
            }
            // empty object ?
            var name;
            for (name in o) {
                return false;
            }
            return true;
        },
        unique: function(arr) {
            if (otype(arr) === "array") {
                return $.unique(arr);
            }
            return arr;
        },
        inArray: inArray,
        // url parser
        getProtocol: getProtocol,
        getHost: function(url) {
            var host = getDomain(url);
            if (REGEXP_PORT_END.test(host)) {
                host = host.replace(REGEXP_PORT_END, "");
            }
            return host;
        },
        getPort: function(url) {
            var port = getDomain(url),
                match = port.match(REGEXP_PORT_END);
            if (match == null) {
                port = '';
            } else {
                port = match[1];
            }
            return port;
        },
        getDomain: getDomain,
        // 深层拷贝
        extend: $.extend,
        // 计算字符串的hash
        hash: hash,
        // 获取时间戳
        timestamp: function() {
            return new Date().getTime();
        },
        // 空操作
        noop: function() {},
        // 继承
        Extends: function (child, parent, properties) {
            properties = properties || {};

            for (var key in parent) {
                if (__hasOwn.call(properties, key)) {
                    child[key] = properties[key];
                } else if (__hasOwn.call(parent, key)) {
                    child[key] = parent[key];
                }
            }

            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;

            child.prototype = new ctor();
            child.__super__ = parent;

            return child;
        }
    };

    for (var key in _.Exports) {
        if (__hasOwn.call(_.Exports, key))
            _[key] = _.Exports[key];
    }

    _.toUrl = function(path, params, relativePath) {

        path = _.trim(path);
        relativePath = _.trim(relativePath);

        if (_.isEmpty(path)) {
            path = relativePath;
            relativePath = '';
        }

        // 开头的'+/'标记相对路径的最后一层路径作为目录
        if (path.indexOf('+/') == 0) {
            if (relativePath.length && !REGEXP_SLASH_END.test(relativePath)) {
                relativePath += "/";
            }
            path = path.substring(2);
        } else if (path.indexOf('\+/') == 0) {
            path = path.substring(1);
        }

        if (relativePath.length) {
            relativePath = relativePath.split('\/');
            relativePath.pop();
            relativePath = relativePath.join('/');
        }

        var url = path;

        var posParams = url.indexOf('?'), urlParams = "";
        if (posParams > -1) {
            urlParams = url.substring(posParams + 1);
            url = url.substring(0, posParams);
        }

        if (REGEXP_DSLASH_START.test(url)) {
            url = _.LOCAL_PROTOCOL + url;
        }

        // 非相对路径时默认相对于指定的相对路径
        if (!REGEXP_PROTOCOL_START.test(url) && !REGEXP_SLASH_START.test(url)) {
            url = relativePath + '/' + url;
        }

        url = _.normalizeUrl(url);

        // 替换 ./
        url = url.replace(/\/\.\//g, "/");

        // 处理 ../
        var pathPre, pathSuffix, matches,
            reDot2 = /\/\.{2,}\//g;
        while ((matches = reDot2.exec(url)) != null) {
            pathPre = url.substring(0, matches.index);
            pathPre = pathPre.split("\/");
            pathPre.pop();
            pathPre = pathPre.join("/");
            pathSuffix = url.substring(reDot2.lastIndex);
            reDot2.lastIndex = pathPre.length;
            url = pathPre + (pathSuffix.length ? "/" + pathSuffix : "");
        }

        url = url.replace(REGEXP_HASH_START, "");

        if (_.isEmpty(params)) {
            params = "";
        } else {
            if (_.isObject(params)) {
                try {
                    params = $.param(params);
                } catch (e) {
                    params = "";
                }
            } else {
                params = _.trim(params);
            }
        }

        if (urlParams && params) {
            params = [urlParams, params].join("&");
        } else if (urlParams) {
            params = urlParams;
        }

        if (params) {
            url = url + "?" + params;
        }

        if (_.isEmpty(url)) {
            url = "/";
        }

        return url;
    };

    _.getPath = function(path, relativePath) {
        path = _.toUrl(path, null, relativePath);
        return path;
    };

    _.getPathId = function(path, relativePath) {
        path = _.getPath(path, relativePath);
        return _.encodeIdFromURI(path);
    };

    _.normalizeUrl = function(path) {
        path = _.trim(path);

        if (path.length) {
            // 去除重复斜杠
            var match = REGEXP_PROTOCOL.exec(path);
            if (match != null) {
                var prefix = [], paths = [], prevPath;
                do {
                    prefix.push(match[0]);
                    if (paths.length > 1) {
                        prevPath = paths[paths.length - 1];
                        paths[paths.length - 1] = prevPath.substring(0, match.index);
                    }
                    path = path.substring(REGEXP_PROTOCOL.lastIndex);
                    paths.push(path);
                } while (
                    (match = REGEXP_PROTOCOL.exec(path)) != null
                );
                for (var i=0; i<paths.length; i++) {
                    paths[i] = prefix[i] + trimDoubleSlash(paths[i]);
                }
                path = paths.join('');
            } else {
                path = trimDoubleSlash(path);
            }
        }

        function trimDoubleSlash(path) {
            return (path + "").replace(/\/{2,}/g, "/");
        }

        return path;
    };

    _.getParam = function(name, params) {
        params = params || {};
        return params[name];
    };

    _.concatError = function(errTarget, errSource) {

        errTarget = _.sliceError(errTarget);

        errSource = _.__aslice.call(arguments, 1);
        errSource = _.sliceError(errSource);

        var concatError = function(errSource, level) {

            level = level || 0;

            if (level > 1000) return errTarget;

            if (_.isArray(errSource)) {
                level = level + 1;
                $.each(errSource, function(i, errSource) {
                    concatError(errSource, level);
                });
            } else {
                var pos = _.inError(errTarget, errSource);
                if (pos < 0) {
                    errTarget.push(errSource);
                } else {
                    errTarget.splice(pos, 1, errSource);
                }
            }

            return errTarget;
        };

        return concatError(errSource);
    };

    _.sliceError = function(errors, filter) {

        if (_.isNull(errors)) {
            errors = [];
        } else if (!_.isArray(errors)) {
            errors = [errors];
        }

        var errorFilter = function(err, filter, level) {
            var filtered = [];

            level = level || 0;

            if (level > 1000) return filtered;

            if (_.isArray(err)) {
                level = level + 1;
                $.each(err, function(i, err) {
                    filtered = filtered.concat(errorFilter(err, filter, level));
                });
            } else if (_.notNull(err)) {
                if (_.isEmpty(filter)) {
                    filtered.push(err);
                } else {
                    var equal, non, re_non = /^!/;
                    for (var key in filter) {
                        non = re_non.test(key);
                        if (non) {
                            key = (key + '').replace(re_non, "");
                        }
                        equal = (
                            (filter[key] instanceof RegExp)
                                ? filter[key].test(err[key])
                                : filter[key] === err[key]
                        );
                        if (non) {
                            equal = !equal;
                        }
                        if (!equal) {
                            break;
                        }
                    }
                    if (equal) {
                        filtered.push(err);
                    }
                }
            }

            return filtered;
        };

        return errorFilter(errors, filter);
    };

    _.shiftError = function(errors, errSource) {

        errors = _.sliceError(errors);

        errSource = _.__aslice.call(arguments, 1);
        errSource = _.sliceError(errSource);

        var shiftError = function(errSource, level) {
            var pos = -1;

            level = level || 0;

            if (level > 1000) return errors;

            if (_.isArray(errSource)) {
                level = level + 1;
                $.each(errSource, function(i, errSource) {
                    shiftError(errSource, level);
                });
            } else if ((pos = _.inError(errors, errSource)) > -1) {
                errors.splice(pos, 1);
            }

            return errors;
        };

        return shiftError(errSource);
    };

    _.includeError = function(errors, bRemove, errSource) {

        errors = _.sliceError(errors);

        if (_.isBoolean(bRemove)) {
            errSource = _.__aslice.call(arguments, 2);
        } else {
            errSource = _.__aslice.call(arguments, 1);
            bRemove = false;
        }

        errSource = _.sliceError(errSource);

        var errorIncludes = function(errSource, level) {
            var includes = [], pos = -1;

            level = level || 0;

            if (level > 1000) return includes;

            if (_.isArray(errSource)) {
                level = level + 1;
                $.each(errSource, function(i, errSource) {
                    includes = includes.concat(errorIncludes(errSource, level));
                });
            } else if ((pos = _.inError(errors, errSource)) > -1) {
                if (bRemove) {
                    includes.push(errors.splice(pos, 1)[0]);
                } else {
                    includes.push(errors[pos]);
                }
            }

            return includes;
        };

        return errorIncludes(errSource);
    };

    _.excludeError = function(errors, bRemove, errSource) {

        errors = _.sliceError(errors);

        if (_.isBoolean(bRemove)) {
            errSource = _.__aslice.call(arguments, 2);
        } else {
            errSource = _.__aslice.call(arguments, 1);
            bRemove = false;
        }

        errSource = _.sliceError(errSource);

        var errorExcludes = function(errSource, level) {
            var excludes = [], pos = -1;

            level = level || 0;

            if (level > 1000) return excludes;

            if (_.isArray(errSource)) {
                level = level + 1;
                $.each(errSource, function(i, errSource) {
                    excludes = excludes.concat(errorExcludes(errSource, level));
                });
            } else {
                if ((pos = _.inError(errors, errSource)) == -1) {
                    excludes.push(errSource);
                } else if (bRemove) {
                    errors.splice(pos, 1)
                }
            }

            return excludes;
        };

        return errorExcludes(errSource);
    };

    _.inError = function(errors, errSource) {

        errors = _.sliceError(errors);

        errSource = _.__aslice.call(arguments, 1);
        errSource = _.sliceError(errSource);

        var inErrors = function(errSource, level) {
            var pos = -1, posFirst = pos;

            level = level || 0;

            if (level > 1000) return posFirst;

            if (_.isArray(errSource)) {
                level = level + 1;
                $.each(errSource, function(i, errSource) {
                    if ((pos = inErrors(errSource, level)) < 0) {
                        return false;
                    }
                    if (posFirst < 0) {
                        posFirst = pos;
                    }
                });
            } else if (_.notNull(errSource)) {
                posFirst = pos = _.inArray(errSource, errors);
            }

            return posFirst;
        };

        return inErrors(errSource);
    };

    _.matchFn = function(fn) {
        var match = null;

        if (_.isFunction(fn)) {
            var fnStr = _.trim(fn + ""),
                fnMatch = fnStr.match(REGEXP_FUNCTION);
            if (fnMatch != null) {
                match = [];
                var params = _.trim(fnMatch[1]);
                params = params.split(/\s*,\s*/);
                match = match.concat(params);
                var fnContentStart = fnStr.indexOf('{'),
                    fnContentEnd = fnStr.lastIndexOf('}');
                var fnContent = fnStr.substring(fnContentStart + 1, fnContentEnd);
                match.push(_.trim(fnContent));
            }
        }

        return match;
    };

    _.normalizeCallbackArgs = function(cb, args) {
        var _args;
        try {
            _args = __aslice.call(args);
        } catch (e) {
            _args = [].concat(args);
        }
        var err = _args.shift(),
            _bRemoved = function(err) {
                var res;
                if (err && err.context) {
                    try {
                        res = (err.context.inError(err) < 0);
                    } catch (e) {
                        res = false;
                    }
                } else {
                    res = false;
                }
                return res;
            },
            bRemoved,
            _hasHandler = function(err) {
                var res;
                if (err && !_.isUndef(err.__err_handler__)) {
                    res = true;
                } else {
                    res = false;
                }
                return res;
            },
            hasHandler;
        if (_.notNull(err)) {
            if (_.isArray(err)) {
                for (var i=0; i<err.length; i++) {
                    bRemoved = _bRemoved(err[i]);
                    hasHandler = _hasHandler(err[i]);
                    if (bRemoved || hasHandler) {
                        break;
                    }
                }
            } else {
                bRemoved = _bRemoved(err);
                hasHandler = _hasHandler(err);
            }
            var match;
            if (!bRemoved && !hasHandler && (match = _.matchFn(cb)) != null) {
                var fnArg0 = match[0],
                    fnContent = match[match.length - 1];
                if (_.notNull(fnArg0) && _.notNull(fnContent)) {
                    try {
                        fnArg0 = _.trim(fnArg0);
                        fnContent = _.trim(fnContent);
                        // TODO 处理尚待完善 - 如果有内部方法的参数与当前错误对象参数名相同，会误检测
                        var source = fnContent
                        // 去除单行注释
                            .replace(/\/\/[^\n]+/g, "")
                            // 去除字符串
                            .replace(/'[^']+'/g, "")
                            .replace(/"[^"]+"/g, "")
                            // 去除被赋值的变量
                            .replace(/[\w\$@]+\s*=/g, "")
                            // 去除对象键
                            .replace(/[\w\$@]+\s*:/g, "");
                        // 去除块注释
                        var _source = '';
                        $.each(source.split(/\/\*/), function(i, s) {
                            s = s.split(/\*\//);
                            if (s.length === 1) {
                                _source += s[0];
                            } else {
                                _source += s[1];
                            }
                        });
                        source = _source;
                        // 查找参数是否被使用
                        var reArg = new RegExp('\\b'+fnArg0+'\\b'),
                            reVar = /\$|@/,
                            reMatch, argCalled = false;
                        if (
                            (reMatch = reArg.exec(source)) != null
                            && !reVar.test(source.charAt(reMatch.index - 1))
                            && !reVar.test(source.charAt(reMatch.index + fnArg0.length))
                        ) {
                            argCalled = true;
                        }
                        // 标记错误对象被处理过
                        if (argCalled) {
                            err = _.setPropsRecursive(false, err, {
                                __err_handler__: true
                            }, {
                                configurable: true
                            });
                        }
                    } catch (e) {}
                }
            }
        }
        _args.unshift(err);
        return _args;
    };

    function normalizeStateLabel(label) {

        label = _.trim(label).toUpperCase();

        var reBefore = /^BEFORE(?!_)/;
        if (reBefore.test(label)) {
            label = label.replace(reBefore, 'BEFORE_');
        }

        return label;
    }

    function copyValue(val) {
        var _val;
        if (_.isArray(val)) {
            _val = [];
            for (var i=0; i<val.length; i++) {
                _val[i] = copyValue(val[i]);
            }
        } else if (_.isPlainObject(val)) {
            _val = $.extend(true, {}, val);
        } else {
            _val = val;
        }
        return _val;
    }

    return _;
});