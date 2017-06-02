define('yfjs/spa/ui/loading', [
    '../version', 'jquery', '../util/helpers', '../util/error', '../util/event'
], function(Version, $, _, Error, Event) {

    var Loading = function(options, context) {
        if (this instanceof Loading) {
            // init options
            if (_.notNull(options) && !_.isObject(options)) {
                options = {type: _.trim(options)};
            }
            _.def(this, '__options__', _.extend({}, Loading.DEFAULTS, options));

            this.setOption('type', _.trim(this.getOption('type')));

            // init
            options = this.__options__ || {};

            _.def(this, '__context__', context);

            var id = _.isEmpty(options.id) ? (
                _.isEmpty(options.type) ? '' : options.type
            ) : options.id;

            _.def(this, 'id', id, {
                writable: false,
                configurable: false
            });

            _.def(this, 'containerId',
                Loading.CONTAINER_ID + (_.isEmpty(id) ? '' : '-' + id),
                {
                    writable: false,
                    configurable: false
                }
            );

            _.def(this,
                'className',
                Loading.CLASSNAME + (_.isEmpty(options.type) ? '' : '-' + options.type),
                {
                    writable: false,
                    configurable: false
                }
            );
        } else {
            return new Loading(options, context);
        }
    };

    Loading.NAMESPACE = "Loading";

    Loading.VERSION = Version(Loading.NAMESPACE);

    Loading.CONTAINER_ID = 'app-loader';

    Loading.CLASSNAME = "loading";

    Loading.DEFAULTS = {
        type: '',
        id: '',
        container: 'body',
        html: '<div class="loader"></div>',
        ready: function($container) {
            $(".loader", $container).loader();
            return this;
        },
        destroy: function($container) {
            $(".loader", $container).loader('destroy');
            return this;
        }
    };

    Loading.Error = Error(Loading.NAMESPACE);

    Loading.Error.translate({
        'callback': "执行 Loading - {0} 的 {1} 操作时发生了错误: {2}"
    });

    Loading.Event = Event(Loading.NAMESPACE);

    Loading.prototype = {
        setOption: _.optionSetter(Loading.DEFAULTS),
        getOption: _.optionGetter(),
        getOptions: _.optionsGetter(),
        getContext: function() {
            return this.__context__;
        },
        getContainer$: function() {
            var $container;

            var container = this.getOption('container') || _.docBody;
            try {
                $container = $(container);
                if (!$container.length) {
                    $container = $(_.docBody);
                }
            } catch (e) {
                $container = $(_.docBody);
            }

            return $container;
        },
        ready: function() {
            var options = this.__options__ || {},
                $container = this.getContainer$();

            $container.addClass(this.className);

            var html;

            if (_.isFunction(options.html)) {
                try {
                    html = options.html.call(this.getContext() || this, this);
                } catch (e) {
                    Loading.Event.trigger('Error',
                        this.makeError('callback', [options.type, 'calledHtmlOption', e.message], e)
                    );
                    return false;
                }
            } else {
                html = options.html;
            }

            html = _.trim(html);

            var loadingSelector = '#' + this.containerId,
                $loadingContainer = $container.children(loadingSelector);

            if (!$loadingContainer.length) {
                html = Loading.wrap(this.id, options.type)(html);
                $container.prepend(html);
                $loadingContainer = $container.children(loadingSelector);
            } else {
                $loadingContainer.html(html);
            }

            if (_.isFunction(options.ready)) {
                try {
                    options.ready.call(this.getContext() || this, $loadingContainer, this);
                } catch (e) {
                    Loading.Event.trigger('Error',
                        this.makeError('callback', [options.type, 'ready', e.message], e)
                    );
                    return false;
                }
            }
        },
        destroy: function() {
            var options = this.__options__ || {},
                $container = this.getContainer$(),
                loadingSelector = "#" + this.containerId,
                $loadingContainer = $container.children(loadingSelector);

            var err;

            if (_.isFunction(options.destroy)) {
                try {
                    options.destroy.call(this.getContext() || this, $loadingContainer, this);
                } catch (e) {
                    err = this.makeError('callback', [options.type, 'destroy', e.message], e);
                }
            }

            $container.removeClass(this.className);

            $loadingContainer.remove();

            if (err) {
                Loading.Event.trigger('Error', err);
                return false;
            }
        },
        makeError: function(id, option, originalError) {
            var errorMaker = this.__error_maker__, err;
            if (!errorMaker) {
                _.def(this, '__error_maker__', _.errorMaker(Loading.Error, this.getContext()));
                errorMaker = this.__error_maker__;
            }
            err = errorMaker.apply(this, arguments);
            return err;
        }
    };

    Loading.wrap = function(id, type) {

        id = Loading.CONTAINER_ID + (_.isEmpty(id) ? '' : '-' + id);
        type = Loading.CONTAINER_ID + (_.isEmpty(type) ? '' : '-' + type);

        return function(html) {
            var wrapper = (
                '<div class="' + type + '" id="' + id + '"></div>'
            );

            var $wrapper = $(wrapper);

            $wrapper.html(html || '');

            return _.html2str($wrapper) || wrapper;
        };
    };

    return Loading;
});