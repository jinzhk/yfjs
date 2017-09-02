define('yfjs/spa/util/widget', [
    '../version', 'jquery', './helpers', './event', './error', './remote',
    './template', './ajax', './websocket', './style-loader', './cookie',
    '../ui/loading'
], function(
    Version, $, _, Event, Error, Remote,
    Template, Ajax, WebSocket, StyleLoader, Cookie,
    Loading
) {

    var ROOT_URL = _.LOCAL_ROOT;

    Widget.NAMESPACE = "Widget";

    Widget.VERSION = Version(Widget.NAMESPACE);

    var NS_LOWER = Widget.NAMESPACE.toLowerCase();

    Widget.PROPERTIES = {
        // mark
        NAMESPACE : Widget.NAMESPACE,
        VERSION   : Widget.VERSION,
        // default options
        DEFAULTS : {
            /**
             * 当前实例渲染时的标签页标题 {String|Function}
             * - 布局实例和最上层的视图实例有效
             * - 视图实例优先于其布局实例
             * - 为 Function 类型时获取返回结果。this 指针指向当前实例
             */
            title: _.__undef__,
            /**
             * 当前实例渲染时使用的模板和模板配置项 {String|Object|Remote|Function}
             * - 不设置时，默认为 templates 目录下与当前实例的 js 文件同路径同名的 html 文件
             * - 为 String 类型时作为模板文本内容
             * - 为 null 时不使用模板
             * - 为有效 Object 类型时，可使用以下配置项
             *      === 模板使用设置 ===
             *      - url         {String}   模板文件路径，默认相对于 templates 目录
             *      - source      {String}   模板文本内容
             *      - data        {Object}   模板使用的数据
             *      - dataFilter  {Function} 模板数据格式化方法
             *      === 模板配置项 ===
             *      - escape   {Boolean}  是否编码输出变量的 HTML 字符。默认为true
             *      - cache    {Boolean}  是否开启缓存。默认为true
             *      - comment  {Boolean}  是否显示 html 注释。设为 false 则忽略 html 注释内容。默认为 true
             *      - compress {Boolean}  是否压缩输出。默认为false
             *      - rendered {Function} 输出内容处理钩子。传入编译错误信息、编译后的输出内容，需返回数组，数组索引第0项为错误信息，第1项为处理后的输出内容。
             *      - helpers  {Object}   模板辅助方法。键值为 {名称(String)} - {方法(Function)}
             *      - remote   {Object}   请求远程模板时的配置项，内容同 ajax 配置项
             * - 为 Remote 类型时，若获取结果为 Object 类型，则作为 Object 类型的配置项，否则，作为远程模板文件路径
             * - 为 Function 类型时获取返回结果。this 指针指向当前实例
             */
            template: _.__undef__,
            /**
             * 当前实例渲染时使用的数据 {Object|Remote|Function}
             * - 存在此配置项时，忽略 template.data 配置项
             * - 为数组类型或其他非 Object 类型时，自动转换为 Object 类型，格式为 {data: [data]}
             * - 为 Remote 类型时，其参数作为发送 ajax 请求的配置项
             * - 为 Function 类型时获取返回结果。this 指针指向当前实例
             */
            data: {},
            /**
             * 模板编译前对传入数据的格式化处理 {Function}
             * - 存在此配置项时，忽略 template.dataFilter 配置项
             * - 传入参数为 错误信息、 data 或 ajax请求返回的数据、jqXHR对象（如果是通过 ajax 获取的数据），返回值作为模板编译时的传入数据
             * - this 指针指向当前实例
             */
            dataFilter: _.__undef__,
            /**
             * 模板编译输出结果处理方法 {Function}
             * - 存在此配置项时，忽略 template.rendered 配置项
             * - 传入编译错误信息、编译后的输出内容
             * - 必须返回数组，数组索引第0项为错误信息，第1项为处理后的输出内容
             * - this 指针指向当前实例
             */
            rendered: _.__undef__,
            /**
             * 当前实例渲染时使用的样式文件 {String|Array|Function}
             * - 默认相对路径为应用层的 baseUrl.style 配置项
             * - 为 Function 类型时获取返回结果。this 指针指向当前实例
             */
            style: _.__undef__,
            /**
             * 事件绑定 {Array}
             * - 每项为事件绑定参数数组 [eventName, element, data, handler, one]
             *     - eventName {String}
             *          事件名称，支持以空格间隔的多个事件
             *     - element {String|jQuery|HTMLElement}
             *          可选。事件绑定元素，可为选择器字符串、jQuery对象、dom元素对象
             *     - data {Object}
             *          可选。事件绑定数据
             *     - handler {Function}
             *          事件绑定回调方法
             *     - one
             *          可选。设为 1 时只绑定一次事件
             * - 为 Function 类型时获取返回结果。this 指针指向当前实例
             */
            binds: _.__undef__,
            /**
             * 子实例加载中效果设置 {Object|Function}
             * - html    {String|Function}
             *           加载效果对应的 html 字符串。
             *           为 Function 类型时获取返回结果。this 指针指向当前实例
             * - ready   {Function}
             *           触发加载效果的执行函数。
             *           传入当前 container 参数。this 指针指向当前实例
             * - destroy {Function}
             *           销毁加载效果的执行函数。
             *           传入当前 container 参数。this 指针指向当前实例
             * - 为 Function 类型时获取返回结果
             *
             * 例：
             * {
             *     html: "...",
             *     ready: function() { ... },
             *     destroy: function() { ... }
             * }
             * {
             *     html: function() { ... return "..."; },
             *     ready: function() { ... },
             *     destroy: function() { ... }
             * }
             */
            loading: {
                html: '<div class="loader center-block"></div>'
            },
            /**
             * 当前实例下远程模板、样式文件缓存开关 {Boolean}
             * - 继承应用层 cache 配置项
             * - 为 Function 类型时获取返回结果
             */
            cache: _.__undef__,
            /**
             * 当前实例下样式文件加载器配置
             * - cache {Boolean}
             *       是否开启缓存。默认为true
             * - remote {Object}
             *       请求远程模板时的配置项，内容同 ajax 配置项
             * - 为 Function 类型时获取返回结果
             */
            styleLoader: _.__undef__,
            /**
             * 当前实例下环境模式 {String|Function}
             * 模式可完全自定义，例如：
             *     - mock  模拟阶段
             *     - test  测试阶段
             *     - dev   开发阶段
             *     - pro   产品阶段
             * - 为 Function 类型时获取返回结果
             */
            mode: _.__undef__,
            /**
             * 当前实例下 ajax 配置项 {Object|Function}
             * - 支持 jquery.ajax 下的所有配置项
             * - 另外还支持以下配置项
             *      - base {String}
             *          上下文路径
             *      - respFilter {Function}
             *          返回数据的处理函数
             *          - 传入参数为 错误信息、请求返回的数据、当前xhr对象。
             *          - 必须返回一个数组，数组第一项为错误信息，第二项和第三项为新处理后的数据和xhr对象
             *      - mode {String}
             *          当前环境模式。模式可完全自定义，例如：
             *          - mock  模拟阶段
             *          - test  测试阶段
             *          - dev   开发阶段
             *          - pro   产品阶段
             *      - urls {Object}
             *          请求地址相关配置 {Object}
             *          - {String} : {Object} 键值对分别为 名称 和 各模式下的请求地址
             *          - 发送请求时 url 可使用此配置的键名代替
             * - 为 Function 类型时获取返回结果
             */
            ajax: _.__undef__,
            /**
             * 当前实例下 webSocket 配置项 {Object|Function}
             * - base {String}
             *     上下文路径
             * - respFilter {Function}
             *     返回数据的处理函数
             *     - 传入参数为 错误信息、请求返回的数据、当前xhr对象。
             *     - 必须返回一个数组，数组第一项为错误信息，第二项和第三项为新处理后的数据和xhr对象
             * - mode {String}
             *     当前环境模式。模式可完全自定义，例如：
             *     - mock  模拟阶段
             *     - test  测试阶段
             *     - dev   开发阶段
             *     - pro   产品阶段
             * - urls {Object}
             *     请求地址相关配置 {Object}
             *     - {String} : {Object} 键值对分别为 名称 和 各模式下的请求地址
             *     - 发送请求时 url 可使用此配置的键名代替
             * - 为 Function 类型时获取返回结果
             */
            websocket: _.__undef__,
            /**
             * 当前实例下 cookie 配置项 {Object|Function}
             * - 为全局的 cookie 工具添加额外方法
             * - {String} : {Function} 键值对分别为方法名称和方法体，方法的 this 指针指向全局的 cookie 对象
             * - 为 Function 类型时获取返回结果
             */
            cookie: _.__undef__,
            /**
             * 生命周期钩子 statechange {Function}
             * - 在状态改变时调用（优先于状态钩子）
             * - this 指针指向当前实例
             */
            statechange: _.__undef__,
            /**
             * 生命周期钩子 beforeCreate {Function}
             * - 在当前实例初始化之前调用
             * - this 指针指向当前实例
             */
            beforeCreate: _.__undef__,
            /**
             * 生命周期钩子 created {Function}
             * - 在当前实例初始化完成后调用
             * - this 指针指向当前实例
             */
            created: _.__undef__,
            /**
             * 生命周期钩子 beforeLoad {Function}
             * - 在当前实例开始加载之前调用
             * - this 指针指向当前实例
             */
            beforeLoad: _.__undef__,
            /**
             * 生命周期钩子 loaded {Function}
             * - 在当前实例加载完成后调用
             * - this 指针指向当前实例
             */
            loaded: _.__undef__,
            /**
             * 生命周期钩子 beforeReady {Function}
             * - 在当前实例对应的 DOM 已准备好，事件绑定、创建子实例等执行之前调用
             * - this 指针指向当前实例
             */
            beforeReady: _.__undef__,
            /**
             * 生命周期钩子 ready {Function}
             * - 在当前实例对应的 DOM 已准备好，事件绑定、创建子实例等执行之后调用
             * - this 指针指向当前实例
             */
            ready: _.__undef__,
            /**
             * 生命周期钩子 beforeDestroy {Function}
             * - 在当前实例销毁之前调用
             * - 视图实例优先于当前的布局实例调用
             * - 返回非 undefined|null 值时不切换当前最上层的视图，并将返回值作为提示信息内容
             * - this 指针指向当前实例
             */
            beforeDestroy: _.__undef__,
            /**
             * 生命周期钩子 destroyed {Function}
             * - 在当前实例销毁后，页面切换后调用
             * - this 指针指向当前实例
             */
            destroyed: _.__undef__,
            /**
             * 错误过滤处理方法 {Function}
             * - 发生错误时，最先调用此方法
             * - this 指针指向当前实例
             */
            errorFilter: _.__undef__,
            /**
             * 错误处理方法 {Function}
             * - 发生错误时，自动调用此方法
             * - this 指针指向当前实例
             * - 方法内可使用以下函数处理相关错误
             *     - addError 拼接错误
             *     - getError  获取指定错误信息
             *     - removeError  删除指定错误信息
             * - 未经处理的错误信息将上抛到 App 层
             */
            onError: _.__undef__
        },
        // 脚本文件相对路径
        PREFIX_PATH_SCRIPT   : "app/views",
        // 模板文件相对路径
        PREFIX_PATH_TEMPLATE : "app/templates",
        // 样式文件相对路径
        PREFIX_PATH_STYLE    : "app/styles",
        // 子实例的 class 样式标记的前缀
        PREFIX_CSS_INCLUDE   : "app-include_",
        // 自动生成容器元素的id
        CONTAINER_ID : "app-" + NS_LOWER,
        // 自动生成容器元素绑定键
        BIND_KEY     : "data-" + NS_LOWER,
        // 默认事件处理对象
        Event : Event(Widget.NAMESPACE),
        // 默认错误处理对象
        Error : Error(Widget.NAMESPACE),
        // regexp
        REGEXP_PROTOCOL_START  : _.REGEXP_PROTOCOL_START,
        REGEXP_DSLASH_START    : _.REGEXP_DSLASH_START,
        REGEXP_SLASH_START     : _.REGEXP_SLASH_START,
        REGEXP_SLASH_END       : _.REGEXP_SLASH_END,
        REGEXP_RELATIVE_START  : _.REGEXP_RELATIVE_START,
        REGEXP_HASH_START      : _.REGEXP_HASH_START,
        REGEXP_HASH_PATH_START : _.REGEXP_HASH_PATH_START,
        // default state
        defaultState: function(state) {
            return state;
        },
        // default template
        defaultTemplate: function(template) {
            return template;
        }
    };

    // 模板引入模式
    Widget.INCLUDE_MODE = ['include', 'lazy', 'trigger'];

    // 模板引入层次限制
    Widget.INCLUDE_LEVEL_LIMIT = 1000;

    // 状态
    Widget.STATE = [
        'BEFORE_CREATE', 'CREATED',
        'BEFORE_LOAD', 'LOADED',
        'BEFORE_READY', 'READY',
        'BEFORE_DESTROY', 'DESTROYED'
    ];
    Widget.STATE[-1] = 'DISPOSE';

    Widget.STATE_INDEX = {};

    $.each(Widget.STATE, function(i, state) {
        Widget.STATE_INDEX[state] = i;
    });

    /*!
     * 更新状态
     */
    Widget.updateState = _.stateUpdater(Widget.STATE, Widget.STATE_INDEX);

    function Widget(options) {
        if (this instanceof Widget) {
            // init props
            options = _.extend({}, Widget.PROPERTIES, options);
            options.DEFAULTS = options.DEFAULTS || {};

            var defaults = Widget.PROPERTIES.DEFAULTS || {};

            var key;

            for (key in defaults) {
                if (_.isUndef(options.DEFAULTS[key]) && _.__hasOwn.call(defaults, key))
                    options.DEFAULTS[key] = defaults[key];
            }

            options.NAMESPACE = _.trim(options.NAMESPACE) || Widget.PROPERTIES.NAMESPACE;

            for (key in options) {
                if (_.__hasOwn.call(options, key))
                    _.def(this, key, options[key], {
                        writable: false,
                        configurable: (key === "PREFIX_CSS_INCLUDE") ? true : false
                    });
            }

            NS_LOWER = this.NAMESPACE.toLowerCase();

            _.def(this, 'CONTAINER', "#" + this.CONTAINER_ID, {
                writable: false,
                configurable: false
            });

            // translate errors
            if (this.Error instanceof Error) {
                this.Error.translate({
                    'instantiated' : this.NAMESPACE + " 的构造器对象必须通过 " + this.NAMESPACE + " 的实例对象进行实例化",
                    'initialized'  : this.NAMESPACE + " 的实例对象必须通过 " + this.NAMESPACE + " 的初始器对象进行实例化",
                    'param_invalid': "执行 " + this.NAMESPACE + ".{0} 时发生了错误：缺少 {0} 参数"
                });
                this.Error.translate(
                    'callback' + '_' + NS_LOWER,
                    "执行 " + this.NAMESPACE + " 的 {0} 时发生了错误: {1}"
                );
            }

            _.def(this, 'LAST_INSTANCE', null, {
                writable: false,
                configurable: true
            });

            _.def(this, 'LAST_$STYLE', null, {
                writable: false,
                configurable: true
            });

            _.def(this, 'INCLUDE_WIDGET', this, {
                writable: false,
                configurable: true
            });
        } else {
            return new Widget(options);
        }
    }

    Widget.prototype.config = function(key, val) {
        if (!this.__configurator__) {
            _.def(this, '__configurator__', _.configurator.call(this, this.DEFAULTS));
        }
        return this.__configurator__.apply(this, arguments);
    };

    Widget.prototype.ID = 0;

    Widget.prototype.uuid = function() {
        Widget.ID = _.increaseId(Widget.ID);
        return Widget.ID;
    };

    Widget.prototype.instanceof = function(o, constructor) {

        constructor = constructor || this.Launcher;

        try {
            return (o instanceof constructor);
        } catch (e) {
            return false;
        }
    };

    Widget.prototype.isChanged = function(instance) {
        var lastInst = this.LAST_INSTANCE;
        if (this.instanceof(instance)) {
            if (!this.instanceof(lastInst))
                return true;
            if (instance.getInitializer() !== lastInst.getInitializer())
                return true;
            if (instance.getState('hash') !== lastInst.getState('hash'))
                return true;
            return false;
        } else {
            return instance !== lastInst;
        }
    };

    Widget.prototype.setLastStyle$ = function($style) {
        if (_.isUndef($style)) {
            _.def(this, 'LAST_$STYLE', null);
        } else if (_.is$($style)) {
            var last$Style = this.LAST_$STYLE;
            if (!_.is$(last$Style)) {
                last$Style = $([]);
            }
            last$Style = last$Style.add($style);
            _.def(this, 'LAST_$STYLE', last$Style);
        }
        return this;
    };

    Widget.prototype.removeStyle$ = function($style, container) {
        var widget = this;
        if (_.is$($style)) {
            var $styleToRemove = $([]);

            var $head = $(_.document.head || 'head'),
                $container;

            if (container) {
                try {
                    $container = $(container);
                } catch (e) {
                    $container = $head;
                }
            }

            if (!$container || !$container.length) {
                $container = $head;
            }

            $style.each(function() {
                var $this = $(this),
                    selector = '#' + $this.attr('id') + '[' + widget.BIND_KEY + '="' + $this.attr(widget.BIND_KEY) + '"]';
                $styleToRemove = $styleToRemove.add(
                    $(selector, $container)
                );
            });

            $styleToRemove.remove();
        }
        return this;
    };

    Widget.prototype.load = function(state, callback) {
        var self = this;

        var def = $.Deferred();

        state = this.normalizeState(state);

        (function(def, state, callback) {

            if (_.isFunction(callback)) {
                def.done(function(err, res) {
                    try {
                        callback.apply(self, arguments);
                    } catch (e) {
                        self.Event.trigger('CallbackError',
                            self.Error.make('callback' + '_' + NS_LOWER, ['loadCallback', e.message], e)
                        );
                    }
                });
            }

            if (state) {
                var defLoad = $.Deferred();

                _.assignDeferred(def, defLoad);

                var isScript   = (state && "script" == state.type),
                    isStyle    = (state && "style" == state.type),
                    isTemplate = (state && !isScript && !isStyle);

                var isIncludeInst = state.include ? self.instanceof(state.include.context, self.Creator) : false,
                    includeInst = isIncludeInst ? state.include.context : null;

                defLoad.done(function(err, res) {
                    var args = [err];

                    // init args
                    if (self.instanceof(res)) {
                        // 加载了 view 脚本文件
                    } else {
                        // 加载了样式或模板文件
                        res = res || {};
                        res.state = res.state || state;
                        if (isTemplate || isStyle) {
                            _.extend(res, {
                                wrap: self.wrap(
                                    state.name,
                                    state.container
                                        ? state.container.replace(self.REGEXP_HASH_START, "")
                                        : _.__undef__
                                )
                            });
                            if (isTemplate) {
                                _.extend(res, {
                                    html: self.wrapTemplate(state.name, state.id)(res.source)
                                });
                            } else if (!_.isUndef(res.source)) {
                                _.extend(res, {
                                    html: self.wrapStyle(state.name, state.id)(res.source)
                                });
                            } else {
                                _.extend(res, {
                                    html: res.html
                                });
                            }
                        } else {
                            _.extend(res, {wrap: self.wrap()});
                        }
                    }

                    args.push(res);

                    _.disposeDeferred(def, false);

                    def.resolve.apply(def.resolve, args);
                });

                if (state.path) {
                    if (isScript) {
                        // 作为 View 或者 Layout 的脚本文件加载
                        var scriptPath = self.normalizeScriptPath(state.path);
                        require([scriptPath], function(res) {
                            if (def.__rejected__) {
                                defLoad.reject();
                                return;
                            }
                            if (self.instanceof(res, self.Initializer)) {
                                // init state
                                if (_.isUndef(state.id)) {
                                    _.def(state, 'id', self.uuid(), {
                                        writable: false,
                                        configurable: false
                                    });
                                }
                                if (_.isUndef(state.level)) {
                                    _.def(state, 'level', 1, {
                                        writable: false,
                                        configurable: false
                                    });
                                }
                                _.def(state, 'label', Widget.STATE[0], {
                                    writable: false,
                                    configurable: true
                                });
                                // create instance
                                var instance = new self.Creator(res, state, self);
                                defLoad.resolve(_.__undef__, new self.Launcher(instance, self));
                            } else {
                                defLoad.resolve(
                                    self.Error.make(
                                        'script_invalid_return',
                                        {
                                            level: self.Error.LEVEL_PAGE,
                                            args: [state.path, scriptPath + ".js"]
                                        }
                                    )
                                );
                            }
                        }, function(e) {
                            var moduleId = e.requireModules && e.requireModules[0];
                            if (moduleId) {
                                requirejs.undef(moduleId);
                            }
                            if (def.__rejected__) {
                                defLoad.reject();
                                return;
                            }
                            var filename;
                            try {
                                filename = require.toUrl(moduleId) || "";
                                var posQuery = filename.indexOf("?");
                                if (posQuery > -1) {
                                    filename = filename.substring(0, posQuery);
                                }
                            } catch (e) {
                                filename = moduleId;
                            }
                            filename = filename || "";
                            if (filename.indexOf(ROOT_URL) == 0) {
                                filename = filename.substring(ROOT_URL.length-1);
                            }
                            var evt = e.originalError,
                                err = evt && evt.error ? evt.error : e;
                            var msg, msgPos;
                            if (evt && _.notNull(evt.lineno)) {
                                msgPos = ['line ' + evt.lineno];
                                if (_.notNull(evt.colno)) {
                                    msgPos.push('col ' + evt.colno);
                                }
                                msgPos = msgPos.join(', ');
                            }
                            if (/^Error$/i.test(err.name)) {
                                msg = err.message + '';
                                defLoad.resolve(self.Error.make(
                                    msg.indexOf('timeout') > -1
                                        ? 'script_timeout'
                                        : 'script_unfound',
                                    {
                                        level: self.Error.LEVEL_PAGE,
                                        args: [state.path, filename + ".js"]
                                    },
                                    err
                                ));
                            } else {
                                msg = err.name ? err.name + ' - ' + err.message : err.message + '';
                                msg += (msgPos ? ' (at ' + msgPos + ')' : '');
                                defLoad.resolve(self.Error.make('script_error', {
                                    level: self.Error.LEVEL_PAGE,
                                    args: [state.path, filename + ".js",  msg]
                                }, err));
                            }
                        });
                    } else if (isStyle) {
                        // 作为样式文件加载
                        var stylePath = self.normalizeStylePath(state.url);
                        if (stylePath && (stylePath = stylePath[0])) {
                            var styleLoader;
                            if (isIncludeInst) {
                                styleLoader = includeInst.styleLoader;
                            } else {
                                styleLoader = StyleLoader;
                            }
                            styleLoader.load(stylePath, function(err, res) {
                                if (def.__rejected__) {
                                    defLoad.reject();
                                    return;
                                }
                                if (res.filename && (res.filename = _.trim(res.filename))) {
                                    _.def(state, 'id', _.encodeIdFromURI(res.filename), {
                                        writable: false,
                                        configurable: false
                                    });
                                } else {
                                    _.def(state, 'id', state.name, {
                                        writable: false,
                                        configurable: false
                                    });
                                }
                                if (isIncludeInst) {
                                    _.def(state, 'name', includeInst.getState('name'), {
                                        writable: false,
                                        configurable: false
                                    });
                                }
                                if (err && isIncludeInst) {
                                    err = self.Error.make('style_unfound', {
                                        NS: StyleLoader.NAMESPACE,
                                        args: [state.path, err.message],
                                        level: self.Error.LEVEL_CONSOLE
                                    }, err);
                                }
                                defLoad.resolve(err, res);
                            });
                        } else {
                            defLoad.resolve(_.__undef__, {wrap: self.wrap()});
                        }
                    } else {
                        // 作为模板文件加载
                        var tplPath = self.normalizeTemplatePath(state.path),
                            tplLoader;
                        if (isIncludeInst) {
                            tplLoader = includeInst.template;
                        } else {
                            tplLoader = Template;
                        }
                        tplLoader.remote(tplPath, function(err, res) {
                            if (def.__rejected__) {
                                defLoad.reject();
                                return;
                            }
                            _.def(state, 'id', state.name, {
                                writable: false,
                                configurable: false
                            });
                            if (isIncludeInst) {
                                _.def(state, 'name', includeInst.getState('name'), {
                                    writable: false,
                                    configurable: false
                                });
                            }
                            res && (res.state = state);
                            defLoad.resolve(err, res);
                        });
                    }
                } else {
                    defLoad.resolve(self.Error.make('param_invalid', {
                        level: self.Error.LEVEL_PAGE, args: ['load', 'state.path']
                    }));
                }
            } else {
                def.resolve(_.__undef__, {wrap: self.wrap()});
            }
        })(def, state, callback);

        return def;
    };

    Widget.prototype.include = function(includedState, readyIncluded, callback) {
        var self = this.INCLUDE_WIDGET || this;

        if (_.isFunction(readyIncluded)) {
            callback = readyIncluded;
            readyIncluded = [];
        }

        if (_.isFunction(includedState)) {
            callback = includedState;
            includedState = null;
        }

        var def = $.Deferred();

        (function(def, state, callback) {

            if (_.isFunction(callback)) {
                def.done(function(err, res) {
                    try {
                        callback.apply(self, arguments);
                    } catch (e) {
                        var cbErr;
                        if (self.validIncludedState(state)) {
                            cbErr = state.include.context.makeError(
                                'callback',
                                [state.include.context.getPath(), 'includeCallback', e.message],
                                e
                            );
                        } else {
                            cbErr = self.Error.make('callback' + '_' + NS_LOWER, ['includeCallback', e.message], e)
                        }
                        self.Event.trigger('CallbackError', cbErr);
                    }
                });
            }

            if (self.validIncludedState(state)) {

                var pos = inReadyIncluded(state), launcher;

                if (pos > -1) {
                    launcher = readyIncluded[pos];
                }

                if (self.instanceof(launcher)) {
                    // 已经加载过的使用原实例加载
                    launcher.dispose().reset(state).load(loadedInclude);
                } else {
                    // 未加载过的加载相应文件
                    self.load(state, function(err, resLoad) {
                        if (_.isEmpty(err)) {
                            if (self.instanceof(resLoad)) {
                                // add included
                                var stateInclude = resLoad.getState('include'),
                                    context = stateInclude ? stateInclude.context : null;
                                if (self.instanceof(context, self.Creator)) {
                                    context.__included__.push(resLoad);
                                }
                                // load
                                resLoad.load(loadedInclude);
                            } else {
                                resLoad.widget = self;
                                def.resolve(_.__undef__, resLoad);
                            }
                        } else {
                            resLoad.widget = self;
                            err = assignErrProps.call(resLoad, err);
                            def.resolve(err, resLoad);
                        }
                    });
                }
            } else {
                def.resolve();
            }

            function loadedInclude(err, res) {
                // assign context
                if (res) {
                    res.context = this;
                    res.widget = self;
                }
                // assign layout
                var inst = this.getInstance(),
                    layout =
                        self.instanceof(inst.context, self.Creator)
                            ? inst.context.getLayout()
                            : null;
                if (self.instanceof(layout, self.Creator)) {
                    _.def(inst, '__layout__', layout);
                } else {
                    _.def(inst, '__layout__', null);
                }
                // assign error
                err = assignErrProps.call(this, err, {context: inst});
                def.resolve(err, res);
            }
        })(def, includedState, callback);

        function inReadyIncluded(state) {
            var id = state ? state.id : '',
                pos = -1;
            if (id && _.isArray(readyIncluded)) {
                var readyInclude;
                for (var i=0; i<readyIncluded.length; i++) {
                    readyInclude = readyIncluded[i];
                    if (self.instanceof(readyInclude) && readyInclude.getState('id') == id) {
                        pos = i;
                        break;
                    }
                }
            }
            return pos;
        }

        function assignErrProps(err, props) {
            if (_.isEmpty(err)) return _.__undef__;
            err =  _.setPropsRecursive(
                err,
                _.extend(
                    {
                        __caller_name__: NS_LOWER + '.include',
                        state: self.instanceof(this) ? this.getState() : this.state
                    },
                    props
                )
            );
            var errConsole = _.sliceError(err, {level: self.Error.LEVEL_CONSOLE});
            err = _.concatError(
                err,
                _.setPropsRecursive(
                    _.shiftError(err, errConsole), {level: self.Error.LEVEL_WIDGET}
                )
            );
            return err;
        }

        return def;
    };

    Widget.prototype.includeAll = function(includes, readyIncluded, callback) {
        var self = this.INCLUDE_WIDGET || this;

        if (_.isFunction(readyIncluded)) {
            callback = readyIncluded;
            readyIncluded = [];
        }

        if (_.isFunction(includes)) {
            callback = includes;
            includes = [];
        }

        includes = includes || [];

        if (!_.isArray(includes)) {
            includes = [includes];
        }

        readyIncluded = readyIncluded || [];

        if (!_.isArray(readyIncluded)) {
            readyIncluded = [readyIncluded];
        }

        var def = $.Deferred(), defs = [];

        $.each(includes, function(i, include) {
            defs.push(self.include(include, readyIncluded));
        });

        (function(def, defs, callback) {

            if (_.isFunction(callback)) {
                def.done(function(err, res) {
                    try {
                        callback.apply(self, arguments);
                    } catch (e) {
                        self.Event.trigger('CallbackError',
                            self.Error.make('callback' + '_' + NS_LOWER, ['includeAllCallback', e.message], e)
                        );
                    }
                });
            }

            if (defs.length) {
                $.when.apply($.when, defs).done(function() {
                    var args = _.__aslice.call(arguments),
                        err, res;
                    if (defs.length > 1) {
                        $.each(args, function(i, arg) {
                            if (!_.isUndef(arg[0])) {
                                err = err || new Array(defs.length);
                                err[i] = arg[0];
                            }
                            if (!_.isUndef(arg[1])) {
                                res = res || new Array(defs.length);
                                res[i] = arg[1];
                            }
                        });
                    } else {
                        err = args[0];
                        res = args[1];
                    }
                    def.resolve(err, res);
                });
            } else {
                def.resolve();
            }

        })(def, defs, callback);

        return def;
    };

    Widget.prototype.includeAsync = function(includes, readyIncluded, callback) {
        var self = this.INCLUDE_WIDGET || this;

        if (_.isFunction(readyIncluded)) {
            callback = readyIncluded;
            readyIncluded = [];
        }

        if (_.isFunction(includes)) {
            callback = includes;
            includes = [];
        }

        includes = includes || [];

        if (!_.isArray(includes)) {
            includes = [includes];
        }

        readyIncluded = readyIncluded || [];

        if (!_.isArray(readyIncluded)) {
            readyIncluded = [readyIncluded];
        }

        var defs;

        $.each(includes, function(i, include) {
            defs = defs || [];
            defs.push(
                self.include(include, readyIncluded, callback)
            );
        });

        return defs;
    };

    Widget.prototype.sliceIncludes = function(includes, filter) {
        var self = this.INCLUDE_WIDGET || this;

        var filtered = [];

        includes = includes || [];

        if (!_.isArray(includes)) {
            includes = [includes];
        }

        var _filter = {};

        if (_.notNull(filter)) {
            if (_.isArray(filter)) {
                _filter.mode = filter;
            } else if (_.isObject(filter)) {
                _.extend(_filter, filter);
            } else {
                _filter.id = _.trim(filter);
            }
        }

        _filter.mode = _filter.mode || Widget.INCLUDE_MODE || [];

        if (!_.isArray(_filter.mode)) {
            _filter.mode = [_filter.mode];
        }

        $.each(includes, function(i, includedState) {
            if (self.validIncludedState(includedState)
                && (
                    _.inArray(includedState.include.mode, _filter.mode) > -1
                    && (
                        !_filter.id
                        || _filter.id == includedState.id
                        || _filter.id == includedState.name
                    )
                )
            ) {
                filtered.push(includedState);
            }
        });

        return filtered;
    };

    Widget.prototype.validIncludedState = function(state) {
        var self = this.INCLUDE_WIDGET || this;
        return state && state.include && self.instanceof(state.include.context, self.Creator);
    };

    Widget.prototype.normalizeState = function(state) {

        if (_.isEmpty(state))
            return this.defaultState(state);

        if (state.__normalized__)
            return state;

        var _state = {};

        if (_.isObject(state)) {
            state = _.extend({}, state);
        } else {
            state = {path: _.trim(state)};
        }

        var hash = decodeURIComponent(state.hash || state.path || "");

        // trim hash
        var path = hash,
            posHash = hash.indexOf("#");

        if (this.REGEXP_DSLASH_START.test(path)) {
            path = ROOT_URL + path;
        }

        var isUrl = this.REGEXP_PROTOCOL_START.test(path);

        if (isUrl) {
            _.def(_state, 'url', path, {
                writable: false,
                configurable: false
            });
            path = path.replace(this.REGEXP_PROTOCOL_START, "").replace(this.REGEXP_SLASH_START, "");
            var posSlash = path.indexOf('/');
            if (posSlash > -1) {
                path = path.substring(posSlash);
            }
            if (posHash > -1) {
                hash = hash.substring(posHash);
            } else {
                hash = "";
            }
        } else {
            if (posHash > -1) {
                path = hash.substring(posHash + 1);
                hash = hash.substring(posHash);
            }
            if (hash) {
                if (!this.REGEXP_HASH_START.test(hash)) {
                    hash = "#" + hash;
                }
                if (!this.REGEXP_HASH_PATH_START.test(hash)) {
                    hash = hash.replace(this.REGEXP_HASH_START, "#/");
                }
            }
            _.def(_state, 'url', hash.replace(this.REGEXP_HASH_START, ""), {
                writable: false,
                configurable: false
            });
        }

        _.def(_state, 'hash', hash, {
            writable: false,
            configurable: false
        });

        // trim data
        var posQuery = path.indexOf("?"), params;
        if (posQuery > -1) {
            params = $.parseQuery(path);
            path = path.substring(0, posQuery);
        }

        // trim path
        if (!this.REGEXP_SLASH_START.test(path)) {
            path = "/" + path;
        }
        path = path.replace(this.REGEXP_SLASH_END, "");

        var posSuffix = path.lastIndexOf('.'),
            posLastSlash = path.lastIndexOf('/'),
            suffix;
        if (posSuffix > -1 && posSuffix > posLastSlash) {
            suffix = path.substring(posSuffix + 1);
            path = path.substring(0, posSuffix);
        }
        suffix = _.isEmpty(suffix) ? "js" : _.trim(suffix).toLowerCase();

        _.def(_state, 'suffix', suffix, {
            writable: false,
            configurable: false
        });

        var type;
        if ("js" == _state.suffix) {
            type = "script";
        } else if ("css" == _state.suffix || "less" == _state.suffix || "scss" == _state.suffix) {
            type = "style";
        } else {
            type = "template";
        }
        _.def(_state, 'type', type, {
            writable: false,
            configurable: false
        });

        if (_state.type === "style") {
            path += ("." + suffix);
        }

        _.def(_state, 'name', _.encodeIdFromURI(path), {
            writable: false,
            configurable: (type == "script" ? false : true)
        });

        _.def(_state, 'path', path, {
            writable: false,
            configurable: false
        });

        _.def(_state, 'param', _.extend({}, params), {
            writable: false,
            configurable: false
        });

        _.def(_state, 'data', _.extend({}, state.data), {
            writable: false,
            configurable: false
        });

        _.def(_state, '__normalized__', true);

        return _state;
    };

    Widget.prototype.normalizeScriptPath = function(path) {

        if (!path) return "";

        if (path.indexOf(this.PREFIX_PATH_SCRIPT + "/") == 0) {
            return path;
        }

        if (!this.REGEXP_SLASH_START.test(path)) {
            path = "/" + path;
        }

        return this.PREFIX_PATH_SCRIPT + path;
    };

    Widget.prototype.normalizeTemplatePath = function(path) {

        if (!path) return "";

        var posQuery = path.lastIndexOf('?'), queryStr;

        if (posQuery > -1) {
            queryStr = path.substring(posQuery);
            path = path.substring(0, posQuery);
        }

        var posSuffix = path.lastIndexOf('.');

        if (posSuffix == -1) {
            path += ".html";
        } else if (posSuffix == path.length - 1) {
            path += "html";
        }

        if (queryStr) {
            path += queryStr;
        }

        if (path.indexOf(this.PREFIX_PATH_TEMPLATE + '/') == 0) {
            return path;
        }

        if (!this.REGEXP_SLASH_START.test(path)) {
            path = "/" + path;
        }

        return this.PREFIX_PATH_TEMPLATE + path;
    };

    Widget.prototype.trimTemplatePath = function(url) {
        var tplPath = _.trim(url);
        if (tplPath.length) {
            var tplBaseUrl = _.getRequireUrl(this.PREFIX_PATH_TEMPLATE);
            if (tplBaseUrl.indexOf(_.LOCAL_ROOT) == 0) {
                tplBaseUrl = tplBaseUrl.substring(_.LOCAL_ROOT.length - 1);
            }
            if (tplPath.indexOf(tplBaseUrl) == 0) {
                if (this.REGEXP_SLASH_END.test(tplBaseUrl)) {
                    tplPath = tplPath.substring(tplBaseUrl.length - 1);
                } else {
                    tplPath = tplPath.substring(tplBaseUrl.length);
                }
            }
            var posSuffix = tplPath.lastIndexOf('.');
            if (posSuffix > -1) {
                tplPath = tplPath.substring(0, posSuffix);
            }
        }
        return tplPath;
    };

    Widget.prototype.normalizeStylePath = function(path) {

        if (!path) return;

        var self = this;

        var normalizePath = function(stylePath, level) {
            var stylesPath;

            level = level || 0;

            if (level > 1000) return stylesPath;

            if (_.isArray(stylePath)) {
                level = level + 1;
                $.each(stylePath, function(i, stylePath) {
                    stylePath = normalizePath(stylePath, level);
                    if (stylePath) {
                        stylesPath = stylesPath || [];
                        stylesPath = stylesPath.concat(stylePath);
                    }
                });
            } else if (!_.isEmpty(stylePath)) {
                stylePath = _.trim(stylePath);
                if (self.REGEXP_DSLASH_START.test(stylePath)) {
                    stylePath = _.LOCAL_PROTOCOL + stylePath;
                } else if (!self.REGEXP_PROTOCOL_START.test(stylePath)) {
                    if (!self.REGEXP_SLASH_START.test(stylePath)) {
                        stylePath = "/" + stylePath;
                    }
                    if (path.indexOf(self.PREFIX_PATH_STYLE + '/') != 0) {
                        stylePath = self.PREFIX_PATH_STYLE + stylePath;
                    }
                    stylePath = _.getRequireUrl(stylePath);
                }
                stylesPath = stylesPath || [];
                stylesPath.push(stylePath);
            }

            return stylesPath;
        };

        return normalizePath(path);
    };

    Widget.prototype.wrap = function(name, id, key) {

        var bindKey = key || this.BIND_KEY,
            bindVal = name || "undefined";

        id = id || this.CONTAINER_ID;

        return function(html, cssClass) {

            cssClass = _.trim(cssClass);

            var wrapper = (
                '<div' + (_.isEmpty(cssClass) ? '' : ' class="' + cssClass + '"') + ' id="' + id + '" ' + bindKey + '="' + bindVal + '"></div>'
            );

            var $wrapper = $(wrapper);

            $wrapper.html(html || '');

            return _.html2str($wrapper) || wrapper;
        };
    };

    Widget.prototype.wrapTemplate = function(name, id, key) {

        var bindKey = key || this.BIND_KEY,
            bindVal = name || "undefined";

        id = id || this.CONTAINER_ID;

        return function(html) {
            var wrapper = (
                '<script type="text/html" id="' + id + '" ' + bindKey + '="' + bindVal + '"></script>'
            );

            var $wrapper = $(wrapper);

            $wrapper.html(html || '');

            return _.html2str($wrapper) || wrapper;
        };
    };

    Widget.prototype.wrapStyle = function(name, id, key) {

        var bindKey = key || this.BIND_KEY,
            bindVal = name || "undefined";

        id = id || this.CONTAINER_ID;

        return function(html) {
            var wrapper = (
                '<style type="text/css" id="' + id + '" ' + bindKey + '="' + bindVal + '"></style>'
            );

            var $wrapper = $(wrapper);

            $wrapper.html(html || '');

            return _.html2str($wrapper) || wrapper;
        };
    };

    Widget.prototype.updateWrap = function(name, id) {

        var bindVal = name || "undefined",
            $container = $('#' + (id || this.CONTAINER_ID));

        if ($container.length) {
            $container.attr(this.BIND_KEY, bindVal);
            return true;
        }

        return false;
    };

    Widget.prototype.Launcher = function(instance, widget) {
        // Widget's Constructor must be instantiated with Widget's Creator instance.
        if (!(instance instanceof widget.Creator))
            throw widget.Error.make('instantiated');

        if (this instanceof widget.Launcher) {
            // init widget instance
            _.def(this, '__widget__', widget);

            // init interface
            _.def(this, '__instance__', instance);

            // assign options
            _.def(this, '__options__', instance.__options__);

            // assign interface util
            _.def(this, 'ajax', instance.ajax, {
                writable: false,
                configurable: false
            });
            _.def(this, 'template', instance.template, {
                writable: false,
                configurable: false
            });
            _.def(this, 'styleLoader', instance.styleLoader, {
                writable: false,
                configurable: false
            });
            _.def(this, 'ws', instance.ws, {
                writable: false,
                configurable: false
            });

            // ready done state
            _.def(this, '__ready_done__', false, {
                configurable: true
            });

            // load deferred
            _.def(this, '__deferred__', null, {
                configurable: true
            });
        } else {
            return new widget.Launcher(instance, widget);
        }
    };

    Widget.prototype.Launcher.prototype = {
        getInstance: function() {
            return this.__instance__;
        },
        getInitializer: function() {
            return this.getInstance().getInitializer();
        },
        getState: function(key) {
            var instance = this.getInstance();
            return instance.getState.apply(instance, arguments);
        },
        setState: function(key, val) {
            var instance = this.getInstance();
            instance.setState.apply(instance, arguments);
            return this;
        },
        getData: function() {
            var instance = this.getInstance();
            return instance.getData.apply(instance, arguments);
        },
        setData: function(key, val) {
            var instance = this.getInstance();
            instance.setData.apply(instance, arguments);
            return this;
        },
        getCache: function() {
            var instance = this.getInstance();
            return instance.getCache.apply(instance, arguments);
        },
        setCache: function(key, val) {
            var instance = this.getInstance();
            instance.setCache.apply(instance, arguments);
            return this;
        },
        getUrl: function(path, params) {
            var instance = this.getInstance();
            return instance.getUrl.apply(instance, arguments);
        },
        load: function(callback) {

            if (this.__deferred__) return this.__deferred__;

            var self = this,
                widget = this.__widget__,
                options = this.__options__ || {},
                instance = this.getInstance();

            // update state
            var statechange = Widget.updateState.call(instance, 'beforeLoad');

            // statechange
            if (false !== statechange) {
                instance.callOption('statechange', statechange);
            }

            // before load
            instance.callOption('beforeLoad');

            var def = $.Deferred();

            _.def(self, '__deferred__', def);

            def.done(function(err, res) {
                if (instance.context !== instance.rootContext) {
                    // update state
                    var statechange = Widget.updateState.call(instance, 'loaded');
                    // statechange
                    if (false !== statechange) {
                        instance.callOption('statechange', statechange);
                    }
                    // loaded
                    instance.callOption('loaded');
                }
                if (_.isFunction(callback)) {
                    try {
                        callback.apply(self, arguments);
                    } catch (e) {
                        widget.Event.trigger('CallbackError',
                            instance.makeError('callback', [instance.getPath(), 'loadCallback', e.message], e)
                        );
                    }
                }
                _.def(self, '__deferred__', null);
            });

            var defLoad = $.Deferred(),
                defStyles = $.Deferred();

            $.when(defLoad, defStyles).done(function(argsLoad, argsStyle) {
                var err;

                if (argsLoad[0]) {
                    err = _.concatError(err, argsLoad[0]);
                }

                if (argsStyle && argsStyle[0]) {
                    err = _.concatError(err, argsStyle[0]);
                }

                var html = argsLoad[1];

                if (_.isEmpty(err)) {
                    err = _.__undef__;
                }

                var args = [err];

                // set state container
                var container = self.getState('container'), containerId;
                if (!container) {
                    self.setState('container', widget.CONTAINER);
                } else {
                    // update container id
                    containerId = instance.getContainerId();
                    // update interface's container
                    _.def(instance, 'container', container);
                }

                // set state data
                self.setData(_.extend({}, argsLoad[2], {$include: self.getData('$include')}));
                // set state template
                self.setState('source', argsLoad[3]);
                // set state style
                var concatStyle = function(resStyle, level) {
                    var $html;

                    level = level || 0;

                    if (level > 1000) return $html;

                    if (_.isArray(resStyle)) {
                        level = level + 1;
                        $.each(resStyle, function(i, resStyle) {
                            var $styleHtml = concatStyle(resStyle, level);
                            if ($styleHtml) {
                                $html = $html || $([]);
                                $html = $html.add($styleHtml);
                            }
                        });
                    } else if (_.notNull(resStyle) && resStyle.html) {
                        var styleHtml = _.trim(resStyle.html);
                        try {
                            $html = $(styleHtml);
                        } catch (e) {
                            $html = styleHtml;
                        }
                    }

                    return $html;
                };
                if (argsStyle) {
                    self.setState('$style', concatStyle(argsStyle[1]));
                }

                var res = {
                    html : html,
                    wrap : widget.wrap(self.getState('name'), containerId)
                };

                args.push(res);

                _.disposeDeferred(def, false);

                def.resolve.apply(def.resolve, args);
            });

            _.assignDeferred(def, [defLoad, defStyles]);

            var defRender = $.Deferred();

            defRender.done(function(err, htmlText, data, source) {
                _.disposeDeferred(defLoad, false);
                var argsRender = _.__aslice.call(arguments);
                if (!_.isUndef(htmlText)) {
                    // 处理 body
                    var bodyHtml = instance.getData('__body__');
                    if (_.notNull(bodyHtml)) {
                        htmlText = _.replaceMainBody(htmlText, 'body', bodyHtml);
                        try {
                            delete instance.__state__.data.__body__;   
                        } catch (e) {}
                        argsRender[1] = htmlText;
                    }
                }
                defLoad.resolve.apply(defLoad.resolve, argsRender);
            });

            _.assignDeferred(defLoad, defRender);

            var templateOption = instance.get('template'),
                dataOption = instance.callOption('data');

            // def render
            if (!_.eqNull(templateOption) || _.notNull(dataOption)) {

                if (_.isUndef(templateOption)) {
                    // default template
                    templateOption = {
                        url: self.getState('path')
                    };
                }

                if (!_.isObject(templateOption)) {
                    templateOption = {source: _.trim(templateOption)}
                }

                var renderOptions = _.extend(
                    {},
                    templateOption,
                    {
                        data: dataOption,
                        dataFilter: options.dataFilter
                    }
                );

                _.def(renderOptions, '__self__', true);

                instance.render(renderOptions, function(err) {
                    if (err) {
                        instance.removeError(err);
                    }
                    defRender.resolve.apply(defRender.resolve, arguments);
                });
            } else {
                defRender.resolve(_.__undef__, _.__undef__);
            }

            // init style option
            var styleOption = widget.normalizeStylePath(
                instance.callOption('style')
            );
            if (styleOption) {
                // load styles
                var styleDefs = [], styleState;
                $.each(styleOption, function(i, stylePath) {
                    styleState = widget.normalizeState(stylePath);
                    styleState.context = instance;
                    styleDefs.push(widget.load(styleState));
                });
                $.when.apply($.when, styleDefs).done(function() {
                    var args = _.__aslice.call(arguments),
                        err, res;
                    if (styleDefs.length > 1) {
                        $.each(args, function(i, arg) {
                            if (arg[0]) {
                                err = err || new Array(styleDefs.length);
                                err[i] = arg[0];
                            }
                            res = res || new Array(styleDefs.length);
                            res[i] = arg[1];
                        });
                    } else {
                        err = args[0];
                        res = args[1];
                    }
                    _.disposeDeferred(defStyles, false);
                    defStyles.resolve(err, res);
                });
                _.assignDeferred(defStyles, styleDefs);
            } else {
                defStyles.resolve();
            }

            return def;
        },
        doneReady: function() {
            return !!this.__ready_done__;
        },
        ready: function() {
            var widget = this.__widget__,
                instance = this.getInstance();

            _.def(this, '__ready_done__', true);

            var binds, i;

            // reset binds
            var bindsCache = instance.__binds__;
            if (_.isArray(bindsCache) && bindsCache.length) {
                for (i=0; i<bindsCache.length; i++) {
                    binds = bindsCache[i];
                    if (_.isArray(binds)) {
                        instance.unbind(binds[0], binds[1], binds[3]);
                    }
                }
                bindsCache.splice(0, bindsCache.length);
            }

            // update state
            var statechange = Widget.updateState.call(instance, 'beforeReady');

            // statechange
            if (false !== statechange) {
                instance.callOption('statechange', statechange);
            }

            // before ready
            instance.callOption('beforeReady');

            // bind events
            var bindsOpt = instance.callOption('binds');
            if (_.isArray(bindsOpt) && bindsOpt.length) {
                for (i=0; i<bindsOpt.length; i++) {
                    binds = bindsOpt[i];
                    if (_.isArray(binds)) {
                        instance.bind.apply(instance, binds);
                    }
                }
            }

            // lazy include
            instance.load({mode: 'lazy'});

            // ready included
            $.each(instance.__included__, function(i, included) {
                if (widget.instanceof(included)) {
                    var includeInst = included.getInstance();
                    if (includeInst.isLoaded()) {
                        included.ready();
                    }
                }
            });

            // update state
            statechange = Widget.updateState.call(instance, 'ready');

            // statechange
            if (false !== statechange) {
                instance.callOption('statechange', statechange);
            }

            // custom ready
            instance.callOption('ready');

            if (!instance.__already__) {
                _.def(instance, '__already__', true);
            }

            return this;
        },
        reset: function(state) {
            var instance = this.getInstance();

            // reset param
            var k;
            if (state && state.param) {
                for (k in state.param) {
                    if (k in instance.__state__.param) {
                        instance.__state__.param[k] = state.param[k];
                    } else {
                        delete instance.__state__.param[k];
                    }
                }
            }

            // reset includes
            instance.__includes__.splice(0, instance.__includes__.length);
            instance.__included__.splice(0, instance.__included__.length);

            // close WebSocket
            this.ws.close();

            _.def(this, '__ready_done__', false);

            return this;
        },
        beforeDestroy: function() {
            var widget = this.__widget__,
                instance = this.getInstance();

            var args = _.__aslice.call(arguments), flag;

            $.each(instance.__included__, function(i, included) {
                if (widget.instanceof(included)) {
                    flag = included.beforeDestroy.apply(included, args);
                    if (_.notNull(flag)) {
                        return false;
                    }
                }
            });

            // update state
            var statechange = Widget.updateState.call(instance, 'beforeDestroy');

            // statechange
            if (false !== statechange) {
                instance.callOption('statechange', statechange);
            }

            var _beforeDestroy = instance.get('beforeDestroy');

            // call beforeDestroy
            if (_.isNull(flag) && _.isFunction(_beforeDestroy)) {
                try {
                    flag = _beforeDestroy.apply(instance, args);
                } catch (e) {
                    var cbErr = instance.makeError('callback', [instance.getPath(), 'beforeDestroy', e.message], e);
                    flag = cbErr.message;
                }
            }

            return flag;
        },
        destroy: function() {
            var widget = this.__widget__,
                instance = this.getInstance();

            var statechange;

            // before destroy
            if (!instance.inState('beforeDestroy')) {
                // update state
                statechange = Widget.updateState.call(instance, 'beforeDestroy');
                // statechange
                if (false !== statechange) {
                    instance.callOption('statechange', statechange);
                }
                // before destroy
                instance.callOption('beforeDestroy');
            }

            // destroy included
            $.each(instance.__included__, function(i, included) {
                if (widget.instanceof(included)) {
                    included.destroy();
                }
            });

            // unbind events
            var bindsCache = instance.__binds__;
            if (_.isArray(bindsCache)) {
                var binds;
                for (var i=0; i<bindsCache.length; i++) {
                    binds = bindsCache[i];
                    if (_.isArray(binds)) {
                        instance.unbind(binds[0], binds[1], binds[3]);
                    }
                }
                bindsCache.splice(0, bindsCache.length);
            }

            // close WebSocket
            this.ws.close();

            return this;
        },
        destroyed: function() {
            var widget = this.__widget__,
                instance = this.getInstance();

            // destroyed included
            $.each(instance.__included__, function(i, included) {
                if (widget.instanceof(included)) {
                    included.destroyed();
                }
            });

            // reset props
            instance.__error__.splice(0, instance.__error__.length);
            instance.__includes__.splice(0, instance.__includes__.length);
            instance.__included__.splice(0, instance.__included__.length);

            _.def(instance, '__already__', false);

            _.def(this, '__ready_done__', false);

            // update state
            var statechange = Widget.updateState.call(instance, 'destroyed');

            // statechange
            if (false !== statechange) {
                instance.callOption('statechange', statechange);
            }

            // custom destroyed
            instance.callOption('destroyed');

            // dispose options
            var prop;
            for (prop in instance.__options__) {
                delete instance.__options__[prop];
            }
            for (prop in instance) {
                delete instance[prop];
            }

            return this;
        },
        readyStyle: function(container) {
            var $style = this.getState('$style');

            if (_.is$($style)) {
                var $head = $(_.document.head || 'head'),
                    $container;

                if (container) {
                    try {
                        $container = $(container);
                    } catch (e) {
                        $container = $head;
                    }
                }

                if (!$container || !$container.length) {
                    $container = $head;
                }

                if ($container === $head) {
                    $container.append($style);
                } else {
                    $container.prepend($style);
                }
            }

            return this;
        },
        destroyStyle: function(container) {
            var widget = this.__widget__,
                $style = this.getState('$style');
            widget.removeStyle$($style, container);
            return this;
        },
        // 销毁 ajax 请求等，释放资源占用
        dispose: function() {
            var widget = this.__widget__,
                instance = this.getInstance();

            // update state to dispose
            Widget.updateState.call(instance, 'dispose');

            // destroy self ajax
            this.ajax.abort(false);

            // destroy included ajax
            $.each(instance.__included__, function(i, included) {
                if (widget.instanceof(included)) {
                    included.dispose();
                }
            });

            return this;
        }
    };

    Widget.prototype.Creator = function(initializer, state, widget) {
        // Widget's Creator must be instantiated with Widget's Initializer instance.
        if (!(initializer instanceof widget.Initializer))
            throw widget.Error.make('initialized');

        if (this instanceof widget.Creator) {
            // init namespace
            _.def(this, '__ns__', widget.NAMESPACE);

            // init widget instance
            _.def(this, '__widget__', widget);

            // init creator instance
            _.def(this, '__initializer__', initializer);

            // init options
            _.def(this, '__options__', {});

            // init setter
            _.def(this, '__setter__', _.setter(widget.DEFAULTS, widget.Creator));

            // init getter
            _.def(this, '__getter__', _.getter(widget.DEFAULTS, widget.Creator));

            // 状态索引
            _.def(this, '__state_index__', Widget.STATE_INDEX['BEFORE_CREATE'], {
                configurable: true
            });

            _.def(this, '__state_index_getter__', _.stateIndexGetter(Widget.STATE, Widget.STATE_INDEX));

            // 错误缓冲区
            _.def(this, '__error__', []);

            // 错误命名空间
            _.def(this, '__error_ns__', 'WIDGET');

            // 错误创建器
            _.def(this, '__error_maker__', _.errorMaker(widget.Error));

            var self = this, key, options = initializer.getOptions();

            for (key in options) {
                if (_.__hasOwn.call(options, key)) {
                    var val = options[key];
                    if (!_.isUndef(val)) {
                        this.set(key, val);
                    }
                }
            }

            state = state || {};

            _.def(state, 'label', Widget.STATE[this.__state_index__]);

            // statechange
            this.callOption('statechange', state);

            // before create
            this.callOption('beforeCreate', state);

            // init state
            _.def(this, '__state_org__', state);
            _.stateReplacement.call(this, '__state__', state);

            // init cache
            if (this.__state__.data && this.__state__.data.reload) {
                this.removeCache();
                delete this.__state__.data.reload;
            }

            // 标记是否已执行过ready
            _.def(this, '__already__', false, {
                configurable: true
            });

            // 缓存已绑定事件
            _.def(this, '__binds__', []);

            // 缓存当前实例下引入子实例的状态
            _.def(this, '__includes__', []);

            // 缓存已创建的子实例
            _.def(this, '__included__', []);

            // 根上下文
            _.def(this, 'rootContext', widget.CONTEXT || this, {
                writable: false,
                configurable: false
            });

            // 当前上下文
            var context;
            if (state.include && widget.instanceof(state.include.context, widget.Creator)) {
                context = state.include.context;
            } else {
                context = widget.CONTEXT || this;
            }
            _.def(this, 'context', context, {
                writable: false
            });

            // 当前容器选择器
            _.def(this, 'container', widget.CONTAINER, {
                writable: false
            });

            // init binds option
            var bindsOpt = this.callOption('binds');
            if (!_.isArray(bindsOpt)) {
                bindsOpt = [];
            }
            var bindsList = [];
            $.each(bindsOpt, function(i, binds) {
                if (_.isArray(binds)) {
                    bindsList.push(Event.normalizeBindArgs.apply(Event, binds));
                }
            });
            this.set('binds', bindsList);

            // init loading option
            var loadingOpt = _.extend(
                {},
                widget.DEFAULTS.loading,
                this.callOption('loading'),
                {type: "include"}
            );
            this.set('loading', loadingOpt);

            // init cache option
            var cacheOption = this.callOption('cache');
            if (_.isNull(cacheOption)) {
                try {
                    cacheOption = this.rootContext.get('cache');
                    this.set('cache', cacheOption);
                } catch (e) {}
            }

            // init template option
            var templateOption = this.callOption('template'), renderOption;
            if (_.notNull(templateOption) && _.isObject(templateOption)) {
                if (Remote.instanceof(templateOption)) {
                    templateOption = templateOption.get();
                    if (_.notNull(templateOption) && !_.isObject(templateOption)) {
                        templateOption = {url: _.trim(templateOption)};
                    }
                }
                if (_.notNull(templateOption)) {
                    for (key in templateOption) {
                        if (!_.__hasOwn.call(Template.DEFAULTS, key)) {
                            renderOption = renderOption || {};
                            renderOption[key] = templateOption[key];
                            delete templateOption[key];
                        }
                    }
                } else {
                    renderOption = templateOption;
                }
            } else {
                renderOption = templateOption;
            }
            this.set('template', widget.defaultTemplate(renderOption));

            // init styleLoader option
            var styleLoaderOption = this.callOption('styleLoader');
            if (_.notNull(cacheOption)) {
                styleLoaderOption = _.extend({cache: cacheOption}, styleLoaderOption);
            }
            this.set('styleLoader', styleLoaderOption);

            // init mode option
            var modeOption = this.callOption('mode');
            this.set('mode', modeOption);

            // init ajax option
            var ajaxOption = this.callOption('ajax');
            if (_.notNull(modeOption)) {
                ajaxOption = _.extend({mode: modeOption}, ajaxOption);
            }
            this.set('ajax', ajaxOption);

            // init websocket option
            var wsOption = this.callOption('websocket');
            if (_.notNull(modeOption)) {
                wsOption = _.extend({mode: modeOption}, wsOption);
            }
            this.set('websocket', wsOption);

            // init cookie option
            this.set('cookie', this.callOption('cookie'));

            // template util
            var rendered = this.get('rendered');
            _.def(this, 'template', Template(
                _.extend(
                    {
                        cache: cacheOption,
                        include: function() {
                            return __include.apply(self, arguments);
                        }
                    },
                    templateOption,
                    _.isFunction(rendered) ? {rendered: rendered} : null
                ),
                this
            ), {
                writable: false,
                configurable: false
            });

            // template filename during render
            _.def(this, '__render_file__', null, {
                configurable: true
            });

            // styleLoader util
            _.def(this, 'styleLoader', StyleLoader(styleLoaderOption, this), {
                writable: false,
                configurable: false
            });

            // ajax util
            _.def(this, 'ajax', Ajax(ajaxOption, this), {
                writable: false,
                configurable: false
            });

            // webSocket util
            _.def(this, 'ws', WebSocket(wsOption, this), {
                writable: false,
                configurable: false
            });

            // cookie util
            _.def(this, 'cookie', Cookie(null, this), {
                writable: false,
                configurable: false
            });

            // init cookie util
            var cookieOption = this.get('cookie');
            if (_.notNull(cookieOption) && _.isObject(cookieOption)) {
                var cookieOpt;
                for (key in cookieOption) {
                    cookieOpt = cookieOption[key];
                    if (_.__hasOwn.call(Cookie.DEFAULTS, key)) {
                        this.cookie.setOption(key, cookieOpt);
                    } else if (!_.__hasProto.call(Cookie.prototype, key)) {
                        this.cookie[key] = cookieOpt;
                    }
                    cookieOpt = _.__undef__;
                }
            }

            // init cookie path
            this.cookie.setPath(this.getPath());

            // update state
            var statechange = Widget.updateState.call(this, 'created');

            // statechange
            if (false !== statechange) {
                this.callOption('statechange', statechange);
            }

            // created
            this.callOption('created');
        } else {
            return new widget.Creator(initializer, state, widget);
        }
    };

    Widget.prototype.Creator.prototype = {
        getInitializer: function() {
            return this.__initializer__;
        },
        getLayout: function() {
            return this.__layout__;
        },
        set: function(key, val) {
            var setter = this.__setter__, res;
            if (_.isFunction(setter)) {
                res = setter.apply(this, arguments);
            }
            if (false === res) {
                var err = this.makeError('setter', [this.getPath(), key]);
                this.addError(err);
                var widget = this.__widget__;
                if (this.afterState('beforeLoad')) {
                    widget.Event.trigger('Error', err);
                }
            }
            return this;
        },
        get: function(key) {
            var getter = this.__getter__, val;
            if (_.isFunction(getter)) {
                val = getter.apply(this, arguments);
            }
            return val;
        },
        getOptions: function() {
            return _.extend(true, {}, this.__options__);
        },
        callOption: function(name, arg) {
            var args = _.__aslice.call(arguments, 1);
            return this.applyOption(name, args);
        },
        applyOption: function(name, args) {
            var option, res;

            if (!_.isArray(args)) {
                if (!_.isUndef(args)) {
                    args = [args];
                } else {
                    args = [];
                }
            }

            if (_.isFunction(name)) {
                option = name;
                name = option.name;
            } else {
                option = this.get(name);
            }

            var err,
                errProps = {
                    __caller_name__: name
                };

            if (_.isFunction(option)) {
                try {
                    res = option.apply(this, args);
                } catch (e) {
                    err = _.setPropsRecursive(
                        this.makeError('callback', [this.getPath(), name, e.message], e),
                        errProps
                    );
                    this.addError(err);
                    res = _.__undef__;
                }
            } else {
                res = option;
            }

            if (!_.isEmpty(err) && this.afterState('beforeLoad')) {
                var widget = this.__widget__;
                widget.Event.trigger('Error', err);
            }

            return res;
        },
        setState: function(key, val) {
            var stateSetter = _.stateSetter(this.__state__, this.__state_org__);
            if (_.isFunction(stateSetter)) {
                stateSetter.apply(this, arguments);
            }
            return this;
        },
        getState: function(key) {
            var val, stateGetter = _.stateGetter(this.__state__);
            if (_.isFunction(stateGetter)) {
                val = stateGetter.apply(this, arguments);
            }
            return val;
        },
        /**
         * 获取状态索引
         * @param label_or_index 状态标签或索引
         * @returns {undefined|number}
         */
        getStateIndex: function(label_or_index) {
            var index, stateIndexGetter = this.__state_index_getter__;
            if (_.isFunction(stateIndexGetter)) {
                index = stateIndexGetter.apply(this, arguments);
            }
            return index;
        },
        /**
         * 判断当前状态是否正处于指定状态
         * @param label_or_index 状态标签或索引
         * @returns {boolean}
         */
        inState: function(label_or_index) {
            var bin = false,
                index = this.getStateIndex(label_or_index);
            if (!_.isUndef(index) && this.__state_index__ == index) {
                bin = true;
            }
            return bin;
        },
        /**
         * 判断当前状态是否在指定状态之前
         * @param label_or_index 状态标签或索引
         * @returns {boolean}
         */
        beforeState: function(label_or_index) {
            var before = false,
                index = this.getStateIndex(label_or_index);
            if (!_.isUndef(index) && this.__state_index__ < index) {
                before = true;
            }
            return before;
        },
        /**
         * 判断当前状态是否在指定状态之后
         * @param label_or_index 状态标签或索引
         * @returns {boolean}
         */
        afterState: function(label_or_index) {
            var after = false,
                index = this.getStateIndex(label_or_index);
            if (!_.isUndef(index) && this.__state_index__ > index) {
                after = true;
            }
            return after;
        },
        isBeforeCreate: function() {
            return this.inState('beforeCreate');
        },
        isCreated: function() {
            return this.inState('created');
        },
        isBeforeLoad: function() {
            return this.inState('beforeLoad');
        },
        isLoaded: function() {
            return this.inState('loaded');
        },
        isBeforeReady: function() {
            return this.inState('beforeReady');
        },
        isReady: function() {
            return this.inState('ready');
        },
        isBeforeDestroy: function() {
            return this.inState('beforeDestroy');
        },
        isDestroyed: function() {
            return this.inState('destroyed');
        },
        isDispose: function() {
            return this.inState('dispose');
        },
        already: function() {
            return !!this.__already__;
        },
        getUrl: function(path, params) {
            var widget = this.__widget__, relativePath;
            if (_.notNull(this.__render_file__)) {
                relativePath = widget.trimTemplatePath(this.__render_file__);
            } else {
                relativePath = this.getPath();
            }
            var url = _.toUrl(path, params, relativePath);
            if (!widget.REGEXP_HASH_START.test(url)) {
                url = "#" + url;
            }
            return url;
        },
        getPath: function(path) {
            return _.getPath(path, this.getState('path'));
        },
        getPathId: function(path) {
            return _.getPathId(path, this.getState('path'));
        },
        getParam: function(name) {
            return _.getParam(name, this.getParams());
        },
        getParams: function() {
            return this.getState('param') || {};
        },
        getData: function(key) {
            var data = this.getState('data'), val;
            if (data) {
                if (_.isUndef(key)) {
                    val = data;
                } else {
                    key = _.trim(key);
                    if (key.length > 0) {
                        val = data[key];
                    }
                }
                val = _.copyValue(val);
            }
            return val;
        },
        setData: function(key, val) {
            if (this.__state__ && this.__state__.data && _.notNull(key)) {
                if (_.isObject(key)) {
                    for (var k in key) {
                        _.def(this.__state__.data, k, key[k], {
                            enumerable: true
                        });
                    }
                } else {
                    key = _.trim(key);
                    if (key.length > 0) {
                        _.def(this.__state__.data, key, val, {
                            enumerable: true
                        });
                    }
                }
            }
            return this;
        },
        getCache: function(key) {
            var args = _.__aslice.call(arguments),
                initializer = this.getInitializer();

            var cacheKey = this.getCacheKey();
            if (!_.isEmpty(cacheKey)) {
                args.unshift(cacheKey);
                return initializer.getCache.call(initializer, args);
            } else {
                return initializer.getCache.apply(initializer, args);
            }
        },
        setCache: function(key, val) {
            var args = _.__aslice.call(arguments),
                initializer = this.getInitializer();

            var cacheKey = this.getCacheKey();
            if (!_.isEmpty(cacheKey)) {
                if (!_.isArray(args[0])) {
                    args[0] = [args[0]];
                }
                args[0].unshift(cacheKey);
            }

            initializer.setCache.apply(initializer, args);

            return this;
        },
        removeCache: function(key) {
            var args = _.__aslice.call(arguments),
                initializer = this.getInitializer();

            var cacheKey = this.getCacheKey();
            if (!_.isEmpty(cacheKey)) {
                args.unshift(cacheKey);
                initializer.removeCache.call(initializer, args);
            } else {
                initializer.removeCache.apply(initializer, args);
            }

            return this;
        },
        getCacheKey: function() {
            if (this.__cacheKey__) {
                return this.__cacheKey__;
            }
            var cacheKey = [],
                widget = this.__widget__,
                context = this.context;
            if (context !== this.rootContext) {
                cacheKey.push(this.getState('name'));
                var include = this.getState('include'),
                    index = include ? include.id : _.__undef__;
                if (!_.isUndef(index)) {
                    cacheKey.push(index);
                }
                while (
                    widget.instanceof(context, widget.Creator)
                    && context !== this.rootContext
                ) {
                    cacheKey.push(context.getState('name'));
                    context = context.context;
                }
            } else {
                cacheKey.push(this.getState('name'));
            }

            cacheKey = "__" + cacheKey.join('_') + "__";

            _.def(this, '__cacheKey__', cacheKey);

            return cacheKey;
        },
        /**
         * 获取当前容器的ID
         * @returns {string}
         */
        getContainerId: function() {
            var widget = this.__widget__,
                containerId = this.getState('container');
            if (!containerId) {
                containerId = _.trim(this.container);
            }
            containerId = containerId.replace(widget.REGEXP_HASH_START, "");
            return containerId;
        },
        /**
         * 查找指定元素层下的子模块元素
         * @param wrapper {*|jQuery|HTMLElement}
         *          - 父层元素 默认为当前的容器
         * @param index {Integer} 元素次序，从 0 开始计数
         * @returns {*|jQuery|HTMLElement}
         */
        findInclude: function(wrapper, index) {
            var $wrapper = this.to$(wrapper),
                includeSelector = this.includeSelector();
            if (_.notNull(index)) {
                index = parseInt(index);
                includeSelector = includeSelector + ":eq(" + index + ")";
            }
            return $(includeSelector, $wrapper);
        },
        /**
         * 查找指定元素层下的第一个子模块元素
         * @param wrapper {*|jQuery|HTMLElement}
         *          - 父层元素 默认为当前的容器
         * @returns {*|jQuery|HTMLElement}
         */
        firstInclude: function(wrapper) {
            var $wrapper = this.to$(wrapper),
                includeSelector = this.includeSelector();
            return $(includeSelector + ':first', $wrapper);
        },
        /**
         * 查找指定元素层下的最后一个子模块元素
         * @param wrapper {*|jQuery|HTMLElement}
         *          - 父层元素 默认为当前的容器
         * @returns {*|jQuery|HTMLElement}
         */
        lastInclude: function(wrapper) {
            var $wrapper = this.to$(wrapper),
                includeSelector = this.includeSelector();
            return $(includeSelector + ':last', $wrapper);
        },
        readyInclude: function(errIncluded, resIncluded) {
            if (this.isDestroyed() || this.isDispose() || this.beforeState('ready')) return this;

            var widget = this.__widget__;

            if (_.isArray(resIncluded)) {
                for (var i=0; i<resIncluded.length; i++) {
                    readyIncluded.call(this, errIncluded ? errIncluded[i] : _.__undef__, resIncluded[i]);
                }
            } else {
                readyIncluded.call(this, errIncluded, resIncluded);
            }

            function readyIncluded(errIncluded, resIncluded) {
                if (_.isNull(resIncluded) || this.isDestroyed() || this.isDispose()) return this;

                var launcher = resIncluded.context;

                if (widget.instanceof(launcher)) {
                    var instance = launcher.getInstance();

                    var $container;
                    try {
                        $container = $(instance.container);
                    } catch (e) {
                        $container = null;
                    }

                    if ($container && $container.length) {
                        if (!launcher.doneReady()) {
                            launcher.readyStyle($container).ready();
                        }
                    } else {
                        _.requestAnimationFrame.call(this, readyIncluded, _.__aslice.call(arguments), 30);
                    }
                }
            }

            return this;
        },
        includeSelector: function() {
            var widget = this.__widget__,
                widgetInclude = widget.INCLUDE_WIDGET;
            return '[id^="' + widgetInclude.CONTAINER_ID + '"][' + widgetInclude.BIND_KEY + ']';
        },
        /**
         * 转换为 jQuery 对象
         * @param dom {*|jQuery|HTMLElement}
         *          - 默认为当前的容器
         * @returns {Undefined|jQuery}
         */
        to$: function(dom) {
            if (_.isEmpty(dom)) {
                dom = this.container;
            }

            var $dom;

            try {
                if (_.is$(dom)) {
                    $dom = dom;
                } else {
                    $dom = $(dom);
                }
            } catch (e) {
                $dom = _.__undef__;
            }

            return $dom;
        },
        /**
         * 根据选择器参数获取当前容器下的 jquery 对象，屏蔽子容器
         * @param selector 选择器
         * @returns {*|jQuery|HTMLElement}
         */
        $: function(selector) {
            var $container = this.to$() || $([]), $all;

            if (!_.isDom(selector) && !_.is$(selector)) {
                selector = _.trim(selector);
            }

            if (_.isEmpty(selector)) return $([]);

            try {
                if (/^window$/i.test(selector)) {
                    return $(_.window);
                } else if (/^document$/i.test(selector)) {
                    return $(_.document);
                } else if (_.isDom(selector)) {
                    return $(selector);
                } else if (_.is$(selector)) {
                    return selector;
                } else {
                    $all = $(selector, $container);
                }
            } catch (e) {
                $all = $([]);
            }

            if (!$all.prevObject || !$all.prevObject.length) {
                $all.prevObject = $container;
            }

            if (!$all.length) return $all;

            var self = this, $in = $([]),
                includeSelector = this.includeSelector();

            $all.each(function() {
                var $this = $(this);

                // 查找是否处于 include 容器内，如果存在上层的 include 容器，则过滤掉
                var closestContainer = $this.parents(includeSelector + ':first').attr('id');

                if (!closestContainer) {
                    closestContainer = self.container;
                } else {
                    closestContainer = '#' + closestContainer;
                }

                if (closestContainer === self.container) {
                    $in = $in.add($this);
                }
            });

            $in.selector = $all.selector;
            $in.context = $all.context;
            $in.prevObject = $all.prevObject;

            return $in;
        },
        bind: function(eventName, element, data, handler, /*INTERNAL*/ one) {
            var self = this, widget = this.__widget__;

            if (this.isDestroyed() || this.isDispose()) return this;

            // eventName can be a map of eventName/handlers
            if (_.notNull(eventName) && _.isObject(eventName)) {
                // ( eventName-Object, selector, data )
                if (!_.validElement(element)) {
                    // ( types-Object, data )
                    data = data || element;
                    element = _.__undef__;
                }
                for (var evtName in eventName) {
                    this.bind(evtName, element, data, eventName[evtName], one);
                }
                return this;
            }

            var args = Event.normalizeBindArgs.apply(this, arguments);

            if (!args) return this;

            eventName = args[0];
            element = args[1];
            data = args[2];
            handler = args[3];

            if (this.beforeState('beforeReady')) {
                // 当前容器内容还未显示时，加入配置项
                var bindsOpt = self.get('binds');
                if (!_.isArray(bindsOpt)) {
                    bindsOpt = [];
                }
                bindsOpt.push([eventName, element, data, handler, one]);
                self.set('binds', bindsOpt);
                return this;
            }

            if (handler) {
                handler.context = self;
            }

            // bind
            if (_.is$(element)) {
                if (handler && element.prevObject) {
                    handler.delegateTarget = element.prevObject[0];
                }
                widget.Event.bind(eventName, element, data, handler, one);
            } else {
                if (/^viewchange/.test(eventName)) {
                    element = _.window;
                } else if (!element) {
                    element = self.to$();
                } else {
                    element = self.$(element);
                }
                if (handler) {
                    var $container = self.to$();
                    if ($container) {
                        handler.delegateTarget = $container[0];
                    }
                }
                widget.Event.bind(eventName, element, data, handler, one);
            }

            var bindsCache = self.__binds__;

            // push binds cache
            if (inBinds(eventName, element, data, handler, one) == -1) {
                bindsCache.push([eventName, element, data, handler, one]);
            }

            function inBinds(eventName, element, data, handler, one) {
                var pos = -1, binds;
                for (var i=0; i<bindsCache.length; i++) {
                    binds = bindsCache[i];
                    if (_.isArray(binds)) {
                        if (binds[0] === eventName
                            && binds[1] === element
                            && binds[2] === data
                            && binds[3] === handler
                            && binds[4] === one
                        ) {
                            pos = i;
                            break;
                        }
                    }
                }
                return pos;
            }

            return this;
        },
        on: function() {
            return this.bind.apply(this, arguments);
        },
        one: function(eventName, element, data, handler) {
            return this.bind(eventName, element, data, handler, 1);
        },
        unbind: function(eventName, element, handler) {
            var self = this, widget = this.__widget__;

            var args = Event.normalizeUnBindArgs.apply(Event, arguments);

            eventName = args[0];
            element = args[1];
            handler = args[2];

            if (_.is$(element)) {
                widget.Event.unbind(eventName, element, handler);
            } else {
                if (/^viewchange/.test(eventName)) {
                    element = _.window;
                } else if (!element) {
                    element = self.to$();
                } else {
                    element = self.$(element);
                }
                widget.Event.unbind(eventName, element, handler);
            }

            return this;
        },
        off: function() {
            return this.unbind.apply(this, arguments);
        },
        trigger: function(eventName, data, element) {
            var self = this, widget = this.__widget__;

            if (this.isDestroyed() || this.isDispose()) return this;

            if (this.beforeState('ready')) {
                widget.Event.trigger.apply(widget.Event, arguments);
                return this;
            }

            var args = Event.normalizeTriggerArgs.apply(Event, arguments);

            eventName = args[0];
            data = args[1];
            element = args[2];

            if (_.is$(element)) {
                widget.Event.trigger(eventName, data, element);
            } else {
                if (/^viewchange/.test(eventName)) {
                    element = _.window;
                } else if (!element) {
                    element = self.to$();
                } else {
                    element = self.$(element);
                }
                widget.Event.trigger(eventName, data, element);
            }

            return this;
        },
        /**
         * 创建错误对象
         * @param id {String} 错误标识
         * @param option {Object|Array} 配置项
         *        * 为 Object 类型时
         *        - level {String} 错误级别，不限大小写。可选为 'page', 'app', 'widget', 'console'. 默认为 'console'
         *        - args {Object|Array} 错误信息编译参数
         *        - message {String} 自定义错误信息
         *        * 为 Array 类型时，作为 args 配置项
         * @param originalError {Error} 原错误对象
         * @returns {Error}
         */
        makeError: function(id, option, originalError) {
            var errorMaker = this.__error_maker__, err;
            if (_.isFunction(errorMaker)) {
                err = errorMaker.apply(this, arguments);
            }
            return err || {};
        },
        /**
         * 设置错误缓冲区中的错误对象
         * @param err(s) {Error|Array} 错误信息对象
         *        - 参数可传入任意多个
         *        - 不传入参数时将清空所有错误信息
         * @returns {Widget.prototype.Creator}
         */
        setError: function(err) {
            this.__error__.splice(0, this.__error__.length);
            this.addError.apply(this, arguments);
            return this;
        },
        /**
         * 获取错误缓冲区中的错误对象
         * @param filter {Object} 过滤条件
         *        - 键值分别为要查找的错误对象的键和值
         *        - 若值为正则表达式，则根据正则的匹配结果过滤
         *        - 键以叹号(!)开头时，则对匹配结果取非
         *        - 不传入此参数时返回所有错误信息
         * @returns {Array}
         */
        getError: function(filter) {
            if (_.isNull(filter)) {
                return _.isEmpty(this.__error__) ? [] : [].concat(this.__error__);
            } else {
                return _.sliceError(this.__error__, filter);
            }
        },
        /**
         * 往错误缓冲区内添加错误信息
         * @param err(s) {Error|Array} 错误信息对象
         *        - 参数可传入任意多个
         * @returns {Widget.prototype.Creator}
         */
        addError: function(err) {
            var args = _.__aslice.call(arguments);
            args.unshift(this.__error__);
            var errArr = _.concatError.apply(_, args);
            this.__error__.splice(0, this.__error__.length);
            this.__error__.push.apply(this.__error__, errArr);
            return this;
        },
        /**
         * 从错误缓冲区中删除错误信息
         * @param err(s) {Error|Array} 错误信息对象
         *        - 参数可传入任意多个
         * @returns {Widget.prototype.Creator}
         */
        removeError: function(err) {
            var args = _.__aslice.call(arguments);
            args.unshift(this.__error__);
            var errArr = _.shiftError.apply(_, args);
            this.__error__.splice(0, this.__error__.length);
            this.__error__.push.apply(this.__error__, errArr);
            return this;
        },
        /**
         * 筛选在错误缓冲区内的错误对象
         * @param bRemove {Boolean} 是否删除在错误缓冲区内的错误对象
         * @param err(s) {Error|Array} 错误对象
         *        - 参数可传入任意多个
         * @returns {Array}
         */
        includeError: function(bRemove, err) {
            var args = _.__aslice.call(arguments);
            args.unshift(this.__error__);
            return _.includeError.apply(_, args);
        },
        /**
         * 筛选不在错误缓冲区内的错误对象
         * @param bRemove {Boolean} 是否删除在错误缓冲区内的错误对象
         * @param err(s) {Error|Array} 错误对象
         *        - 参数可传入任意多个
         * @returns {Array}
         */
        excludeError: function(bRemove, err) {
            var args = _.__aslice.call(arguments);
            args.unshift(this.__error__);
            return _.excludeError.apply(_, args);
        },
        /**
         * 获取错误对象在错误缓冲区内的位置
         * @param err(s) {Error|Array} 错误信息对象
         *        - 可为任意多个参数
         *        - 多个错误信息对象参数时。若有一个不在，则返回 -1；否则，返回第一个错误对象所在的位置
         * @returns {Integer} 不存在时，返回 -1
         */
        inError: function(err) {
            var args = _.__aslice.call(arguments);
            args.unshift(this.__error__);
            return _.inError.apply(_, args);
        },
        /**
         * 自定义错误信息的处理方法
         * @param err(s)   {Error|Array} 错误信息对象
         * @param callback {Function}    自定义回调方法
         * @returns {Widget.prototype.Creator}
         */
        onError: function(err, callback) {
            if (_.isFunction(callback)) {
                _.setPropsRecursive(err, {__err_handler__: callback});
            }
            return this;
        },
        /**
         * 设置错误信息属性和值
         * @param err(s)     {Error|Array} 要设置的错误信息
         * @param props      {Object}       键值对
         * @param descriptor {Object}       同 Object.defineProperty 的 descriptor 参数
         *        - writable     如果为false，属性的值就不能被重写。
         *        - enumerable   是否能在for...in循环中遍历出来或在Object.keys中列举出来。
         *        - configurable 如果为false，则任何尝试删除目标属性或修改属性以下特性（writable, configurable, enumerable）的行为将被无效化。
         * @returns {Widget.prototype.Creator}
         */
        assignError: function(err, props, descriptor) {
            var widget = this.__widget__;
            props = widget.Error.normalizeOption(props);
            _.setPropsRecursive(err, props, descriptor);
            return this;
        },
        /**
         * 加载远程模板内容并渲染
         * @param options   {String|Object|Remote} 模板文本内容|配置项
         * - {Object} 模板配置项
         *     - url {String}
         *           模板文件地址，相对于入口js的位置
         *     - source {String}
         *           模板文本内容，若存在 url 配置项，则忽略此配置项
         *     - data {Object|Remote}
         *           模板编译时传入的数据，为Remote类型时（App.remote）将远程获取数据
         *     - dataFilter {Function}
         *           模板编译前对传入数据的预处理，传入参数为 data 或 ajax请求返回的数据，返回值作为模板编译时的传入数据
         *     - callback {Function}
         *           模板编译后的回调函数，传入参数为 { [err] - 编译错误信息 }, { [htmlText] - 模板编译后的字符串文本 }, { [data] - 模板编译使用的数据 }, { [source] - 模板文本内容 }
         * - {String} 模板文本内容，同 options.source
         * - {Remote} 获取初始化参数，若为 Object 类型，作为配置项，否则，作为模板文件地址，同 options.utl
         * @param data        {Object|Remote}  可选。同 options.data，存在则忽略 options.data
         * @param dataFilter  {Function}       可选。同 options.dataFilter，存在则忽略 options.dataFilter
         * @param callback    {Function}       可选。同 options.callback，存在则忽略 options.callback
         *
         * @returns {Deferred.promise}  jquery延迟promise对象。done状态下的回调函数同callback
         */
        render: function(options, data, dataFilter, callback) {
            var self = this, widget = this.__widget__;

            // filter args
            var url, source;

            if (Remote.instanceof(options)) {
                options = options.get();
                if (_.notNull(options) && !_.isObject(options)) {
                    options = {url: options};
                }
            }

            if (_.isFunction(data)) {
                if (_.isFunction(dataFilter)) {
                    dataFilter = data;
                    callback   = dataFilter;
                } else {
                    dataFilter = _.__undef__;
                    callback   = data;
                }
                data = _.__undef__;
            } else if (_.isFunction(dataFilter) && !_.isFunction(callback)) {
                callback   = dataFilter;
                dataFilter = _.__undef__;
            }

            if (_.notNull(options)) {
                if (_.isObject(options)) {
                    url        = options.url;
                    source     = options.source;
                    if (_.isUndef(data)) {
                        data = options.data;
                    }
                    if (_.isUndef(dataFilter)) {
                        dataFilter = options.dataFilter;
                    }
                    if (_.isUndef(callback)) {
                        callback = options.callback;
                    }
                } else {
                    source = _.trim(options);
                }
            }

            var bRenderSelf = options ? !!options.__self__ : false;

            url = normalizeTplUrl(url);

            var def = $.Deferred();

            var tempProps = {__caller_name__: NS_LOWER + ".render"},
                props = _.extend({context: self}, tempProps);

            (function(def, bRenderSelf, url, source, data, dataFilter, callback) {

                def.done(function(err, htmlText, data, source) {
                    var args = _.__aslice.call(arguments);
                    _.requestAnimationFrame.call(self, function(err, htmlText, data, source, argsInclude) {
                        err = _.setPropsRecursive(err, props);

                        var self = this;

                        self.addError(err);

                        var errs;

                        if (_.isFunction(callback)) {
                            try {
                                callback.apply(self, arguments);
                                _.normalizeCallbackArgs(callback, arguments);
                            } catch (e) {
                                var cbErr = _.setPropsRecursive(
                                    self.makeError('callback', [self.getPath(), 'render callback', e.message], e),
                                    props
                                );
                                self.addError(cbErr);
                            }
                        }

                        errs = self.getError(tempProps);

                        if (!_.isEmpty(errs) && self.afterState('beforeLoad')) {
                            widget.Event.trigger('Error', errs);
                        }

                        // ready included
                        if (_.isArray(argsInclude)) {
                            self.readyInclude.apply(self, argsInclude);
                        }
                    }, args);
                });

                var defData = $.Deferred(), defTpl = $.Deferred();

                $.when(defData, defTpl).done(function(argsData, argsTpl) {
                    var err;

                    if (argsData[0]) {
                        err = argsData[0];
                        self.addError(argsData[0]);
                    }

                    var filteredData;

                    if (_.isFunction(dataFilter)) {
                        var argsDataFilter = [].concat(argsData);
                        argsDataFilter.unshift(dataFilter);
                        filteredData = self.template.dataFilter.apply(self.template, argsDataFilter);
                        err = self.includeError(true, err);
                        if (_.notNull(dataFilter.__err_called__)) {
                            err = _.concatError(err, dataFilter.__err_called__);
                        }
                    } else {
                        filteredData = argsData[1];
                    }

                    self.removeError(err);

                    var renderData = Template.normalizeData(filteredData);

                    renderData = _.extend({}, renderData, {
                        $param: self.getState('param'),
                        $include: self.getData('$include')
                    });

                    if (argsTpl[0]) {
                        err = _.concatError(err, argsTpl[0]);
                    }

                    if (_.isEmpty(err)) {
                        err = _.__undef__;
                    }

                    argsTpl = argsTpl.slice(1);

                    if (!_.isUndef(argsTpl[0])) {
                        self.template.render(argsTpl[0], renderData, argsTpl[1], function(err2, htmlText, data, source, argsInclude) {
                            if (err2) {
                                self.removeError(err2);
                                err = _.concatError(err, err2);
                            }
                            argsInclude && _.def(argsInclude, '__do_ready__', true);
                            def.resolve(err, htmlText, filteredData, argsTpl[0], argsInclude);
                        });
                    } else {
                        def.resolve(err, _.__undef__, filteredData, argsTpl[0]);
                    }
                });

                // load data
                var remoteData = false;
                if (Remote.instanceof(data)) {
                    data = data.get();
                    remoteData = true;
                }
                if (_.isPromise(data)) {
                    data.done(function() {
                        var args = _.__aslice.call(arguments);
                        args.unshift(_.__undef__);
                        defData.resolve.apply(defData.resolve, args);
                    }).fail(function() {
                        var args = _.__aslice.call(arguments);
                        if (_.notNull(args[0]) && !_.isObject(args[0])) {
                            args[0] = {message: _.trim(args[0])};
                        }
                        defData.resolve.apply(defData.resolve, args);
                    });
                } else if(remoteData && _.notNull(data)) {
                    self.ajax.send(data, function(err, resp, xhr) {
                        if (err) {
                            self.removeError(err);
                        }
                        defData.resolve(err, resp, xhr);
                    });
                } else {
                    defData.resolve(_.__undef__, data);
                }

                // load template
                if (url) {
                    self.template.remote(url, function(err, res) {
                        if (err) {
                            self.removeError(err);
                        }
                        if (bRenderSelf && res && _.notNull(res.filename)) {
                            self.setState('template', res.filename);
                        }
                        defTpl.resolve(err, res ? res.source : _.__undef__, res ? res.filename : _.__undef__);
                    });
                } else {
                    defTpl.resolve(_.__undef__, source || _.__undef__);
                }

            })(def, bRenderSelf, url, source, data, dataFilter, callback);

            function normalizeTplUrl(url) {
                if (!_.isEmpty(url)) {
                    url = _.trim(url);
                    // init relative path
                    url = _.toUrl(url, null, self.getPath());
                    // init template path
                    url = widget.normalizeTemplatePath(url);
                } else {
                    url = _.__undef__;
                }
                return url;
            }

            return def.promise();
        },
        /**
         * 加载(通过 include 方式引入的)子模块的内容
         * @param filter  {String|jQuery|Object}
         * - 为 String 类型时，作为模块容器元素的id
         * - 为 jQuery 对象类型时，获取其id
         * - 为 Object 类型时，为过滤条件，可包含以下属性
         *       - id   {String|jQuery} 容器元素的id
         *       - mode {String|Array}  引入模式，可选为 ['include', 'lazy', 'trigger']
         * @param params {Object} 设置引入模块的参数
         * @returns {Widget.prototype.Creator}
         */
        load: function(filter, params) {
            var self = this, widget = this.__widget__.INCLUDE_WIDGET || this;

            if (!_.isEmpty(filter)) {
                var id;

                if (_.is$(filter)) {
                    try {
                        if (_.isNull(filter.attr(widget.BIND_KEY))) {
                            filter = self.firstInclude(filter);
                        }
                        if (filter.length) {
                            id = filter.attr('id');
                            filter = {};
                        } else {
                            filter = _.__undef__;
                        }
                    } catch (e) {
                        filter = _.__undef__;
                    }
                } else if (!_.isObject(filter)) {
                    id = filter;
                    filter = {};
                } else {
                    id = filter.id;
                }

                if (!filter) return this;

                if (!_.isEmpty(id)) {
                    id = _.trim(id).replace(widget.REGEXP_HASH_START, "");

                    var prefixDomId = widget.CONTAINER_ID + "-";

                    if (id.indexOf(prefixDomId) == 0) {
                        id = id.substring(prefixDomId.length);
                    }

                    id && (filter.id = id);
                }
            }

            // 过滤条件为空则不触发加载
            if (_.isEmpty(filter)) return this;

            var includes = widget.sliceIncludes(this.__includes__, filter);

            // 未找到相应子模块不触发加载
            if (_.isEmpty(includes)) return this;

            // 初始化参数
            if (_.notNull(params) && !_.isObject(params)) {
                params = _.trim(params);
                if (params.indexOf('?') == -1) {
                    params = '?' + params;
                }
                try {
                    params = $.parseQuery(params);
                } catch (e) {
                    params = _.__undef__;
                }
            }

            // 加载预处理
            $.each(includes, function(i, stateInclude) {
                // 更新参数
                if (params) {
                    if (_.isEmpty(stateInclude.param)) {
                        stateInclude.param = _.extend({}, params);
                    } else {
                        for (var k in stateInclude.param) {
                            if (!(k in params)) {
                                delete stateInclude.param[k];
                            }
                        }
                        stateInclude.param = _.extend(stateInclude.param, params);
                    }
                }
                // 显示加载进度效果
                readyLoading(stateInclude);
            });

            // 异步加载子模块
            widget.includeAsync(includes, self.__included__, function(errIncluded, resIncluded) {
                if (resIncluded) {
                    var state, launcher, includeInst, isDestroy = false;

                    if (widget.instanceof(launcher = resIncluded.context)) {
                        includeInst = launcher.getInstance();
                        state = includeInst.getState();
                        if (widget.instanceof(includeInst.context, widget.Creator)) {
                            isDestroy = includeInst.context.isDestroyed() || includeInst.context.isDispose();
                        }
                    } else {
                        state = resIncluded.state;
                    }

                    if (_.isEmpty(errIncluded) && _.isUndef(resIncluded.html)) {
                        resIncluded.html = '';
                    }

                    destroyLoading(state);

                    if (isDestroy) return;

                    renderHtml(resIncluded, state);

                    if (errIncluded) {
                        widget.Event.trigger('IncludeError', errIncluded);
                    }
                }
            });

            function readyLoading(state) {
                if (state) {
                    var loadingOpt = _.extend({}, self.get('loading'), {
                        id: 'include-' + state.id,
                        container: state.container
                    });

                    var loading = Loading(loadingOpt, self);

                    state.__loading__ = loading;

                    loading.ready();
                }
            }

            function destroyLoading(state) {
                if (state) {
                    var loading = state.__loading__;
                    if (loading instanceof Loading) {
                        loading.destroy();
                    }
                    delete state.__loading__;
                }
            }

            function renderHtml(resIncluded, state) {
                if (resIncluded && state) {
                    var $container = $(state.container);
                    // render html
                    if (!_.isUndef(resIncluded.html)) {
                        $container.html(resIncluded.html);
                    }
                    // ready content
                    var launcher;
                    if (widget.instanceof(launcher = resIncluded.context)) {
                        if (_.inArray(launcher, self.__included__) < 0) {
                            self.__included__.push(launcher);
                        }
                        launcher.readyStyle($container).ready();
                    }
                }
            }

            return this;
        }
    };

    _.def(Widget.prototype.Creator.prototype, '__const_props__', [
        '__ns__', '__widget__', '__initializer__',
        '__options__',
        '__setter__', '__getter__',
        '__error__', '__error_ns__', '__error_maker__',
        '__state_index__', '__state_index_getter__',
        '__state_org__', '__state__',
        '__already__', '__binds__',
        '__includes__', '__included__',
        '__render_file__',
        'rootContext', 'context', 'container',
        'ajax', 'template', 'styleLoader', 'ws', 'cookie'
    ]);

    Widget.prototype.Initializer = function(options, widget) {
        if (this instanceof widget.Initializer) {
            _.def(this, '__widget__', widget);
            _.def(this, '__options__', _.extend({}, widget.DEFAULTS, options));
            _.def(this, '__cache__', {});
        } else {
            return new widget.Initializer(options, widget);
        }
    };

    Widget.prototype.Initializer.prototype = {
        // 配置项
        set: function(key, val) {
            var widget = this.__widget__;
            if (!_.isFunction(this.__setter__)) {
                _.def(this, '__setter__', _.optionSetter(widget.DEFAULTS));
            }
            this.__setter__.apply(this, arguments);
            return this;
        },
        get: _.optionGetter(),
        getOptions: _.optionsGetter(),
        // 缓存
        getCache: function(key) {
            var val;
            if (this.__cache__) {
                var cache = this.__cache__, k;

                if (_.isArray(key)) {
                    for (var i=0; i<key.length; i++) {
                        k = _.trim(key[i]);
                        if (_.isNull(cache)) break;
                        if (!_.isEmpty(k) && i < key.length - 1) {
                            cache = cache[k];
                        }
                    }
                } else if (!_.isUndef(key)) {
                    k = _.trim(key);
                }

                key = k;

                if (_.isNull(key)) {
                    val = cache;
                } else if (!_.isEmpty(key) && _.notNull(cache)) {
                    val = cache[key];
                }

                val = _.copyValue(val);
            }
            return val;
        },
        setCache: function(key, val) {
            if (this.__cache__) {
                var cache = this.__cache__, kInner, k;
                if (_.isArray(key)) {
                    for (var i=0; i<key.length; i++) {
                        kInner = key[i];
                        if (_.notNull(kInner)) {
                            if (_.isObject(kInner)) {
                                for (k in kInner) {
                                    cache[k] = kInner[k];
                                }
                                break;
                            } else if (!_.isEmpty(kInner)) {
                                kInner = _.trim(kInner);
                                if (i == key.length - 1) {
                                    cache[kInner] = val;
                                } else {
                                    if (_.isNull(cache[kInner]) || !_.isObject(cache[kInner])) {
                                        cache[kInner] = {};
                                    }
                                    cache = cache[kInner];
                                }
                            }
                        }
                    }
                } else if (_.notNull(key)) {
                    if (_.isObject(key)) {
                        for (kInner in key) {
                            cache[key] = key[kInner];
                        }
                    } else if (!_.isEmpty(key)) {
                        key = _.trim(key);
                        cache[key] = val;
                    }
                }
            }
            return this;
        },
        removeCache: function(key) {
            if (this.__cache__) {
                var cache = this.__cache__, k;

                if (_.isArray(key)) {
                    for (var i=0; i<key.length; i++) {
                        k = _.trim(key[i]);
                        if (_.isNull(cache)) break;
                        if (!_.isEmpty(k) && i < key.length - 1) {
                            cache = cache[k];
                        }
                    }
                } else if (!_.isUndef(key)) {
                    k = _.trim(key);
                }

                key = k;

                if (_.notNull(cache)) {
                    if (_.isNull(key)) {
                        for (k in cache) {
                            delete cache[k];
                        }
                    } else if (!_.isEmpty(key)) {
                        delete cache[key];
                    }
                }
            }
            return this;
        },
        // 事件预绑定
        bind: function(eventName, element, data, handler, /*INTERNAL*/ one) {

            // eventName can be a map of eventName/handlers
            if (_.notNull(eventName) && _.isObject(eventName)) {
                // ( eventName-Object, selector, data )
                if (!_.validElement(element)) {
                    // ( types-Object, data )
                    data = data || element;
                    element = _.__undef__;
                }
                for (var evtName in eventName) {
                    this.bind(evtName, element, data, eventName[evtName], one);
                }
                return this;
            }

            var args = Event.normalizeBindArgs.apply(this, arguments);

            if (!args) return this;

            eventName = args[0];
            element = args[1];
            data = args[2];
            handler = args[3];

            var binds = this.get('binds');

            if (_.isArray(binds)) {
                binds.push([eventName, element, data, handler, one]);
            } else {
                binds = [
                    [eventName, element, data, handler, one]
                ];
            }

            this.set('binds', binds);

            return this;
        },
        on: function() {
            return this.bind.apply(this, arguments);
        },
        one: function(eventName, element, data, handler) {
            return this.bind(eventName, element, data, handler, 1);
        },
        // 生命周期钩子
        beforeCreate: function(handler) {
            this.set('beforeCreate', handler);
            return this;
        },
        created: function(handler) {
            this.set('created', handler);
            return this;
        },
        beforeLoad: function(handler) {
            this.set('beforeLoad', handler);
            return this;
        },
        loaded: function(handler) {
            this.set('loaded', handler);
            return this;
        },
        beforeReady: function(handler) {
            this.set('beforeReady', handler);
            return this;
        },
        ready: function(handler) {
            this.set('ready', handler);
            return this;
        },
        beforeDestroy: function(handler) {
            this.set('beforeDestroy', handler);
            return this;
        },
        destroyed: function(handler) {
            this.set('destroyed', handler);
            return this;
        }
    };

    Widget.prototype.create = function(options) {
        return new this.Initializer(options, this);
    };

    /*!
     * 模板 include 实现
     * @param path    {String}        必选。引入文件路径
     * @param params  {String|Object} 可选。引入文件传入的参数
     * @param mode    {String}        可选。引入模式
     *          - include  默认，页面载入前即加载相关内容
     *          - lazy     页面载入后自动开始加载相关内容
     *          - trigger  页面载入后手动触发加载相关内容
     *
     * @returns {string} 占位标记字符串
     * @private
     */
    function __include(path, params, mode) {
        var emptyStr = '';

        if (this.isDestroyed() || this.isDispose()) return emptyStr;

        var widget = this.__widget__.INCLUDE_WIDGET || this,
            pLevel = this.getState('level') || 1;

        var err;

        if (pLevel >= Widget.INCLUDE_LEVEL_LIMIT) {
            err = this.makeError('include_limit', [this.getPath(), path]);
            this.addError(err);
            if (this.afterState('beforeLoad')) {
                widget.Event.trigger('Error', err);
            }
            return emptyStr;
        }

        var args = _.__aslice.call(arguments);

        // 去除末尾 $data 和 $filename 参数
        var $filename = args.pop(),
            $data = args.pop();

        if (!args[0] || !(args[0] = _.trim(args[0]))) {
            err = Template.Error.make('param_invalid', ['include', 'path']);
            this.addError(err);
            if (this.afterState('beforeLoad')) {
                widget.Event.trigger('Error', err);
            }
            return emptyStr;
        }

        var self = this;

        var _path = args[0], _params, _mode;

        if (args.length > 2) {
            _params = params;
            _mode = mode;
        } else if (_.inArray(args[1], Widget.INCLUDE_MODE) > -1) {
            _params = {};
            _mode = args[1];
        } else {
            _params = args[1] || {};
        }

        if (_.inArray(_mode, Widget.INCLUDE_MODE) < 0) {
            _mode = Widget.INCLUDE_MODE[0];
        }

        var relativePath;

        if (_.notNull($filename) && /\//.test($filename)) {
            relativePath = widget.trimTemplatePath($filename);
        } else {
            relativePath = this.getPath();
        }

        _path = _.toUrl(_path, null, relativePath);

        var state = widget.normalizeState(_path);

        if (!state || !state.path) {
            err = Template.Error.make('param_invalid', ['include', 'path']);
            this.addError(err);
            if (this.afterState('beforeLoad')) {
                widget.Event.trigger('Error', err);
            }
            return emptyStr;
        }

        var include = {};

        _.def(include, 'context', this, {
            writable: false,
            configurable: false
        });

        _.def(include, 'mode', _mode, {
            writable: false,
            configurable: false
        });

        var k;

        if (_params) {
            for (k in _params) {
                state.param[k] = _params[k];
            }
        }

        var contextParams = this.getParams();

        for (k in contextParams) {
            if (!_.__hasOwn.call(state.param, k)) {
                state.param[k] = contextParams[k];
            }
        }

        _.extend(state.data, {$include: $data});

        var includeKey = _.isEmpty($filename) ? this.getState('name') : $filename,
            id = this.template.includeIndex(includeKey);

        _.def(include, 'id', id, {
            writable: false,
            configurable: false
        });

        var pid = this.getState('id');

        if (widget.instanceof(this.__layout__, widget.Creator)) {
            pid = this.__layout__.getState('id') + (pid ? '-' + pid : '');
        }

        if (pid) {
            id = pid + '-' + id;
        }

        _.def(state, 'id', id, {
            writable: false,
            configurable: (state.type == "script" ? false : true)
        });

        _.def(state, 'level', pLevel + 1, {
            writable: false,
            configurable: false
        });

        // container 标记
        var containerId = widget.CONTAINER_ID + '-' + state.id;
        _.def(state, 'container', '#' + containerId, {
            writable: false,
            configurable: false
        });

        // body 标记
        var bodyKey = '__body_' + (state.id + "").replace(/\-/g, "_") + '__';
        _.def(include, 'body', bodyKey, {
            writable: false,
            configurable: false
        });

        _.def(state, 'include', include, {
            writable: false,
            configurable: false
        });

        var pos = inIncludes(state);
        if (pos > -1) {
            this.__includes__.splice(pos, 1, state);
        } else {
            this.__includes__.push(state);
        }

        if (_mode === "include") {
            this.template.setIncludePromise(
                widget.include(state, this.__included__),
                includeKey
            );
            return '{{{' + bodyKey + '}}}';
        } else {
            this.template.setIncludePromise(null, includeKey);
            var cssClass = widget.PREFIX_CSS_INCLUDE + _.stylePathId(state.name);
            if (_mode === "lazy") {
                var loadingOpt = this.get('loading') || {}, loadingHtml;
                if (loadingHtml = loadingOpt.html) {
                    if (_.isFunction(loadingHtml)) {
                        loadingHtml = loadingHtml.call(this);
                    }
                    loadingHtml = Loading.wrap('include-' + state.id, 'include')(loadingHtml);
                }
                return widget.wrap(state.name, containerId)(loadingHtml, cssClass);
            } else {
                return widget.wrap(state.name, containerId)('', cssClass);
            }
        }

        function inIncludes(state) {
            var pos = -1;

            if (_.isNull(state)) return pos;

            var stateInclude;
            for (var i=0; i<self.__includes__.length; i++) {
                stateInclude = self.__includes__[i] || {};
                if (stateInclude.id === state.id) {
                    pos = i;
                    break;
                }
            }

            return pos;
        }
    }

    return Widget;
});