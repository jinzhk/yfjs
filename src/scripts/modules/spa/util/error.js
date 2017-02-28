define('yfjs/spa/util/error', ['../version', 'jquery', './helpers'], function(Version, $, _) {

    var Error = function(options) {
        if (this instanceof Error) {
            // init options
            if (_.notNull(options) && !_.isObject(options)) {
                options = {NS: _.trim(options)};
            }
            _.def(this, '__options__', _.extend({}, Error.DEFAULTS, options));
            // init errors cache
            _.def(this, '__errors__', {});
            // assign level
            for (var key in Error.LEVELS) {
                if (_.__hasOwn.call(Error.LEVELS, key))
                    _.def(this, key, Error.LEVELS[key], {
                        writable: false,
                        configurable: false
                    });
            }
        } else {
            return new Error(options);
        }
    };

    Error.NAMESPACE = "Error";

    Error.VERSION = Version(Error.NAMESPACE);

    /**
     * 错误级别
     * - -3  抛至错误页面的错误
     * - -2  抛至应用层的错误
     * - -1  当前模块自处理的错误
     * - 0   在控制台打印的错误
     */
    Error.LEVELS = {
        LEVEL_PAGE    : -3,
        LEVEL_APP     : -2,
        LEVEL_WIDGET  : -1,
        LEVEL_CONSOLE : 0
    };

    Error.DEFAULTS = {
        NS: "",
        level: Error.LEVELS.LEVEL_CONSOLE,
        args: _.__undef__,
        message: _.__undef__
    };

    Error.REGEXP_REST_PARAM = _.REGEXP_REST_PARAM;

    Error.prototype = {
        setOption: _.optionSetter(Error.DEFAULTS),
        getOption: _.optionGetter(),
        getOptions: _.optionsGetter(),
        make: function(id, option, originalError) {

            id = _.isEmpty(id) ? "unknown" : _.trim(id);

            option = _.extend({}, this.__options__, this.normalizeOption(option));

            if (_.isUndef(option.message)) {
                option.message = this.format(id, option.args);
            }

            if (originalError && _.isUndef(option.message)) {
                option.message = originalError.message;
            }

            if (_.isUndef(option.message)) {
                option.message = id;
            }

            var err = new ErrConstructor(option.message);

            err.type = id;
            err.NS = option.NS;
            err.level = option.level;

            if (_.notNull(originalError)) {
                err.originalError = originalError;
                if (!_.isUndef(originalError.stack)) {
                    err.stack = originalError.stack;
                }
            }

            return err;
        },
        normalizeOption: function(option) {
            var _option = {};

            if (_.isArray(option)) {
                _option.args = option;
            } else if (_.notNull(option)) {
                if (!_.isObject(option)) {
                    option = {message: _.trim(option)}
                } else if (!_.isUndef(option.level)) {
                    option.level = normalizeLevel(option.level);
                }
                _.extend(_option, option);
            }

            return _option;
        },
        translate: function(id, msg, formatter) {

            var that = this;

            var doTranslate = function(id, msg, formatter) {
                if (_.isString(msg) && !_.isEmpty(msg)) {
                    that.__errors__[id] = {
                        message: msg,
                        formatter: formatter
                    };
                }
            };

            if (!_.isEmpty(id)) {
                if (_.isObject(id)) {
                    var val;
                    for (var key in id) {
                        val = id[key];
                        if (_.notNull(val) && _.isObject(val)) {
                            doTranslate(key, val.message, val.formatter);
                        } else {
                            doTranslate(key, val);
                        }
                    }
                } else {
                    id = _.trim(id);
                    doTranslate(id, msg, formatter);
                }
            }
        },
        format: function(id, args) {
            if (_.isEmpty(id)) return '';

            id = _.trim(id);

            var errCache = this.__errors__[id], msg;

            if (errCache) {
                if (!_.isEmpty(args)) {
                    if (_.isFunction(errCache.formatter)) {
                        try {
                            msg = errCache.formatter.call(errCache.formatter, errCache.message, args);
                        } catch (e) {
                            msg = _.__undef__;
                        }
                    } else if (_.isString(errCache.message) && !_.isEmpty(errCache.message)) {
                        msg = errCache.message.replace(Error.REGEXP_REST_PARAM, function(word, key) {
                            key = _.trim(key);
                            return _.isUndef(args[key]) ? '' : args[key];
                        });
                    }
                }
                if (_.isUndef(msg) && _.notNull(errCache.message)) {
                    msg = _.trim(errCache.message);
                }
            }

            return msg;
        }
    };

    var ErrConstructor = _.window.Error || function(msg) {
        this.message = _.notNull(msg) ? _.trim(msg) : "";
    };

    function normalizeLevel(level) {
        var levelIndex;
        if (_.isNumber(level)) {
            if (level == Error.LEVELS.LEVEL_PAGE
                || level == Error.LEVELS.LEVEL_APP
                || level == Error.LEVELS.LEVEL_WIDGET
                || level == Error.LEVELS.LEVEL_CONSOLE
            ) {
                levelIndex = level;
            } else {
                levelIndex = Error.LEVELS.LEVEL_CONSOLE;
            }
        } else {
            level = level + '';
            if (/page$/i.test(level)) {
                levelIndex = Error.LEVELS.LEVEL_PAGE;
            } else if (/app$/i.test(level)) {
                levelIndex = Error.LEVELS.LEVEL_APP;
            } else if (/widget$/i.test(level)) {
                levelIndex = Error.LEVELS.LEVEL_WIDGET;
            } else {
                levelIndex = Error.LEVELS.LEVEL_CONSOLE;
            }
        }
        return levelIndex;
    }

    return Error;
});