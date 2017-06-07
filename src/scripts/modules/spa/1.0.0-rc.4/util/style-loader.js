define('yfjs/spa/util/style-loader', ['../version', 'jquery', './helpers', './event', './error', './ajax'], function(Version, $, _, Event, Error, Ajax) {

    var REGEXP_PROTOCOL_START  = _.REGEXP_PROTOCOL_START,
        REGEXP_DSLASH_START    = _.REGEXP_DSLASH_START,
        REGEXP_SLASH_START     = _.REGEXP_SLASH_START,
        REGEXP_URL_IMPORT      = _.REGEXP_URL_IMPORT,
        REGEXP_QUOTA_START     = _.REGEXP_QUOTA_START,
        REGEXP_QUOTA_END       = _.REGEXP_QUOTA_END;

    var ROOT_URL = _.LOCAL_ROOT,
        DOMAIN = _.LOCAL_DOMAIN;

    var StyleLoader = function(options, context) {
        if (this instanceof StyleLoader) {
            // init options
            _.def(this, '__options__', _.extend(true, {}, StyleLoader.DEFAULTS, options));
            // init context
            _.def(this, '__context__', context);
        } else {
            return new StyleLoader(options, context);
        }
    };

    StyleLoader.NAMESPACE = "StyleLoader";

    StyleLoader.VERSION = Version(StyleLoader.NAMESPACE);

    StyleLoader.DEFAULTS = {
        /**
         * 是否开启缓存 {Boolean}
         * - 默认为 true
         */
        cache: true,
        /**
         * 请求远程样式文件时的配置项 {Object}
         */
        remote: {
            headers: {
                'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
            },
            dataType: "text"
        }
    };

    StyleLoader.Event = Event(StyleLoader.NAMESPACE);

    StyleLoader.Error = Error(StyleLoader.NAMESPACE);

    StyleLoader.Error.translate({
        'style_unfound': "找不到样式文件 {0}",
        'callback': "执行 StyleLoader 的 {0} 时发生了错误: {1}"
    });

    StyleLoader.config = _.configurator.call(StyleLoader, StyleLoader.DEFAULTS);

    // 样式文件缓存  { {fileUrl} : {fileContent} }
    StyleLoader.cache = {};

    // 默认远程样式文件请求对象
    StyleLoader.ajax = null;

    StyleLoader.load = function(filepath, callback) {
        var def = $.Deferred();

        filepath = _.trim(filepath);

        var context, self = this;

        try {
            context = this.__context__ || this || {};
        } catch (e) {
            context = {};
        }

        (function(def, filepath, callback, context) {

            if (_.isFunction(callback)) {
                def.done(function(err, res) {
                    try {
                        callback.apply(context, arguments);
                        _.normalizeCallbackArgs(callback, arguments);
                    } catch (e) {
                        StyleLoader.Event.trigger('CallbackError',
                            self.makeError('callback', ['loadCallback', e.message], e)
                        );
                    }
                });
            }

            var fileContent, options;

            if (self && self.__options__) {
                options = self.__options__;
            } else {
                options = StyleLoader.DEFAULTS;
            }

            if (options.cache && !_.isUndef(fileContent = StyleLoader.cache[filepath])) {
                def.resolve(_.__undef__, {filename: filepath, source: fileContent});
            } else {
                var fileUrl = normalizeFileUrl(filepath),
                    fileId = _.encodeIdFromURI(filepath);

                if (filepath.indexOf(ROOT_URL) == 0) {
                    filepath = filepath.substring(ROOT_URL.length - 1);
                } else {
                    filepath = fileUrl;
                }

                var domain = _.getDomain(fileUrl);

                if (domain && domain !== DOMAIN) {
                    var NS = context.NS || '',
                        stateName = _.isFunction(context.getState) ? context.getState('name') : '';
                    def.resolve(_.__undef__, {
                        filename: filepath,
                        html: (
                            '<link id="' + fileId + '" '+
                            (NS && stateName ?
                                'data-'+NS.toLowerCase()+'="'+stateName+'" ':''
                            ) +
                            'href="' + fileUrl + '" ' +
                            'rel="stylesheet" ' +
                            'type="text/css"' +
                            '/>'
                        )
                    });
                } else {

                    var posLastSlash = fileUrl.lastIndexOf('/'),
                        relativePath = fileUrl.substring(0, posLastSlash + 1);

                    var ajax, ajaxOpt;

                    if (options.remote) {
                        ajaxOpt = options.remote;
                    } else {
                        ajaxOpt = StyleLoader.DEFAULTS.remote;
                    }

                    if (context.ajax instanceof Ajax) {
                        ajax = context.ajax;
                    } else {
                        if (!StyleLoader.ajax) {
                            StyleLoader.ajax = new Ajax(StyleLoader.DEFAULTS.remote);
                        }
                        ajax = StyleLoader.ajax;
                    }

                    fileUrl = _.extend(true, {}, ajaxOpt, {url: fileUrl});

                    ajax.get(fileUrl, function(err, resp) {
                        if (err && _.isFunction(this.removeError)) {
                            this.removeError(err);
                        }
                        if (!err && !_.isUndef(resp)) {
                            fileContent = _.trim(resp);
                            fileContent = fileContent.replace(
                                REGEXP_URL_IMPORT,
                                function(word, path) {
                                    path = _.trim(path).replace(REGEXP_QUOTA_START, "").replace(REGEXP_QUOTA_END, "");
                                    if (REGEXP_DSLASH_START.test(path)) {
                                        path = _.LOCAL_PROTOCOL + path;
                                    }
                                    if (!REGEXP_PROTOCOL_START.test(path)) {
                                        if (REGEXP_SLASH_START.test(path)) {
                                            path = path.replace(REGEXP_SLASH_START, "");
                                            path = ROOT_URL + path;
                                        } else {
                                            path = relativePath + path;
                                        }
                                    }
                                    return 'url("' + path + '")';
                                }
                            );
                            // cache fileContent
                            if (options.cache) {
                                StyleLoader.cache[fileUrl] = fileContent;
                            }
                        } else if (err) {
                            err = self.makeError('style_unfound', [filepath], err)
                        }
                        def.resolve(err, {filename: filepath, source: fileContent});
                    });
                }
            }

            function normalizeFileUrl(filepath) {

                var path = _.trim(filepath),
                    query = {};

                var posQuery = filepath.lastIndexOf("?");
                if (posQuery > -1) {
                    path = filepath.substring(0, posQuery);
                    query = $.parseQuery(filepath);
                }

                filepath = _.getRequireUrl(path);

                if (!options.cache) {
                    _.extend(query, {bust: _.timestamp()});
                }

                query = $.param(query);

                filepath = path + (query ? '?' + query : '');

                return filepath;
            }
        })(def, filepath, callback, context);

        return def.promise();
    };

    StyleLoader.makeError = function() {
        return StyleLoader.Error.make.apply(StyleLoader.Error, arguments);
    };

    StyleLoader.prototype = {
        setOption: _.optionSetter(StyleLoader.DEFAULTS),
        getOption: _.optionGetter(),
        getOptions: _.optionsGetter(),
        getContext: function() {
            return this.__context__;
        },
        load: function(filepath, callback) {
            return StyleLoader.load.apply(this, arguments);
        },
        makeError: function(id, option, originalError) {
            var errorMaker = this.__error_maker__, err;
            if (!errorMaker) {
                _.def(this, '__error_maker__', _.errorMaker(StyleLoader.Error, this.getContext()));
                errorMaker = this.__error_maker__;
            }
            err = errorMaker.apply(this, arguments);
            err.level = StyleLoader.Error.LEVEL_CONSOLE;
            return err;
        }
    };

    return StyleLoader;
});