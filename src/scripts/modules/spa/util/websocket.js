define('yfjs/spa/util/websocket', ['../version', 'jquery', './helpers', './history', './event', './error'], function(Version, $, _, History, Event, Error) {

    var JSON = _.JSON;

    var _WebSocket = _.window.WebSocket || _.window.MozWebSocket;

    var WebSocket = function(options, context) {
        if (this instanceof WebSocket) {
            _.def(this, '__options__', _.extend({}, WebSocket.DEFAULTS, options));
            _.def(this, '__context__', context);
            _.def(this, '__ws__', []);
        } else {
            return new WebSocket(options, context);
        }
    };

    WebSocket.NAMESPACE = "WebSocket";

    WebSocket.VERSION = Version(WebSocket.NAMESPACE);

    WebSocket.DEFAULTS = {
        base: '/',
        /**
         * 返回数据的处理函数 {Function}
         * - 传入参数为 错误信息、请求返回的数据、当前 ws 对象。this 指针指向当前的 context 配置项
         * - 必须返回一个数组，数组第一项为错误信息，第二项和第三项为新处理后的数据和 ws 对象
         */
        respFilter: _.__undef__,
        /**
         * 当前环境模式 {String}
         * 模式可完全自定义，例如：
         * - mock  模拟阶段
         * - test  测试阶段
         * - dev   开发阶段
         * - pro   产品阶段
         */
        mode: 'mock',
        /**
         * 请求地址相关配置 {Object}
         * - {String} : {Object} 键值对分别为 名称 和 各模式下的请求地址
         * - 发送请求时 url 可使用此配置的键名代替
         * 例如：
         * {
         *     'examples.get': {
         *         mock: '...',
         *         pro: '...'
         *     },
         *     'examples.delete': {
         *         mock: '...',
         *         pro: '...'
         *     }
         * }
         */
        urls: {}
    };

    WebSocket.REGEXP_PROTOCOL_START        = _.REGEXP_PROTOCOL_START;
    WebSocket.REGEXP_PROTOCOL_WS_START     = _.REGEXP_PROTOCOL_WS_START;
    WebSocket.REGEXP_SECURE_PROTOCOL_START = _.REGEXP_SECURE_PROTOCOL_START;
    WebSocket.REGEXP_SLASH_START           = _.REGEXP_SLASH_START;
    WebSocket.REGEXP_SLASH_END             = _.REGEXP_SLASH_END;

    WebSocket.config = _.configurator.call(WebSocket, WebSocket.DEFAULTS);

    WebSocket.Event = Event(WebSocket.NAMESPACE);

    WebSocket.Error = Error(WebSocket.NAMESPACE);

    WebSocket.Error.translate({
        'unsupported': "当前环境不支持 WebSocket",
        'initialized': "初始化 WebSocket 失败：{0}",
        'callback': "执行 WebSocket 的 {0} 时发生了错误：{1}",
        'ws_error': "WebSocket 发生了错误：{0}"
    });

    WebSocket.prototype = {
        setOption: _.optionSetter(WebSocket.DEFAULTS),
        getOption: _.optionGetter(),
        getOptions: _.optionsGetter(),
        getContext: function() {
            return this.__context__;
        },
        open: function(options, callback) {
            var _options = this.normalizeOptions(options);

            var self = this, errs, triggered_unsupported;

            var doOpen = function (options) {
                if (_.isArray(options)) {
                    $.each(options, function(i, option) {
                        doOpen(option);
                    });
                } else if (_.notNull(options)) {

                    var context = self.getContext() || options;

                    var tempProps = {__caller_name__: "ws.open"},
                        props = tempProps;

                    var err;

                    if (!_WebSocket && !triggered_unsupported) {
                        err = _.setPropsRecursive(
                            self.makeError('unsupported'),
                            props
                        );
                        triggered_unsupported = true;
                        calledCallback.call(context, err);
                    } else {
                        var __ws__;

                        try {
                            __ws__ = new _WebSocket(options.url);

                            if (!__ws__) return self;

                            self.__ws__.push(__ws__);

                            __ws__.onopen = function(event) {
                                __ws__.onerror = function(event) {
                                    onResponded(event, "error");
                                };
                                __ws__.onmessage = function(event) {
                                    onResponded(event);
                                };
                                __ws__.onclose = function(event) {
                                    //
                                };
                            };
                        } catch (e) {
                            __ws__ = _.__undef__;
                            err = _.setPropsRecursive(
                                self.makeError('initialized', [e.message], e),
                                props
                            );
                            calledCallback.call(context, err);
                        }
                    }

                    function onResponded(event, type) {
                        var resp;
                        try {
                            resp = JSON.parse(event.data);
                        } catch (e) {
                            resp = event.data;
                        }
                        var argsOrg = [
                            (type === "error")
                                ? _.setPropsRecursive(
                                    self.makeError('ws_error', [resp.message || resp]),
                                    props
                                )
                                : _.__undef__,
                            resp,
                            __ws__
                        ];
                        var args = [].concat(argsOrg);
                        if (_.isFunction(options.respFilter)) {
                            try {
                                args = options.respFilter.apply(context, argsOrg);
                                if (_.isArray(args)) {
                                    args[2] !== argsOrg[2] && (args[2] = argsOrg[2]);
                                } else {
                                    args = [].concat(argsOrg);
                                }
                            } catch (e) {
                                var cbErr = _.setPropsRecursive(
                                    self.makeError('callback', ['respFilter', e.message], e),
                                    props
                                );
                                args[0] = args[0] ? [cbErr].concat(args[0]) : cbErr;
                            }
                        }
                        calledCallback.apply(context, args);
                    }

                    function calledCallback() {
                        var args = _.__aslice.call(arguments), cbErr;

                        errs = _.__undef__;

                        concatError.call(this, args[0]);

                        if (_.isFunction(callback)) {
                            try {
                                callback.apply(this, args);
                                _.normalizeCallbackArgs(callback, args);
                            } catch (e) {
                                cbErr = _.setPropsRecursive(
                                    self.makeError('callback', ['callback', e.message], e),
                                    props
                                );
                                concatError(cbErr);
                            }
                        }

                        reportError.call(this);
                    }

                    function concatError(err) {
                        if (!_.isEmpty(err)) {
                            var context = this;
                            if (_.notNull(context) && _.isFunction(context.addError)) {
                                context.addError(err);
                            }
                            if (!errs) {
                                errs = err;
                            } else {
                                if (_.isArray(err)) {
                                    errs = err.concat(errs);
                                } else {
                                    errs = [err].concat(errs);
                                }
                            }
                        }
                    }

                    function reportError() {
                        var context = this, _errs;
                        if (_.notNull(context) && _.isFunction(context.sliceError)) {
                            _errs = context.sliceError(_.extend({NS: WebSocket.NAMESPACE}, tempProps));
                        } else {
                            _errs = errs;
                        }
                        if (!_.isEmpty(_errs)) {
                            WebSocket.Event.trigger('Error', _errs);
                        }
                    }
                }
            };

            doOpen(_options);

            return this;
        },
        close: function(ws) {
            if (validWs(ws)) {
                try {
                    ws.close();
                } catch (e) {}
                this.clear(ws);
            } else {
                var self = this, __ws__ = [].concat(this.__ws__);
                $.each(__ws__, function(i, ws) {
                    if (validWs(ws)) {
                        self.close(ws);
                    } else if (ws) {
                        self.clear(ws);
                    }
                });
            }
            function validWs(ws) {
                return ws && _.isFunction(ws.close);
            }
        },
        clear: function(ws) {
            if (ws) {
                var pos;
                if ((pos = _.inArray(ws, this.__ws__)) > -1) {
                    this.__ws__.splice(pos, 1);
                }
            } else if (_.isUndef(ws)) {
                this.__ws__.splice(0, this.__ws__.length);
            }
        },
        normalizeOptions: function(options) {
            var self = this;

            var normalize = function(option, level) {
                var obj;

                level = level || 0;

                if (level > 1000) return obj;

                if (_.isArray(option)) {
                    level = level + 1;
                    $.each(option, function(i, option) {
                        option = normalize(option, level);
                        if (option) {
                            obj = obj || [];
                            obj = obj.concat(option);
                        }
                    });
                } else {
                    if (option && option.__normalized__) return option;

                    obj = self.getOptions();

                    if (_.isPlainObject(option)) {
                        _.extend(true, obj, option);
                    } else {
                        _.extend(true, obj, {name: option ? _.trim(option) : _.__undef__});
                    }

                    if (!obj.url) {
                        if (obj.urls && obj.name && obj.mode) {
                            var urlOpt;
                            if (urlOpt = obj.urls[name]) {
                                obj.url = urlOpt[obj.mode];
                            }
                        }
                    }

                    delete obj.urls;

                    obj.url = _.trim(obj.url || obj.name);

                    if (!obj.url) {
                        return _.__undef__;
                    }

                    var replaceProtocol = function(url) {
                        url = url.replace(WebSocket.REGEXP_SECURE_PROTOCOL_START, "wss://");
                        url = url.replace(WebSocket.REGEXP_PROTOCOL_START, "ws://");
                        return url;
                    };

                    if (!WebSocket.REGEXP_PROTOCOL_WS_START.test(obj.url)) {
                        if (!WebSocket.REGEXP_PROTOCOL_START.test(obj.url)) {
                            // init base url
                            obj.base = obj.base || "/";
                            if (!WebSocket.REGEXP_SLASH_END.test(obj.base)) {
                                obj.base += "/";
                            }
                            if (!WebSocket.REGEXP_PROTOCOL_START.test(obj.base)) {
                                obj.base = History.getRootUrl() + obj.base.replace(WebSocket.REGEXP_SLASH_START, "");
                            }
                            // init url
                            obj.url = obj.url.replace(WebSocket.REGEXP_SLASH_START, "").replace(/\/{2,}/, "/");
                            if (obj.url.indexOf(obj.base) != 0) {
                                obj.url = obj.base + obj.url;
                            }
                        }
                        obj.url = replaceProtocol(obj.url);
                    }

                    delete obj.base;

                    _.def(obj, '__normalized__', true);
                }

                return obj;
            };

            return normalize(options);
        },
        makeError: function(id, option, originalError) {
            var errorMaker = this.__error_maker__, err;
            if (!errorMaker) {
                _.def(this, '__error_maker__', _.errorMaker(WebSocket.Error, this.getContext()));
                errorMaker = this.__error_maker__;
            }
            err = errorMaker.apply(this, arguments);
            return err;
        }
    };

    return WebSocket;
});