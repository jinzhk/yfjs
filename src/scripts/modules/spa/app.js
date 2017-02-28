define('yfjs/spa', ['yfjs/spa/app'], function(App) { return new App(); });
define('yfjs/spa/app', [
    'yfjs',
    './version', 'jquery', './util/helpers', './util/event', './util/error',
    './util/widget', './util/route',
    './util/remote', './util/template', './util/style-loader',
    './util/ajax', './util/websocket',
    './util/filter', './util/cookie', './util/console',
    './ui/loading'
], function(
    YFjs,
    Version, $, _, Event, Error,
    Widget, Route,
    Remote, Template, StyleLoader,
    Ajax, WebSocket,
    Filter, Cookie, console,
    Loading
) {
    var JSON = _.JSON;

    // global tools
    _.window.$ = $;
    _.window._ = _.Exports;
    _.window.JSON = JSON;
    _.window.console = console;

    App.NAMESPACE = "App";

    App.VERSION = Version(App.NAMESPACE);

    App.DEFAULTS = {
        /**
         * 内容容器 {DOM|String|jQuery|Function}
         * - 可为 dom 元素对象、选择器字符串、jQuery元素对象
         * - 默认为 "body"
         * - 为 Function 类型时获取返回结果
         */
        container: "body",
        /**
         * 应用资源的相对路径 {String|Object|Function}
         * - 为 String 类型时设置 root（即同 {root: [baseUrl]}）
         * - 为 Function 类型时获取返回结果
         */
        baseUrl: {
            /**
             * 应用根路径 {String}
             * - 若以双斜杠（如 //example.com）或资源协议（如 http: https: 等）开头，则为指定的远程地址
             * - 非远程地址时，则和当前域名连接作为应用根路径
             * - 默认会读取 base 标签的值，若不存在 base 标签，默认为当前域名
             */
            root: "",
            /**
             * 静态资源的相对路径 {String}
             * - 若以双斜杠（如 //example.com）或资源协议（如 http: https: 等）开头，则为指定的远程地址
             * - 若以斜杠开头，则相对于应用根路径（root），否则，相对入口（data-main）js文件所在的目录
             * - 默认相对于应用根路径
             */
            resource: "/",
            /**
             * 样式文件的相对路径 {String}
             * - 若以双斜杠（如 //example.com）或资源协议（如 http: https: 等）开头，则为指定的远程地址
             * - 若以斜杠开头，则相对于应用根路径（root），否则，相对入口（data-main）js文件所在的目录
             * - 默认相对于应用根路径
             */
            style: "/",
            /**
             * 视图的脚本文件的相对路径 {String}
             * - 若以双斜杠（如 //example.com）或资源协议（如 http: https: 等）开头，则为指定的远程地址
             * - 若以斜杠开头，则相对于应用根路径（root），否则，相对入口（data-main）js文件所在的目录
             * - 默认为入口（data-main）js文件所在目录下的 views 目录
             */
            view: "views",
            /**
             * 布局的脚本文件的相对路径 {String}
             * - 若以双斜杠（如 //example.com）或资源协议（如 http: https: 等）开头，则为指定的远程地址
             * - 若以斜杠开头，则相对于应用根路径（root），否则，相对入口（data-main）js文件所在的目录
             * - 默认为入口（data-main）js文件所在目录下的 layouts 目录
             */
            layout: "layouts",
            /**
             * 模板文件的相对路径 {String}
             * - 若以双斜杠（如 //example.com）或资源协议（如 http: https: 等）开头，则为指定的远程地址
             * - 若为跨域远程地址，需自行处理跨域问题
             * - 若以斜杠开头，则相对于应用根路径（root），否则，相对入口（data-main）js文件所在的目录
             * - 默认为入口（data-main）js文件所在目录下的 layouts 目录
             */
            template: "templates"
        },
        /**
         * 默认首页 {String|Function}
         * - 默认为 "/home"
         * - 为 Function 类型时获取返回结果
         */
        index: "/home",
        /**
         * html 标签上当前视图和布局实例的 class 样式标记的前缀 {Object|Function}
         * - layout  {String}
         *           当前 layout 的 class 样式标记的前缀
         * - view    {String}
         *           当前 view 的 class 样式标记的前缀
         * - include {String}
         *           子实例的 class 样式标记的前缀
         * - 默认为
         *   {
         *       layout: "app-layout_",
         *       view: "app-view_",
         *       include: "app-include_"
         *   }
         * - 为 Function 类型时获取返回结果
         */
        cssPrefix: {
            layout: "app-layout_",
            view: "app-view_",
            include: "app-include_"
        },
        /**
         * 页面加载中效果设置 {Object|Function}
         * - html    {String|Function}
         *           加载效果对应的 html 字符串。
         *           为 Function 类型时获取返回结果。this 指针指向当前应用实例
         * - ready   {Function}
         *           触发加载效果的执行函数。
         *           传入当前 container 参数。this 指针指向当前应用实例
         * - destroy {Function}
         *           销毁加载效果的执行函数。
         *           传入当前 container 参数。this 指针指向当前应用实例
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
        loading: _.__undef__,
        /**
         * 过滤器配置 {Object|Array|Function}
         * - name     {String}
         *            过滤器名称
         * - access   {Function}
         *            过滤器执行过滤判断的函数，需返回 true|false。传入当前状态 state 参数，this 指针指向当前应用实例
         * - do       {Function}
         *            过滤器执行过滤效果的函数。传入当前状态 state 参数，this 指针指向当前应用实例
         * - includes {String|RegExp|Array}
         *            需要拦截的 view 的路径，支持字符串和正则表达式，字符串支持通配符的写法
         * - excludes {String|RegExp|Array}
         *            不需要拦截的 view 的路径，支持字符串和正则表达式，字符串支持通配符的写法
         * - 为 Function 类型时获取返回结果
         */
        filter: _.__undef__,
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
         * - 为 Function 类型时获取返回结果。this 指针指向当前应用实例
         */
        binds: _.__undef__,
        /**
         * 全局缓存配置开关 {Boolean}
         * - 设置远程模板、样式文件等是否开启缓存
         * - 自动继承 data-cache 设置
         * - 未设置 data-cache 时默认为 true (开启)
         * - 为 Function 类型时获取返回结果
         */
        cache: true,
        /**
         * 模板全局配置
         * - escape {Boolean}
         *       是否编码输出变量的 HTML 字符。默认为true
         * - cache {Boolean}
         *       是否开启缓存。默认为true
         * - comment {Boolean}
         *       是否显示 html 注释。设为 false 则忽略 html 注释内容。默认为 true
         * - compress {Boolean}
         *       是否压缩输出。默认为false
         * - rendered {Function}
         *       输出内容处理钩子。传入编译错误信息、编译后的输出内容，需返回数组，数组索引第0项为错误信息，第1项为处理后的输出内容。
         * - helpers {Object}
         *       模板辅助方法。键值为 {名称(String)} - {方法(Function)}
         * - remote {Object}
         *       请求远程模板时的配置项，内容同 ajax 配置项
         * - 为 Function 类型时获取返回结果
         */
        template: _.__undef__,
        /**
         * 样式文件加载器全局配置
         * - cache {Boolean}
         *       是否开启缓存。默认为true
         * - remote {Object}
         *       请求远程模板时的配置项，内容同 ajax 配置项
         * - 为 Function 类型时获取返回结果
         */
        styleLoader: _.__undef__,
        /**
         * 全局环境模式配置 {String|Function}
         * 模式可完全自定义，例如：
         *     - mock  模拟阶段
         *     - test  测试阶段
         *     - dev   开发阶段
         *     - pro   产品阶段
         * - 为 Function 类型时获取返回结果
         */
        mode: _.__undef__,
        /**
         * Ajax 全局配置项 {Object|Function}
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
         * WebSocket 全局配置项 {Object|Function}
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
         * cookie 附加配置项 {Object|Function}
         * - 为全局的 cookie 工具添加额外方法
         * - {String} : {Function} 键值对分别为方法名称和方法体，方法的 this 指针指向全局的 cookie 对象
         * - 为 Function 类型时获取返回结果
         */
        cookie: _.__undef__,
        /**
         * 生命周期钩子 statechange {Function}
         * - 在状态改变时调用（优先于状态钩子）
         * - this 指针指向当前应用实例
         */
        statechange: _.__undef__,
        /**
         * 生命周期钩子 beforeCreate {Function}
         * - 在应用实例初始化之前调用
         * - this 指针指向当前应用实例
         */
        beforeCreate: _.__undef__,
        /**
         * 生命周期钩子 created {Function}
         * - 在应用实例初始化完成后调用
         * - this 指针指向当前应用实例
         */
        created: _.__undef__,
        /**
         * 生命周期钩子 beforeReady {Function}
         * - 在应用实例初始化完成，事件绑定等执行之前调用
         * - this 指针指向当前应用实例
         */
        beforeReady: _.__undef__,
        /**
         * 生命周期钩子 ready {Function}
         * - 在应用实例初始化完成，事件绑定等执行之后调用
         * - this 指针指向当前应用实例
         */
        ready: _.__undef__,
        /**
         * 生命周期钩子 beforeLoad {Function}
         * - 在加载当前视图实例之前调用
         * - this 指针指向当前应用实例
         */
        beforeLoad: _.__undef__,
        /**
         * 生命周期钩子 loaded {Function}
         * - 在当前视图实例加载并准备完成之后调用
         * - this 指针指向当前应用实例
         */
        loaded: _.__undef__,
        /**
         * 生命周期钩子 beforeDestroy {Function}
         * - 在准备关闭当前标签页,销毁应用实例之前调用
         * - 返回非 undefined|null 值时不关闭页面，并将返回值作为提示信息内容
         * - this 指针指向当前应用实例
         */
        beforeDestroy: _.__undef__,
        /**
         * 生命周期钩子 destroyed {Function}
         * - 在销毁应用实例之后,关闭当前标签页时调用
         * - this 指针指向当前应用实例
         */
        destroyed: _.__undef__,
        /**
         * 错误页面配置 {String|Object|Remote|Function}
         * - 为 String 类型时作为错误信息的模板文本内容
         * - 为 Object 类型时作为错误页面配置
         *      - 一个 view 实例的所有配置
         *      - 另可使用 path {String} 配置项指定 view 页面路径
         * - 为 Remote 类型时，若获取结果为 Object 类型，同 Object 类型参数处理，否则，作为 path 配置项处理
         * - 为 Function 类型时获取返回结果
         */
        error: (
            '<div class="container">' +
                '<h1>Error</h1>' +
                '{{if isArray(error)}}' +
                '<dl>' +
                    '{{each error as err}}' +
                    '{{if err}}' +
                    '<dt>&diams;&ensp;{{err.type}}</dt>' +
                    '<dd>{{err.message}}</dd>' +
                    '{{/if}}' +
                    '{{/each}}' +
                '</dl>' +
                '{{else if error}}' +
                '<dl>' +
                    '<dt>&diams;&ensp;{{error.type}}</dt>' +
                    '<dd>{{error.message}}</dd>' +
                '</dl>' +
                '{{/if}}' +
            '</div>'
        ),
        /**
         * 全局错误过滤处理方法 {Function}
         * - 发生错误时，最先调用此方法
         * - this 指针根据实际调用情况动态指向当前应用或视图或布局实例
         */
        errorFilter: _.__undef__,
        /**
         * 错误处理方法 {Function}
         * - 发生错误时，自动调用此方法
         * - 方法的 this 指针指向当前应用实例
         * - 方法内可使用以下函数处理相关错误
         *     - addError 拼接错误
         *     - getError  获取指定错误信息
         *     - removeError  删除指定错误信息
         * - 若存在未经处理的错误信息，页面将根据 error 配置项跳转至错误页面
         */
        onError: _.__undef__,
        /**
         * Layout 和 View 共用的默认配置 {Object|Function}
         * - 为 Function 类型时获取返回结果
         */
        Widget: _.__undef__,
        /**
         * Layout 的默认配置 {Object|Function}
         * - 为 Function 类型时获取返回结果
         */
        Layout: _.__undef__,
        /**
         * View 的默认配置 {Object|Function}
         * - 为 Function 类型时获取返回结果
         */
        View: _.__undef__
    };

    var View = Route.View;
    
    var Layout = Route.Layout;

    // regexp
    App.REGEXP_PROTOCOL_START  = _.REGEXP_PROTOCOL_START;
    App.REGEXP_DSLASH_START    = _.REGEXP_DSLASH_START;
    App.REGEXP_SLASH_START     = _.REGEXP_SLASH_START;
    App.REGEXP_SLASH_END       = _.REGEXP_SLASH_END;
    App.REGEXP_HASH_START      = _.REGEXP_HASH_START;
    App.REGEXP_PATH_HASH_START = _.REGEXP_PATH_HASH_START;

    // state
    App.STATE = [
        'BEFORE_CREATE', 'CREATED',
        'BEFORE_READY', 'READY',
        'BEFORE_LOAD', 'LOADED',
        'BEFORE_DESTROY', 'DESTROYED'
    ];
    App.STATE[-1] = 'DISPOSE';

    App.STATE_INDEX = {};

    $.each(App.STATE, function(i, state) {
        App.STATE_INDEX[state] = i;
    });

    /*!
     * 更新状态
     */
    App.updateState = _.stateUpdater(App.STATE, App.STATE_INDEX);

    App.Event = Event(App.NAMESPACE);

    App.Error = Error(App.NAMESPACE);

    App.Error.translate({
        'instantiated' : App.NAMESPACE + " 的构造器对象必须通过 " + App.NAMESPACE + " 的实例对象进行实例化",
        'initialized'  : App.NAMESPACE + " 的实例对象必须通过 " + App.NAMESPACE + " 的初始器对象进行实例化",
        'setter': "App 设置错误。无法设置实例属性 {0}，因为它是 App 实例的固有属性",
        'callback': "执行 App 的 {0} 操作时发生了错误: {1}"
    });

    // 当前 view 实例
    _.def(App, 'LAST_VIEW', null, {
        writable: false,
        configurable: true
    });

    function App(options) {
        if (this instanceof App) {
            _.def(this, '__options__', _.extend({}, App.DEFAULTS, options));
            _.def(this, '__cache__', {});
        } else {
            return new App(options);
        }
    }

    App.prototype = {
        // 工具
        _: _.Exports,
        remote: Remote,
        json: JSON,
        console: console,
        // 配置项
        set: _.optionSetter(App.DEFAULTS),
        get: _.optionGetter(),
        getOptions: _.optionsGetter(),
        // 缓存
        getCache: View.Initializer.prototype.getCache,
        setCache: View.Initializer.prototype.setCache,
        removeCache: View.Initializer.prototype.removeCache,
        // 模板辅助方法
        helper: function(name, fn) {
            name = _.trim(name);
            if (name && _.isFunction(fn)) {
                var helpers = this.get('helpers') || {};
                helpers[name] = fn;
                this.set('helpers', helpers);
            }
            return this;
        },
        helpers: function(helpers) {
            if (_.notNull(helpers) && _.isObject(helpers)) {
                var _helpers = this.get('helpers') || {};
                _.extend(_helpers, helpers);
                this.set('helpers', _helpers);
            }
            return this;
        },
        // 事件预绑定
        bind : View.Initializer.prototype.bind,
        on   : View.Initializer.prototype.on,
        one  : View.Initializer.prototype.one,
        // 实例创建入口
        create: function(options) {
            // init options
            var thisProps = {};
            for (var key in this) {
                if (_.__hasOwn.call(this, key)) {
                    thisProps[key] = this[key];
                }
            }
            delete thisProps.__options__;
            delete thisProps.__cache__;
            options = _.extend(thisProps, options);

            var launcher = new App.Launcher(
                new App.Creator(new App(options))
            );

            launcher.startup();

            return launcher.getInstance();
        }
    };

    App.Launcher = function(instance) {
        // App's Constructor must be initialized with App's Interface instance.
        if (!(instance instanceof App.Creator))
            throw App.Error.make('instantiated');

        if (this instanceof App.Launcher) {

            _.def(this, '__widget__', instance.__widget__);

            _.def(this, '__instance__', instance);

            _.def(this, '__options__', instance.__options__);

            _.def(this, '__err_frame__', 30);

            _.def(this, '__err_buffer__', []);

            _.def(this, '__err_stime__', 0, {
                configurable: true
            });

            _.def(this, 'ajax', instance.ajax, {
                writable: false,
                configurable: false
            });

            _.def(this, 'ws', instance.ws, {
                writable: false,
                configurable: false
            });

            _.def(this, 'template', instance.template, {
                writable: false,
                configurable: false
            });

            // init
            this.init();
        } else {
            return new App.Launcher(instance);
        }
    };

    App.Launcher.prototype = {
        getInstance: function() {
            return this.__instance__;
        },
        init: function() {
            var options = this.__options__,
                appInst = this.getInstance();

            // default container
            this.container = appInst.container;

            // default template helpers
            Template.helpers({
                'getCookie': function() {
                    return this.rootContext.getCookie.apply(this.rootContext, arguments);
                },
                'getRootUrl': function() {
                    return this.rootContext.getRootUrl.apply(this.rootContext, arguments);
                },
                'getResourceUrl': function() {
                    return this.rootContext.getResourceUrl.apply(this.rootContext, arguments);
                },
                'getStyleUrl': function() {
                    return this.rootContext.getStyleUrl.apply(this.rootContext, arguments);
                },
                'getFullUrl': function() {
                    return this.rootContext.getFullUrl.apply(this.rootContext, arguments);
                },
                'getUrl': function() {
                    return this.getUrl.apply(this, arguments);
                }
            });

            // layout css class regexp
            var regexpLayoutClassname;
            try {
                regexpLayoutClassname = new RegExp("(^|\\s)(" + options.cssPrefix.layout + "[^\\s'\"]+)(\\s|$)");
            } catch (e) {
                regexpLayoutClassname = null;
            }
            _.def(this, 'REGEXP_LAYOUT_CLASSNAME', regexpLayoutClassname, {
                writable: false,
                configurable: false
            });

            // view css class regexp
            var regexpViewClassname;
            try {
                regexpViewClassname = new RegExp("(^|\\s)(" + options.cssPrefix.view + "[^\\s'\"]+)(\\s|$)");
            } catch (e) {
                regexpViewClassname = null;
            }
            _.def(this, 'REGEXP_VIEW_CLASSNAME', regexpViewClassname, {
                writable: false,
                configurable: false
            });

            return this;
        },
        startup: function() {
            var self = this,
                options = this.__options__ || {},
                appInst = this.getInstance();

            // update state
            var statechange = App.updateState.call(appInst, 'beforeReady');

            // statechange
            if (false !== statechange) {
                appInst.callOption('statechange', statechange);
            }

            // before ready
            appInst.callOption('beforeReady');

            // on error
            App.Event.bind([
                'Error', 'LoadError', 'LoadingError', 'FilterError',
                'CallbackError', 'WidgetError', 'IncludeError',
                'TemplateError', 'AjaxError', 'WebSocketError', 'CookieError'
            ].join(' '), function(e, err, resLoad) {
                // 每 app.__err_frame__(30ms) 间隔时间处理一次错误信息
                var nowTime = new Date().getTime();
                if (!self.__err_stime__) {
                    _.def(self, '__err_stime__', nowTime);
                }
                var dTime = nowTime - self.__err_stime__;
                if (dTime == 0 || dTime <= self.__err_frame__) {
                    var errBuffer = _.concatError(self.__err_buffer__, err),
                        errBufferArgs = [0, self.__err_buffer__.length];
                    errBufferArgs = errBufferArgs.concat(errBuffer);
                    self.__err_buffer__.splice.apply(self.__err_buffer__, errBufferArgs);
                    if (dTime == 0) {
                        _.requestAnimationFrame.call(self, handleError, [], self.__err_frame__);
                    }
                }
                function handleError() {
                    var self = this;
                    _.def(self, '__err_stime__', 0);
                    var err = self.__err_buffer__.splice(0, self.__err_buffer__.length);
                    // error filter
                    err = callErrorFilter(err);
                    // init page error
                    var errPage = _.sliceError(err, {level: View.Error.LEVEL_PAGE}),
                        errOther = _.shiftError(err, errPage);
                    if (!_.isEmpty(errPage) && _.isEmpty(errOther)) {

                        logError(err);

                        // throw to error page
                        var errReported = err;

                        var errOptions = appInst.callOption('error');

                        if (Remote.instanceof(errOptions)) {
                            errOptions = errOptions.get();
                            if (!_.isEmpty(errOptions) && !_.isObject(errOptions)) {
                                errOptions = {path: _.trim(errOptions)};
                            }
                        }

                        if (!_.isEmpty(errOptions)) {
                            if (_.isObject(errOptions)) {
                                if (errOptions.path) {
                                    View.load(errOptions, function(err, res) {
                                        if (View.instanceof(res)) {
                                            loadError(res, errReported);
                                        } else {
                                            renderErrHtml(_.concatError(err, errReported));
                                        }
                                    });
                                } else {
                                    errOptions.path = "error";
                                    errOptions.layout = errOptions.layout || null;
                                    loadError(
                                        new View.Constructor(
                                            new View.Creator(
                                                View.create(errOptions, View), View
                                            ), View
                                        ),
                                        errReported
                                    );
                                }
                            } else {
                                errOptions = _.trim(errOptions);
                                self.template.render(errOptions, {error: errReported}, function(err, htmlText) {
                                    if (!_.isUndef(htmlText)) {
                                        renderErrHtml(htmlText);
                                    } else {
                                        renderErrHtml(_.concatError(err, errReported));
                                    }
                                });
                            }
                        } else {
                            renderErrHtml();
                        }

                        function loadError(errView, error) {
                            if (View.instanceof(errView)) {
                                errView.setData('$error', error);
                                errView.load(function(err, res) {
                                    if (!_.isEmpty(err)) {
                                        err = _.concatError(err, error);
                                        renderErrHtml(err);
                                    } else {
                                        // render error view
                                        res = res || {};
                                        res.error = true;
                                        App.Event.trigger('Loaded', res);
                                    }
                                });
                            }
                        }

                        function renderErrHtml(err, html) {
                            if (_.isString(err)) {
                                html = err;
                                err = errReported;
                            } else {
                                err = err || errReported;
                            }

                            var res = {
                                view: false, layout: false
                            };

                            if (_.isUndef(html)) {
                                html = self.defaultErrorHtml(err);
                            }

                            html = Route.View.wrap()(html);

                            if (Layout.updateWrap()) {
                                res.container = Layout.CONTAINER;
                            } else {
                                html = Layout.wrap()(html);
                            }

                            res.html = html;

                            res.error = true;

                            App.Event.trigger('Loaded', res);
                        }
                    } else {
                        // init widget error
                        var errWidget = _.sliceError(err, {level: View.Error.LEVEL_WIDGET});
                        if (!_.isEmpty(errWidget)) {
                            errWidget = callOnError(errWidget);
                        }
                        if (!_.isEmpty(errWidget)) {
                            errWidget = callOnErrorOption(errWidget);
                        }
                        // init app error
                        var errApp = _.sliceError(err, {level: View.Error.LEVEL_APP});
                        if (!_.isEmpty(errWidget)) {
                            errApp = _.concatError(errApp, errWidget);
                        }
                        if (!_.isEmpty(errApp)) {
                            appInst.addError(errApp);
                            errApp = callOnErrorOption(errApp, appInst);
                        }
                        // 处理 include 类型的错误
                        if (!_.isEmpty(errApp)) {
                            resLoad = resLoad || {};

                            var errIncludes = _.sliceError(errApp, {
                                __caller_name__: /^(view|layout)\.include/
                            });

                            if (!_.isEmpty(errIncludes)) {
                                var errIncludesMap = {},
                                    renderIncludes = {},
                                    bodyKey;

                                $.each(errIncludes, function(i, err) {
                                    if (err.state && (bodyKey = err.state.body)) {
                                        errIncludesMap[bodyKey] = _.concatError(
                                            errIncludesMap[bodyKey], err
                                        );
                                    }
                                });

                                for (bodyKey in errIncludesMap) {
                                    renderIncludes[bodyKey] = self.defaultErrorHtml(errIncludesMap[bodyKey]);
                                }

                                if (!_.isUndef(resLoad.html)) {
                                    var template;
                                    if (resLoad.layout) {
                                        template = resLoad.layout.template;
                                    } else if (resLoad.view) {
                                        template = resLoad.view.template;
                                    } else {
                                        template = self.template;
                                    }

                                    var html = template.render(resLoad.html, renderIncludes);

                                    if (_.isString(html)) {
                                        resLoad.html = html;
                                    }
                                }
                            }
                        }

                        logError(err);

                        if (!_.isEmpty(resLoad)) {
                            resLoad.view = resLoad.view || false;
                            resLoad.layout = resLoad.layout || false;
                            App.Event.trigger('Loaded', resLoad);
                        }
                    }
                }
            });

            Cookie.Event.bind('Error', function(e, err) {
                App.Event.trigger('CookieError', _.isArray(err) ? [err] : err);
            });

            Loading.Event.bind('Error', function(e, err) {
                App.Event.trigger('LoadingError', _.isArray(err) ? [err] : err);
            });

            Filter.Event.bind('Error', function(e, err) {
                App.Event.trigger('FilterError', _.isArray(err) ? [err] : err);
            });

            Template.Event.bind('Error', function(e, err) {
                App.Event.trigger('TemplateError', _.isArray(err) ? [err] : err);
            });

            Template.Event.bind('CallbackError', function(e, err) {
                App.Event.trigger('CallbackError', _.isArray(err) ? [err] : err);
            });

            Ajax.Event.bind('Error', function(e, err) {
                App.Event.trigger('AjaxError', _.isArray(err) ? [err] : err);
            });

            WebSocket.Event.bind('Error', function(e, err) {
                App.Event.trigger('WebSocketError', _.isArray(err) ? [err] : err);
            });

            View.Event.bind('Error', function(e, err) {
                App.Event.trigger('WidgetError', _.isArray(err) ? [err] : err);
            });

            Layout.Event.bind('Error', function(e, err) {
                App.Event.trigger('WidgetError', _.isArray(err) ? [err] : err);
            });

            View.Event.bind('IncludeError', function(e, err) {
                App.Event.trigger('IncludeError', _.isArray(err) ? [err] : err);
            });

            Layout.Event.bind('IncludeError', function(e, err) {
                App.Event.trigger('IncludeError', _.isArray(err) ? [err] : err);
            });

            Route.Event.bind('CallbackError', function(e, err) {
                App.Event.trigger('CallbackError', _.isArray(err) ? [err] : err);
            });

            function callErrorFilter(err) {
                var rptErrs = [];
                if (_.isArray(err)) {
                    $.each(err, function(i, err) {
                        rptErrs = _.concatError(rptErrs, callErrorFilter(err));
                    });
                } else if (!_.isEmpty(err)) {
                    rptErrs.push(err);
                    // init context
                    var context;
                    if (
                        View.instanceof(err.context, View.Creator)
                        || Layout.instanceof(err.context, Layout.Creator)
                    ) {
                        context = err.context;
                    } else {
                        context = appInst;
                    }
                    // error filter
                    var errFilter;
                    if (!_.isEmpty(err) && _.isFunction(errFilter = context.get('errorFilter'))) {
                        // assign error context
                        if (err.context !== context) {
                            _.setPropsRecursive(err, {context: context});
                        }
                        // add error buffer
                        if (context.inError(err) < 0) {
                            context.addError(err);
                        }
                        // do filter
                        try {
                            errFilter.call(context, err);
                            if (context.inError(err) < 0) {
                                rptErrs = _.shiftError(rptErrs, err);
                            }
                        } catch (e) {
                            rptErrs = _.concatError(rptErrs,
                                context.makeError('callback', ['errorFilter', e.message], e)
                            );
                        }
                    }
                }
                return rptErrs;
            }

            function callOnError(err) {
                var rptErrs = [];
                if (_.isArray(err)) {
                    $.each(err, function(i, err) {
                        rptErrs = _.concatError(rptErrs, callOnError(err));
                    });
                } else if (!_.isEmpty(err)) {
                    rptErrs.push(err);
                    // init context
                    var context;
                    if (
                        View.instanceof(err.context, View.Creator)
                        || Layout.instanceof(err.context, Layout.Creator)
                    ) {
                        context = err.context;
                    }
                    // call error handler
                    var onError = err.__err_handler__;
                    if (onError) {
                        rptErrs = _.shiftError(rptErrs, err);
                        if (_.isFunction(onError)) {
                            try {
                                onError.call(context, err);
                            } catch (e) {
                                rptErrs = _.concatError(rptErrs,
                                    (context || appInst)
                                        .makeError('callback', ['onPropError', e.message], e)
                                );
                            }
                        }
                    }
                }
                return rptErrs;
            }

            function callOnErrorOption(err, context) {
                var rptErrs = [];
                if (_.isArray(err)) {
                    $.each(err, function(i, err) {
                        rptErrs = _.concatError(rptErrs, callOnErrorOption(err, context));
                    });
                } else if (!_.isEmpty(err)) {
                    rptErrs.push(err);
                    // init context
                    if (!context && (
                            View.instanceof(err.context, View.Creator)
                            || Layout.instanceof(err.context, Layout.Creator)
                        )) {
                        context = err.context;
                    }
                    // call onError option
                    if (context) {
                        if (context.inError(err) > -1) {
                            var onError = context.get('onError');
                            if (_.isFunction(onError)) {
                                try {
                                    onError.call(context, err);
                                } catch (e) {
                                    rptErrs.push(
                                        context.makeError('callback', ['onError', e.message], e)
                                    );
                                }
                            }
                        } else {
                            rptErrs = _.shiftError(rptErrs, err);
                        }
                        if (err.context !== context) {
                            if (
                                View.instanceof(err.context, View.Creator)
                                || Layout.instanceof(err.context, Layout.Creator)
                            ) {
                                err.context.removeError(err);
                            }
                            _.setPropsRecursive(err, {context: context});
                            if (context.inError(err) < 0) {
                                context.addError(err);
                            }
                        }
                    }
                }
                return rptErrs;
            }

            // on app fn called
            App.Event.bind('AppFnCalled', function(e, fnName) {
                if (fnName && _.__hasProto.call(App.Creator, fnName)) {
                    var args = _.__aslice.call(arguments, 2),
                        fn = self[fnName];
                    if (_.isFunction(fn)) {
                        fn.apply(self, args);
                    }
                }
            });

            // on loading
            Route.Event.bind('Loading', function() {
                appInst.__loading__.ready();
            });

            // on loaded
            App.Event.bind('Loaded', function(e, res) {
                res = res || {};

                var curView = res.view,
                    prevView = View.LAST_INSTANCE,
                    viewChanged = View.isChanged(curView);

                // destroy previous view
                if (View.instanceof(prevView)) {
                    prevView.destroy();
                }

                var curLayout = res.layout,
                    prevLayout = Layout.LAST_INSTANCE,
                    layoutChanged = Layout.isChanged(curLayout);

                // destroy previous layout
                if (layoutChanged && Layout.instanceof(prevLayout)) {
                    prevLayout.destroy();
                }

                // update current view instance
                if (View.instanceof(curView)) {
                    _.def(App, 'LAST_VIEW', curView.getInstance());
                } else {
                    _.def(App, 'LAST_VIEW', null);
                }

                // update app state
                var curViewState;

                if (View.instanceof(curView)) {
                    curViewState = curView.getState();
                    self.replaceState(curViewState);
                }

                if (View.instanceof(prevView)) {
                    self.replacePrevState(prevView.getState());
                } else if (_.notNull(curViewState)) {
                    self.replacePrevState(curViewState);
                }

                // ready container html
                if (!_.isUndef(res.html)) {

                    // render container html
                    if (res.container) {
                        $(res.container).html(res.html);
                    } else {
                        $(self.container).prepend(res.html);
                    }

                    // reset html tag css class mark
                    updateDocElClassName(res);

                    if (viewChanged) {
                        // remove former views style
                        View.removeStyle$(View.LAST_$STYLE).setLastStyle$();
                        // destroy previous view style
                        if (View.instanceof(prevView)) {
                            prevView.destroyStyle();
                        }
                        // ready view style
                        if (View.instanceof(curView)) {
                            curView.readyStyle();
                        }
                    }

                    if (layoutChanged) {
                        // remove former layouts style
                        Layout.removeStyle$(Layout.LAST_$STYLE).setLastStyle$();
                        // destroy previous layout style
                        if (Layout.instanceof(prevLayout)) {
                            prevLayout.destroyStyle();
                        }
                        // ready layout style
                        if (Layout.instanceof(curLayout)) {
                            curLayout.readyStyle();
                        }
                    }
                } else {
                    // 未渲染页面内容的 layout 和 view 不更新 css class 标记，不准备样式文件
                    // 但缓存上一次 layout 和 view 的样式文件，以便后来渲染页面的 layout 和 view 销毁
                    if (View.instanceof(prevView)) {
                        View.setLastStyle$(prevView.getState('$style') || null);
                    }
                    if (Layout.instanceof(prevLayout)) {
                        Layout.setLastStyle$(prevLayout.getState('$style') || null);
                    }
                }

                // destroyed previous view
                if (View.instanceof(prevView)) {
                    prevView.destroyed();
                }

                // destroyed previous layout
                if (layoutChanged && Layout.instanceof(prevLayout)) {
                    prevLayout.destroyed();
                }

                // trigger viewchange
                if (self.prevState('hash') !== self.getState('hash')) {
                    App.Event.trigger('viewchange', [self.getState(), self.prevState()], _.window);
                } else {
                    self.replacePrevState(self.getState());
                }

                var reloadPage = false;

                if (View.instanceof(curView)) {
                    reloadPage = !!curView.getState('__reload_page__');
                }

                // ready layout
                if ((reloadPage || layoutChanged) && Layout.instanceof(curLayout)) {
                    curLayout.ready();
                }

                // ready view
                if (View.instanceof(curView)) {
                    curView.ready();
                }

                // update last layout instance
                if (false !== curLayout || Layout.instanceof(curLayout)) {
                    _.def(Layout, 'LAST_INSTANCE', curLayout);
                } else {
                    _.def(Layout, 'LAST_INSTANCE', null);
                }

                // update last view instance
                if (false !== curView || View.instanceof(curView)) {
                    _.def(View, 'LAST_INSTANCE', curView);
                } else {
                    _.def(View, 'LAST_INSTANCE', null);
                }

                // update state
                var statechange = App.updateState.call(appInst, 'loaded');

                // statechange
                if (false !== statechange) {
                    appInst.callOption('statechange', statechange);
                }

                // loaded
                appInst.callOption('loaded');

                destroyPageLoading();

                function updateDocElClassName(res) {
                    res = res || {};

                    _.docRoot.className = _.docRoot.className || "";

                    var updateClassName = function(regexp, prefix, name) {
                        if (regexp && regexp instanceof RegExp) {
                            var className = (prefix || "") + (name || "");
                            if (regexp.test(_.docRoot.className)) {
                                _.docRoot.className = _.docRoot.className.replace(regexp, className ? "$1" + className + "$3" : " ");
                            } else {
                                _.docRoot.className = _.docRoot.className ? _.docRoot.className + " " + className : className;
                            }
                        }
                    };

                    if (Layout.instanceof(res.layout)) {
                        updateClassName(
                            self.REGEXP_LAYOUT_CLASSNAME, options.cssPrefix.layout, _.stylePathId(res.layout.getState('name'))
                        );
                    } else {
                        updateClassName(self.REGEXP_LAYOUT_CLASSNAME);
                    }
                    if (View.instanceof(res.view)) {
                        updateClassName(
                            self.REGEXP_VIEW_CLASSNAME, options.cssPrefix.view, _.stylePathId(res.view.getState('name'))
                        );
                    } else {
                        updateClassName(self.REGEXP_VIEW_CLASSNAME);
                    }
                }

                function destroyPageLoading() {
                    appInst.__loading__.destroy();
                }
            });

            // on route
            $(_.document).on("click", 'a[href^="#"]', function(e) {

                // 禁止默认操作和冒泡的事件不做处理
                var isDefaultPrevented = _.isFunction(e.isDefaultPrevented) && e.isDefaultPrevented(),
                    isPropagationStopped = _.isFunction(e.isPropagationStopped) && e.isPropagationStopped(),
                    isImmediatePropagationStopped = _.isFunction(e.isImmediatePropagationStopped) && e.isImmediatePropagationStopped();

                if (isDefaultPrevented || isPropagationStopped || isImmediatePropagationStopped) return;

                // 加载指定view
                var $this = $(this),
                    href = _.trim($this.attr('href')),
                    path = href.replace(App.REGEXP_HASH_START, "");

                var reload = _.trim($this.data('reload')) || false;

                if (reload === "false") return;

                // 阻止默认事件
                e.preventDefault();

                if (typeof reload !== "boolean") {
                    try {
                        reload = eval(_.trim(reload));
                        reload = !!reload;
                    } catch (e) {
                        reload = false;
                    }
                }

                if (reload) {
                    path = _.toUrl(path, {__reload__: true})
                }

                path && self.go(path);
            });

            // on before destroy
            $(_.window).off("beforeunload").on("beforeunload", function(evt) {
                var flag = self.beforeViewDestroy(evt);
                if (_.isNull(flag)) {
                    // beforeDestroy
                    flag = self.beforeDestroy(evt);
                    // destroy
                    if (_.isNull(flag)) {
                        self.destroy();
                    }
                }
                if (_.notNull(flag)) {
                    flag = normalizeBeforeDestroyText(flag)
                    if (evt && _.notNull(flag)) {
                        evt.returnValue = flag;
                    }
                }
                return flag;
            });

            // bind events
            if (_.isArray(options.binds)) {
                var binds;
                for (var i=0; i<options.binds.length; i++) {
                    binds = options.binds[i];
                    if (_.isArray(binds)) {
                        self.bind.apply(self, binds);
                    }
                }
            }

            // ready
            self.ready();

            // listen route
            Route.listen(function() { self.go(); });

            // 自动初始化页面
            self.go();

            return this;
        },
        getState: function(key) {
            var appInst = this.getInstance();
            return appInst.getState.apply(appInst, arguments);
        },
        setState: function(key, val) {
            var appInst = this.getInstance();
            appInst.setState.apply(appInst, arguments);
            return this;
        },
        replaceState: function(newState) {
            if (newState != null) {
                var appInst = this.getInstance(),
                    prevLabel = appInst.getState('label');
                _.stateReplacement.call(appInst, '__state__', newState, {
                    configurable: true
                });
                if (_.notNull(prevLabel)) {
                    _.def(appInst.__state__, 'label', prevLabel);
                }
            }
            return this;
        },
        prevState: function(key) {
            var appInst = this.getInstance();
            return appInst.prevState.apply(appInst, arguments);
        },
        replacePrevState: function(newState) {
            if (newState != null) {
                var appInst = this.getInstance(),
                    prevLabel = appInst.prevState('label');
                _.stateReplacement.call(appInst, '__prev_state__', newState, {
                    configurable: true
                });
                if (_.notNull(prevLabel)) {
                    _.def(appInst.__prev_state__, 'label', prevLabel);
                }
            }
            return this;
        },
        ready: function() {
            var appInst = this.getInstance();
            // update state
            var statechange = App.updateState.call(appInst, 'ready');
            // statechange
            if (false !== statechange) {
                appInst.callOption('statechange', statechange);
            }
            // ready
            appInst.callOption('ready');
        },
        destroy: function() {
            var appInst = this.getInstance();
            // update state
            var statechange = App.updateState.call(appInst, 'destroyed');
            // statechange
            if (false !== statechange) {
                appInst.callOption('statechange', statechange);
            }
            // destroyed
            appInst.callOption('destroyed');
        },
        beforeDestroy: function() {
            var appInst = this.getInstance();

            // update state
            var statechange = App.updateState.call(appInst, 'beforeDestroy');

            // statechange
            if (false !== statechange) {
                appInst.callOption('statechange', statechange);
            }

            var _beforeDestroy = appInst.get('beforeDestroy'), flag;

            // call beforeDestroy
            if (_.isFunction(_beforeDestroy)) {
                try {
                    flag = _beforeDestroy.apply(appInst, arguments)
                } catch (e) {
                    var cbErr = appInst.makeError('callback', ['beforeDestroy', e.message], e);
                    flag = cbErr.message;
                }
            }

            return flag;
        },
        go: function(reloadPage, state) {
            var self = this, appInst = this.getInstance();

            if (!self.go.__before_destroy__) {
                // before view destroy
                var flag = self.beforeViewDestroy();

                if (_.notNull(flag)) {
                    try {
                        if (!_.window.confirm(normalizeBeforeDestroyText(flag))) {
                            return self;
                        }
                    } catch (e) {
                        return self;
                    }
                }
            }

            if (!_.isBoolean(reloadPage)) {
                state = reloadPage;
                reloadPage = false;
            }

            if (!_.isUndef(self.go.reloadPage)) {
                reloadPage = !!self.go.reloadPage;
                delete self.go.reloadPage;
            }

            if (_.isNumber(state)) {
                self.go.reloadPage = reloadPage;
                Route.history.go(state);
                return self;
            }

            var options = self.__options__;

            var curState = Route.getState(),
                curStateHash = decodeURIComponent(curState.hash.replace(App.REGEXP_PATH_HASH_START, ""));

            var stateHash;

            if (!_.notNull(state)) {
                state = normalizeState(curState);

                stateHash = state.hash.replace(App.REGEXP_HASH_START, "");

                if (stateHash !== curStateHash) {
                    _.def(self.go, '__before_destroy__', true, {
                        configurable: true
                    });
                    Route.replaceState(
                        state.data || null, state.title || "", stateHash
                    );
                    return self;
                }
            } else {
                if (!_.isObject(state)) {
                    state = {hash: _.trim(state)};
                }

                state = normalizeState(state);

                var reload = state.param.__reload__;

                if (reload) {
                    delete state.param.__reload__;
                    state = normalizeState({hash: _.toUrl(state.path, state.param)});
                    self.go.reload = reload;
                }

                stateHash = state.hash.replace(App.REGEXP_HASH_START, "");

                if (stateHash !== curStateHash) {
                    _.def(self.go, '__before_destroy__', true, {
                        configurable: true
                    });
                    Route.pushState(
                        state.data || null, state.title || "", stateHash
                    );
                    return self;
                }
            }

            delete self.go.__before_destroy__;

            _.def(state, '__reload_page__', reloadPage);

            if (self.go.reload) {
                state.data.reload = self.go.reload;
                delete self.go.reload;
            } else {
                delete state.data.reload;
            }

            var prevState = self.getState();
            if (prevState) {
                self.replacePrevState(prevState);
            }

            self.replaceState(state);

            if (accessFilters(state)) {
                // clear console
                if (_.isFunction(console.clear)) {
                    console.clear();
                }
                // update state
                var statechange = App.updateState.call(appInst, 'beforeLoad');
                // statechange
                if (false !== statechange) {
                    appInst.callOption('statechange', statechange);
                }
                // before load
                appInst.callOption('beforeLoad');
                // app error
                var errApp;
                if (!_.isEmpty(errApp = appInst.getError())) {
                    App.Event.trigger('Error', errApp);
                }
                // do load
                Route.load(state, loaded);
            }

            function loaded(errLoad, resLoad) {
                if (!_.isEmpty(errLoad)) {
                    App.Event.trigger('LoadError', [errLoad, resLoad]);
                } else {
                    App.Event.trigger('Loaded', resLoad);
                }
            }

            function accessFilters(state) {
                state = state || {};
                state.path = state.path || state.hash || "";

                var result = true;

                if (!state.path || !appInst.__filters__.length) return result;

                state.filtered = [];

                $.each(appInst.__filters__, function(i, filter) {
                    if (filter instanceof Filter) {
                        result = filter.doFilter(state.path);
                        if (result) {
                            state.filtered.push(filter);
                        } else {
                            return false;
                        }
                    }
                });

                return result;
            }

            function normalizeState(state) {
                state = _.extend({}, state);
                state.hash = (state.hash || "").replace(App.REGEXP_PATH_HASH_START, "");

                if (!state.hash || state.hash === "/") {
                    state.hash = options.index;
                }

                var posHash = state.hash.lastIndexOf("#");
                if (posHash > -1) {
                    state.hash = state.hash.substring(posHash + 1);
                    return normalizeState(state);
                }

                state = View.normalizeState(state);

                return state;
            }

            return this;
        },
        back: function() {
            Route.history.back();
            return this;
        },
        forward: function() {
            Route.history.forward();
            return this;
        },
        helper: function(name, fn) {
            this.template.helper(name, fn);
            return this;
        },
        helpers: function(helpers) {
            this.template.helpers(helpers);
            return this;
        },
        bind: function(eventName, element, data, handler, /*INTERNAL*/ one) {
            var self = this, _interface = self.getInstance();

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

            if (handler) {
                handler.context = _interface;
            }

            // bind
            if (_.is$(element)) {
                App.Event.bind(eventName, element, data, handler, one);
            } else {
                if (/^viewchange/.test(eventName)) {
                    element = _.window;
                } else if (!element) {
                    element = _.document;
                } else {
                    element = $(element, _.document);
                }
                App.Event.bind(eventName, element, data, handler, one);
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
            var args = Event.normalizeUnBindArgs.apply(Event, arguments);

            eventName = args[0];
            element = args[1];
            handler = args[2];

            if (_.is$(element)) {
                App.Event.unbind(eventName, element, handler);
            } else {
                if (/^viewchange/.test(eventName)) {
                    element = _.window;
                } else if (!element) {
                    element = _.document;
                } else {
                    element = $(element, _.document);
                }
                App.Event.unbind(eventName, element, handler);
            }

            return this;
        },
        off: function() {
            return this.unbind.apply(this, arguments);
        },
        trigger: function(eventName, data, element) {
            var args = Event.normalizeTriggerArgs.apply(Event, arguments);

            eventName = args[0];
            data = args[1];
            element = args[2];

            if (_.is$(element)) {
                App.Event.trigger(eventName, data, element);
            } else {
                if (/^viewchange/.test(eventName)) {
                    element = _.window;
                } else if (!element) {
                    element = _.document;
                } else {
                    element = $(element, _.document);
                }
                App.Event.trigger(eventName, data, element);
            }

            return this;
        },
        beforeViewDestroy: function(e) {
            var lastView = View.LAST_INSTANCE,
                lastLayout = Layout.LAST_INSTANCE;

            var flag;

            if (View.instanceof(lastView)) {
                flag = lastView.beforeDestroy(e);
            }

            if (_.isNull(flag) && Layout.instanceof(lastLayout)) {
                flag = lastLayout.beforeDestroy(e);
            }

            return flag;
        },
        defaultErrorHtml: function(err) {
            var html;

            if (_.isString(App.DEFAULTS.error)) {
                html = this.template.render(App.DEFAULTS.error, {error: err});
                if (!_.isString(html)) {
                    err = _.isArray(html) ? html.concat(err) : [html].concat(err);
                    html = _.__undef__;
                }
            }

            if (_.isUndef(html)) {
                html = [];
                if (_.isArray(err)) {
                    $.each(err, function(i, err) {
                        html.push(normalizeErrMsg(err));
                    });
                } else {
                    html.push(normalizeErrMsg(err));
                }
                html = html.join('\n') || 'Error!';
            }

            return html;
        }
    };

    App.Creator = function(initializer) {
        // App's Creator must be instantiated with App's instance.
        if (!(initializer instanceof App))
            throw App.Error.make('initialized');

        if (this instanceof App.Creator) {

            _.def(this, '__ns__', App.NAMESPACE);

            _.def(this, '__widget__', View);

            _.def(this, '__initializer__', initializer);

            // init options
            _.def(this, '__options__', {});

            // init setter
            _.def(this, '__setter__', _.setter(App.DEFAULTS, App.Creator));

            // init getter
            _.def(this, '__getter__', _.getter(App.DEFAULTS, App.Creator));

            // 状态索引
            _.def(this, '__state_index__', App.STATE_INDEX['BEFORE_CREATE'], {
                configurable: true
            });

            _.def(this, '__state_index_getter__', _.stateIndexGetter(App.STATE, App.STATE_INDEX));

            // 错误缓冲区
            _.def(this, '__error__', []);

            // 错误命名空间
            _.def(this, '__error_ns__', 'APP');

            // 错误创建器
            _.def(this, '__error_maker__', _.errorMaker(App.Error));

            // json util
            _.def(this, 'json', JSON, {
                writable: false,
                configurable: false
            });

            // _ util
            _.def(this, '_', _.Exports, {
                writable: false,
                configurable: false
            });

            var self = this, key, options = initializer.getOptions();

            for (key in options) {
                if (_.__hasOwn.call(options, key)) {
                    var val = options[key];
                    if (!_.isUndef(val)) {
                        this.set(key, val);
                    }
                }
            }

            var state = {};

            _.def(state, 'label', App.STATE[this.__state_index__], {
                writable: false,
                configurable: true
            });

            // statechange
            this.callOption('statechange', state);

            // before create
            this.callOption('beforeCreate', state);

            // init state
            _.def(this, '__state__', state, {
                configurable: true
            });

            // init prev state
            _.def(this, '__prev_state__', null, {
                configurable: true
            });

            // init container
            this.set('container', this.callOption('container') || _.docBody);

            // init baseUrl
            var baseUrl = this.callOption('baseUrl');
            if (_.notNull(baseUrl) && !_.isObject(baseUrl)) {
                baseUrl = {root: _.trim(baseUrl)};
            }
            baseUrl = _.extend({}, App.DEFAULTS.baseUrl, baseUrl);
            if (!baseUrl.root) {
                baseUrl.root = Route.getBaseHref();
            }
            baseUrl.root = _.trim(baseUrl.root).replace(App.REGEXP_SLASH_END, "");
            this.set('baseUrl', baseUrl);

            // init index
            this.set('index', _.trim(this.callOption('index')) || Ajax.DEFAULTS.index);

            // init html css prefix
            var cssPrefix = this.callOption('cssPrefix') || {};
            if (_.isObject(cssPrefix)) {
                cssPrefix.layout = (
                    _.trim(cssPrefix.layout) || App.DEFAULTS.cssPrefix.layout
                );
                cssPrefix.view = (
                    _.trim(cssPrefix.view) || App.DEFAULTS.cssPrefix.view
                );
                cssPrefix.include = (
                    _.trim(cssPrefix.include) || App.DEFAULTS.cssPrefix.include
                );
            } else {
                cssPrefix = _.extend({}, App.DEFAULTS.cssPrefix);
            }
            this.set('cssPrefix', cssPrefix);

            // init loading option
            this.set('loading', _.extend(
                {},
                App.DEFAULTS.loading,
                this.callOption('loading')
            ));

            // init filter option
            this.set('filter', _.normalizeArrOption(
                this.callOption('filter')
            ));

            // init binds option
            this.set('binds', this.callOption('binds'));

            // init cache option
            if (_.isNull(YFjs.mdCache)) {
                YFjs.mdCache = this.callOption('cache');
            }
            if (_.notNull(YFjs.mdCache)) {
                this.set('cache', YFjs.mdCache);
            }

            // init template option
            this.set('template', this.callOption('template'));

            // init styleLoader option
            this.set('styleLoader', this.callOption('styleLoader'));

            // init global mode
            this.set('mode', this.callOption('mode'));

            // init ajax option
            this.set('ajax', this.callOption('ajax'));

            // init WebSocket option
            this.set('websocket', this.callOption('websocket'));

            // init cookie option
            this.set('cookie', this.callOption('cookie'));

            // init Widget option
            this.set('Widget', this.callOption('Widget'));

            // init Layout option
            this.set('Layout', this.callOption('Layout'));

            // init View option
            this.set('View', this.callOption('View'));

            options = this.__options__ || {};

            var baseUrlOpt = options.baseUrl, url = {};
            url.root     = _.getRelativePath(baseUrlOpt.root, _.LOCAL_ROOT, false);
            url.resource = _.getRelativePath(baseUrlOpt.resource, url.root);
            url.style    = _.getRelativePath(baseUrlOpt.style, url.root);
            url.view     = _.getRelativePath(baseUrlOpt.view, url.root);
            url.layout   = _.getRelativePath(baseUrlOpt.layout, url.root);
            url.template = _.getRelativePath(baseUrlOpt.template, url.root);
            _.def(this, 'url', url, {
                writable: false,
                configurable: false
            });

            var container;
            try {
                if (!$(options.container).length) {
                    container = _.docBody;
                } else {
                    container = options.container;
                }
            } catch (e) {
                container = _.docBody;
            }
            _.def(this, 'container', container, {
                writable: false
            });

            _.def(this, 'rootContext', this, {
                writable: false,
                configurable: false
            });

            _.def(Layout, 'CONTEXT', this.rootContext, {
                writable: false,
                configurable: false
            });

            _.def(View, 'CONTEXT', this.rootContext, {
                writable: false,
                configurable: false
            });

            // loading
            options.loading.type = "page";
            options.loading.container = this.container;
            _.def(this, '__loading__', Loading(options.loading, this));

            // filters
            var filters = [];
            $.each(options.filter, function(i, filterOpt) {
                var filter = new Filter(filterOpt, self),
                    pos = inFilters(filter, filters);
                if (pos < 0) {
                    filters.push(filter);
                } else {
                    filters.splice(pos, 1, filter);
                }
            });
            _.def(this, '__filters__', filters);

            // remote mark
            _.def(this, 'remote', Remote, {
                writable: false,
                configurable: false
            });

            // global mode
            _.def(this, 'mode', options.mode, {
                writable: false,
                configurable: false
            });

            // init ajax defaults
            Ajax.config(
                _.extend(
                    {base: this.url.root, mode: options.mode},
                    options.ajax
                )
            );

            // ajax util
            _.def(this, 'ajax', Ajax(null, this), {
                writable: false,
                configurable: false
            });

            // init websocket defaults
            WebSocket.config(
                _.extend(
                    {base: this.url.root, mode: options.mode},
                    options.websocket
                )
            );

            // WebSocket util
            _.def(this, 'ws', WebSocket(null, this), {
                writable: false,
                configurable: false
            });

            var cacheOption = options.cache,
                templateOption, styleLoaderOption;

            if (!_.isUndef(cacheOption)) {
                templateOption = _.extend({cache: cacheOption}, options.template);
                styleLoaderOption = _.extend({cache: cacheOption}, options.styleLoader);
            } else {
                templateOption = options.template;
                styleLoaderOption = options.styleLoader;
            }

            // init template defaults
            if (_.notNull(templateOption)) {
                Template.config(templateOption);
            }

            // init styleLoader defaults
            if (_.notNull(styleLoaderOption)) {
                StyleLoader.config(styleLoaderOption);
            }

            // template util
            _.def(this, 'template', Template(null, this), {
                writable: false,
                configurable: false
            });

            // template filename during render
            _.def(this, '__render_file__', null, {
                configurable: true
            });

            // styleLoader util
            _.def(this, 'styleLoader', StyleLoader(null, this), {
                writable: false,
                configurable: false
            });

            // init cookie defaults
            if (_.notNull(options.cookie) && _.isObject(options.cookie)) {
                var cookieOpt, cookieProto = _.extend({}, Cookie.prototype);
                for (key in options.cookie) {
                    cookieOpt = options.cookie[key];
                    if (_.__hasOwn.call(Cookie.DEFAULTS, key)) {
                        Cookie.config(key, cookieOpt);
                    } else if (!_.__hasProto.call(cookieProto, key)) {
                        Cookie.prototype[key] = cookieOpt;
                    }
                    cookieOpt = _.__undef__;
                }
            }

            // cookie util
            _.def(this, 'cookie', Cookie(null, this), {
                writable: false,
                configurable: false
            });

            // init Layout and View defaults
            if (_.notNull(options.Widget) && _.isObject(options.Widget)) {
                View.config(options.Widget);
                Layout.config(options.Widget);
            }
            if (_.notNull(options.View) && _.isObject(options.View)) {
                View.config(options.View);
            }
            if (_.notNull(options.Layout) && _.isObject(options.Layout)) {
                Layout.config(options.Layout);
            }
            if (_.isFunction(options.errorFilter)) {
                View.config('errorFilter', options.errorFilter);
                Layout.config('errorFilter', options.errorFilter);
            }

            if (_.notNull(options.cssPrefix.include)) {
                _.def(View, 'PREFIX_CSS_INCLUDE', options.cssPrefix.include);
                _.def(Layout, 'PREFIX_CSS_INCLUDE', options.cssPrefix.include);
            }

            require.config({
                paths: {
                    'app/resources' : this.url.resource.replace(App.REGEXP_SLASH_END, ""),
                    'app/styles'    : this.url.style.replace(App.REGEXP_SLASH_END, ""),
                    'app/views'     : this.url.view.replace(App.REGEXP_SLASH_END, ""),
                    'app/layouts'   : this.url.layout.replace(App.REGEXP_SLASH_END, ""),
                    'app/templates' : this.url.template.replace(App.REGEXP_SLASH_END, "")
                }
            });

            // export app interface
            define(App.NAMESPACE, function() {return self;});

            // update state
            var statechange = App.updateState.call(this, 'created');

            // statechange
            if (false !== statechange) {
                this.callOption('statechange', statechange);
            }

            // created
            this.callOption('created');
        } else {
            return new App.Creator(initializer);
        }
    };

    App.Creator.prototype = {
        getInitializer: function() {
            return this.__initializer__;
        },
        set: function(key, val) {
            var setter = this.__setter__, res;
            if (_.isFunction(setter)) {
                res = setter.apply(this, arguments);
            }
            if (false === res) {
                var err = this.makeError('setter', [key]);
                this.addError(err);
                if (this.afterState('beforeLoad')) {
                    App.Event.trigger('Error', err);
                }
            }
            return this;
        },
        get: View.Creator.prototype.get,
        getOptions: View.Creator.prototype.getOptions,
        callOption: View.Creator.prototype.callOption,
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
                        this.makeError('callback', [name, e.message], e),
                        errProps
                    );
                    this.addError(err);
                    res = _.__undef__;
                }
            } else {
                res = option;
            }

            if (!_.isEmpty(err) && this.afterState('beforeLoad')) {
                App.Event.trigger('Error', err);
            }

            return res;
        },
        getFilter: function(name) {
            var filter;

            name = _.trim(name);

            if (!_.isEmpty(name)) {
                var _filter;
                for (var i=0; i<this.__filters__.length; i++) {
                    _filter = this.__filters__[i];
                    if (_filter && _filter.name === name) {
                        filter = _filter;
                        break;
                    }
                }
            }

            return filter;
        },
        getFilters: function() {
            return [].concat(this.__filters__);
        },
        getStateIndex:   View.Creator.prototype.getStateIndex,
        inState:         View.Creator.prototype.inState,
        beforeState:     View.Creator.prototype.beforeState,
        afterState:      View.Creator.prototype.afterState,
        isBeforeCreate:  View.Creator.prototype.isBeforeCreate,
        isCreated:       View.Creator.prototype.isCreated,
        isBeforeReady:   View.Creator.prototype.isBeforeReady,
        isReady:         View.Creator.prototype.isReady,
        isBeforeLoad:    View.Creator.prototype.isBeforeLoad,
        isLoaded:        View.Creator.prototype.isLoaded,
        isBeforeDestroy: View.Creator.prototype.isBeforeDestroy,
        isDestroyed:     View.Creator.prototype.isDestroyed,
        isDispose:       View.Creator.prototype.isDispose,
        setState:  View.Creator.prototype.getState,
        getState:  View.Creator.prototype.getState,
        getPath:   View.Creator.prototype.getPath,
        getPathId: View.Creator.prototype.getPathId,
        getParam:  View.Creator.prototype.getParam,
        getParams: View.Creator.prototype.getParams,
        setPrevState: function(key, val) {
            var prevStateSetter = _.stateSetter(this.__prev_state__);
            if (_.isFunction(prevStateSetter)) {
                prevStateSetter.apply(this, arguments);
            }
            return this;
        },
        prevState: function(key) {
            var val, prevStateGetter = _.stateGetter(this.__prev_state__);
            if (_.isFunction(prevStateGetter)) {
                val = prevStateGetter.apply(this, arguments);
            }
            return val;
        },
        prevPath: function(path) {
            return _.getPath(path, this.prevState('path'));
        },
        prevPathId: function(path) {
            return _.getPathId(path, this.prevState('path'));
        },
        prevParam: function(name) {
            return _.getParam(name, this.prevParams());
        },
        prevParams: function() {
            return this.prevState('param') || {};
        },
        // get cache
        getCache:    View.Creator.prototype.getCache,
        // set cache
        setCache:    View.Creator.prototype.setCache,
        // remove cache
        removeCache: View.Creator.prototype.removeCache,
        // get cache key
        getCacheKey: function() { return ''; },
        // view constructor
        View: function(options) {
            return View.create(options);
        },
        // layout constructor
        Layout: function(options) {
            return Layout.create(options);
        },
        // current view instance
        getView: function() {
            return App.LAST_VIEW;
        },
        // history go api
        go: function() {
            triggerAppFn('go', _.__aslice.call(arguments));
            return this;
        },
        back: function() {
            triggerAppFn('back', _.__aslice.call(arguments));
            return this;
        },
        forward: function() {
            triggerAppFn('forward', _.__aslice.call(arguments));
            return this;
        },
        // cookie quick api
        getCookie: function() {
            return this.cookie.get.apply(this.cookie, arguments);
        },
        setCookie: function() {
            this.cookie.set.apply(this.cookie, arguments);
            return this;
        },
        removeCookie: function(key, options) {
            return this.cookie.remove.apply(this.cookie, arguments);
        },
        // url api
        getRootUrl: function(path, params) {
            return this.getFullUrl(path, params);
        },
        getResourceUrl: function(path, params) {
            return this.getFullUrl(path, params, this.url.resource);
        },
        getStyleUrl: function(path, params) {
            return this.getFullUrl(path, params, this.url.style);
        },
        getFullUrl: function(path, params, rootUrl) {
            path = path || "";
            params = params || "";

            var url = rootUrl || this.url.root;

            if (App.REGEXP_SLASH_START.test(path)) {
                path = path.replace(App.REGEXP_SLASH_START, "");
            }

            url += path;

            try {
                if (_.isObject(params)) {
                    params = $.param(params);
                } else {
                    params = _.trim(params);
                }
            } catch (e) {
                params = "";
            }

            if (params) {
                if (/\?$/.test(url)) {
                    url += params;
                } else if (url.indexOf('?') > -1) {
                    url += ('&' + params);
                } else {
                    url += ('?' + params);
                }
            }

            return url;
        },
        getUrl: function(path, params) {
            var widget = this.__widget__, relativePath;
            if (_.notNull(this.__render_file__)) {
                relativePath = widget.trimTemplatePath(this.__render_file__);
            } else {
                relativePath = this.getPath();
            }
            var url = _.toUrl(path || this.get('index'), params, relativePath);
            if (!App.REGEXP_HASH_START.test(url)) {
                url = "#" + url;
            }
            return url;
        },
        // helpers api
        helper: function(name, fn) {
            triggerAppFn('helper', _.__aslice.call(arguments));
            return this;
        },
        helpers: function(helpers) {
            triggerAppFn('helpers', _.__aslice.call(arguments));
            return this;
        },
        // event bind api
        bind: function() {
            triggerAppFn('bind', _.__aslice.call(arguments));
            return this;
        },
        on: function() {
            triggerAppFn('on', _.__aslice.call(arguments));
            return this;
        },
        one: function() {
            triggerAppFn('one', _.__aslice.call(arguments));
            return this;
        },
        unbind: function() {
            triggerAppFn('unbind', _.__aslice.call(arguments));
            return this;
        },
        off: function() {
            triggerAppFn('off', _.__aslice.call(arguments));
            return this;
        },
        trigger: function() {
            triggerAppFn('trigger', _.__aslice.call(arguments));
            return this;
        },
        makeError    : View.Creator.prototype.makeError,
        setError     : View.Creator.prototype.setError,
        getError     : View.Creator.prototype.getError,
        addError     : View.Creator.prototype.addError,
        removeError  : View.Creator.prototype.removeError,
        includeError : View.Creator.prototype.includeError,
        excludeError : View.Creator.prototype.excludeError,
        inError      : View.Creator.prototype.inError,
        onError      : View.Creator.prototype.onError,
        assignError  : View.Creator.prototype.assignError
    };

    _.def(App.Creator.prototype, '__const_props__', [
        '__ns__', '__widget__', '__initializer__',
        '__options__',
        '__setter__', '__getter__',
        '__error__', '__error_ns__', '__error_maker__',
        '__state_index__', '__state_index_getter__',
        '__state__', '__prev_state__',
        '__loading__', '__filters__',
        '__render_file__',
        'url', 'container', 'rootContext',
        'remote', 'mode', 'ajax', 'ws', 'template', 'cookie', 'json'
    ]);

    function triggerAppFn(fnName, args) {

        fnName = _.trim(fnName);
        args = args || [];

        if (fnName) {
            App.Event.trigger('AppFnCalled', [fnName].concat(args));
        }
    }

    function logError(err, level) {

        level = level || 0;

        if (level > 1000) return;

        if (!_.isEmpty(err)) {
            if (_.isArray(err)) {
                $.each(err, function(i, err) {
                    logError(err, level + 1);
                });
            } else {
                // print console
                var rptErr;
                if (
                    err.context instanceof App.Creator
                    || View.instanceof(err.context, View.Creator)
                    || Layout.instanceof(err.context, Layout.Creator)
                ) {
                    if (_.inError(err, err.context.getError()) > -1) {
                        rptErr = err;
                        err.context.removeError(err);
                    } else {
                        rptErr = null;
                    }
                } else {
                    rptErr = err;
                }
                if (_.notNull(rptErr)) {
                    console.error(rptErr);
                }
            }
        }
    }

    function normalizeErrMsg(err) {
        if (err && _.isString(err.message)) {
            return (
                (err.type ? err.type + ' ' : '').replace(/^\w/, function(w) {
                    return w.toUpperCase()
                }) +
                'Error' +
                (err.message ? ': ' + err.message : '')
            );
        }
        return '';
    }

    function inFilters(filter, filters) {
        var pos = -1;

        if (!_.notNull(filter) || !_.isArray(filters)) return pos;

        for (var i=0; i<filters.length; i++) {
            if (
                _.notNull(filters[i]) && _.notNull(filters[i].name)
                && filter.name === filters[i].name
            ) {
                pos = i;
                break;
            }
        }

        return pos;
    }

    function normalizeBeforeDestroyText(text) {

        if (_.notNull(text)) {
            if (!_.isObject(text)) {
                text = _.trim(text);
            } else {
                text = "";
            }
        } else {
            text = "";
        }

        var res = '页面还有未完成的操作';

        if (text.length) {
            res += (
                '：\n' +
                '==================================================' +
                '\n' + text + '\n' +
                '==================================================' +
                '\n'
            );
        } else {
            res += "。";
        }

        res += "确定离开吗？";

        return res;
    }

    return App;
});