define('yfjs/spa/util/ajax', ['../version', 'jquery', './helpers', './event', './error'], function(Version, $, _, Event, Error) {

    var JSON = _.JSON;

    var Ajax = function(options, context) {
        if (this instanceof Ajax) {
            // init options
            _.def(this, '__options__', _.extend(true, {}, Ajax.DEFAULTS, options));
            // init context
            _.def(this, '__context__', context);
            // 保存当前实例下已发送的 xhr 对象，以便销毁
            _.def(this, '__xhr__', []);
        } else {
            return new Ajax(options, context);
        }
    };

    Ajax.NAMESPACE = "Ajax";

    Ajax.VERSION = Version(Ajax.NAMESPACE);

    Ajax.DEFAULTS = {
        base: "/",
        headers: {
            'Accept': "application/json; charset=utf-8",
            'Content-Type': "application/json; charset=utf-8"
        },
        dataType: "json",
        /**
         * 返回数据的处理函数 {Function}
         * - 传入参数为 错误信息、请求返回的数据、当前xhr对象。this 指针指向当前的 context 配置项
         * - 必须返回一个数组，数组第一项为错误信息，第二项和第三项为新处理后的数据和xhr对象
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
         * 发送请求:
         * ajax.get('examples.get');
         * ajax.delete('examples.delete');
         */
        urls: {},
        /**
         * RESTful 接口地址中的动态参数 {Object|Array}
         * 例如：
         * url:  /api/example/page/{page}/{pageLen}
         * args: {page: 1, pageLen: 10}
         */
        args: _.__undef__
    };

    Ajax.REGEXP_PROTOCOL_START = _.REGEXP_PROTOCOL_START;
    Ajax.REGEXP_DSLASH_START   = _.REGEXP_DSLASH_START;
    Ajax.REGEXP_SLASH_START    = _.REGEXP_SLASH_START;
    Ajax.REGEXP_SLASH_END      = _.REGEXP_SLASH_END;
    Ajax.REGEXP_REST_PARAM     = _.REGEXP_REST_PARAM;

    Ajax.REGEXP_JSON_TEXT = /text\/json/ig;

    Ajax.config = _.configurator.call(Ajax, Ajax.DEFAULTS);

    Ajax.Event = Event(Ajax.NAMESPACE);

    Ajax.Error = Error(Ajax.NAMESPACE);

    Ajax.Error.translate({
        'callback': "执行 Ajax 的 {0} 时发生了错误：{1}",
        'param_invalid': "执行 Ajax 时发生了错误：缺少请求地址参数"
    });

    Ajax.prototype = {
        setOption: _.optionSetter(Ajax.DEFAULTS),
        getOption: _.optionGetter(),
        getOptions: _.optionsGetter(),
        getContext: function() {
            return this.__context__;
        },
        /**
         * 发送Ajax请求
         * @param options   {Object|Array}  配置项
         * @param data      {Object}        请求参数
         * @param callback  {Function}      默认回调函数
         */
        send: function(options, data, callback) {
            // filter args
            if (_.isFunction(data)) {
                callback = data; data = null;
            }

            var self = this;

            return createAjax.call(
                this,
                options, data,
                function(defPromise, callbacks, context, errTag) {

                    errTag = {__caller_name__: errTag || "ajax.send"};

                    defPromise.done(function() {

                        var args = Array.prototype.slice.call(arguments);

                        var errConcatRes = concatError([], args[0]),
                            errs = errConcatRes.errs,
                            hasAbortErr = errConcatRes.bAbortErr;

                        var callSuccess = function(fn, i) {
                            if (_.isFunction(fn)) {
                                var cbErr;
                                if (i > -1 && args[i] && !args[i][0]) {
                                    try {
                                        fn.call(context[i], args[i][1], "success", args[i][2]);
                                    } catch (e) {
                                        cbErr = self.normalizeError(
                                            self.makeError('callback', ['success ('+i+') callback', e.message], e)
                                        );
                                        errConcatRes = concatError(errs, cbErr);
                                        errs = errConcatRes.errs;
                                    }
                                } else if (i == -1 && !args[0]) {
                                    try {
                                        fn.call(context, args[1], "success", args[2]);
                                    } catch (e) {
                                        cbErr = self.normalizeError(
                                            self.makeError('callback', ['success callback', e.message], e)
                                        );
                                        errConcatRes = concatError(errs, cbErr);
                                        errs = errConcatRes.errs;
                                    }
                                }
                            }
                        };

                        var callError = function(fn, i) {
                            if (_.isFunction(fn)) {
                                var cbErr;
                                if (i > -1 && args[i] && args[i][0]) {
                                    try {
                                        fn.call(context[i], args[i][2], args[i][2].statusText || "error", args[i][1]);
                                    } catch (e) {
                                        cbErr = self.normalizeError(
                                            self.makeError('callback', ['error ('+i+') callback', e.message], e)
                                        );
                                        errConcatRes = concatError(errs, cbErr);
                                        errs = errConcatRes.errs;
                                    }
                                } else if (i == -1 && args[0]) {
                                    try {
                                        fn.call(context, args[2], args[2].statusText || "error", args[1]);
                                    } catch (e) {
                                        cbErr = self.normalizeError(
                                            self.makeError('callback', ['error callback', e.message], e)
                                        );
                                        errConcatRes = concatError(errs, cbErr);
                                        errs = errConcatRes.errs;
                                    }
                                }
                            }
                        };

                        var callComplete = function(fn, i) {
                            if (_.isFunction(fn)) {
                                var multiSuccess = (i > -1 && args[i] && !args[i][0]),
                                    singleSuccess = (i == -1 && !args[0]);
                                var multiError = (i > -1 && args[i] && args[i][0]),
                                    singleError = (i == -1 && args[0]);
                                var cbErr;
                                if (multiSuccess || multiError) {
                                    try {
                                        if (multiSuccess) {
                                            fn.call(context[i], args[i][1], "success", args[i][2]);
                                        } else {
                                            fn.call(context[i], args[i][2], args[i][2].statusText || "error", args[i][1]);
                                        }
                                    } catch (e) {
                                        cbErr = self.normalizeError(
                                            self.makeError('callback', ['complete ('+i+') callback', e.message], e)
                                        );
                                        errConcatRes = concatError(errs, cbErr);
                                        errs = errConcatRes.errs;
                                    }
                                } else if (singleSuccess || singleError) {
                                    try {
                                        if (singleSuccess) {
                                            fn.call(context, args[1], "success", args[2]);
                                        } else {
                                            fn.call(context, args[2], args[2].statusText || "error", args[1]);
                                        }
                                    } catch (e) {
                                        cbErr = self.normalizeError(
                                            self.makeError('callback', ['complete callback', e.message], e)
                                        );
                                        errConcatRes = concatError(errs, cbErr);
                                        errs = errConcatRes.errs;
                                    }
                                }
                            }
                        };

                        // 调用所有自定义的 success 回调方法
                        if (_.isArray(callbacks.success)) {
                            $.each(callbacks.success, function(i, fn) {
                                callSuccess(fn, i);
                            });
                        } else {
                            callSuccess(callbacks.success, -1);
                        }

                        // 调用所有自定义的 error 回调方法
                        if (_.isArray(callbacks.error)) {
                            $.each(callbacks.error, function(i, fn) {
                                callError(fn, i);
                            });
                        } else {
                            callError(callbacks.error, -1);
                        }

                        // 调用所有自定义的 complete 回调方法
                        if (_.isArray(callbacks.complete)) {
                            $.each(callbacks.complete, function(i, fn) {
                                callComplete(fn, i);
                            });
                        } else {
                            callComplete(callbacks.complete, -1);
                        }

                        // 不存在中断的 ajax 错误时，调用默认的回调方法
                        if (!hasAbortErr && _.isFunction(callback)) {
                            try {
                                callback.apply(self.getContext(), args);
                                _.normalizeCallbackArgs(callback, args);
                            } catch (e) {
                                var cbErr = self.normalizeError(
                                    self.makeError('callback', ['callback', e.message], e)
                                );
                                errConcatRes = concatError(errs, cbErr);
                                errs = errConcatRes.errs;
                            }
                        }

                        errs = sliceError(errs);

                        if (!_.isEmpty(errs)) {
                            Ajax.Event.trigger('Error', [errs]);
                        }

                        function concatError(errs, err, level) {
                            var bAbortErr = false;

                            level = level || 0;

                            if (level > 1000) return bAbortErr;

                            if (_.isArray(err)) {
                                level = level + 1;
                                var concatRes;
                                for (var i=0; i<err.length; i++) {
                                    concatRes = concatError(errs, err[i], level);
                                    errs = concatRes.errs;
                                    bAbortErr = bAbortErr || concatRes.bAbortErr;
                                }
                            } else if (_.notNull(err)) {
                                bAbortErr = (err.textStatus === "abort" && err.xhr && err.xhr.__abort_err__ === false);
                                if (!bAbortErr) {
                                    _.setPropsRecursive(err, errTag);
                                    if (err.context && _.isFunction(err.context.addError)) {
                                        err.context.addError.call(err.context, err);
                                    }
                                    errs = _.concatError(errs, err);
                                }
                            }

                            return {errs: errs, bAbortErr: bAbortErr};
                        }

                        function sliceError(err, level) {
                            var _errs = [];

                            var filter = _.extend({NS: Ajax.NAMESPACE}, errTag);

                            level = level || 0;

                            if (level > 1000) return err;

                            if (_.isArray(err)) {
                                for (var i=0; i<err.length; i++) {
                                    _errs = _errs.concat(
                                        sliceError(err[i], level)
                                    )
                                }
                            } else if (_.notNull(err)) {
                                if (err.context && _.isFunction(err.context.getError)) {
                                    if (
                                        _.inError(
                                            _.sliceError(err.context.getError(), filter),
                                            err
                                        ) > -1
                                    ) {
                                        _errs.push(err);
                                    }
                                } else {
                                    _errs.push(err);
                                }
                            }

                            return _errs;
                        }

                    });
                }
            );
        },

        get: function(options, data, callback) {
            var defaults = {type: "GET", __caller_name__: "ajax.get"};
            if (_.isFunction(data)) {
                callback = data; data = null;
            }
            return this.send(this.normalizeOptions(options, defaults), data, callback);
        },

        post: function(options, data, callback) {
            var defaults = {type: "POST", __caller_name__: "ajax.post"};
            if (_.isFunction(data)) {
                callback = data; data = null;
            }
            return this.send(this.normalizeOptions(options, defaults), data, callback);
        },

        postJSON: function(options, data, callback) {
            var defaults = {type: "POST", contentType: "text/json", __caller_name__: "ajax.postJSON"};
            if (_.isFunction(data)) {
                callback = data; data = null;
            }
            return this.send(this.normalizeOptions(options, defaults), data, callback);
        },

        put: function(options, data, callback) {
            var defaults = {type: "PUT", __caller_name__: "ajax.put"};
            if (_.isFunction(data)) {
                callback = data; data = null;
            }
            return this.send(this.normalizeOptions(options, defaults), data, callback);
        },

        putJSON: function(options, data, callback) {
            var defaults = {type: "PUT", contentType: "text/json", __caller_name__: "ajax.putJSON"};
            if (_.isFunction(data)) {
                callback = data; data = null;
            }
            return this.send(this.normalizeOptions(options, defaults), data, callback);
        },

        delete: function(options, data, callback) {
            var defaults = {type: "DELETE", __caller_name__: "ajax.delete"};
            if (_.isFunction(data)) {
                callback = data; data = null;
            }
            return this.send(this.normalizeOptions(options, defaults), data, callback);
        },

        head: function(options, data, callback) {
            var defaults = {type: "HEAD", dataType: "text", __caller_name__: "ajax.head"};
            if (_.isFunction(data)) {
                callback = data; data = null;
            }
            return this.send(this.normalizeOptions(options, defaults), data, callback);
        },

        normalizeOptions: function(options, overrides) {
            var self = this;

            var normalizeOption = function(option, override, i, level) {
                var obj;

                level = level || 0;

                if (level > 1000) return obj;

                i = i || 0;

                if (_.isArray(option)) {
                    level = level + 1;
                    $.each(option, function(i, option) {
                        option = normalizeOption(option, override, i, level);
                        if (option) {
                            obj = obj || [];
                            obj = obj.concat(option);
                        }
                    });
                } else {
                    if (option && option.__normalized__) return option;

                    obj = self.getOptions();

                    if (_.isArray(override)) {
                        override = override[i];
                    }

                    if (!_.isPlainObject(override)) {
                        override = {name: override ? _.trim(override) : _.__undef__};
                    }

                    if (_.isPlainObject(option)) {
                        _.extend(true, obj, option, override);
                    } else {
                        _.extend(true, obj, {name: option ? _.trim(option) : _.__undef__}, override);
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

                    if (_.isEmpty(obj.url)) {
                        return _.__undef__;
                    }

                    // replace RESTful args
                    obj.args = obj.args || {};
                    obj.url = obj.url.replace(Ajax.REGEXP_REST_PARAM, function(word, key) {
                        key = _.trim(key);
                        return _.isUndef(obj.args[key]) ? '' : obj.args[key];
                    });
                    delete obj.args;

                    if (Ajax.REGEXP_DSLASH_START.test(obj.url)) {
                        obj.url = _.LOCAL_PROTOCOL + obj.url;
                    }

                    if (!Ajax.REGEXP_PROTOCOL_START.test(obj.url)) {

                        obj.url = obj.url.replace(Ajax.REGEXP_SLASH_START, "");

                        obj.base = obj.base || "/";

                        if (!Ajax.REGEXP_SLASH_END.test(obj.base)) {
                            obj.base += "/";
                        }

                        if (!Ajax.REGEXP_PROTOCOL_START.test(obj.base) && !Ajax.REGEXP_SLASH_START.test(obj.base)) {
                            obj.base = "/" + obj.base;
                        }

                        if (obj.url.indexOf(obj.base) != 0) {
                            obj.url = obj.base + obj.url;
                        }
                    }

                    delete obj.base;

                    _.def(obj, '__normalized__', true);

                    return _.isEmpty(obj.url) ? _.__undef__ : obj;
                }

                return obj;
            };

            return normalizeOption(options, overrides);
        },

        normalizeError: function(err, xhr, level) {
            if (!err) return err;

            level = level || 0;

            if (level > 1000) return err;

            if (_.isArray(err)) {
                level = level + 1;
                for (var i=0; i<err.length; i++) {
                    err[i] = this.normalizeError(err[i], xhr, level);
                }
            } else {
                if (_.notNull(xhr)) {
                    err.xhr = xhr;
                    err.status = xhr.status;
                    err.textStatus = xhr.textStatus;
                }
                err.context = this.getContext();
            }

            return err;
        },
        /**
         * 终止异步请求
         * @param xhr  要终止的异步请求对象。可选。不使用此参数将终止所有正在执行的异步请求
         * @param bErr {Boolean} 设为 false 时不触发 abort 类型错误，且不执行回调方法
         */
        abort: function(xhr, bErr) {
            if (_.isBoolean(xhr)) {
                bErr = xhr;
                xhr = _.__undef__;
            }
            if (validXhr(xhr)) {
                if (bErr === false) {
                    _.def(xhr, '__abort_err__', false);
                }
                xhr.abort();
                this.clear(xhr);
            } else {
                var self = this, __xhr__ = [].concat(this.__xhr__);
                $.each(__xhr__, function(i, xhr) {
                    if (validXhr(xhr)) {
                        self.abort(xhr, bErr);
                    } else if(xhr) {
                        self.clear(xhr);
                    }
                });
            }
            function validXhr(xhr) {
                return xhr && _.isFunction(xhr.abort);
            }
        },
        clear: function(xhr) {
            if (xhr) {
                var pos;
                if ((pos = _.inArray(xhr, this.__xhr__)) > -1) {
                    this.__xhr__.splice(pos, 1);
                }
            } else if (_.isUndef(xhr)) {
                this.__xhr__.splice(0, this.__xhr__.length);
            }
        },
        makeError: function(id, option, originalError) {
            var errorMaker = this.__error_maker__, err;
            if (!errorMaker) {
                _.def(this, '__error_maker__', _.errorMaker(Ajax.Error, this.getContext()));
                errorMaker = this.__error_maker__;
            }
            err = errorMaker.apply(this, arguments);
            return err;
        }
    };

    function createAjax(options, data, callback) {
        options = this.normalizeOptions(options);

        if (_.isFunction(data)) {
            callback = data; data = null;
        }

        var self = this, def = $.Deferred();

        var callbacks = {}, context, len = 0, errTag;

        if (_.isArray(options)) {
            var defs = [];
            $.each(options, function(i, option) {
                createAjax.call(self, option, data, function(defPromise, _callbacks, _context) {
                    defs.push(defPromise);
                    if (_.isFunction(_callbacks.success)) {
                        callbacks.success = callbacks.success || [];
                        callbacks.success.push(_callbacks.success);
                    }
                    if (_.isFunction(_callbacks.error)) {
                        callbacks.error = callbacks.error || [];
                        callbacks.error.push(_callbacks.error);
                    }
                    if (_.isFunction(_callbacks.complete)) {
                        callbacks.complete = callbacks.complete || [];
                        callbacks.complete.push(_callbacks.complete);
                    }
                    context = context || [];
                    context.push(_context);
                    len ++;
                });
                errTag = option.__caller_name__;
            });
            (function(def, defs) {
                $.when.apply($.when, defs).done(function() {
                    if (defs.length > 1) {
                        var _args = Array.prototype.slice.call(arguments),
                            args = [], err, resp, xhr;
                        $.each(_args, function(i, arg) {
                            if (arg[0]) {
                                err = err || new Array(defs.length);
                                err[i] = arg[0];
                            }
                            if (!_.isUndef(arg[1])) {
                                resp = resp || new Array(defs.length);
                                resp[i] = arg[1];
                            }
                            if (arg[2]) {
                                xhr = xhr || new Array(defs.length);
                                xhr[i] = arg[2];
                            }
                        });
                        args.push(err, resp, xhr);
                        def.resolve.apply(def.resolve, args);
                    } else {
                        def.resolve.apply(def.resolve, arguments);
                    }
                });
            })(def, defs);
        } else if (options) {
            if (_.notNull(data)) {
                if (_.otype(data) !== _.otype(options.data)) {
                    options.data = data;
                } else {
                    if (_.isArray(data)) {
                        options.data = data.concat(options.data);
                    } else if (_.isObject(data)) {
                        options.data = _.extend({}, options.data, data);
                    } else {
                        options.data = data;
                    }
                }
            }
            // init json text data
            if (Ajax.REGEXP_JSON_TEXT.test(options.contentType)) {
                options.contentType = options.contentType.replace(Ajax.REGEXP_JSON_TEXT, "application/json");
                data = options.data;
                if (_.notNull(data) && _.isObject(data)) {
                    try {
                        options.data = JSON.stringify(data);
                    } catch (e) {
                        options.data = data;
                    }
                }
            }
            // normalize url
            var posQuery = options.url.lastIndexOf("?");
            if (posQuery > -1) {
                try {
                    var queryParams = $.parseQuery(options.url),
                        queryUrl = options.url.substring(0, posQuery);
                    queryUrl += ("?" + $.param(queryParams));
                    options.url = queryUrl;
                } catch (e) {}
            }
            if (options.success) {
                callbacks.success = options.success;
                delete options.success;
            }
            if (options.error) {
                callbacks.error = options.error;
                delete options.error;
            }
            if (options.complete) {
                callbacks.complete = options.complete;
                delete options.complete;
            }
            context = options.context || options;
            (function(self, context, options) {
                var __xhr__ = $.ajax(options);

                self.__xhr__.push(__xhr__);

                __xhr__.then(function(resp, textStatus, xhr) {
                    // clear xhr
                    self.clear(__xhr__);
                    // init xhr
                    xhr.options = _.extend({}, options);
                    xhr.textStatus = textStatus;
                    // init resp
                    var args = [_.__undef__, resp, xhr];
                    if (_.isFunction(options.respFilter)) {
                        try {
                            args = options.respFilter.apply(context, [_.__undef__, resp, xhr]);
                            if (_.isArray(args)) {
                                args[2] !== xhr && (args[2] = xhr);
                            } else {
                                args = [_.__undef__, resp, xhr];
                            }
                        } catch (e) {
                            args = [self.makeError('callback', ['respFilter', e.message], e), resp, xhr];
                        }
                    }
                    args[0] = self.normalizeError(args[0], xhr);

                    def.resolve.apply(def.resolve, args);
                }, function(xhr, textStatus, errorThrown) {
                    // clear xhr
                    self.clear(__xhr__);

                    // init xhr
                    xhr.options = _.extend({}, options);
                    xhr.textStatus = textStatus;

                    // init resp
                    var resp;
                    if (textStatus === "abort") {
                        resp = _.__undef__;
                    } else {
                        resp = xhr.responseText;
                    }

                    // init error
                    var err = self.makeError('ajax', (xhr.status || 500) + ' / ' + (errorThrown || textStatus || "unknown"));

                    var _options = self.__options__ || {},
                        xhrOption = xhr.options || {};

                    if (err.message && xhrOption.url) {
                        var url = xhrOption.url;
                        if (url.indexOf(_options.base) == 0) {
                            url = url.substring(_options.base.length - 1) || url;
                        }
                        var ends = ' - ' + url;
                        if (err.message.indexOf(ends) != (err.message.length - ends.length)) {
                            err.message += ends;
                        }
                    }

                    var args = [err, resp, xhr];

                    args[0] = err = self.normalizeError(args[0], xhr);

                    if (!_.isUndef(resp)) {
                        try {
                            resp = JSON.parse(resp);
                        } catch (e) {
                            resp = xhr.responseText;
                        }
                        args[1] = resp;
                    }
                    if (_.isFunction(options.respFilter)) {
                        try {
                            args = options.respFilter.apply(context, args);
                            if (_.isArray(args)) {
                                args[2] !== xhr && (args[2] = xhr);
                            } else {
                                args = [err, resp, xhr];
                            }
                        } catch (e) {
                            args = [
                                self.makeError('callback', ['respFilter', e.message], e),
                                resp, xhr
                            ];
                        }
                        args[0] = self.normalizeError(args[0], xhr);
                    }

                    def.resolve.apply(def.resolve, args);
                });
            })(self, context, options);

            errTag = options.__caller_name__;

            len ++;
        } else {
            def.resolve(
                self.normalizeError(
                    self.makeError('param_invalid')
                )
            );
        }

        var defPromise = def.promise();

        if (_.isFunction(callback)) {
            callback.call({length: len}, defPromise, callbacks, context, errTag);
        }

        return defPromise;
    }

    return Ajax;
});