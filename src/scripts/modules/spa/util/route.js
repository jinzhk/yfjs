define('yfjs/spa/util/route', [
    '../version', './history', 'jquery', './helpers', './event', './error', './widget', './layout', './view', './template'
], function(
    Version, History, $, _, Event, Error, Widget, Layout, View, Template
) {

    History.init({html4Mode: true, disableSuid: true});

    var Route = {};

    Route.NAMESPACE = "Route";

    Route.VERSION = Version(Route.NAMESPACE);

    Route.Event = Event(Route.NAMESPACE);

    Route.Error = Error(Route.NAMESPACE);

    Route.Error.translate({
        'callback': "执行 Route 的 {0} 时发生了错误: {1}"
    });

    _.def(Layout, 'INCLUDE_WIDGET', View);

    Route.Layout = Layout;

    Route.View = View;

    Route.Callback = _.__undef__;

    Route.OriginalTitle = (function() {
        var title;
        try {
            title = _.document.getElementsByTagName('title')[0].innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
        } catch (e) {
            title = "";
        }
        return title;
    })();

    Route.setTitle = function(newTitle) {
        try {
            newTitle = newTitle || Route.OriginalTitle || _.document.location.href;
        } catch (e) {
            newTitle = "";
        }
        if (newTitle) {
            newTitle = String(newTitle);
            // Apply
            try {
                _.document.getElementsByTagName('title')[0].innerHTML = newTitle.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
            }
            catch ( Exception ) { }
            _.document.title = newTitle;
        }
        return Route;
    };

    // 缓存最近一次加载的 View 实例
    _.def(Route, 'LAST_VIEW', null, {
        writable: false,
        configurable: true
    });

    // 缓存最近一次加载的 Layout 实例
    _.def(Route, 'LAST_LAYOUT', null, {
        writable: false,
        configurable: true
    });

    Route.load = function(state, callback) {
        var def = $.Deferred();

        _.disposeDeferred(Route.load);

        _.assignDeferred(Route.load, def);

        Route.Event.trigger('Loading');

        def.done(function(err, res) {
            // unbinds
            View.Event.unbind('CallbackError');
            Layout.Event.unbind('CallbackError');
            // loaded
            var viewInst = res && res.view ? res.view.getInstance() : _.__undef__;
            if (viewInst && viewInst.context === viewInst.rootContext) {
                // update state
                var statechange = Widget.updateState.call(viewInst, 'loaded');
                // statechange
                if (false !== statechange) {
                    viewInst.callOption('statechange', statechange);
                }
                viewInst.callOption('loaded');
            }
            // set template error level to 'page'
            if (!_.isEmpty(err)) {
                err = _.concatError(
                    err,
                    _.setPropsRecursive(
                        _.sliceError(err, {NS: Template.NAMESPACE}),
                        {level: Route.Error.LEVEL_PAGE}
                    )
                );
            }
            // callback
            if (_.isFunction(callback)) {
                try {
                    callback.apply(Route, arguments);
                } catch (e) {
                    Route.Event.trigger('CallbackError', Route.makeError('callback', ['loadCallback', e.message], e));
                }
            }
            _.disposeDeferred(Route.load, false);
        });

        View.Event.bind('CallbackError', function(e, err) {
            Route.Event.trigger('CallbackError', err);
        });

        Layout.Event.bind('CallbackError', function(e, err) {
            Route.Event.trigger('CallbackError', err);
        });

        if (View.instanceof(state)) {
            loadView(state);
        } else {
            _.assignDeferred(
                def,
                View.load(state, function(err, view) {
                    if (!_.isEmpty(err)) {
                        def.resolve(err);
                    } else {
                        loadView(view);
                    }
                })
            );
        }

        function loadView(view) {
            // do load view
            if (View.instanceof(view)) {

                var viewInst = view.getInstance();

                var viewTitle = viewInst.callOption('title');

                if (_.notNull(viewTitle)) {
                    Route.setTitle(viewTitle);
                }

                var defLayout = $.Deferred();

                defLayout.done(function(err, layout) {
                    var result = {view: view};

                    if (!_.isEmpty(err)) {
                        def.resolve(err, result);
                    } else {
                        var resLayout, layoutChanged;

                        if (Layout.instanceof(layout)) {
                            layoutChanged = Layout.isChanged(layout);
                            if (layoutChanged) {
                                _.def(viewInst, '__layout__', layout.getInstance());
                            } else {
                                _.def(viewInst, '__layout__', Layout.LAST_INSTANCE.getInstance());
                            }
                            result.layout = layout;
                        } else {
                            layoutChanged = Layout.isChanged();
                            _.def(viewInst, '__layout__', null);
                            result.layout = _.__undef__;
                            resLayout = layout;
                        }

                        var defView = $.Deferred();

                        defView.done(function(err, resView) {

                            result.html = resView.html;

                            if (_.isUndef(result.html)) {
                                // 不渲染页面时，不切换layout
                                result.layout = Layout.LAST_INSTANCE;
                                def.resolve(err, result);
                            } else {
                                if (result.layout) {
                                    var reloadPage = view.getState('__reload_page__'),
                                        layoutInst;
                                    if (reloadPage || layoutChanged) {
                                        // wrap view
                                        result.html = wrapView(resView, result.html);

                                        // layout未改变则使用缓存的layout
                                        if (!layoutChanged) {
                                            result.layout = Layout.LAST_INSTANCE;
                                            result.layout.reset();
                                        }

                                        // 释放上一个 Layout 实例占用的资源
                                        var preLayout = Route.LAST_LAYOUT;

                                        if (Layout.instanceof(preLayout)) {
                                            preLayout.dispose();
                                        }

                                        _.def(Route, 'LAST_LAYOUT', result.layout);

                                        layoutInst = result.layout.getInstance();

                                        // set layout body
                                        _.def(layoutInst.__state__.data, '__body__', result.html, {
                                            enumerable: true,
                                            configurable: true
                                        });

                                        // load layout
                                        _.assignDeferred(
                                            def,
                                            result.layout.load(function(errLayout, res) {
                                                resLayout = res || {};

                                                if (errLayout) {
                                                    err = _.concatError(err, errLayout);
                                                }

                                                if (!_.isUndef(resLayout.html)) {
                                                    result.html = resLayout.html;
                                                }

                                                // wrap layout
                                                if (Layout.updateWrap(result.layout.getState('name'))) {
                                                    result.container = Layout.CONTAINER;
                                                } else {
                                                    result.html = wrapLayout(resLayout, result.html);
                                                }

                                                def.resolve(err, result);
                                            })
                                        );
                                    } else {
                                        // layout未改变则使用缓存的layout
                                        result.layout = Layout.LAST_INSTANCE;
                                        result.container = View.CONTAINER;
                                        def.resolve(err, result);
                                    }
                                } else {
                                    // wrap view
                                    result.html = wrapView(resView, result.html);
                                    // wrap layout
                                    if (Layout.updateWrap()) {
                                        result.container = Layout.CONTAINER;
                                    } else {
                                        result.html = wrapLayout(resLayout, result.html);
                                    }
                                    def.resolve(err, result);
                                }
                            }
                        });

                        _.assignDeferred(def, defView);

                        // 释放上一个 View 实例占用的资源
                        var preView = Route.LAST_VIEW;

                        if (View.instanceof(preView)) {
                            preView.dispose();
                        }

                        _.def(Route, 'LAST_VIEW', view);

                        // load view
                        _.assignDeferred(
                            defView,
                            view.load(function(err, res) {
                                _.disposeDeferred(defView, false);
                                defView.resolve(err, res);
                            })
                        );
                    }
                });

                _.assignDeferred(def, defLayout);

                // load layout
                var layoutOption = viewInst.callOption('layout');

                _.assignDeferred(
                    defLayout,
                    Layout.load(layoutOption, function(err, layout) {
                        if (_.isNull(viewTitle)) {
                            var layoutTitle;
                            if (Layout.instanceof(layout)) {
                                var layoutInst = layout.getInstance();
                                layoutTitle = layoutInst.callOption('title')
                            }
                            if (layoutTitle) {
                                Route.setTitle(layoutTitle);
                            } else {
                                Route.setTitle();
                            }
                        }
                        _.disposeDeferred(defLayout, false);
                        defLayout.resolve(err, layout);
                    })
                );

                function wrapView(resView, html) {
                    resView = resView || {};
                    if (_.isFunction(resView.wrap)) {
                        html = resView.wrap(html);
                    } else {
                        html = View.wrap()(html);
                    }
                    return _.html2str(html);
                }

                function wrapLayout(resLayout, html) {
                    resLayout = resLayout || {};
                    if (_.isFunction(resLayout.wrap)) {
                        html = resLayout.wrap(html);
                    } else {
                        html = Layout.wrap()(html);
                    }
                    return _.html2str(html);
                }
            }
        }

        return def.promise();
    };

    Route.listen = function(callback) {
        if (!Route.Callback) {
            History.Adapter.bind(window, "statechange", function() {
                try {
                    _.isFunction(Route.Callback) && Route.Callback.call(Route);
                } catch (e) {
                    Route.Event.trigger('CallbackError', Route.makeError('callback', ['stateChangeCallback', e.message], e));
                }
            });
        }
        if (_.isFunction(callback)) {
            Route.Callback = callback;
        }
    };

    Route.makeError = function(id, option, originalError) {
        var errorMaker = Route.__error_maker__, err;
        if (!errorMaker) {
            _.def(Route, '__error_maker__', _.errorMaker(Route.Error));
            errorMaker = Route.__error_maker__;
        }
        err = errorMaker.apply(this, arguments);
        err.level= Route.Error.LEVEL_PAGE;
        return err;
    };

    Route.history = {
        back: function(queue) {
            return History.back(queue);
        },
        forward: function(queue) {
            return History.forward(queue);
        },
        go: function(index, queue) {
            return History.go(index, queue);
        }
    };

    Route.getRootUrl = function() {
        return History.getRootUrl();
    };

    Route.getBaseHref = function() {
        return History.getBaseHref();
    };

    Route.getState = function() {
        return History.getState();
    };

    Route.getStateById = function(id) {
        return History.getStateById(id);
    };

    Route.getStateByIndex = function(index) {
        return History.getStateByIndex(index);
    };

    Route.pushState = function() {
        return History.pushState.apply(History, arguments);
    };

    Route.replaceState = function() {
        return History.replaceState.apply(History, arguments);
    };

    return Route;
});