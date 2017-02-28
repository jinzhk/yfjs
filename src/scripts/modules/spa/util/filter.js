define('yfjs/spa/util/filter', [
    '../version', './helpers', './path-wildcard-compiler', './error', './event'
], function(Version, _, PathWildcardCompiler, Error, Event) {

    var Filter = function(options, context) {
        if (this instanceof Filter) {
            // init options
            if (_.notNull(options) && !_.isObject(options)) {
                options = {name: _.trim(options)};
            }
            _.def(this, '__options__', _.extend({}, Filter.DEFAULTS, options));

            this.setOption('name', _.trim(this.getOption('name')));

            if (!_.isFunction(this.getOption('access'))) {
                this.setOption('access', Filter.DEFAULTS.access);
            }

            if (!_.isFunction(this.getOption('do'))) {
                this.setOption('do', Filter.DEFAULTS.do);
            }

            // init
            _.def(this, 'id', _.increaseId(Filter.ID), {
                writable: false,
                configurable: false
            });

            _.def(this, '__context__', context);

            var name = this.getOption('name');

            if (_.isEmpty(name)) {
                name = Filter.NAMESPACE.toLowerCase() + '-' + this.id;
            }

            _.def(this, 'name', name, {
                writable: false,
                configurable: false
            });

            var i, path, pathRegex;

            var includes = _.normalizeArrOption(this.getOption('includes'));

            for (i=0; i<includes.length; i++) {
                path = includes[i];
                if (!(path instanceof RegExp)) {
                    pathRegex = PathWildcardCompiler.compilePathName(path);
                    if (pathRegex) {
                        includes[i] = pathRegex;
                    }
                }
            }

            _.def(this, 'includes', includes, {
                writable: false,
                configurable: false
            });

            var excludes = _.normalizeArrOption(this.getOption('excludes'));

            for (i=0; i<excludes.length; i++) {
                path = excludes[i];
                if (!(path instanceof RegExp)) {
                    pathRegex = PathWildcardCompiler.compilePathName(path);
                    if (pathRegex) {
                        excludes[i] = pathRegex;
                    }
                }
            }

            _.def(this, 'excludes', excludes, {
                writable: false,
                configurable: false
            });
        } else {
            return new Filter(options, context);
        }
    };

    Filter.NAMESPACE = 'Filter';

    Filter.VERSION = Version(Filter.NAMESPACE);

    Filter.DEFAULTS = {
        name: '',
        access: _.returnTrue,
        do: _.noop,
        includes: [],
        excludes: []
    };

    Filter.Event = Event(Filter.NAMESPACE);

    Filter.Error = Error(Filter.NAMESPACE);

    Filter.Error.translate({
        'callback': "执行过滤器 {0} 的 {1} 操作时发生了错误: {2}"
    });

    Filter.ID = 0;

    Filter.prototype = {
        setOption: _.optionSetter(Filter.DEFAULTS),
        getOption: _.optionGetter(),
        getOptions: _.optionsGetter(),
        getContext: function() {
            return this.__context__;
        },
        doFilter: function(path) {

            if (this.exclude(path)) return true;

            var options = this.__options__ || {}

            var result = true, err;

            if (_.isFunction(options.access)) {
                try {
                    result = options.access.call(this.getContext() || this, path, this);
                } catch (e) {
                    err = this.makeError('callback', [this.name, 'access', e.message], e);
                }
            }

            if (err) {
                Filter.Event.trigger('Error', err);
                return false;
            }

            if (!result && _.isFunction(options.do)) {
                try {
                    options.do.call(this.getContext() || this, path, this);
                } catch (e) {
                    err = this.makeError('callback', [this.name, 'do', e.message], e);
                }
            }

            if (err) {
                Filter.Event.trigger('Error', err);
                return false;
            }

            return result;
        },
        include: function(path) {
            var res = false;

            if (!_.notNull(path)) return res;

            var i, exclude = false, regex;

            for (i=0; i<this.excludes.length; i++) {
                regex = this.excludes[i];
                if (
                    (regex instanceof RegExp && regex.test(path))
                    || regex === path
                ) {
                    exclude = true;
                    res = false;
                    break;
                }
            }

            if (!exclude) {
                for (i=0; i<this.includes.length; i++) {
                    regex = this.includes[i];
                    if (
                        (regex instanceof RegExp && regex.test(path))
                        || regex === path
                    ) {
                        res = true;
                        break;
                    }
                }
            }

            return res;
        },
        exclude: function(path) {
            var res = true;

            if (!_.notNull(path)) return res;

            res = this.include(path);

            return !res;
        },
        makeError: function(id, option, originalError) {
            var errorMaker = this.__error_maker__, err;
            if (!errorMaker) {
                _.def(this, '__error_maker__', _.errorMaker(Filter.Error, this.getContext()));
                errorMaker = this.__error_maker__;
            }
            err = errorMaker.apply(this, arguments);
            err.level= Filter.Error.LEVEL_PAGE;
            return err;
        }
    };

    Filter.pathMatch = function(path, pathRegexStr) {
        if (!_.notNull(path)) return null;

        path = _.trim(path);

        var pathRegex;

        if (pathRegexStr instanceof RegExp) {
            pathRegex = pathRegexStr;
        } else {
            pathRegexStr += '';
            pathRegex = PathWildcardCompiler.compilePathName(pathRegexStr);
        }

        return _.notNull(pathRegex) ? path.match(pathRegex) : null;
    };

    Filter.pathMatches = function(path, pathRegexStr) {
        if (!_.notNull(path)) return false;

        path = _.trim(path);

        var pathRegex;

        if (pathRegexStr instanceof RegExp) {
            pathRegex = pathRegexStr;
        } else {
            pathRegexStr += '';
            pathRegex = PathWildcardCompiler.compilePathName(pathRegexStr);
            if (!pathRegex) {
                pathRegex = pathRegexStr;
            }
        }

        return pathRegex instanceof RegExp ? pathRegex.test(path) : pathRegex === path;
    };

    return Filter;
});