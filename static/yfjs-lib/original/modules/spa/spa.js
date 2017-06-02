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
             * - 默认为入口（data-main）js文件所在目录下的 templates 目录
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
         *       请求远程样式文件时的配置项，内容同 ajax 配置项
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
         *     - 传入参数为 错误信息、请求返回的数据、当前 ws 对象。
         *     - 必须返回一个数组，数组第一项为错误信息，第二项和第三项为新处理后的数据和 ws 对象
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
                                var errIncludesMap = {}, bodyKey;

                                $.each(errIncludes, function(i, err) {
                                    if (err.state && (bodyKey = err.state.body)) {
                                        errIncludesMap[bodyKey] = _.concatError(
                                            errIncludesMap[bodyKey], err
                                        );
                                    }
                                });

                                if (!_.isUndef(resLoad.html)) {
                                    var htmlIncluded;
                                    for (bodyKey in errIncludesMap) {
                                        htmlIncluded = self.defaultErrorHtml(errIncludesMap[bodyKey]);
                                        resLoad.html = _.replaceMainBody(resLoad.html, bodyKey, htmlIncluded);
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
        setState:  View.Creator.prototype.setState,
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
define('yfjs/spa/version', function() {

    var DefVer = '1.0.0-rc.2';

    var VERSION = {
        // ui
        'Loading'              : DefVer,
        // util
        'Ajax'                 : DefVer,
        'App'                  : DefVer,
        'Cookie'               : DefVer,
        'Error'                : DefVer,
        'Event'                : DefVer,
        'Filter'               : DefVer,
        'Layout'               : DefVer,
        'Remote'               : DefVer,
        'Route'                : DefVer,
        'StyleLoader'          : DefVer,
        'Template'             : DefVer,
        'View'                 : DefVer,
        'WebSocket'            : DefVer,
        'Widget'               : DefVer,
        'PathWildcardCompiler' : DefVer
    };

    var ver = function(name) {
        return VERSION[name] || "0.0.0";
    };

    return ver;
});
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
/**
 * @depends nothing
 * @name core.console
 * @package jquery-sparkle {@link http://balupton.com/projects/jquery-sparkle}
 */

/**
 * Console Emulator
 * We have to convert arguments into arrays, and do this explicitly as webkit (chrome) hates function references, and arguments cannot be passed as is
 * @version 1.0.3
 * @date August 31, 2010
 * @since 0.1.0-dev, December 01, 2009
 * @package jquery-sparkle {@link http://balupton.com/projects/jquery-sparkle}
 * @author Benjamin "balupton" Lupton {@link http://balupton.com}
 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://balupton.com}
 * @license MIT License {@link http://creativecommons.org/licenses/MIT/}
 */

define('yfjs/spa/util/console', function() {

    var window = window || this || {};

    // Check to see if console exists, if not define it
    if ( typeof window.console === 'undefined' ) {
        window.console = {};
    }

    // Check to see if we have emulated the console yet
    if ( typeof window.console.emulated === 'undefined' ) {
        // Emulate Log
        if ( typeof window.console.log === 'function' ) {
            window.console.hasLog = true;
        }
        else {
            if ( typeof window.console.log === 'undefined' ) {
                window.console.log = function(){};
            }
            window.console.hasLog = false;
        }

        // Emulate Debug
        if ( typeof window.console.debug === 'function' ) {
            window.console.hasDebug = true;
        }
        else {
            if ( typeof window.console.debug === 'undefined' ) {
                window.console.debug = !window.console.hasLog ? function(){} : function(){
                    var arr = ['console.debug:']; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
                    window.console.log.apply(window.console, arr);
                };
            }
            window.console.hasDebug = false;
        }

        // Emulate Warn
        if ( typeof window.console.warn === 'function' ) {
            window.console.hasWarn = true;
        }
        else {
            if ( typeof window.console.warn === 'undefined' ) {
                window.console.warn = !window.console.hasLog ? function(){} : function(){
                    var arr = ['console.warn:']; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
                    window.console.log.apply(window.console, arr);
                };
            }
            window.console.hasWarn = false;
        }

        // Emulate Error
        if ( typeof window.console.error === 'function' ) {
            window.console.hasError = true;
        }
        else {
            if ( typeof window.console.error === 'undefined' ) {
                window.console.error = function(){
                    var msg = "An error has occured.";

                    // Log
                    if ( window.console.hasLog ) {
                        var arr = ['console.error:']; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
                        window.console.log.apply(window.console, arr);
                        // Adjust Message
                        msg = 'An error has occured. More information is available in your browser\'s javascript console.'
                    }

                    // Prepare Arguments
                    for ( var i = 0; i < arguments.length; ++i ) {
                        if ( typeof arguments[i] !== 'string' ) {
                            break;
                        }
                        msg += "\n"+arguments[i];
                    }

                    // Throw Error
                    if ( typeof Error !== 'undefined' ) {
                        throw new Error(msg);
                    }
                    else {
                        throw(msg);
                    }
                };
            }
            window.console.hasError = false;
        }

        // Emulate Trace
        if ( typeof window.console.trace === 'function' ) {
            window.console.hasTrace = true;
        }
        else {
            if ( typeof window.console.trace === 'undefined' ) {
                window.console.trace = function(){
                    window.console.error('console.trace does not exist');
                };
            }
            window.console.hasTrace = false;
        }

        // Done
        window.console.emulated = true;
    }

    return window.console;
});

/**
 * 获取及设置Cookie
 *
 * Created by jinzhk on 2016/11/22.
 */
define('yfjs/spa/util/cookie', [
    '../version', './helpers', './error', './event'
], function(Version, _, Error, Event) {

    var JSON = _.JSON;

    var document = _.document;

    var pluses = /\+/g;

    var Cookie = function(options, context) {
        if (this instanceof Cookie) {
            _.def(this, '__options__', _.extend({}, Cookie.DEFAULTS, options));
            _.def(this, '__context__', context);
        } else {
            return new Cookie(options, context);
        }
    };

    Cookie.NAMESPACE = "Cookie";

    Cookie.VERSION = Version(Cookie.NAMESPACE);

    Cookie.DEFAULTS = {
        /**
         * 有效域（二级域） {String}
         * - 跨二级域时须以 "." 开头，如 .example.com
         * - 根据浏览器同源策略，cookie 默认是不支持跨一级域的。如果需要跨一级域，可以在后台通过设置 P3P HTTP Header 来实现第三方 cookie 的共享
         *   如: jsp response.setHeader("P3P", "CP='CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR'")
         * - 默认为当前域
         */
        domain: _.LOCAL_HOST,
        /**
         * 有效路径 {String}
         * - 默认为根路径
         */
        path: "/",
        /**
         * 有效时间 {Number|Date}
         * - 为 Number 类型时，单位为天
         * - 半天可以设为 0.5
         * - IE 不支持设置 max-age
         * - 默认为 session 存在时间
         */
        expires: _.__undef__,
        /**
         * 安全策略 {boolean}
         * - 设为 true，则获取 cookie 时需要 https 协议
         * - 默认为 false
         */
        secure: false,
        /**
         * 是否对要设置的 cookie 的键和值进行编码
         * - 默认为 true
         */
        encode: false
    };

    Cookie.config = _.configurator.call(Cookie, Cookie.DEFAULTS);

    Cookie.Error = Error(Cookie.NAMESPACE);

    Cookie.Error.translate({
        'config': "设置 cookie 时发生了错误：{0}",
        'converter': "转换 cookie 值时发生了错误：{0}"
    });

    Cookie.Event = Event(Cookie.NAMESPACE);

    Cookie.prototype = {
        setOption: _.optionSetter(Cookie.DEFAULTS),
        getOption: _.optionGetter(),
        getOptions: _.optionsGetter(),
        getContext: function() {
            return this.__context__;
        },
        /**
         * 获取所有的 cookie（键=>值）
         * @returns {Object}
         */
        getAll: function() {
            return this.config() || {};
        },
        /**
         * 获取某个 cookie 的值
         * @param key {String} 键
         * @param converter {Function} 定义转换类型，
         *        如：
         *        set('foo', '42');
         *        get('foo', Number); // => 42
         * @returns {Object}
         */
        get: function(key, converter) {
            return _.isFunction(converter) ? this.config(key, converter) : this.config(key);
        },
        /**
         * 设置cookie
         * @param key {string} 键
         * @param value 任意类型（undefined和Function类型除外） 值
         * @param options {Object} 额外参数
         * @returns {Cookie}
         */
        set: function(key, value, options) {
            if (_.isUndef(value) || _.isFunction(value)) return this;
            this.config(key, value, options);
            return this;
        },
        /**
         * 删除cookie
         * @param key {String} 键
         * @param options {Object} 额外参数
         * @returns {Boolean} true|false
         */
        remove: function (key, options) {
            if (_.isUndef(this.get(key))) {
                return false;
            }
            // Must not alter options, thus extending a fresh object...
            this.config(key, '', _.extend({}, options, { expires: -1 }));
            return !_.isUndef(this.get(key));
        },
        /**
         * 设置有效域
         * @param domain {String}
         * @returns {Cookie}
         */
        setDomain: function(domain) {
            if (!_.isEmpty(domain)) {
                this.setOption('domain', _.trim(domain));
            }
            return this;
        },
        /**
         * 设置有效路径
         * @param path {String}
         * @returns {Cookie}
         */
        setPath: function(path) {
            if (!_.isEmpty(path)) {
                this.setOption('path', _.trim(path));
            }
            return this;
        },
        /**
         * 设置有效时间
         * @param expires {Number|Date}
         * @returns {Cookie}
         */
        setExpires: function(expires) {
            if (_.isNumber(expires) || (expires instanceof Date)) {
                this.setOption('expires', expires);
            }
            return this;
        },
        /**
         * 获取或设置 cookie
         * @param key
         * @param value
         * @param options
         * @returns {*}
         */
        config: function(key, value, options) {

            var raw = !this.getOption('encode');

            // Write

            if (!_.isUndef(value) && !_.isFunction(value)) {
                options = this.getOptions(options);

                if (_.isNumber(options.expires)) {
                    var days = options.expires, t = options.expires = new Date();
                    t.setTime(+t + days * 864e+5);
                }

                raw = !options.encode;

                try {
                    return (document.cookie = [
                        this.encode(key, raw), '=', this.stringifyCookieValue(value, raw),
                        options.expires instanceof Date
                            ? '; expires=' + options.expires.toUTCString() : '',
                        options.path
                            ? '; path=' + options.path : '',
                        options.domain
                            ? '; domain=' + options.domain : '',
                        options.secure
                            ? '; secure' : ''
                    ].join(''));
                } catch (e) {
                    Cookie.Event.trigger('Error',
                        this.makeError('config', [e.message], e)
                    );
                    return document.cookie;
                }
            }

            // Read

            key = _.trim(key);

            var result = _.isEmpty(key) ? {} : _.__undef__;

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling config().
            var cookies = document.cookie ? document.cookie.split('; ') : [];

            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split('=');
                var name = this.decode(parts.shift(), raw);
                var cookie = parts.join('=');

                if (key && key === name) {
                    // If second argument (value) is a function it's a converter...
                    result = this.read(cookie, value);
                    break;
                }

                // Prevent storing a cookie that we couldn't decode.
                if (!key && !_.isUndef(cookie = this.read(cookie))) {
                    result[name] = cookie;
                }
            }

            return result;
        },
        encode: function(s, raw) {
            return raw ? s : encodeURIComponent(s);
        },
        decode: function(s, raw) {
            return raw ? s : decodeURIComponent(s);
        },
        stringifyCookieValue: function(value, raw) {
            if (_.notNull(value) && _.isObject(value)) {
                try {
                    value = JSON.stringify(value);
                } catch (e) {
                    value = String(value);
                }
            } else {
                value = String(value);
            }
            return this.encode(value, raw);
        },
        parseCookieValue: function(s, raw) {
            if (s.indexOf('"') === 0) {
                // This is a quoted cookie as according to RFC2068, unescape...
                s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }

            var res;

            try {
                // Replace server-side written pluses with spaces.
                // If we can't decode the cookie, ignore it, it's unusable.
                // If we can't parse the cookie, ignore it, it's unusable.
                // s = this.decode(s.replace(pluses, ' '), raw);
                s = this.decode(s, raw);
                res = JSON.parse(s);
            } catch(e) {
                res = s;
            }

            return res;
        },
        read: function(s, converter, raw) {
            var value = this.parseCookieValue(s, raw), res;
            if (_.isFunction(converter)) {
                try {
                    res = converter.call(this.getContext() || this, value);
                } catch (e) {
                    Cookie.Event.trigger('Error',
                        this.makeError('converter', [e.message], e)
                    );
                    res = value;
                }
            } else {
                res = value;
            }
            return res;
        },
        makeError: function(id, option, originalError) {
            var errorMaker = this.__error_maker__, err;
            if (!errorMaker) {
                _.def(this, '__error_maker__', _.errorMaker(Cookie.Error, this.getContext()));
                errorMaker = this.__error_maker__;
            }
            err = errorMaker.apply(this, arguments);
            return err;
        }
    };

    return Cookie;
});

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
define('yfjs/spa/util/event', ['../version', 'jquery', './helpers', './console'], function(Version, $, _, console) {

    var Event = function(options) {
        if (this instanceof Event) {
            // init options
            if (_.notNull(options) && !_.isObject(options)) {
                options = {NS: _.trim(options)};
            }
            _.def(this, '__options__', _.extend({}, Event.DEFAULTS, options));
        } else {
            return new Event(options);
        }
    };

    Event.NAMESPACE = "Event";

    Event.VERSION = Version(Event.NAMESPACE);

    Event.DEFAULTS = {
        NS: ""
    };

    Event.prototype = {
        setOption: _.optionSetter(Event.DEFAULTS),
        getOption: _.optionGetter(),
        getOptions: _.optionsGetter(),
        /**
         * 事件绑定。与 jquery(>=1.9.1) 框架的事件方法 on 兼容
         * @param eventName {String}
         *          事件名称，多个事件以空格间隔
         * @param element {String|jQuery|HTMLElement}
         *          可选。事件绑定元素，可为选择器字符串、jQuery对象、dom元素对象
         * @param data {Object}
         *          可选。事件绑定数据
         * @param handler {Function}
         *          事件绑定回调方法
         * @param one
         *          可选。设为 1 时只绑定一次事件
         * @returns {Event}
         */
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

            var self = this, ns = self.getOption('NS');

            var regExpNS = getRegExpNS(ns);

            var doBind = function(eventName, element, data, handler, one) {

                if (_.isEmpty(eventName)) return;

                // init eventName
                if (!isGlobalEvent(eventName) && !regExpNS.test(eventName)) {
                    eventName += ("." + ns);
                }

                // create event callback
                var callback = function(evt) {
                    var args, handler;

                    try {
                        args = _.__aslice.call(evt.handleObj.handler.arguments);
                        handler = evt.handleObj.handler.delegateHandler;
                    } catch (e) {
                        args = evt ? [evt] : [];
                        handler = null;
                    }

                    try {
                        if (_.isFunction(handler) && (
                            !handler.delegateTarget
                            || evt.delegateTarget === _.window
                            || handler.delegateTarget === evt.delegateTarget
                            || $.contains(handler.delegateTarget, evt.delegateTarget))
                        ) {
                            if (handler.context && _.isFunction(handler.context.applyOption)) {
                                return handler.context.applyOption.call(handler.context, handler, args);
                            } else {
                                return handler.apply(handler.context || this, args);
                            }
                        }
                    } catch (e) {
                        console.error(e);
                    }
                };

                handler.delegateCallback = callback;
                callback.delegateHandler = handler;

                try {
                    // bind event to element
                    if (_.isString(element)) {
                        $(_.document).on(eventName, element, data, callback, one);
                    } else {
                        var selector = parseSelector(element);
                        if (element.prevObject && element.prevObject.length) {
                            element = element.prevObject;
                            selector = parseSelector(element, selector);
                        } else {
                            selector = '';
                        }
                        var $element = _.is$(element) ? element : $(element);
                        if (selector.length) {
                            $element.on(eventName, selector, data, callback, one);
                        } else {
                            $element.on(eventName, _.__undef__, data, callback, one);
                        }
                    }
                } catch (e) {}
            };

            // split eventName
            var eventNames = _.unique(eventName.split(/\s+/));
            $.each(eventNames, function(i, eventName) {
                doBind(eventName, element, data, handler, one);
            });

            return this;
        },
        /**
         * 事件绑定。等效于bind
         */
        on: function() {
            return this.bind.apply(this, arguments);
        },
        /**
         * 绑定一次事件。与 jquery(>=1.9.1) 框架的事件方法 one 兼容
         * @param eventName {String}
         *          事件名称，多个事件以空格间隔
         * @param element {String|jQuery|HTMLElement}
         *          可选。事件绑定元素，可为选择器字符串、jQuery对象、dom元素对象
         * @param data {Object}
         *          可选。事件绑定数据
         * @param handler {Function}
         *          事件绑定回调方法
         * @returns {Event}
         */
        one: function(eventName, element, data, handler) {
            return this.bind(eventName, element, data, handler, 1);
        },
        /**
         * 事件解绑。与 jquery(>=1.9.1) 框架的事件方法 off 兼容
         * @param eventName {String}
         *          事件名称，多个事件以空格间隔
         * @param element {String|jQuery|HTMLElement}
         *          可选。事件绑定元素，可为选择器字符串、jQuery对象、dom元素对象
         * @param handler {Function}
         *          可选。事件绑定回调方法
         * @returns {Event}
         */
        unbind: function(eventName, element, handler) {

            // eventName can be a map of eventName/handlers
            if (_.notNull(eventName) && _.isObject(eventName)) {
                for (var evtName in eventName) {
                    this.unbind(evtName, element, eventName[evtName]);
                }
                return this;
            }

            var args = Event.normalizeUnBindArgs.apply(Event, arguments);

            eventName = args[0];
            element = args[1];
            handler = args[2];

            var self = this, ns = self.getOption('NS');

            var regExpNS = getRegExpNS(ns);

            var doUnBind = function(eventName, element, handler) {

                if (_.isEmpty(eventName)) return;

                // init eventName
                if (!isGlobalEvent(eventName) && !regExpNS.test(eventName)) {
                    eventName += ("." + ns);
                }

                var callback;

                if (handler) {
                    callback = handler.delegateCallback || handler;
                }

                try {
                    // unbind event from element
                    if (_.isString(element)) {
                        $(_.document).off(eventName, element, handler);
                    } else {
                        var selector = parseSelector(element);
                        if (element.prevObject && element.prevObject.length) {
                            element = element.prevObject;
                            selector = parseSelector(element, selector);
                        } else {
                            selector = '';
                        }
                        var $element = _.is$(element) ? element : $(element);
                        if (selector.length) {
                            $element.off(eventName, selector, callback);
                        } else {
                            $element.off(eventName, callback);
                        }
                    }
                } catch (e) {}
            };

            // split eventName
            var eventNames = _.unique(eventName.split(/\s+/));
            $.each(eventNames, function(i, eventName) {
                doUnBind(eventName, element, handler);
            });

            return this;
        },
        /**
         * 事件解绑。等效于unbind
         */
        off: function() {
            return this.unbind.apply(this, arguments);
        },
        /**
         * 触发事件。与 jquery(>=1.9.1) 框架的事件方法 trigger 兼容
         * @param eventName {String}
         *          事件名称，多个事件以空格间隔
         * @param data {Object}
         *          可选。事件绑定数据
         * @param element {String|jQuery|HTMLElement}
         *          可选。事件触发元素，可为选择器字符串、jQuery对象、dom元素对象
         * @returns {Event}
         */
        trigger: function(eventName, data, element) {

            var args = Event.normalizeTriggerArgs.apply(Event, arguments);

            eventName = args[0];
            data = args[1];
            element = args[2];

            var ns = this.getOption('NS');

            var regExpNamespace = getRegExpNS(ns);

            var doTrigger = function(eventName) {

                if (_.isEmpty(eventName)) return;

                // init eventName
                if (!isGlobalEvent(eventName) && !regExpNamespace.test(eventName)) {
                    eventName += ("." + ns);
                }

                try {
                    var $element = _.is$(element) ? element : $(element);
                    $element.trigger(eventName, data);
                } catch (e) {}
            };

            // split eventName
            var eventNames = _.unique(eventName.split(/\s+/));
            $.each(eventNames, function(i, eventName) {
                doTrigger(eventName, data);
            });

            return this;
        }
    };

    Event.normalizeBindArgs = function(eventName, element, data, handler, one) {
        var args;

        eventName = _.trim(eventName);

        if (!_.validElement(element)) {
            if (_.isFunction(element)) {
                handler = element;
                data = null;
            } else {
                if (_.isFunction(data)) {
                    handler = data;
                    data = null;
                }
                if (data == null) {
                    data = element;
                }
            }
            element = _.document;
        } else if (_.isFunction(data)) {
            handler = data;
            data = null;
        }

        if (handler === false) {
            handler = _.returnFalse;
        } else if (!handler) {
            return args;
        }

        // 处理 viewchange 事件
        eventName = eventName.replace(/viewchange(?!\.App\.G)/i, "viewchange.App.G");

        if (_.isString(element)) {
            if (/^window$/i.test(element)) {
                element = _.window;
            } else if (/^document$/i.test(element)) {
                element = _.document;
            }
        }

        if (arguments[arguments.length - 1] === 1) {
            one = 1;
        } else {
            one = _.__undef__;
        }

        args = [eventName, element, data, handler, one];

        return args;
    };

    Event.normalizeUnBindArgs = function(eventName, element, handler) {
        var args;

        eventName = _.trim(eventName);

        if (element === false || _.isFunction(element)) {
            handler = element;
            element = _.document;
        }

        if (_.isString(element)) {
            if (/^window$/i.test(element)) {
                element = _.window;
            } else if (/^document$/i.test(element)) {
                element = _.document;
            }
        }

        if (handler === false) {
            handler = _.returnFalse;
        }

        // 处理 viewchange 事件
        eventName = eventName.replace(/viewchange(?!\.App\.G)/i, "viewchange.App.G");

        if (_.isString(element)) {
            if (/^window$/i.test(element)) {
                element = _.window;
            } else if (/^document$/i.test(element)) {
                element = _.document;
            }
        }

        args = [eventName, element, handler];

        return args;
    };

    Event.normalizeTriggerArgs = function(eventName, data, element) {
        var args;

        eventName = _.trim(eventName);

        if (_.validElement(data)) {
            element = data;
            data = _.__undef__;
        }

        if (!_.validElement(element)) {
            element = _.document;
        }

        // 处理 viewchange 事件
        eventName = eventName.replace(/viewchange(?!\.App\.G)/i, "viewchange.App.G");

        if (_.isString(element)) {
            if (/^window$/i.test(element)) {
                element = _.window;
            } else if (/^document$/i.test(element)) {
                element = _.document;
            }
        }

        args = [eventName, data, element];

        return args;
    };

    function getRegExpNS(ns) {
        var regExpNamespace;
        if (!_.isEmpty(ns)) {
            regExpNamespace = new RegExp("\\." + ns + "$");
        } else {
            regExpNamespace = /\s*/;
        }
        return regExpNamespace;
    }

    function parseSelector(element, selector) {
        element = element || {};
        selector = _.trim(selector);

        var _selector = _.trim(element.selector);

        if (selector.length) {
            if (_selector.length && selector.indexOf(_selector) == 0) {
                selector = _.trim(selector.substring(_selector.length));
            }
        } else {
            selector = _selector;
        }

        return selector;
    }

    function isGlobalEvent(eventName) {
        return /\.App\.G$/.test(eventName);
    }

    return Event;
});
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

        (function(self, callback, args, period) {
            setTimeout(function() {
                typeof callback === "function" && callback.apply(self, args);
            }, period);
        })(this, callback, args, period);

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
        replaceMainBody: function(html, bodyKey, replacement) {
            if (html == null || bodyKey == null) return '';

            bodyKey = trim(bodyKey);

            if (!bodyKey.length || replacement == null) return html;

            html += '';
            replacement += '';

            try {
                html = html.replace(
                    new RegExp('\\{\\{\\{' + bodyKey + '\\}\\}\\}', "g"), replacement
                );
            } catch (e) {
                bodyKey = '{{{ ' + bodyKey + '}}}';
                var pos;
                while ((pos = html.indexOf(bodyKey)) > -1) {
                    html = html.substring(0, pos) + replacement + html.substring(pos + bodyKey.length);
                }
            }

            return html;
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
/*!
 * 改写自
 * =======================================================================
 * History.js Native Adapter - v1.8.0
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 * =======================================================================
 * 新加功能
 * =======================================================================
 * - Updated by jinzhk on 2016/07/22
 * 删除History自动调用init进行初始化的相关代码，改为可传入配置项手动调用。
 * - Updated by jinzhk on 2016/07/25
 * 1、改写了 isTraditionalAnchor 方法，空字符串返回false。
 * 2、完善了方法 getShortUrl - 替换 baseUrl 时若 baseUrl 以'/'结尾，应替换为'/'。
 * - Updated by jinzhk on 2016/08/24
 * 调整了方法 hashChangeInit - lastDocumentHash 初始化时不设为空，改设为当前hash值
 * =======================================================================
 */
define('yfjs/spa/util/history', (function(root) {
    var deps = [];
    // json shim
    if (typeof root.JSON !== "undefined") {
        define('json', function() {return root.JSON});
    }
    deps.push('json');
    return deps;
})(this), function(JSON) {

    var window = this;

    var History;

    /**
     * History.js Native Adapter
     * @author Benjamin Arthur Lupton <contact@balupton.com>
     * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    // Closure
    (function(window,undefined){
        "use strict";

        // Localise Globals
        History = window.History = window.History||{};

        // Check Existence
        if ( typeof History.Adapter !== 'undefined' ) {
            throw new Error('History.js Adapter has already been loaded...');
        }

        // Add the Adapter
        History.Adapter = {
            /**
             * History.Adapter.handlers[uid][eventName] = Array
             */
            handlers: {},

            /**
             * History.Adapter._uid
             * The current element unique identifier
             */
            _uid: 1,

            /**
             * History.Adapter.uid(element)
             * @param {Element} element
             * @return {String} uid
             */
            uid: function(element){
                return element._uid || (element._uid = History.Adapter._uid++);
            },

            /**
             * History.Adapter.bind(el,event,callback)
             * @param {Element} element
             * @param {String} eventName - custom and standard events
             * @param {Function} callback
             * @return
             */
            bind: function(element,eventName,callback){
                // Prepare
                var uid = History.Adapter.uid(element);

                // Apply Listener
                History.Adapter.handlers[uid] = History.Adapter.handlers[uid] || {};
                History.Adapter.handlers[uid][eventName] = History.Adapter.handlers[uid][eventName] || [];
                History.Adapter.handlers[uid][eventName].push(callback);

                // Bind Global Listener
                element['on'+eventName] = (function(element,eventName){
                    return function(event){
                        History.Adapter.trigger(element,eventName,event);
                    };
                })(element,eventName);
            },

            /**
             * History.Adapter.trigger(el,event)
             * @param {Element} element
             * @param {String} eventName - custom and standard events
             * @param {Object} event - a object of event data
             * @return
             */
            trigger: function(element,eventName,event){
                // Prepare
                event = event || {};
                var uid = History.Adapter.uid(element),
                    i,n;

                // Apply Listener
                History.Adapter.handlers[uid] = History.Adapter.handlers[uid] || {};
                History.Adapter.handlers[uid][eventName] = History.Adapter.handlers[uid][eventName] || [];

                // Fire Listeners
                for ( i=0,n=History.Adapter.handlers[uid][eventName].length; i<n; ++i ) {
                    History.Adapter.handlers[uid][eventName][i].apply(this,[event]);
                }
            },

            /**
             * History.Adapter.extractEventData(key,event,extra)
             * @param {String} key - key for the event data to extract
             * @param {String} event - custom and standard events
             * @return {mixed}
             */
            extractEventData: function(key,event){
                var result = (event && event[key]) || undefined;
                return result;
            },

            /**
             * History.Adapter.onDomLoad(callback)
             * @param {Function} callback
             * @return
             */
            onDomLoad: function(callback) {
                var timeout = window.setTimeout(function(){
                    callback();
                },2000);
                window.onload = function(){
                    clearTimeout(timeout);
                    callback();
                };
            }
        };

    })(window);

    /**
     * History.js HTML4 Support
     * Depends on the HTML5 Support
     * @author Benjamin Arthur Lupton <contact@balupton.com>
     * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(window,undefined){
        "use strict";

        // ========================================================================
        // Initialise

        // Localise Globals
        var
            document = window.document, // Make sure we are using the correct document
            setTimeout = window.setTimeout||setTimeout,
            clearTimeout = window.clearTimeout||clearTimeout,
            setInterval = window.setInterval||setInterval;

        History = window.History = window.History||{}; // Public History Object

        // Check Existence
        if ( typeof History.initHtml4 !== 'undefined' ) {
            throw new Error('History.js HTML4 Support has already been loaded...');
        }


        // ========================================================================
        // Initialise HTML4 Support

        // Initialise HTML4 Support
        History.initHtml4 = function(){
            // Initialise
            if ( typeof History.initHtml4.initialized !== 'undefined' ) {
                // Already Loaded
                return false;
            }
            else {
                History.initHtml4.initialized = true;
            }


            // ====================================================================
            // Properties

            /**
             * History.enabled
             * Is History enabled?
             */
            History.enabled = true;


            // ====================================================================
            // Hash Storage

            /**
             * History.savedHashes
             * Store the hashes in an array
             */
            History.savedHashes = [];

            /**
             * History.isLastHash(newHash)
             * Checks if the hash is the last hash
             * @param {string} newHash
             * @return {boolean} true
             */
            History.isLastHash = function(newHash){
                // Prepare
                var oldHash = History.getHashByIndex(),
                    isLast;

                // Check
                isLast = newHash === oldHash;

                // Return isLast
                return isLast;
            };

            /**
             * History.isHashEqual(newHash, oldHash)
             * Checks to see if two hashes are functionally equal
             * @param {string} newHash
             * @param {string} oldHash
             * @return {boolean} true
             */
            History.isHashEqual = function(newHash, oldHash){
                newHash = encodeURIComponent(newHash).replace(/%25/g, "%");
                oldHash = encodeURIComponent(oldHash).replace(/%25/g, "%");
                return newHash === oldHash;
            };

            /**
             * History.saveHash(newHash)
             * Push a Hash
             * @param {string} newHash
             * @return {boolean} true
             */
            History.saveHash = function(newHash){
                // Check Hash
                if ( History.isLastHash(newHash) ) {
                    return false;
                }

                // Push the Hash
                History.savedHashes.push(newHash);

                // Return true
                return true;
            };

            /**
             * History.getHashByIndex()
             * Gets a hash by the index
             * @param {integer} index
             * @return {string}
             */
            History.getHashByIndex = function(index){
                // Prepare
                var hash = null;

                // Handle
                if ( typeof index === 'undefined' ) {
                    // Get the last inserted
                    hash = History.savedHashes[History.savedHashes.length-1];
                }
                else if ( index < 0 ) {
                    // Get from the end
                    hash = History.savedHashes[History.savedHashes.length+index];
                }
                else {
                    // Get from the beginning
                    hash = History.savedHashes[index];
                }

                // Return hash
                return hash;
            };


            // ====================================================================
            // Discarded States

            /**
             * History.discardedHashes
             * A hashed array of discarded hashes
             */
            History.discardedHashes = {};

            /**
             * History.discardedStates
             * A hashed array of discarded states
             */
            History.discardedStates = {};

            /**
             * History.discardState(State)
             * Discards the state by ignoring it through History
             * @param {object} State
             * @return {true}
             */
            History.discardState = function(discardedState,forwardState,backState){
                //History.debug('History.discardState', arguments);
                // Prepare
                var discardedStateHash = History.getHashByState(discardedState),
                    discardObject;

                // Create Discard Object
                discardObject = {
                    'discardedState': discardedState,
                    'backState': backState,
                    'forwardState': forwardState
                };

                // Add to DiscardedStates
                History.discardedStates[discardedStateHash] = discardObject;

                // Return true
                return true;
            };

            /**
             * History.discardHash(hash)
             * Discards the hash by ignoring it through History
             * @param {string} hash
             * @return {true}
             */
            History.discardHash = function(discardedHash,forwardState,backState){
                //History.debug('History.discardState', arguments);
                // Create Discard Object
                var discardObject = {
                    'discardedHash': discardedHash,
                    'backState': backState,
                    'forwardState': forwardState
                };

                // Add to discardedHash
                History.discardedHashes[discardedHash] = discardObject;

                // Return true
                return true;
            };

            /**
             * History.discardedState(State)
             * Checks to see if the state is discarded
             * @param {object} State
             * @return {bool}
             */
            History.discardedState = function(State){
                // Prepare
                var StateHash = History.getHashByState(State),
                    discarded;

                // Check
                discarded = History.discardedStates[StateHash]||false;

                // Return true
                return discarded;
            };

            /**
             * History.discardedHash(hash)
             * Checks to see if the state is discarded
             * @param {string} State
             * @return {bool}
             */
            History.discardedHash = function(hash){
                // Check
                var discarded = History.discardedHashes[hash]||false;

                // Return true
                return discarded;
            };

            /**
             * History.recycleState(State)
             * Allows a discarded state to be used again
             * @param {object} data
             * @param {string} title
             * @param {string} url
             * @return {true}
             */
            History.recycleState = function(State){
                //History.debug('History.recycleState', arguments);
                // Prepare
                var StateHash = History.getHashByState(State);

                // Remove from DiscardedStates
                if ( History.discardedState(State) ) {
                    delete History.discardedStates[StateHash];
                }

                // Return true
                return true;
            };


            // ====================================================================
            // HTML4 HashChange Support

            if ( History.emulated.hashChange ) {
                /*
                 * We must emulate the HTML4 HashChange Support by manually checking for hash changes
                 */

                /**
                 * History.hashChangeInit()
                 * Init the HashChange Emulation
                 */
                History.hashChangeInit = function(){
                    // Define our Checker Function
                    History.checkerFunction = null;

                    // Define some variables that will help in our checker function
                    var lastDocumentHash = History.getHash()||'',
                        iframeId, iframe,
                        lastIframeHash, checkerRunning,
                        startedWithHash = Boolean(History.getHash());

                    // Handle depending on the browser
                    if ( History.isInternetExplorer() ) {
                        // IE6 and IE7
                        // We need to use an iframe to emulate the back and forward buttons

                        // Create iFrame
                        iframeId = 'historyjs-iframe';
                        iframe = document.createElement('iframe');

                        // Adjust iFarme
                        // IE 6 requires iframe to have a src on HTTPS pages, otherwise it will throw a
                        // "This page contains both secure and nonsecure items" warning.
                        iframe.setAttribute('id', iframeId);
                        iframe.setAttribute('src', '#');
                        iframe.style.display = 'none';

                        // Append iFrame
                        document.body.appendChild(iframe);

                        // Create initial history entry
                        iframe.contentWindow.document.open();
                        iframe.contentWindow.document.close();

                        // Define some variables that will help in our checker function
                        lastIframeHash = '';
                        checkerRunning = false;

                        // Define the checker function
                        History.checkerFunction = function(){
                            // Check Running
                            if ( checkerRunning ) {
                                return false;
                            }

                            // Update Running
                            checkerRunning = true;

                            // Fetch
                            var
                                documentHash = History.getHash(),
                                iframeHash = History.getHash(iframe.contentWindow.document);

                            // The Document Hash has changed (application caused)
                            if ( documentHash !== lastDocumentHash ) {
                                // Equalise
                                lastDocumentHash = documentHash;

                                // Create a history entry in the iframe
                                if ( iframeHash !== documentHash ) {
                                    //History.debug('hashchange.checker: iframe hash change', 'documentHash (new):', documentHash, 'iframeHash (old):', iframeHash);

                                    // Equalise
                                    lastIframeHash = iframeHash = documentHash;

                                    // Create History Entry
                                    iframe.contentWindow.document.open();
                                    iframe.contentWindow.document.close();

                                    // Update the iframe's hash
                                    iframe.contentWindow.document.location.hash = History.escapeHash(documentHash);
                                }

                                // Trigger Hashchange Event
                                History.Adapter.trigger(window,'hashchange');
                            }

                            // The iFrame Hash has changed (back button caused)
                            else if ( iframeHash !== lastIframeHash ) {
                                //History.debug('hashchange.checker: iframe hash out of sync', 'iframeHash (new):', iframeHash, 'documentHash (old):', documentHash);

                                // Equalise
                                lastIframeHash = iframeHash;

                                // If there is no iframe hash that means we're at the original
                                // iframe state.
                                // And if there was a hash on the original request, the original
                                // iframe state was replaced instantly, so skip this state and take
                                // the user back to where they came from.
                                if (startedWithHash && iframeHash === '') {
                                    History.back();
                                }
                                else {
                                    // Update the Hash
                                    History.setHash(iframeHash,false);
                                }
                            }

                            // Reset Running
                            checkerRunning = false;

                            // Return true
                            return true;
                        };
                    }
                    else {
                        // We are not IE
                        // Firefox 1 or 2, Opera

                        // Define the checker function
                        History.checkerFunction = function(){
                            // Prepare
                            var documentHash = History.getHash()||'';

                            // The Document Hash has changed (application caused)
                            if ( documentHash !== lastDocumentHash ) {
                                // Equalise
                                lastDocumentHash = documentHash;

                                // Trigger Hashchange Event
                                History.Adapter.trigger(window,'hashchange');
                            }

                            // Return true
                            return true;
                        };
                    }

                    // Apply the checker function
                    History.intervalList.push(setInterval(History.checkerFunction, History.options.hashChangeInterval));

                    // Done
                    return true;
                }; // History.hashChangeInit

                // Bind hashChangeInit
                History.Adapter.onDomLoad(History.hashChangeInit);

            } // History.emulated.hashChange


            // ====================================================================
            // HTML5 State Support

            // Non-Native pushState Implementation
            if ( History.emulated.pushState ) {
                /*
                 * We must emulate the HTML5 State Management by using HTML4 HashChange
                 */

                /**
                 * History.onHashChange(event)
                 * Trigger HTML5's window.onpopstate via HTML4 HashChange Support
                 */
                History.onHashChange = function(event){
                    //History.debug('History.onHashChange', arguments);

                    // Prepare
                    var currentUrl = ((event && event.newURL) || History.getLocationHref()),
                        currentHash = History.getHashByUrl(currentUrl),
                        currentState = null,
                        currentStateHash = null,
                        currentStateHashExits = null,
                        discardObject;

                    // Check if we are the same state
                    if ( History.isLastHash(currentHash) ) {
                        // There has been no change (just the page's hash has finally propagated)
                        //History.debug('History.onHashChange: no change');
                        History.busy(false);
                        return false;
                    }

                    // Reset the double check
                    History.doubleCheckComplete();

                    // Store our location for use in detecting back/forward direction
                    History.saveHash(currentHash);

                    // Expand Hash
                    if ( currentHash && History.isTraditionalAnchor(currentHash) ) {
                        //History.debug('History.onHashChange: traditional anchor', currentHash);
                        // Traditional Anchor Hash
                        History.Adapter.trigger(window,'anchorchange');
                        History.busy(false);
                        return false;
                    }

                    // Create State
                    currentState = History.extractState(History.getFullUrl(currentHash||History.getLocationHref()),true);

                    // Check if we are the same state
                    if ( History.isLastSavedState(currentState) ) {
                        //History.debug('History.onHashChange: no change');
                        // There has been no change (just the page's hash has finally propagated)
                        History.busy(false);
                        return false;
                    }

                    // Create the state Hash
                    currentStateHash = History.getHashByState(currentState);

                    // Check if we are DiscardedState
                    discardObject = History.discardedState(currentState);
                    if ( discardObject ) {
                        // Ignore this state as it has been discarded and go back to the state before it
                        if ( History.getHashByIndex(-2) === History.getHashByState(discardObject.forwardState) ) {
                            // We are going backwards
                            //History.debug('History.onHashChange: go backwards');
                            History.back(false);
                        } else {
                            // We are going forwards
                            //History.debug('History.onHashChange: go forwards');
                            History.forward(false);
                        }
                        return false;
                    }

                    // Push the new HTML5 State
                    //History.debug('History.onHashChange: success hashchange');
                    History.pushState(currentState.data,currentState.title,encodeURI(currentState.url),false);

                    // End onHashChange closure
                    return true;
                };
                History.Adapter.bind(window,'hashchange',History.onHashChange);

                /**
                 * History.pushState(data,title,url)
                 * Add a new State to the history object, become it, and trigger onpopstate
                 * We have to trigger for HTML4 compatibility
                 * @param {object} data
                 * @param {string} title
                 * @param {string} url
                 * @return {true}
                 */
                History.pushState = function(data,title,url,queue){
                    //History.debug('History.pushState: called', arguments);

                    // We assume that the URL passed in is URI-encoded, but this makes
                    // sure that it's fully URI encoded; any '%'s that are encoded are
                    // converted back into '%'s
                    url = encodeURI(url).replace(/%25/g, "%");

                    // Check the State
                    if ( History.getHashByUrl(url) ) {
                        throw new Error('History.js does not support states with fragment-identifiers (hashes/anchors).');
                    }

                    // Handle Queueing
                    if ( queue !== false && History.busy() ) {
                        // Wait + Push to Queue
                        //History.debug('History.pushState: we must wait', arguments);
                        History.pushQueue({
                            scope: History,
                            callback: History.pushState,
                            args: arguments,
                            queue: queue
                        });
                        return false;
                    }

                    // Make Busy
                    History.busy(true);

                    // Fetch the State Object
                    var newState = History.createStateObject(data,title,url),
                        newStateHash = History.getHashByState(newState),
                        oldState = History.getState(false),
                        oldStateHash = History.getHashByState(oldState),
                        html4Hash = History.getHash(),
                        wasExpected = History.expectedStateId == newState.id;

                    // Store the newState
                    History.storeState(newState);
                    History.expectedStateId = newState.id;

                    // Recycle the State
                    History.recycleState(newState);

                    // Force update of the title
                    History.setTitle(newState);

                    // Check if we are the same State
                    if ( newStateHash === oldStateHash ) {
                        //History.debug('History.pushState: no change', newStateHash);
                        History.busy(false);
                        return false;
                    }

                    // Update HTML5 State
                    History.saveState(newState);

                    // Fire HTML5 Event
                    if(!wasExpected)
                        History.Adapter.trigger(window,'statechange');

                    // Update HTML4 Hash
                    if ( !History.isHashEqual(newStateHash, html4Hash) && !History.isHashEqual(newStateHash, History.getShortUrl(History.getLocationHref())) ) {
                        History.setHash(newStateHash,false);
                    }

                    History.busy(false);

                    // End pushState closure
                    return true;
                };

                /**
                 * History.replaceState(data,title,url)
                 * Replace the State and trigger onpopstate
                 * We have to trigger for HTML4 compatibility
                 * @param {object} data
                 * @param {string} title
                 * @param {string} url
                 * @return {true}
                 */
                History.replaceState = function(data,title,url,queue){
                    //History.debug('History.replaceState: called', arguments);

                    // We assume that the URL passed in is URI-encoded, but this makes
                    // sure that it's fully URI encoded; any '%'s that are encoded are
                    // converted back into '%'s
                    url = encodeURI(url).replace(/%25/g, "%");

                    // Check the State
                    if ( History.getHashByUrl(url) ) {
                        throw new Error('History.js does not support states with fragment-identifiers (hashes/anchors).');
                    }

                    // Handle Queueing
                    if ( queue !== false && History.busy() ) {
                        // Wait + Push to Queue
                        //History.debug('History.replaceState: we must wait', arguments);
                        History.pushQueue({
                            scope: History,
                            callback: History.replaceState,
                            args: arguments,
                            queue: queue
                        });
                        return false;
                    }

                    // Make Busy
                    History.busy(true);

                    // Fetch the State Objects
                    var newState        = History.createStateObject(data,title,url),
                        newStateHash = History.getHashByState(newState),
                        oldState        = History.getState(false),
                        oldStateHash = History.getHashByState(oldState),
                        previousState   = History.getStateByIndex(-2);

                    // Discard Old State
                    History.discardState(oldState,newState,previousState);

                    // If the url hasn't changed, just store and save the state
                    // and fire a statechange event to be consistent with the
                    // html 5 api
                    if ( newStateHash === oldStateHash ) {
                        // Store the newState
                        History.storeState(newState);
                        History.expectedStateId = newState.id;

                        // Recycle the State
                        History.recycleState(newState);

                        // Force update of the title
                        History.setTitle(newState);

                        // Update HTML5 State
                        History.saveState(newState);

                        // Fire HTML5 Event
                        //History.debug('History.pushState: trigger popstate');
                        History.Adapter.trigger(window,'statechange');
                        History.busy(false);
                    }
                    else {
                        // Alias to PushState
                        History.pushState(newState.data,newState.title,newState.url,false);
                    }

                    // End replaceState closure
                    return true;
                };

            } // History.emulated.pushState



            // ====================================================================
            // Initialise

            // Non-Native pushState Implementation
            if ( History.emulated.pushState ) {
                /**
                 * Ensure initial state is handled correctly
                 */
                if ( History.getHash() && !History.emulated.hashChange ) {
                    History.Adapter.onDomLoad(function(){
                        History.Adapter.trigger(window,'hashchange');
                    });
                }

            } // History.emulated.pushState

        }; // History.initHtml4

        // Try to Initialise History
        if ( typeof History.init !== 'undefined' ) {
            History.init();
        }

    })(window);
    /**
     * History.js Core
     * @author Benjamin Arthur Lupton <contact@balupton.com>
     * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(window,undefined){
        "use strict";

        // ========================================================================
        // Initialise

        // Localise Globals
        var
            console = window.console||undefined, // Prevent a JSLint complain
            document = window.document, // Make sure we are using the correct document
            navigator = window.navigator, // Make sure we are using the correct navigator
            sessionStorage = window.sessionStorage||false, // sessionStorage
            setTimeout = window.setTimeout,
            clearTimeout = window.clearTimeout,
            setInterval = window.setInterval,
            clearInterval = window.clearInterval,
            alert = window.alert;

        History = window.History = window.History||{}; // Public History Object

        var history = window.history; // Old History Object

        try {
            sessionStorage.setItem('TEST', '1');
            sessionStorage.removeItem('TEST');
        } catch(e) {
            sessionStorage = false;
        }

        // MooTools Compatibility
        JSON.stringify = JSON.stringify||JSON.encode;
        JSON.parse = JSON.parse||JSON.decode;

        // Check Existence
        if ( typeof History.init !== 'undefined' ) {
            throw new Error('History.js Core has already been loaded...');
        }

        // Initialise History
        History.init = function(options){
            // Check Load Status of Adapter
            if ( typeof History.Adapter === 'undefined' ) {
                return false;
            }

            // Check Load Status of Core
            if ( typeof History.initCore !== 'undefined' ) {
                History.initCore(options);
            }

            // Check Load Status of HTML4 Support
            if ( typeof History.initHtml4 !== 'undefined' ) {
                History.initHtml4();
            }

            // Return true
            return true;
        };


        // ========================================================================
        // Initialise Core

        // Initialise Core
        History.initCore = function(options){
            // Initialise
            if ( typeof History.initCore.initialized !== 'undefined' ) {
                // Already Loaded
                return false;
            }
            else {
                History.initCore.initialized = true;
            }


            // ====================================================================
            // Options

            options = options||{};

            /**
             * History.options
             * Configurable options
             */
            History.options = History.options||{};

            /**
             * History.options.hashChangeInterval
             * How long should the interval be before hashchange checks
             */
            History.options.hashChangeInterval = options.hashChangeInterval || History.options.hashChangeInterval || 100;

            /**
             * History.options.safariPollInterval
             * How long should the interval be before safari poll checks
             */
            History.options.safariPollInterval = options.safariPollInterval || History.options.safariPollInterval || 500;

            /**
             * History.options.doubleCheckInterval
             * How long should the interval be before we perform a double check
             */
            History.options.doubleCheckInterval = options.doubleCheckInterval || History.options.doubleCheckInterval || 500;

            /**
             * History.options.disableSuid
             * Force History not to append suid
             */
            History.options.disableSuid = options.disableSuid || History.options.disableSuid || false;

            /**
             * History.options.storeInterval
             * How long should we wait between store calls
             */
            History.options.storeInterval = options.storeInterval || History.options.storeInterval || 1000;

            /**
             * History.options.busyDelay
             * How long should we wait between busy events
             */
            History.options.busyDelay = options.busyDelay || History.options.busyDelay || 250;

            /**
             * History.options.debug
             * If true will enable debug messages to be logged
             */
            History.options.debug = options.debug || History.options.debug || false;

            /**
             * History.options.initialTitle
             * What is the title of the initial state
             */
            History.options.initialTitle = options.initialTitle || History.options.initialTitle || document.title;

            /**
             * History.options.html4Mode
             * If true, will force HTMl4 mode (hashtags)
             */
            History.options.html4Mode = options.html4Mode || History.options.html4Mode || false;

            /**
             * History.options.delayInit
             * Want to override default options and call init manually.
             */
            History.options.delayInit = options.delayInit || History.options.delayInit || false;


            // ====================================================================
            // Interval record

            /**
             * History.intervalList
             * List of intervals set, to be cleared when document is unloaded.
             */
            History.intervalList = [];

            /**
             * History.clearAllIntervals
             * Clears all setInterval instances.
             */
            History.clearAllIntervals = function(){
                var i, il = History.intervalList;
                if (typeof il !== "undefined" && il !== null) {
                    for (i = 0; i < il.length; i++) {
                        clearInterval(il[i]);
                    }
                    History.intervalList = null;
                }
            };


            // ====================================================================
            // Debug

            /**
             * History.debug(message,...)
             * Logs the passed arguments if debug enabled
             */
            History.debug = function(){
                if ( (History.options.debug||false) ) {
                    History.log.apply(History,arguments);
                }
            };

            /**
             * History.log(message,...)
             * Logs the passed arguments
             */
            History.log = function(){
                // Prepare
                var
                    consoleExists = !(typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.apply === 'undefined'),
                    textarea = document.getElementById('log'),
                    message,
                    i,n,
                    args,arg
                    ;

                // Write to Console
                if ( consoleExists ) {
                    args = Array.prototype.slice.call(arguments);
                    message = args.shift();
                    if ( typeof console.debug !== 'undefined' ) {
                        console.debug.apply(console,[message,args]);
                    }
                    else {
                        console.log.apply(console,[message,args]);
                    }
                }
                else {
                    message = ("\n"+arguments[0]+"\n");
                }

                // Write to log
                for ( i=1,n=arguments.length; i<n; ++i ) {
                    arg = arguments[i];
                    if ( typeof arg === 'object' && typeof JSON !== 'undefined' ) {
                        try {
                            arg = JSON.stringify(arg);
                        }
                        catch ( Exception ) {
                            // Recursive Object
                        }
                    }
                    message += "\n"+arg+"\n";
                }

                // Textarea
                if ( textarea ) {
                    textarea.value += message+"\n-----\n";
                    textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
                }
                // No Textarea, No Console
                else if ( !consoleExists ) {
                    alert(message);
                }

                // Return true
                return true;
            };


            // ====================================================================
            // Emulated Status

            /**
             * History.getInternetExplorerMajorVersion()
             * Get's the major version of Internet Explorer
             * @return {integer}
             * @license Public Domain
             * @author Benjamin Arthur Lupton <contact@balupton.com>
             * @author James Padolsey <https://gist.github.com/527683>
             */
            History.getInternetExplorerMajorVersion = function(){
                var result = History.getInternetExplorerMajorVersion.cached =
                        (typeof History.getInternetExplorerMajorVersion.cached !== 'undefined')
                            ?	History.getInternetExplorerMajorVersion.cached
                            :	(function(){
                            var v = 3,
                                div = document.createElement('div'),
                                all = div.getElementsByTagName('i');
                            while ( (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->') && all[0] ) {}
                            return (v > 4) ? v : false;
                        })()
                    ;
                return result;
            };

            /**
             * History.isInternetExplorer()
             * Are we using Internet Explorer?
             * @return {boolean}
             * @license Public Domain
             * @author Benjamin Arthur Lupton <contact@balupton.com>
             */
            History.isInternetExplorer = function(){
                var result =
                        History.isInternetExplorer.cached =
                            (typeof History.isInternetExplorer.cached !== 'undefined')
                                ?	History.isInternetExplorer.cached
                                :	Boolean(History.getInternetExplorerMajorVersion())
                    ;
                return result;
            };

            /**
             * History.emulated
             * Which features require emulating?
             */

            if (History.options.html4Mode) {
                History.emulated = {
                    pushState : true,
                    hashChange: true
                };
            }

            else {

                History.emulated = {
                    pushState: !Boolean(
                        window.history && window.history.pushState && window.history.replaceState
                        && !(
                            (/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent) /* disable for versions of iOS before version 4.3 (8F190) */
                            || (/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent) /* disable for the mercury iOS browser, or at least older versions of the webkit engine */
                        )
                    ),
                    hashChange: Boolean(
                        !(('onhashchange' in window) || ('onhashchange' in document))
                        ||
                        (History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8)
                    )
                };
            }

            /**
             * History.enabled
             * Is History enabled?
             */
            History.enabled = !History.emulated.pushState;

            /**
             * History.bugs
             * Which bugs are present
             */
            History.bugs = {
                /**
                 * Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a `replaceState` call
                 * https://bugs.webkit.org/show_bug.cgi?id=56249
                 */
                setHash: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

                /**
                 * Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions
                 * https://bugs.webkit.org/show_bug.cgi?id=42940
                 */
                safariPoll: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

                /**
                 * MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply function)
                 */
                ieDoubleCheck: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8),

                /**
                 * MSIE 6 requires the entire hash to be encoded for the hashes to trigger the onHashChange event
                 */
                hashEscape: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 7)
            };

            /**
             * History.isEmptyObject(obj)
             * Checks to see if the Object is Empty
             * @param {Object} obj
             * @return {boolean}
             */
            History.isEmptyObject = function(obj) {
                for ( var name in obj ) {
                    if ( obj.hasOwnProperty(name) ) {
                        return false;
                    }
                }
                return true;
            };

            /**
             * History.cloneObject(obj)
             * Clones a object and eliminate all references to the original contexts
             * @param {Object} obj
             * @return {Object}
             */
            History.cloneObject = function(obj) {
                var hash,newObj;
                if ( obj ) {
                    hash = JSON.stringify(obj);
                    newObj = JSON.parse(hash);
                }
                else {
                    newObj = {};
                }
                return newObj;
            };


            // ====================================================================
            // URL Helpers

            /**
             * History.getRootUrl()
             * Turns "http://mysite.com/dir/page.html?asd" into "http://mysite.com"
             * @return {String} rootUrl
             */
            History.getRootUrl = function(){
                // Create
                var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);
                if ( document.location.port||false ) {
                    rootUrl += ':'+document.location.port;
                }
                rootUrl += '/';

                // Return
                return rootUrl;
            };

            /**
             * History.getBaseHref()
             * Fetches the `href` attribute of the `<base href="...">` element if it exists
             * @return {String} baseHref
             */
            History.getBaseHref = function(){
                // Create
                var
                    baseElements = document.getElementsByTagName('base'),
                    baseElement = null,
                    baseHref = '';

                // Test for Base Element
                if ( baseElements.length === 1 ) {
                    // Prepare for Base Element
                    baseElement = baseElements[0];
                    baseHref = baseElement.href.replace(/[^\/]+$/,'');
                }

                // Adjust trailing slash
                baseHref = baseHref.replace(/\/+$/,'');
                if ( baseHref ) baseHref += '/';

                // Return
                return baseHref;
            };

            /**
             * History.getBaseUrl()
             * Fetches the baseHref or basePageUrl or rootUrl (whichever one exists first)
             * @return {String} baseUrl
             */
            History.getBaseUrl = function(){
                // Create
                var baseUrl = History.getBaseHref()||History.getBasePageUrl()||History.getRootUrl();

                // Return
                return baseUrl;
            };

            /**
             * History.getPageUrl()
             * Fetches the URL of the current page
             * @return {String} pageUrl
             */
            History.getPageUrl = function(){
                // Fetch
                var
                    State = History.getState(false,false),
                    stateUrl = (State||{}).url||History.getLocationHref(),
                    pageUrl;

                // Create
                pageUrl = stateUrl.replace(/\/+$/,'').replace(/[^\/]+$/,function(part,index,string){
                    return (/\./).test(part) ? part : part+'/';
                });

                // Return
                return pageUrl;
            };

            /**
             * History.getBasePageUrl()
             * Fetches the Url of the directory of the current page
             * @return {String} basePageUrl
             */
            History.getBasePageUrl = function(){
                // Create
                var basePageUrl = (History.getLocationHref()).replace(/[#\?].*/,'').replace(/[^\/]+$/,function(part,index,string){
                        return (/[^\/]$/).test(part) ? '' : part;
                    }).replace(/\/+$/,'')+'/';

                // Return
                return basePageUrl;
            };

            /**
             * History.getFullUrl(url)
             * Ensures that we have an absolute URL and not a relative URL
             * @param {string} url
             * @param {Boolean} allowBaseHref
             * @return {string} fullUrl
             */
            History.getFullUrl = function(url,allowBaseHref){
                // Prepare
                var fullUrl = url, firstChar = url.substring(0,1);
                allowBaseHref = (typeof allowBaseHref === 'undefined') ? true : allowBaseHref;

                // Check
                if ( /[a-z]+\:\/\//.test(url) ) {
                    // Full URL
                }
                else if ( firstChar === '/' ) {
                    // Root URL
                    fullUrl = History.getRootUrl()+url.replace(/^\/+/,'');
                }
                else if ( firstChar === '#' ) {
                    // Anchor URL
                    fullUrl = History.getPageUrl().replace(/#.*/,'')+url;
                }
                else if ( firstChar === '?' ) {
                    // Query URL
                    fullUrl = History.getPageUrl().replace(/[\?#].*/,'')+url;
                }
                else {
                    // Relative URL
                    if ( allowBaseHref ) {
                        fullUrl = History.getBaseUrl()+url.replace(/^(\.\/)+/,'');
                    } else {
                        fullUrl = History.getBasePageUrl()+url.replace(/^(\.\/)+/,'');
                    }
                    // We have an if condition above as we do not want hashes
                    // which are relative to the baseHref in our URLs
                    // as if the baseHref changes, then all our bookmarks
                    // would now point to different locations
                    // whereas the basePageUrl will always stay the same
                }

                // Return
                return fullUrl.replace(/\#$/,'');
            };

            /**
             * History.getShortUrl(url)
             * Ensures that we have a relative URL and not a absolute URL
             * @param {string} url
             * @return {string} url
             */
            History.getShortUrl = function(url){
                // Prepare
                var shortUrl = url, baseUrl = History.getBaseUrl(), rootUrl = History.getRootUrl();

                // Trim baseUrl
                // Fixed: baseUrl ends with '/' should be replaced with '/'. By jinzhk 2016/07/25
                if ( History.emulated.pushState ) {
                    // We are in a if statement as when pushState is not emulated
                    // The actual url these short urls are relative to can change
                    // So within the same session, we the url may end up somewhere different
                    shortUrl = shortUrl.replace(baseUrl,/\/$/.test(baseUrl)?'/':'');
                }

                // Trim rootUrl
                shortUrl = shortUrl.replace(rootUrl,'/');

                // Ensure we can still detect it as a state
                if ( History.isTraditionalAnchor(shortUrl) ) {
                    shortUrl = './'+shortUrl;
                }

                // Clean It
                shortUrl = shortUrl.replace(/^(\.\/)+/g,'./').replace(/\#$/,'');

                // Return
                return shortUrl;
            };

            /**
             * History.getLocationHref(document)
             * Returns a normalized version of document.location.href
             * accounting for browser inconsistencies, etc.
             *
             * This URL will be URI-encoded and will include the hash
             *
             * @param {object} document
             * @return {string} url
             */
            History.getLocationHref = function(doc) {
                doc = doc || document;

                // most of the time, this will be true
                if (doc.URL === doc.location.href)
                    return doc.location.href;

                // some versions of webkit URI-decode document.location.href
                // but they leave document.URL in an encoded state
                if (doc.location.href === decodeURIComponent(doc.URL))
                    return doc.URL;

                // FF 3.6 only updates document.URL when a page is reloaded
                // document.location.href is updated correctly
                if (doc.location.hash && decodeURIComponent(doc.location.href.replace(/^[^#]+/, "")) === doc.location.hash)
                    return doc.location.href;

                if (doc.URL.indexOf('#') == -1 && doc.location.href.indexOf('#') != -1)
                    return doc.location.href;

                return doc.URL || doc.location.href;
            };


            // ====================================================================
            // State Storage

            /**
             * History.store
             * The store for all session specific data
             */
            History.store = {};

            /**
             * History.idToState
             * 1-1: State ID to State Object
             */
            History.idToState = History.idToState||{};

            /**
             * History.stateToId
             * 1-1: State String to State ID
             */
            History.stateToId = History.stateToId||{};

            /**
             * History.urlToId
             * 1-1: State URL to State ID
             */
            History.urlToId = History.urlToId||{};

            /**
             * History.storedStates
             * Store the states in an array
             */
            History.storedStates = History.storedStates||[];

            /**
             * History.savedStates
             * Saved the states in an array
             */
            History.savedStates = History.savedStates||[];

            /**
             * History.noramlizeStore()
             * Noramlize the store by adding necessary values
             */
            History.normalizeStore = function(){
                History.store.idToState = History.store.idToState||{};
                History.store.urlToId = History.store.urlToId||{};
                History.store.stateToId = History.store.stateToId||{};
            };

            /**
             * History.getState()
             * Get an object containing the data, title and url of the current state
             * @param {Boolean} friendly
             * @param {Boolean} create
             * @return {Object} State
             */
            History.getState = function(friendly,create){
                // Prepare
                if ( typeof friendly === 'undefined' ) { friendly = true; }
                if ( typeof create === 'undefined' ) { create = true; }

                // Fetch
                var State = History.getLastSavedState();

                // Create
                if ( !State && create ) {
                    State = History.createStateObject();
                }

                // Adjust
                if ( friendly ) {
                    State = History.cloneObject(State);
                    State.url = State.cleanUrl||State.url;
                }

                // Return
                return State;
            };

            /**
             * History.getIdByState(State)
             * Gets a ID for a State
             * @param {State} newState
             * @return {String} id
             */
            History.getIdByState = function(newState){

                // Fetch ID
                var id = History.extractId(newState.url),
                    str;

                if ( !id ) {
                    // Find ID via State String
                    str = History.getStateString(newState);
                    if ( typeof History.stateToId[str] !== 'undefined' ) {
                        id = History.stateToId[str];
                    }
                    else if ( typeof History.store.stateToId[str] !== 'undefined' ) {
                        id = History.store.stateToId[str];
                    }
                    else {
                        // Generate a new ID
                        while ( true ) {
                            id = (new Date()).getTime() + String(Math.random()).replace(/\D/g,'');
                            if ( typeof History.idToState[id] === 'undefined' && typeof History.store.idToState[id] === 'undefined' ) {
                                break;
                            }
                        }

                        // Apply the new State to the ID
                        History.stateToId[str] = id;
                        History.idToState[id] = newState;
                    }
                }

                // Return ID
                return id;
            };

            /**
             * History.normalizeState(State)
             * Expands a State Object
             * @param {object} State
             * @return {object}
             */
            History.normalizeState = function(oldState){
                // Variables
                var newState, dataNotEmpty;

                // Prepare
                if ( !oldState || (typeof oldState !== 'object') ) {
                    oldState = {};
                }

                // Check
                if ( typeof oldState.normalized !== 'undefined' ) {
                    return oldState;
                }

                // Adjust
                if ( !oldState.data || (typeof oldState.data !== 'object') ) {
                    oldState.data = {};
                }

                // ----------------------------------------------------------------

                // Create
                newState = {};
                newState.normalized = true;
                newState.title = oldState.title||'';
                newState.url = History.getFullUrl(oldState.url?oldState.url:(History.getLocationHref()));
                newState.hash = History.getShortUrl(newState.url);
                newState.data = History.cloneObject(oldState.data);

                // Fetch ID
                newState.id = History.getIdByState(newState);

                // ----------------------------------------------------------------

                // Clean the URL
                newState.cleanUrl = newState.url.replace(/\??\&_suid.*/,'');
                newState.url = newState.cleanUrl;

                // Check to see if we have more than just a url
                dataNotEmpty = !History.isEmptyObject(newState.data);

                // Apply
                if ( (newState.title || dataNotEmpty) && History.options.disableSuid !== true ) {
                    // Add ID to Hash
                    newState.hash = History.getShortUrl(newState.url).replace(/\??\&_suid.*/,'');
                    if ( !/\?/.test(newState.hash) ) {
                        newState.hash += '?';
                    }
                    newState.hash += '&_suid='+newState.id;
                }

                // Create the Hashed URL
                newState.hashedUrl = History.getFullUrl(newState.hash);

                // ----------------------------------------------------------------

                // Update the URL if we have a duplicate
                if ( (History.emulated.pushState || History.bugs.safariPoll) && History.hasUrlDuplicate(newState) ) {
                    newState.url = newState.hashedUrl;
                }

                // ----------------------------------------------------------------

                // Return
                return newState;
            };

            /**
             * History.createStateObject(data,title,url)
             * Creates a object based on the data, title and url state params
             * @param {object} data
             * @param {string} title
             * @param {string} url
             * @return {object}
             */
            History.createStateObject = function(data,title,url){
                // Hashify
                var State = {
                    'data': data,
                    'title': title,
                    'url': url
                };

                // Expand the State
                State = History.normalizeState(State);

                // Return object
                return State;
            };

            /**
             * History.getStateById(id)
             * Get a state by it's UID
             * @param {String} id
             */
            History.getStateById = function(id){
                // Prepare
                id = String(id);

                // Retrieve
                var State = History.idToState[id] || History.store.idToState[id] || undefined;

                // Return State
                return State;
            };

            /**
             * Get a State's String
             * @param {State} passedState
             */
            History.getStateString = function(passedState){
                // Prepare
                var State, cleanedState, str;

                // Fetch
                State = History.normalizeState(passedState);

                // Clean
                cleanedState = {
                    data: State.data,
                    title: passedState.title,
                    url: passedState.url
                };

                // Fetch
                str = JSON.stringify(cleanedState);

                // Return
                return str;
            };

            /**
             * Get a State's ID
             * @param {State} passedState
             * @return {String} id
             */
            History.getStateId = function(passedState){
                // Prepare
                var State, id;

                // Fetch
                State = History.normalizeState(passedState);

                // Fetch
                id = State.id;

                // Return
                return id;
            };

            /**
             * History.getHashByState(State)
             * Creates a Hash for the State Object
             * @param {State} passedState
             * @return {String} hash
             */
            History.getHashByState = function(passedState){
                // Prepare
                var State, hash;

                // Fetch
                State = History.normalizeState(passedState);

                // Hash
                hash = State.hash;

                // Return
                return hash;
            };

            /**
             * History.extractId(url_or_hash)
             * Get a State ID by it's URL or Hash
             * @param {string} url_or_hash
             * @return {string} id
             */
            History.extractId = function ( url_or_hash ) {
                // Prepare
                var id,parts,url, tmp;

                // Extract

                // If the URL has a #, use the id from before the #
                if (url_or_hash.indexOf('#') != -1)
                {
                    tmp = url_or_hash.split("#")[0];
                }
                else
                {
                    tmp = url_or_hash;
                }

                parts = /(.*)\&_suid=([0-9]+)$/.exec(tmp);
                url = parts ? (parts[1]||url_or_hash) : url_or_hash;
                id = parts ? String(parts[2]||'') : '';

                // Return
                return id||false;
            };

            /**
             * History.isTraditionalAnchor
             * Checks to see if the url is a traditional anchor or not
             * @param {String} url_or_hash
             * @return {Boolean}
             */
            History.isTraditionalAnchor = function(url_or_hash){
                // Check
                var isTraditional = (url_or_hash !== "") && !(/[\/\?\.]/.test(url_or_hash));

                // Return
                return isTraditional;
            };

            /**
             * History.extractState
             * Get a State by it's URL or Hash
             * @param {String} url_or_hash
             * @return {State|null}
             */
            History.extractState = function(url_or_hash,create){
                // Prepare
                var State = null, id, url;
                create = create||false;

                // Fetch SUID
                id = History.extractId(url_or_hash);
                if ( id ) {
                    State = History.getStateById(id);
                }

                // Fetch SUID returned no State
                if ( !State ) {
                    // Fetch URL
                    url = History.getFullUrl(url_or_hash);

                    // Check URL
                    id = History.getIdByUrl(url)||false;
                    if ( id ) {
                        State = History.getStateById(id);
                    }

                    // Create State
                    if ( !State && create && !History.isTraditionalAnchor(url_or_hash) ) {
                        State = History.createStateObject(null,null,url);
                    }
                }

                // Return
                return State;
            };

            /**
             * History.getIdByUrl()
             * Get a State ID by a State URL
             */
            History.getIdByUrl = function(url){
                // Fetch
                var id = History.urlToId[url] || History.store.urlToId[url] || undefined;

                // Return
                return id;
            };

            /**
             * History.getLastSavedState()
             * Get an object containing the data, title and url of the current state
             * @return {Object} State
             */
            History.getLastSavedState = function(){
                return History.savedStates[History.savedStates.length-1]||undefined;
            };

            /**
             * History.getLastStoredState()
             * Get an object containing the data, title and url of the current state
             * @return {Object} State
             */
            History.getLastStoredState = function(){
                return History.storedStates[History.storedStates.length-1]||undefined;
            };

            /**
             * History.hasUrlDuplicate
             * Checks if a Url will have a url conflict
             * @param {Object} newState
             * @return {Boolean} hasDuplicate
             */
            History.hasUrlDuplicate = function(newState) {
                // Prepare
                var hasDuplicate = false,
                    oldState;

                // Fetch
                oldState = History.extractState(newState.url);

                // Check
                hasDuplicate = oldState && oldState.id !== newState.id;

                // Return
                return hasDuplicate;
            };

            /**
             * History.storeState
             * Store a State
             * @param {Object} newState
             * @return {Object} newState
             */
            History.storeState = function(newState){
                // Store the State
                History.urlToId[newState.url] = newState.id;

                // Push the State
                History.storedStates.push(History.cloneObject(newState));

                // Return newState
                return newState;
            };

            /**
             * History.isLastSavedState(newState)
             * Tests to see if the state is the last state
             * @param {Object} newState
             * @return {boolean} isLast
             */
            History.isLastSavedState = function(newState){
                // Prepare
                var isLast = false,
                    newId, oldState, oldId;

                // Check
                if ( History.savedStates.length ) {
                    newId = newState.id;
                    oldState = History.getLastSavedState();
                    oldId = oldState.id;

                    // Check
                    isLast = (newId === oldId);
                }

                // Return
                return isLast;
            };

            /**
             * History.saveState
             * Push a State
             * @param {Object} newState
             * @return {boolean} changed
             */
            History.saveState = function(newState){
                // Check Hash
                if ( History.isLastSavedState(newState) ) {
                    return false;
                }

                // Push the State
                History.savedStates.push(History.cloneObject(newState));

                // Return true
                return true;
            };

            /**
             * History.getStateByIndex()
             * Gets a state by the index
             * @param {integer} index
             * @return {Object}
             */
            History.getStateByIndex = function(index){
                // Prepare
                var State = null;

                // Handle
                if ( typeof index === 'undefined' ) {
                    // Get the last inserted
                    State = History.savedStates[History.savedStates.length-1];
                }
                else if ( index < 0 ) {
                    // Get from the end
                    State = History.savedStates[History.savedStates.length+index];
                }
                else {
                    // Get from the beginning
                    State = History.savedStates[index];
                }

                // Return State
                return State;
            };

            /**
             * History.getCurrentIndex()
             * Gets the current index
             * @return (integer)
             */
            History.getCurrentIndex = function(){
                // Prepare
                var index = null;

                // No states saved
                if(History.savedStates.length < 1) {
                    index = 0;
                }
                else {
                    index = History.savedStates.length-1;
                }
                return index;
            };

            // ====================================================================
            // Hash Helpers

            /**
             * History.getHash()
             * @param {Location=} location
             * Gets the current document hash
             * Note: unlike location.hash, this is guaranteed to return the escaped hash in all browsers
             * @return {string}
             */
            History.getHash = function(doc){
                var url = History.getLocationHref(doc),
                    hash;
                hash = History.getHashByUrl(url);
                return hash;
            };

            /**
             * History.unescapeHash()
             * normalize and Unescape a Hash
             * @param {String} hash
             * @return {string}
             */
            History.unescapeHash = function(hash){
                // Prepare
                var result = History.normalizeHash(hash);

                // Unescape hash
                result = decodeURIComponent(result);

                // Return result
                return result;
            };

            /**
             * History.normalizeHash()
             * normalize a hash across browsers
             * @return {string}
             */
            History.normalizeHash = function(hash){
                // Prepare
                var result = hash.replace(/[^#]*#/,'').replace(/#.*/, '');

                // Return result
                return result;
            };

            /**
             * History.setHash(hash)
             * Sets the document hash
             * @param {string} hash
             * @return {History}
             */
            History.setHash = function(hash,queue){
                // Prepare
                var State, pageUrl;

                // Handle Queueing
                if ( queue !== false && History.busy() ) {
                    // Wait + Push to Queue
                    //History.debug('History.setHash: we must wait', arguments);
                    History.pushQueue({
                        scope: History,
                        callback: History.setHash,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }

                // Log
                //History.debug('History.setHash: called',hash);

                // Make Busy + Continue
                History.busy(true);

                // Check if hash is a state
                State = History.extractState(hash,true);
                if ( State && !History.emulated.pushState ) {
                    // Hash is a state so skip the setHash
                    //History.debug('History.setHash: Hash is a state so skipping the hash set with a direct pushState call',arguments);

                    // PushState
                    History.pushState(State.data,State.title,State.url,false);
                }
                else if ( History.getHash() !== hash ) {
                    // Hash is a proper hash, so apply it

                    // Handle browser bugs
                    if ( History.bugs.setHash ) {
                        // Fix Safari Bug https://bugs.webkit.org/show_bug.cgi?id=56249

                        // Fetch the base page
                        pageUrl = History.getPageUrl();

                        // Safari hash apply
                        History.pushState(null,null,pageUrl+'#'+hash,false);
                    }
                    else {
                        // Normal hash apply
                        document.location.hash = hash;
                    }
                }

                // Chain
                return History;
            };

            /**
             * History.escape()
             * normalize and Escape a Hash
             * @return {string}
             */
            History.escapeHash = function(hash){
                // Prepare
                var result = History.normalizeHash(hash);

                // Escape hash
                result = window.encodeURIComponent(result);

                // IE6 Escape Bug
                if ( !History.bugs.hashEscape ) {
                    // Restore common parts
                    result = result
                        .replace(/\%21/g,'!')
                        .replace(/\%26/g,'&')
                        .replace(/\%3D/g,'=')
                        .replace(/\%3F/g,'?');
                }

                // Return result
                return result;
            };

            /**
             * History.getHashByUrl(url)
             * Extracts the Hash from a URL
             * @param {string} url
             * @return {string} url
             */
            History.getHashByUrl = function(url){
                // Extract the hash
                var hash = String(url)
                        .replace(/([^#]*)#?([^#]*)#?(.*)/, '$2')
                    ;

                // Unescape hash
                hash = History.unescapeHash(hash);

                // Return hash
                return hash;
            };

            /**
             * History.setTitle(title)
             * Applies the title to the document
             * @param {State} newState
             * @return {Boolean}
             */
            History.setTitle = function(newState){
                // Prepare
                var title = newState.title,
                    firstState;

                // Initial
                if ( !title ) {
                    firstState = History.getStateByIndex(0);
                    if ( firstState && firstState.url === newState.url ) {
                        title = firstState.title||History.options.initialTitle;
                    }
                }

                // Apply
                try {
                    document.getElementsByTagName('title')[0].innerHTML = title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
                }
                catch ( Exception ) { }
                document.title = title;

                // Chain
                return History;
            };


            // ====================================================================
            // Queueing

            /**
             * History.queues
             * The list of queues to use
             * First In, First Out
             */
            History.queues = [];

            /**
             * History.busy(value)
             * @param {boolean} value [optional]
             * @return {boolean} busy
             */
            History.busy = function(value){
                // Apply
                if ( typeof value !== 'undefined' ) {
                    //History.debug('History.busy: changing ['+(History.busy.flag||false)+'] to ['+(value||false)+']', History.queues.length);
                    History.busy.flag = value;
                }
                // Default
                else if ( typeof History.busy.flag === 'undefined' ) {
                    History.busy.flag = false;
                }

                // Queue
                if ( !History.busy.flag ) {
                    // Execute the next item in the queue
                    clearTimeout(History.busy.timeout);
                    var fireNext = function(){
                        var i, queue, item;
                        if ( History.busy.flag ) return;
                        for ( i=History.queues.length-1; i >= 0; --i ) {
                            queue = History.queues[i];
                            if ( queue.length === 0 ) continue;
                            item = queue.shift();
                            History.fireQueueItem(item);
                            History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
                        }
                    };
                    History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
                }

                // Return
                return History.busy.flag;
            };

            /**
             * History.busy.flag
             */
            History.busy.flag = false;

            /**
             * History.fireQueueItem(item)
             * Fire a Queue Item
             * @param {Object} item
             * @return {Mixed} result
             */
            History.fireQueueItem = function(item){
                return item.callback.apply(item.scope||History,item.args||[]);
            };

            /**
             * History.pushQueue(callback,args)
             * Add an item to the queue
             * @param {Object} item [scope,callback,args,queue]
             */
            History.pushQueue = function(item){
                // Prepare the queue
                History.queues[item.queue||0] = History.queues[item.queue||0]||[];

                // Add to the queue
                History.queues[item.queue||0].push(item);

                // Chain
                return History;
            };

            /**
             * History.queue (item,queue), (func,queue), (func), (item)
             * Either firs the item now if not busy, or adds it to the queue
             */
            History.queue = function(item,queue){
                // Prepare
                if ( typeof item === 'function' ) {
                    item = {
                        callback: item
                    };
                }
                if ( typeof queue !== 'undefined' ) {
                    item.queue = queue;
                }

                // Handle
                if ( History.busy() ) {
                    History.pushQueue(item);
                } else {
                    History.fireQueueItem(item);
                }

                // Chain
                return History;
            };

            /**
             * History.clearQueue()
             * Clears the Queue
             */
            History.clearQueue = function(){
                History.busy.flag = false;
                History.queues = [];
                return History;
            };


            // ====================================================================
            // IE Bug Fix

            /**
             * History.stateChanged
             * States whether or not the state has changed since the last double check was initialised
             */
            History.stateChanged = false;

            /**
             * History.doubleChecker
             * Contains the timeout used for the double checks
             */
            History.doubleChecker = false;

            /**
             * History.doubleCheckComplete()
             * Complete a double check
             * @return {History}
             */
            History.doubleCheckComplete = function(){
                // Update
                History.stateChanged = true;

                // Clear
                History.doubleCheckClear();

                // Chain
                return History;
            };

            /**
             * History.doubleCheckClear()
             * Clear a double check
             * @return {History}
             */
            History.doubleCheckClear = function(){
                // Clear
                if ( History.doubleChecker ) {
                    clearTimeout(History.doubleChecker);
                    History.doubleChecker = false;
                }

                // Chain
                return History;
            };

            /**
             * History.doubleCheck()
             * Create a double check
             * @return {History}
             */
            History.doubleCheck = function(tryAgain){
                // Reset
                History.stateChanged = false;
                History.doubleCheckClear();

                // Fix IE6,IE7 bug where calling history.back or history.forward does not actually change the hash (whereas doing it manually does)
                // Fix Safari 5 bug where sometimes the state does not change: https://bugs.webkit.org/show_bug.cgi?id=42940
                if ( History.bugs.ieDoubleCheck ) {
                    // Apply Check
                    History.doubleChecker = setTimeout(
                        function(){
                            History.doubleCheckClear();
                            if ( !History.stateChanged ) {
                                //History.debug('History.doubleCheck: State has not yet changed, trying again', arguments);
                                // Re-Attempt
                                tryAgain();
                            }
                            return true;
                        },
                        History.options.doubleCheckInterval
                    );
                }

                // Chain
                return History;
            };


            // ====================================================================
            // Safari Bug Fix

            /**
             * History.safariStatePoll()
             * Poll the current state
             * @return {History}
             */
            History.safariStatePoll = function(){
                // Poll the URL

                // Get the Last State which has the new URL
                var
                    urlState = History.extractState(History.getLocationHref()),
                    newState;

                // Check for a difference
                if ( !History.isLastSavedState(urlState) ) {
                    newState = urlState;
                }
                else {
                    return;
                }

                // Check if we have a state with that url
                // If not create it
                if ( !newState ) {
                    //History.debug('History.safariStatePoll: new');
                    newState = History.createStateObject();
                }

                // Apply the New State
                //History.debug('History.safariStatePoll: trigger');
                History.Adapter.trigger(window,'popstate');

                // Chain
                return History;
            };


            // ====================================================================
            // State Aliases

            /**
             * History.back(queue)
             * Send the browser history back one item
             * @param {Integer} queue [optional]
             */
            History.back = function(queue){
                //History.debug('History.back: called', arguments);

                // Handle Queueing
                if ( queue !== false && History.busy() ) {
                    // Wait + Push to Queue
                    //History.debug('History.back: we must wait', arguments);
                    History.pushQueue({
                        scope: History,
                        callback: History.back,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }

                // Make Busy + Continue
                History.busy(true);

                // Fix certain browser bugs that prevent the state from changing
                History.doubleCheck(function(){
                    History.back(false);
                });

                // Go back
                history.go(-1);

                // End back closure
                return true;
            };

            /**
             * History.forward(queue)
             * Send the browser history forward one item
             * @param {Integer} queue [optional]
             */
            History.forward = function(queue){
                //History.debug('History.forward: called', arguments);

                // Handle Queueing
                if ( queue !== false && History.busy() ) {
                    // Wait + Push to Queue
                    //History.debug('History.forward: we must wait', arguments);
                    History.pushQueue({
                        scope: History,
                        callback: History.forward,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }

                // Make Busy + Continue
                History.busy(true);

                // Fix certain browser bugs that prevent the state from changing
                History.doubleCheck(function(){
                    History.forward(false);
                });

                // Go forward
                history.go(1);

                // End forward closure
                return true;
            };

            /**
             * History.go(index,queue)
             * Send the browser history back or forward index times
             * @param {Integer} queue [optional]
             */
            History.go = function(index,queue){
                //History.debug('History.go: called', arguments);

                // Prepare
                var i;

                // Handle
                if ( index > 0 ) {
                    // Forward
                    for ( i=1; i<=index; ++i ) {
                        History.forward(queue);
                    }
                }
                else if ( index < 0 ) {
                    // Backward
                    for ( i=-1; i>=index; --i ) {
                        History.back(queue);
                    }
                }
                else {
                    throw new Error('History.go: History.go requires a positive or negative integer passed.');
                }

                // Chain
                return History;
            };


            // ====================================================================
            // HTML5 State Support

            // Non-Native pushState Implementation
            if ( History.emulated.pushState ) {
                /*
                 * Provide Skeleton for HTML4 Browsers
                 */

                // Prepare
                var emptyFunction = function(){};
                History.pushState = History.pushState||emptyFunction;
                History.replaceState = History.replaceState||emptyFunction;
            } // History.emulated.pushState

            // Native pushState Implementation
            else {
                /*
                 * Use native HTML5 History API Implementation
                 */

                /**
                 * History.onPopState(event,extra)
                 * Refresh the Current State
                 */
                History.onPopState = function(event,extra){
                    // Prepare
                    var stateId = false, newState = false, currentHash, currentState;

                    // Reset the double check
                    History.doubleCheckComplete();

                    // Check for a Hash, and handle apporiatly
                    currentHash = History.getHash();
                    if ( currentHash ) {
                        // Expand Hash
                        currentState = History.extractState(currentHash||History.getLocationHref(),true);
                        if ( currentState ) {
                            // We were able to parse it, it must be a State!
                            // Let's forward to replaceState
                            //History.debug('History.onPopState: state anchor', currentHash, currentState);
                            History.replaceState(currentState.data, currentState.title, currentState.url, false);
                        }
                        else {
                            // Traditional Anchor
                            //History.debug('History.onPopState: traditional anchor', currentHash);
                            History.Adapter.trigger(window,'anchorchange');
                            History.busy(false);
                        }

                        // We don't care for hashes
                        History.expectedStateId = false;
                        return false;
                    }

                    // Ensure
                    stateId = History.Adapter.extractEventData('state',event,extra) || false;

                    // Fetch State
                    if ( stateId ) {
                        // Vanilla: Back/forward button was used
                        newState = History.getStateById(stateId);
                    }
                    else if ( History.expectedStateId ) {
                        // Vanilla: A new state was pushed, and popstate was called manually
                        newState = History.getStateById(History.expectedStateId);
                    }
                    else {
                        // Initial State
                        newState = History.extractState(History.getLocationHref());
                    }

                    // The State did not exist in our store
                    if ( !newState ) {
                        // Regenerate the State
                        newState = History.createStateObject(null,null,History.getLocationHref());
                    }

                    // Clean
                    History.expectedStateId = false;

                    // Check if we are the same state
                    if ( History.isLastSavedState(newState) ) {
                        // There has been no change (just the page's hash has finally propagated)
                        //History.debug('History.onPopState: no change', newState, History.savedStates);
                        History.busy(false);
                        return false;
                    }

                    // Store the State
                    History.storeState(newState);
                    History.saveState(newState);

                    // Force update of the title
                    History.setTitle(newState);

                    // Fire Our Event
                    History.Adapter.trigger(window,'statechange');
                    History.busy(false);

                    // Return true
                    return true;
                };
                History.Adapter.bind(window,'popstate',History.onPopState);

                /**
                 * History.pushState(data,title,url)
                 * Add a new State to the history object, become it, and trigger onpopstate
                 * We have to trigger for HTML4 compatibility
                 * @param {object} data
                 * @param {string} title
                 * @param {string} url
                 * @return {true}
                 */
                History.pushState = function(data,title,url,queue){
                    //History.debug('History.pushState: called', arguments);

                    // Check the State
                    if ( History.getHashByUrl(url) && History.emulated.pushState ) {
                        throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
                    }

                    // Handle Queueing
                    if ( queue !== false && History.busy() ) {
                        // Wait + Push to Queue
                        //History.debug('History.pushState: we must wait', arguments);
                        History.pushQueue({
                            scope: History,
                            callback: History.pushState,
                            args: arguments,
                            queue: queue
                        });
                        return false;
                    }

                    // Make Busy + Continue
                    History.busy(true);

                    // Create the newState
                    var newState = History.createStateObject(data,title,url);

                    // Check it
                    if ( History.isLastSavedState(newState) ) {
                        // Won't be a change
                        History.busy(false);
                    }
                    else {
                        // Store the newState
                        History.storeState(newState);
                        History.expectedStateId = newState.id;

                        // Push the newState
                        history.pushState(newState.id,newState.title,newState.url);

                        // Fire HTML5 Event
                        History.Adapter.trigger(window,'popstate');
                    }

                    // End pushState closure
                    return true;
                };

                /**
                 * History.replaceState(data,title,url)
                 * Replace the State and trigger onpopstate
                 * We have to trigger for HTML4 compatibility
                 * @param {object} data
                 * @param {string} title
                 * @param {string} url
                 * @return {true}
                 */
                History.replaceState = function(data,title,url,queue){
                    //History.debug('History.replaceState: called', arguments);

                    // Check the State
                    if ( History.getHashByUrl(url) && History.emulated.pushState ) {
                        throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
                    }

                    // Handle Queueing
                    if ( queue !== false && History.busy() ) {
                        // Wait + Push to Queue
                        //History.debug('History.replaceState: we must wait', arguments);
                        History.pushQueue({
                            scope: History,
                            callback: History.replaceState,
                            args: arguments,
                            queue: queue
                        });
                        return false;
                    }

                    // Make Busy + Continue
                    History.busy(true);

                    // Create the newState
                    var newState = History.createStateObject(data,title,url);

                    // Check it
                    if ( History.isLastSavedState(newState) ) {
                        // Won't be a change
                        History.busy(false);
                    }
                    else {
                        // Store the newState
                        History.storeState(newState);
                        History.expectedStateId = newState.id;

                        // Push the newState
                        history.replaceState(newState.id,newState.title,newState.url);

                        // Fire HTML5 Event
                        History.Adapter.trigger(window,'popstate');
                    }

                    // End replaceState closure
                    return true;
                };

            } // !History.emulated.pushState


            // ====================================================================
            // Initialise

            /**
             * Load the Store
             */
            if ( sessionStorage ) {
                // Fetch
                try {
                    History.store = JSON.parse(sessionStorage.getItem('History.store'))||{};
                }
                catch ( err ) {
                    History.store = {};
                }

                // Normalize
                History.normalizeStore();
            }
            else {
                // Default Load
                History.store = {};
                History.normalizeStore();
            }

            /**
             * Clear Intervals on exit to prevent memory leaks
             */
            History.Adapter.bind(window,"unload",History.clearAllIntervals);

            /**
             * Create the initial State
             */
            History.saveState(History.storeState(History.extractState(History.getLocationHref(),true)));

            /**
             * Bind for Saving Store
             */
            if ( sessionStorage ) {
                // When the page is closed
                History.onUnload = function(){
                    // Prepare
                    var	currentStore, item, currentStoreString;

                    // Fetch
                    try {
                        currentStore = JSON.parse(sessionStorage.getItem('History.store'))||{};
                    }
                    catch ( err ) {
                        currentStore = {};
                    }

                    // Ensure
                    currentStore.idToState = currentStore.idToState || {};
                    currentStore.urlToId = currentStore.urlToId || {};
                    currentStore.stateToId = currentStore.stateToId || {};

                    // Sync
                    for ( item in History.idToState ) {
                        if ( !History.idToState.hasOwnProperty(item) ) {
                            continue;
                        }
                        currentStore.idToState[item] = History.idToState[item];
                    }
                    for ( item in History.urlToId ) {
                        if ( !History.urlToId.hasOwnProperty(item) ) {
                            continue;
                        }
                        currentStore.urlToId[item] = History.urlToId[item];
                    }
                    for ( item in History.stateToId ) {
                        if ( !History.stateToId.hasOwnProperty(item) ) {
                            continue;
                        }
                        currentStore.stateToId[item] = History.stateToId[item];
                    }

                    // Update
                    History.store = currentStore;
                    History.normalizeStore();

                    // In Safari, going into Private Browsing mode causes the
                    // Session Storage object to still exist but if you try and use
                    // or set any property/function of it it throws the exception
                    // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to
                    // add something to storage that exceeded the quota." infinitely
                    // every second.
                    currentStoreString = JSON.stringify(currentStore);
                    try {
                        // Store
                        sessionStorage.setItem('History.store', currentStoreString);
                    }
                    catch (e) {
                        if (e.code === DOMException.QUOTA_EXCEEDED_ERR) {
                            if (sessionStorage.length) {
                                // Workaround for a bug seen on iPads. Sometimes the quota exceeded error comes up and simply
                                // removing/resetting the storage can work.
                                sessionStorage.removeItem('History.store');
                                sessionStorage.setItem('History.store', currentStoreString);
                            } else {
                                // Otherwise, we're probably private browsing in Safari, so we'll ignore the exception.
                            }
                        } else {
                            throw e;
                        }
                    }
                };

                // For Internet Explorer
                History.intervalList.push(setInterval(History.onUnload,History.options.storeInterval));

                // For Other Browsers
                History.Adapter.bind(window,'beforeunload',History.onUnload);
                History.Adapter.bind(window,'unload',History.onUnload);

                // Both are enabled for consistency
            }

            // Non-Native pushState Implementation
            if ( !History.emulated.pushState ) {
                // Be aware, the following is only for native pushState implementations
                // If you are wanting to include something for all browsers
                // Then include it above this if block

                /**
                 * Setup Safari Fix
                 */
                if ( History.bugs.safariPoll ) {
                    History.intervalList.push(setInterval(History.safariStatePoll, History.options.safariPollInterval));
                }

                /**
                 * Ensure Cross Browser Compatibility
                 */
                if ( navigator.vendor === 'Apple Computer, Inc.' || (navigator.appCodeName||'') === 'Mozilla' ) {
                    /**
                     * Fix Safari HashChange Issue
                     */

                        // Setup Alias
                    History.Adapter.bind(window,'hashchange',function(){
                        History.Adapter.trigger(window,'popstate');
                    });

                    // Initialise Alias
                    if ( History.getHash() ) {
                        History.Adapter.onDomLoad(function(){
                            History.Adapter.trigger(window,'hashchange');
                        });
                    }
                }

            } // !History.emulated.pushState


        }; // History.initCore

    })(window);

    return History;
});
define('yfjs/spa/util/layout', [
    '../version', './helpers', './event', './error', './widget'
], function(
    Version, _, Event, Error, Widget
) {

    var NAMESPACE = "Layout";

    var Layout = Widget({
        NAMESPACE : NAMESPACE,
        VERSION   : Version(NAMESPACE),

        CONTAINER_ID : "app-layout",
        BIND_KEY     : "data-layout",

        Event : Event(NAMESPACE),
        Error : Error(NAMESPACE),

        PREFIX_PATH_SCRIPT   : "app/layouts",
        PREFIX_PATH_TEMPLATE : "app/templates/layouts",

        defaultTemplate: function(template) {
            if (!_.isUndef(template)) {
                template = template || "{{body}}";
            }
            return template;
        }
    });

    Layout.Error.translate({
        'script_unfound': "加载 {0} 布局失败。找不到依赖文件或模块 {1}",
        'script_timeout': "加载 {0} 布局失败。依赖文件或模块 {1} 加载超时",
        'script_error': "加载 {0} 布局失败。文件 {1} 存在错误：{2}",
        'script_invalid_return': "加载 {0} 布局失败。布局文件 {1} 必须明确返回布局实例",
        'callback': "执行 {0} 布局的 {1} 时发生了错误: {2}",
        'style_unfound': "布局 {0} - {1}",
        'load_fail': "加载 {0} 布局失败。{1}"
    });

    Layout.Error.translate(
        'setter',
        "布局 {0} 设置错误。无法设置实例属性 {1}，因为它是布局实例的固有属性"
    );

    Layout.Error.translate(
        'include_limit',
        "布局 {0} 模板引入错误。引入 {1} 时超过最大引入层数（" + Widget.INCLUDE_LEVEL_LIMIT +"）限制"
    );

    return Layout;
});
/**
 * Created by jinzhk on 2015/11/05.
 *
 * 将一个包含通配符的路径编译成正则表达式
 * 规则如下：
 * 1、合法的文件名字符包括: 字母/数字/下划线/小数点/短横线;
 * 2、合法的路径分隔符为斜杠"/";
 * 3、"＊"代表0个或多个文件名字符;
 * 4、"？"代表1个文件名字符;
 * 5、"＊＊"代表0个或多个文件名字符或路径分隔符;
 * 6、不能连续出现3个"＊";
 * 7、不能连续出现2个路径分隔符;
 * 8、"＊＊"的前后只能是路径分隔符.
 * 9、默认已
 * 转换后的正则表达式, 对每一个通配符建立引用变量, 依次为$1, $2, ...
 * @type {{}}
 */
define('yfjs/spa/util/path-wildcard-compiler', ['../version', 'jquery', './helpers'], function(Version, $, _) {

    var PathWildcardCompiler = {};

    PathWildcardCompiler.NAMESPACE = "PathWildcardCompiler";

    PathWildcardCompiler.VERSION = Version(PathWildcardCompiler.NAMESPACE);

    PathWildcardCompiler.DEFAULTS = {
        // 强制使用绝对路径
        forceAbsolutePath : false,
        // 强制使用相对路径
        forceRelativePath : false,
        // 从头匹配
        forceMatchPrefix  : false,
        // 匹配结尾
        forceMatchSuffix  : false
    };

    PathWildcardCompiler.REGEXP_PREFIX = /^\^/;
    PathWildcardCompiler.REGEXP_SUFFIX = /\$$/;

    PathWildcardCompiler.config = function(key, val) {
        if (!_.isEmpty(key)) {
            if (_.isObject(key)) {
                $.extend(PathWildcardCompiler.DEFAULTS, key);
            } else {
                key = _.trim(key);
                PathWildcardCompiler.DEFAULTS[key] = val;
            }
        }
        return PathWildcardCompiler;
    };

    $.extend(PathWildcardCompiler, {
        // 关键字符
        ESCAPE_CHAR  : '\\',
        SLASH        : '/',
        UNDERSCORE   : '_',
        DASH         : '-',
        DOT          : '.',
        STAR         : '*',
        QUESTION     : '?',
        // 正则
        REGEX_MATCH_PREFIX     : "^",
        REGEX_MATCH_SUFFIX     : "$",
        REGEX_WORD_BOUNDARY    : "\\b",
        REGEX_SLASH            : "\\/",
        REGEX_SLASH_NO_DUP     : "\\/(?!\\/)",
        REGEX_FILE_NAME_CHAR   : "[\\w\\-\\.]",
        // 上一个token的状态
        LAST_TOKEN_START        : 0,
        LAST_TOKEN_SLASH        : 1,
        LAST_TOKEN_FILE_NAME    : 2,
        LAST_TOKEN_STAR         : 3,
        LAST_TOKEN_DOUBLE_STAR  : 4,
        LAST_TOKEN_QUESTION     : 5
    });

    $.extend(PathWildcardCompiler, {
        REGEX_FILE_NAME_SINGLE_CHAR : "(" + PathWildcardCompiler.REGEX_FILE_NAME_CHAR + ")",
        REGEX_FILE_NAME             : "(" + PathWildcardCompiler.REGEX_FILE_NAME_CHAR + "*)",
        REGEX_FILE_PATH             : "(" + PathWildcardCompiler.REGEX_FILE_NAME_CHAR + "+(?:" + PathWildcardCompiler.REGEX_SLASH_NO_DUP + PathWildcardCompiler.REGEX_FILE_NAME_CHAR + "*)*(?=" + PathWildcardCompiler.REGEX_SLASH + "|$)|)" + PathWildcardCompiler.REGEX_SLASH + "?"
    });

    $.extend(PathWildcardCompiler, {
        /**
         * 将包含通配符的路径表达式, 编译成正则表达式
         * @param path
         * @param options
         * @returns {RegExp}
         */
        compilePathName: function(path, options) {
            try {
                return new RegExp(PathWildcardCompiler.pathToRegex(path, options));
            } catch (e) {
                return null;
            }
        },
        /**
         * 取得相关度数值。
         * 所谓相关度数值，即除去分隔符和通配符以后，剩下的字符长度。 相关度数值可用来对匹配结果排序。例如：/a/b/c既匹配/a又匹配/*，但显然前者为更“相关”的匹配。
         * @param path
         * @returns {number}
         */
        getPathNameRelevancy: function(path) {
            path = PathWildcardCompiler.normalizePath(path);
            if (!path) {
                return 0;
            }
            var relevant = 0;
            for (var i = 0; i < path.length; i++) {
                switch (path.charAt(i)) {
                    case PathWildcardCompiler.SLASH:
                    case PathWildcardCompiler.STAR:
                    case PathWildcardCompiler.QUESTION:
                        continue;
                    default:
                        relevant++;
                }
            }
            return relevant;
        },
        pathToRegex: function(path, options) {
            path = PathWildcardCompiler.normalizePath(path);

            if (!path) return null;

            options = $.extend({}, PathWildcardCompiler.DEFAULTS, options);

            // 以 ^ 开头则自动开启从头匹配
            if (PathWildcardCompiler.REGEXP_PREFIX.test(path)) {
                options.forceMatchPrefix = true;
                path = path.slice(1);
            }

            // 以 $ 结尾则自动开启匹配结尾
            if (PathWildcardCompiler.REGEXP_SUFFIX.test(path)) {
                options.forceMatchSuffix = true;
                path = path.slice(0, -1);
            }

            path = _.trim(path);

            var lastToken = PathWildcardCompiler.LAST_TOKEN_START, regexStr = '';

            // 如果第一个字符为slash, 或调用者要求forceMatchPrefix, 则从头匹配
            if (options.forceMatchPrefix || path.length > 0 && path.charAt(0) == PathWildcardCompiler.SLASH) {
                regexStr += PathWildcardCompiler.REGEX_MATCH_PREFIX;
            }

            // 特殊情况：/看作""
            if (path == PathWildcardCompiler.SLASH) {
                path = "";
            }

            for (var i = 0; i < path.length; i++) {
                var ch = path.charAt(i);

                if (options.forceAbsolutePath && lastToken == PathWildcardCompiler.LAST_TOKEN_START && ch != PathWildcardCompiler.SLASH) {
                    throw new Error({
                        name: "Syntax Error", filename: path, number: i, message: 'Path must start with "/" when FORCE_ABSOLUTE_PATH is true.'
                    });
                }

                switch (ch) {
                    case PathWildcardCompiler.SLASH:
                        // slash后面不能是slash, slash不能位于首字符(如果指定了force relative path的话)
                        if (lastToken == PathWildcardCompiler.LAST_TOKEN_SLASH) {
                            throw new Error({
                                name: "Syntax Error", filename: path, number: i, message: 'Path can not contains double slash "//".'
                            });
                        } else if (options.forceRelativePath && lastToken == PathWildcardCompiler.LAST_TOKEN_START) {
                            throw new Error({
                                name: "Syntax Error", filename: path, number: i, message: 'Path can not starts with "/" when FORCE_RELATIVE_PATH is true.'
                            });
                        }

                        // 因为**已经包括了slash, 所以不需要额外地匹配slash
                        if (lastToken != PathWildcardCompiler.LAST_TOKEN_DOUBLE_STAR) {
                            regexStr += PathWildcardCompiler.REGEX_SLASH_NO_DUP;
                        }

                        lastToken = PathWildcardCompiler.LAST_TOKEN_SLASH;
                        break;

                    case PathWildcardCompiler.STAR:
                        var j = i + 1;

                        if (j < path.length && path.charAt(j) == PathWildcardCompiler.STAR) {
                            i = j;

                            // **前面只能是slash
                            if (lastToken != PathWildcardCompiler.LAST_TOKEN_START && lastToken != PathWildcardCompiler.LAST_TOKEN_SLASH) {
                                throw new Error({
                                    name: "Syntax Error", filename: path, number: i, message: 'Double stars "**" in front of only slash "/".'
                                });
                            }

                            lastToken = PathWildcardCompiler.LAST_TOKEN_DOUBLE_STAR;
                            regexStr += PathWildcardCompiler.REGEX_FILE_PATH;
                        } else {
                            // *前面不能是*或**
                            if (lastToken == PathWildcardCompiler.LAST_TOKEN_STAR || lastToken == PathWildcardCompiler.LAST_TOKEN_DOUBLE_STAR) {
                                throw new Error({
                                    name: "Syntax Error", filename: path, number: i, message: 'If the front is not slash "/", the front of star "*" cannot be "*" or "**".'
                                });
                            }

                            lastToken = PathWildcardCompiler.LAST_TOKEN_STAR;
                            regexStr += PathWildcardCompiler.REGEX_FILE_NAME;
                        }

                        break;

                    case PathWildcardCompiler.QUESTION:
                        lastToken = PathWildcardCompiler.LAST_TOKEN_QUESTION;
                        regexStr += PathWildcardCompiler.REGEX_FILE_NAME_SINGLE_CHAR;
                        break;

                    default:
                        // **后只能是slash
                        if (lastToken == PathWildcardCompiler.LAST_TOKEN_DOUBLE_STAR) {
                            throw new Error({
                                name: "Syntax Error", filename: path, number: i, message: 'Double stars "**" must be followed by slash "/".'
                            });
                        }

                        if (/[a-z0-9]/i.test(ch) || ch == PathWildcardCompiler.UNDERSCORE || ch == PathWildcardCompiler.DASH) {
                            // 加上word边界, 进行整字匹配
                            if (lastToken == PathWildcardCompiler.LAST_TOKEN_START) {
                                regexStr += (PathWildcardCompiler.REGEX_WORD_BOUNDARY + ch); // 前边界
                            } else if (i + 1 == path.length) {
                                regexStr += (ch + PathWildcardCompiler.REGEX_WORD_BOUNDARY); // 后边界
                            } else {
                                regexStr += ch;
                            }
                        } else if (ch == PathWildcardCompiler.DOT) {
                            regexStr += (PathWildcardCompiler.ESCAPE_CHAR + PathWildcardCompiler.DOT);
                        } else {
                            throw new Error({
                                name: "Syntax Error", filename: path, number: i, message: 'Path contains non-standard characters.'
                            });
                        }

                        lastToken = PathWildcardCompiler.LAST_TOKEN_FILE_NAME;
                }
            }

            if (options.forceMatchSuffix) {
                regexStr += PathWildcardCompiler.REGEX_MATCH_SUFFIX;
            }

            return regexStr;
        },
        /**
         * 规格化类名。
         * 除去两端空白
         * 将"\\"转换成"//"
         * 将重复的"/"转换成单个的"/"
         * @param path
         * @returns {*}
         */
        normalizePath: function(path) {
            if (_.isEmpty(path)) {
                return null;
            }
            return _.trim(path).replace(/\\\\/g, "/").replace(/\/\//g, "/");
        }
    });

    return PathWildcardCompiler;
});
define('yfjs/spa/util/remote', ['../version', './helpers'], function(Version, _) {

    var Remote = function() {
        return new Remote.Constructor(_.__aslice.call(arguments));
    };

    Remote.NAMESPACE = "Remote";

    Remote.VERSION = Version(Remote.NAMESPACE);

    Remote.instanceof = function(o) {
        return o && o instanceof Remote.Constructor;
    };

    Remote.Constructor = function(args) {
        if (this instanceof Remote.Constructor) {
            this.args = args || [];
            this.length = args.length;
        } else {
            return new Remote.Constructor(args);
        }
    };

    Remote.Constructor.prototype = {
        get: function(index) {
            if (this.length < 1) return;
            if (this.length == 1) {
                return this.args[0];
            }
            if (typeof index === "number") {
                return this.args[index];
            }
            return this.args;
        }
    };

    return Remote;
});
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
/*!
 * 核心编译器部分使用了
 * ===================================================
 * artTemplate - Template Engine - v3.0.0
 * https://github.com/aui/artTemplate
 * Released under the MIT, BSD, and GPL Licenses
 * ===================================================
 * 新增功能 - Update Log.
 * ===================================================
 * - Updated by jinzhk on 2016/08/05
 * 添加了配置项 escapeIgnore，支持忽略某些变量的编码转换。 (!deleted)
 * - Updated by jinzhk on 2016/08/26 ~ 29
 * 1、调整为实例模式
 * 2、支持 dynamicHelper 方式，即添加动态辅助方法，动态辅助方法的 this 指针指向创建实例时传入的 context 配置项 (!deleted)
 * 3、支持远程加载模板的功能 - template.remote
 * 4、支持远程加载模板并渲染的功能 - template.renderRemote (!deleted)
 * - Updated by jinzhk on 2016/09/02
 * 因为 Ajax 模块也改为了实例模式，删除了远程加载模板数据并渲染的方法 template.renderRemote，改为交给调用端自行处理
 * - Updated by jinzhk on 2016/09/05
 * 1、完善了编译器的处理变量的方法 getVariable，解决了不带单双引号的 object 的键被解析为变量的问题
 * 2、改写了编译器的 print 和 include 方法的实现，去除了拼接 $out 语句，改为了只返回当前局部内容
 * - Updated by jinzhk on 2016/09/06
 * 为便于使用远程加载模板的功能，Template 下添加了静态方法 remote，同实例下的方法 remote
 * - Updated by jinzhk on 2016/09/09
 * 1、方法上下文 context 的初始化方式改为了与 options 分离传入的方式
 * 2、去除了 dynamicHelper 的概念和写法，统一为一致的 helper，helper 方法的 this 指针动态指向初始化实例时传入的 context 参数
 * - Updated by jinzhk on 2016/11/28
 * 1、添加了配置项 helpers，用以传入自定义的辅助方法
 * 2、添加了配置项 remote，用以定义请求远程模板时的 ajax 配置项
 * 3、添加了配置项 include，用以自定义模板引入 include 的实现
 * 4、为使配置项更清晰易懂，去除了 escapeIgnore 配置项及相关功能接口
 * ===================================================
 */
define('yfjs/spa/util/template', [
    '../version', 'jquery', './helpers', './template-helpers', './event', './error', './ajax'
], function(
    Version, $, _, DefHelpers, Event, Error, Ajax
) {

    var ROOT_URL = _.LOCAL_ROOT;

    var Template = function(options, context) {
        if (this instanceof Template) {
            var self = this;
            // init options
            _.def(this, '__options__', _.extend({}, Template.DEFAULTS, options));
            if (options && _.notNull(options.helpers)) {
                this.setOption('helpers', _.extend({}, Template.HELPERS, Template.DEFAULTS.helpers, options.helpers));
            } else {
                this.setOption('helpers', _.extend({}, Template.HELPERS, Template.DEFAULTS.helpers));
            }
            if (options && _.notNull(options.remote)) {
                this.setOption('remote', _.extend(true, {}, Template.DEFAULTS.remote, options.remote));
            } else {
                this.setOption('remote', _.extend(true, {}, Template.DEFAULTS.remote));
            }

            // init context
            _.def(this, '__context__', context);

            // init include_promise
            _.def(this, '__include_promise__', []);

            // init include util
            _.def(this, 'utils', {
                $helpers: {},
                $string: Template.toString,
                $escape: Template.escapeHTML,
                $each: Template.each,
                $context: this.getContext() || this,
                $include: function() {
                    return self.include.apply(self, arguments);
                }
            }, {
                writable: false,
                configurable: false
            });

            // init helpers
            this.helpers(this.getOption('helpers'));
        } else {
            return new Template(options, context);
        }
    };

    Template.NAMESPACE = "Template";

    Template.VERSION = Version(Template.NAMESPACE);

    Template.DEFAULTS = {
        /**
         * 逻辑语法开始标签 {String}
         * - 默认为 '{{'
         */
        openTag: '{{',
        /**
         * 逻辑语法结束标签 {String}
         * - 默认为 '}}'
         */
        closeTag: '}}',
        /**
         * 是否编码输出变量的 HTML 字符 {Boolean}
         * - 默认为 true
         */
        escape: true,
        /**
         * 是否开启缓存 {Boolean}
         * - 默认为 true
         */
        cache: false,
        /**
         * 是否显示 html 注释内容 {Boolean}
         * - 设为 true 则显示注释内容，否则忽略注释内容
         * - 默认为 false
         */
        comment: false,
        /**
         * 是否压缩输出
         * - 默认为 false
         */
        compress: false,
        /**
         * 自定义语法格式器 {Function}
         */
        parser: null,
        /**
         * 自定义模板引入实现 {Function}
         */
        include: null,
        /**
         * 编译输出结果的处理钩子 {Function}
         * - 传入编译错误信息、编译后的输出内容
         * - 必须返回数组，数组索引第0项为错误信息，第1项为处理后的输出内容
         */
        rendered: null,
        /**
         * 模板辅助方法 {Object}
         * - 键值为 {名称(String)} - {方法(Function)}
         */
        helpers: _.__undef__,
        /**
         * 请求远程模板时的配置项 {Object}
         */
        remote: {
            headers: {
                'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
            },
            dataType: "text"
        }
    };

    Template.Event = Event(Template.NAMESPACE);

    Template.Error = Error(Template.NAMESPACE);

    Template.Error.translate({
        'remote_error': "模板加载失败：{0}",
        'render_error': "模板文件 {0} {1} 编译错误：{2}",
        'param_invalid_include': "模板内 include 方法缺少 {0} 参数",
        'callback': "执行 Template 的 {0} 时发生了错误: {1}"
    });

    Template.config = _.configurator.call(Template, Template.DEFAULTS);

    // 缓存模板的全局辅助方法
    Template.HELPERS = {};

    // 添加模板的全局辅助方法
    Template.helper = function(name, fn) {
        __helper.apply(Template.HELPERS, arguments);
        return Template;
    };

    // 批量添加模板的全局辅助方法
    Template.helpers = function(helpers) {
        __helpers.apply(Template.HELPERS, arguments);
        return Template;
    };

    Template.helpers(DefHelpers);

    // 静态分析模板变量
    Template.KEYWORDS =
        // 关键字
        'break,case,catch,continue,debugger,default,delete,do,else,false'
        + ',finally,for,function,if,in,instanceof,new,null,return,switch,this'
        + ',throw,true,try,typeof,var,void,while,with'

        // 保留字
        + ',abstract,boolean,byte,char,class,const,double,enum,export,extends'
        + ',final,float,goto,implements,import,int,interface,long,native'
        + ',package,private,protected,public,short,static,super,synchronized'
        + ',throws,transient,volatile'

        // ECMA 5 - use strict
        + ',arguments,let,yield'

        + ',undefined';

    Template.REGEXP_REMOVE      = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
    Template.REGEXP_SPLIT       = /[^\w$]+/g;
    Template.REGEXP_KEYWORDS    = new RegExp(["\\b" + Template.KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g');
    Template.REGEXP_OBJECT_KEY  = /\{\s*(\w+)\s*:/g,
    Template.REGEXP_NUMBER      = /^\d[^,]*|,\d[^,]*/g;
    Template.REGEXP_BOUNDARY    = /^,+|,+$/g;
    Template.REGEXP_SPLIT2      = /^$|,+/;

    Template.REGEXP_COMMENT_START  = /<!--/;
    Template.REGEXP_COMMENT_END    = /-->/;
    Template.REGEXP_TAG_SOURCE     = /<script\s+(?:[^>]*)type=\s*(?:'|")text\/html(?:'|")(?:[^>]*)>([\s\S]*)<\/script>/ig;

    Template.REGEXP_MAIN_OPEN  = /^\{+/;
    Template.REGEXP_MAIN_CLOSE = /^\}+/;

    // 模板缓存 { {filename} : {renderFn} }
    Template.cache = {};

    // 远程模板缓存  { {fileUrl} : {fileContent} }
    Template.remoteCache = {};

    // 默认远程模板请求对象
    Template.ajax = null;

    Template.prototype = {
        setOption: _.optionSetter(Template.DEFAULTS),
        getOption: _.optionGetter(),
        getOptions: _.optionsGetter(),
        getContext: function() {
            return this.__context__;
        },
        /**
         * 添加辅助方法
         * @param name  {String}    方法名
         * @param fn    {Function}  方法实现
         * @returns {Template}  当前模板实例
         */
        helper: function(name, fn) {
            var args = _.__aslice.call(arguments);

            if (_.isFunction(args[1])) {
                args[1] = fn.bind(this.getContext() || this);

                var utils = this.utils || {};
                utils.$helpers = utils.$helpers || {};

                __helper.apply(utils.$helpers, args);
            }

            return this;
        },
        /**
         * 批量添加辅助方法
         * @param helpers  {Object}
         *        键值对为 [name] : [fn] 的对象
         * @returns {Template}  当前模板实例
         */
        helpers: function(helpers) {
            if (_.notNull(helpers) && _.isObject(helpers)) {
                for (var key in helpers) {
                    if (_.__hasOwn.call(helpers, key)) {
                        this.helper(key, helpers[key]);
                    }
                }
            }
            return this;
        },
        /**
         * 模板引入实现
         * @param filename   {String}  模板名
         * @param data       {Object}  引入模板的数据
         * @param $data      {Object}  当前模板的数据
         * @param $filename  {String}  当前模板文件名
         * @returns {String}
         */
        include: function(filename, data, $data, $filename) {
            var options = this.__options__ || {}, err, result;
            if (_.isFunction(options.include)) {
                try {
                    result = options.include.apply(this.getContext() || this, arguments);
                } catch (e) {
                    err = this.makeError('callback', ["include", e.message], e);
                    result = err.message;
                }
            } else {
                var args = _.__aslice.call(arguments);
                if (args.length < 3 || _.isEmpty(args[0])) {
                    err = this.makeError('param_invalid_include', ['filename']);
                    result = err.message;
                } else {

                    var includeData = {$include: $data};

                    if (args.length < 4) {
                        args.splice(1, 1, includeData);
                    } else {
                        args.splice(1, 2, _.extend({}, Template.normalizeData(data), includeData));
                    }

                    var rendered = this.render.apply(this.getContext() || this, args);

                    result = _.isString(rendered) ? rendered : rendered.message;
                }
            }

            if (_.notNull(err)) {
                Template.Event.trigger('Error', err);
            }

            return _.notNull(result) ? String(result) : '';
        },
        includeIndex: function(includeKey) {
            var index = 1;
            if (!_.isEmpty(includeKey)) {
                var i, pos, includePromise;
                if ((pos = this.getIncludePromisePos(includeKey)) > -1) {
                    index = 0;
                    for (i=0; i<pos; i++) {
                        includePromise = this.__include_promise__[i] || {};
                        if (_.isNumber(includePromise.len)) {
                            index += includePromise.len;
                        } else {
                            index += 1;
                        }
                    }
                    includePromise = this.__include_promise__[pos] || {};
                    if (_.isArray(includePromise.promise)) {
                        index += (includePromise.promise.length + 1);
                    } else {
                        index += 1;
                    }
                } else {
                    index = 0;
                    for (i=0; i<this.__include_promise__.length; i++) {
                        includePromise = this.__include_promise__[i];
                        if (_.isNumber(includePromise.len)) {
                            index += includePromise.len;
                        } else {
                            index += 1;
                        }
                    }
                    index += 1;
                }
            }
            return index;
        },
        setIncludePromise: function(promise, includeKey) {
            if (!_.isEmpty(includeKey)) {
                var map = {};
                map.key = includeKey = _.trim(includeKey);
                var pos = this.getIncludePromisePos(map.key);
                if (pos < 0) {
                    map.promise = [promise];
                    map.len = 1;
                    this.__include_promise__.push(map);
                } else {
                    var oldMap = this.__include_promise__.splice(pos, 1)[0] || {};
                    if (!_.isArray(oldMap.promise)) {
                        oldMap.promise = [];
                    }
                    oldMap.promise.push(promise);
                    oldMap.len = oldMap.promise.length;
                    this.__include_promise__.splice(pos, 0, oldMap);
                }
            }
            return this;
        },
        getIncludePromises: function(includeKey) {
            var res, pos;
            if (!_.isEmpty(includeKey) && (pos = this.getIncludePromisePos(includeKey)) > -1) {
                res = this.__include_promise__[pos] || {};
                res = res.promise;
            }
            if (_.isNull(res)) {
                res = [];
            } else if (!_.isArray(res)) {
                res = [res];
            }
            return res;
        },
        getIncludePromisePos: function(includeKey) {
            var pos = -1;
            for (var i=0; i<this.__include_promise__.length; i++) {
                if (this.__include_promise__[i] && this.__include_promise__[i].key === includeKey) {
                    pos = i;
                    break;
                }
            }
            return pos;
        },
        clearIncludePromise: function(includeKey) {
            if (_.isNull(includeKey)) {
                for (var k in this.__include_promise__) {
                    delete this.__include_promise__[k];
                }
            } else {
                var pos = this.getIncludePromisePos(includeKey);
                if (pos > -1) {
                    var includePromise = this.__include_promise__[pos] || {};
                    if (_.isArray(includePromise.promise)) {
                        includePromise.promise.splice(0, includePromise.promise.length);
                    }
                }
            }
        },
        /**
         * 数据格式化处理
         * @param dataFilter
         * @param args
         * @returns {*}
         */
        dataFilter: function(dataFilter, args) {
            var data, filtered = false;

            args = _.__aslice.call(arguments, 1);

            if (_.isFunction(dataFilter)) {
                try {
                    data = dataFilter.apply(this.getContext() || this, args);
                    _.normalizeCallbackArgs(dataFilter, args);
                    delete dataFilter.__err_called__;
                    filtered = true;
                } catch (e) {
                    _.def(
                        dataFilter, '__err_called__',
                        this.makeError('callback', ['dataFilter', e.message], e),
                        {
                            configurable: true
                        }
                    );
                }
            }

            if (!filtered) {
                if (args.length > 1) {
                    data = args;
                } else if (args.length > 0) {
                    data = args[0]
                }
            }

            return data;
        },
        /**
         * 获取远程模板文本内容
         * @param filepath  {String}    必选。模板地址
         * @param callback  {Function}  可选。回调函数，传入参数为 { [err] - 请求错误信息 }, { { filename: [模板（地址）名], source: [模板文本内容] } }
         *
         * @returns {Deferred.promise}  jquery延迟promise对象。done状态下的回调函数同callback
         */
        remote: function(filepath, callback) {
            var self = this;

            return Template.remote.call(self, filepath, function(err, res) {
                var context = self.getContext(),
                    tempProps = {__caller_name__: 'template.remote'},
                    props = _.extend({context: context}, tempProps);

                err = _.setPropsRecursive(err, props);

                var errs = concatError(context, err);

                if (_.isFunction(callback)) {
                    try {
                        callback.apply(context || self, arguments);
                        _.normalizeCallbackArgs(callback, arguments);
                    } catch (e) {
                        errs = sliceError(context, errs, tempProps);
                        var cbErr = _.setPropsRecursive(
                            self.makeError('callback', ['remote callback', e.message], e),
                            props
                        );
                        errs = concatError(context, errs, cbErr);
                    }
                }

                reportError(context, errs, tempProps);
            });
        },
        /**
         * 渲染模板
         * @name    render
         * @param   source   {String}    必选。模板
         * @param   data     {Object}    可选。数据
         * @param   filename {String}    可选。模板文件名
         * @param   callback {Function}  可选。回调函数
         *
         * @returns  {String}    渲染好的字符串
         */
        render: function(source, data, filename, callback) {

            var self = this,
                options = this.__options__ || {},
                context = this.getContext();

            var render;

            if (_.isFunction(data)) {
                callback = data;
                filename = _.__undef__;
                data = {};
            } else if (_.isFunction(filename)) {
                callback = filename;
                if (_.notNull(data) && !_.isObject(data)) {
                    filename = _.trim(data);
                    data = {};
                } else {
                    filename = _.__undef__;
                }
            }

            if (_.isEmpty(source)) return '';

            source = _.trim(source);

            data = Template.normalizeData(data);

            var bFilename = false, bDomId = false;

            // source 作为 DOM 的 id 查找模板
            if (/^[_a-z][a-z\-_0-9—]*$/i.test(source)) {
                var elem;

                try {
                    elem = _.document.getElementById(source);
                } catch (e) {
                    elem = _.__undef__;
                }

                if (elem) {

                    bDomId = true;

                    filename = _.decodeIdToPath(source);

                    context && _.def(context, '__render_file__', filename, {
                        configurable: true
                    });

                    bFilename = !_.isEmpty(filename);

                    if (bFilename && options.cache) {
                        render = Template.cache[filename];
                    }

                    if (!render) {
                        source = (elem.value || elem.innerHTML || "").replace(/^\s*|\s*$/g, '');
                        render = this.compile(source, filename);
                    }

                }

            } else if (bFilename = !_.isEmpty(filename)) {
                context && _.def(context, '__render_file__', filename, {
                    configurable: true
                });
            }

            if (!bFilename) {
                // 不存在文件名时，计算内容的hash值作为文件名，用以include索引
                // 注：此操作在计算大字符串时较耗时，故模板内容较多时应维护在一个文件内
                filename = _.hash(source);
            } else if (!bDomId) {
                // 去除文件名中的时间戳标记
                var posQuery = filename.lastIndexOf("?");
                if (posQuery > -1) {
                    var filenameParam = filename.substring(posQuery + 1);
                    filename = filename.substring(0, posQuery);
                    var bustMatch = filenameParam.match(/bust=[^&]+/);
                    if (bustMatch != null && bustMatch[0] != null) {
                        filenameParam = filenameParam.substring(0, bustMatch.index) + filenameParam.substring(bustMatch.index + bustMatch[0].length);
                    }
                    if (filenameParam.length) {
                        filename += ("?" + filenameParam);
                    }
                }
            }

            // source 不能对应 DOM 时，作为模板内容进行编译
            if (!render) {
                if (options.cache) {
                    render = Template.cache[filename];
                }
                if (!render) {
                    render = this.compile(source, filename);
                }
            }

            var rendered = render.call(this, data);

            context && _.def(context, '__render_file__', null);

            var args = [_.__undef__];

            var props = {__caller_name__: 'template.render'},
                errs, err, renderErr;

            if (!_.isString(rendered)) {
                // render error
                err = _.setPropsRecursive(
                    this.makeError('render_error', [rendered.filename, '- line: ' + rendered.line + ' -', rendered.message], rendered),
                    props
                );
                args[0] = renderErr = err;
                errs = concatError(context, err);
                args.push(_.__undef__);
            } else {
                args.push(rendered);
            }

            var includeKey = filename, includePromises;

            var includePromisesTemp = this.getIncludePromises(includeKey);
            for (var i=0; i<includePromisesTemp.length; i++) {
                if (_.isPromise(includePromisesTemp[i])) {
                    includePromises = includePromises || [];
                    includePromises.push(includePromisesTemp[i]);
                }
            }
            includePromisesTemp = null;

            if (_.isArray(includePromises) && includePromises.length) {
                if (_.isString(args[1])) {
                    var def = $.Deferred();

                    (function(def, includeKey, includePromises, callback, args) {
                        $.when.apply($.when, includePromises).done(function() {
                            var renderErr = args[0],
                                rendered = _.trim(args[1]);

                            var argsInclude = _.__aslice.call(arguments),
                                errIncluded, resIncluded;

                            if (includePromises.length > 1) {
                                $.each(argsInclude, function(i, arg) {
                                    if (!_.isUndef(arg[0])) {
                                        errIncluded = errIncluded || new Array(includePromises.length);
                                        errIncluded[i] = arg[0];
                                    }
                                    if (!_.isUndef(arg[1])) {
                                        resIncluded = resIncluded || new Array(includePromises.length);
                                        resIncluded[i] = arg[1];
                                    }
                                });
                            } else {
                                errIncluded = argsInclude[0];
                                resIncluded = argsInclude[1];
                            }

                            if (!_.isEmpty(errIncluded)) {
                                renderErr = _.concatError(renderErr, errIncluded);
                                args[0] = renderErr;
                            }

                            var i;

                            if (_.isArray(resIncluded)) {
                                for (i=0; i<resIncluded.length; i++) {
                                    renderIncluded(errIncluded ? errIncluded[i] : _.__undef__, resIncluded[i]);
                                }
                            } else {
                                renderIncluded(errIncluded, resIncluded);
                            }

                            args[1] = rendered;

                            function renderIncluded(errIncluded, resIncluded) {
                                if (resIncluded && resIncluded.widget) {
                                    var widget = resIncluded.widget,
                                        isIncludeInst = widget.instanceof(resIncluded.context);

                                    var launcher = isIncludeInst ? resIncluded.context : null,
                                        instance = launcher ? launcher.getInstance() : null,
                                        parentInst = instance ? instance.context : null;

                                    var bodyKey, bodyHtml, stateInclude;

                                    // parse state data
                                    if (isIncludeInst) {
                                        if (_.inArray(launcher, parentInst.__included__) < 0) {
                                            parentInst.__included__.push(launcher);
                                        }
                                        stateInclude = instance.getState('include') || {};
                                        bodyKey = stateInclude.body;
                                    } else if (resIncluded.state) {
                                        stateInclude = resIncluded.state.include || {};
                                        bodyKey = stateInclude.body;
                                    } else {
                                        bodyKey = _.__undef__;
                                    }

                                    // parse included's html
                                    if (!_.isEmpty(bodyKey)) {
                                        if (!_.isUndef(resIncluded.html)) {
                                            var $style;
                                            if (isIncludeInst && ($style = launcher.getState('$style'))) {
                                                resIncluded.html = _.html2str($style) + '\n' + resIncluded.html;
                                            }
                                            bodyHtml = wrapIncluded(resIncluded.html);
                                        } else if (errIncluded) {
                                            bodyHtml = wrapIncluded('{{{'+bodyKey+'}}}');
                                        } else {
                                            bodyHtml = wrapIncluded('');
                                        }
                                        rendered = _.replaceMainBody(rendered, bodyKey, bodyHtml);
                                    }

                                    function wrapIncluded(html) {
                                        var cssClass = isIncludeInst
                                            ? widget.PREFIX_CSS_INCLUDE + _.stylePathId(instance.getState('name'))
                                            : '';
                                        if (_.isFunction(resIncluded.wrap)) {
                                            return resIncluded.wrap(html, cssClass);
                                        } else if (launcher || resIncluded.state) {
                                            var containerId = resIncluded.state
                                                ? resIncluded.state.container
                                                : instance.getState('container');

                                            containerId = containerId.replace(widget.REGEXP_HASH_START, "");

                                            var name = resIncluded.state
                                                ? resIncluded.state.name
                                                : instance.getState('name');

                                            return widget.wrap(name, containerId)(html, cssClass);
                                        } else {
                                            return html || '';
                                        }
                                    }
                                }
                            }

                            self.clearIncludePromise(includeKey);

                            def.resolve(args[1]);

                            argsInclude = [errIncluded, resIncluded];

                            handleCallback(callback, args, argsInclude);

                            // ready included
                            if (!argsInclude.__do_ready__ && context && _.isFunction(context.readyInclude)) {
                                _.def(argsInclude, '__do_ready__', true);
                                context.readyInclude.apply(context, argsInclude);
                            }
                        });
                    })(def, includeKey, includePromises, callback, args);

                    return def.promise();
                } else {
                    this.clearIncludePromise(includeKey);
                    handleCallback(callback, args);
                }
            } else {
                handleCallback(callback, args);
                return _.isEmpty(renderErr) ? rendered : parseErrMsg(renderErr);
            }

            function handleCallback(callback, args, argsInclude) {
                if (_.isFunction(callback)) {
                    var context = self.getContext();
                    args = _.normalizeArrOption(args);
                    args = self.rendered.apply(self, args);
                    args.push(data, source);
                    if (_.notNull(argsInclude)) {
                        args.push(argsInclude);
                    }
                    try {
                        callback.apply(context || self, args);
                    } catch (e) {
                        errs = sliceError(context, errs, props);
                        err = _.setPropsRecursive(
                            self.makeError('callback', ['renderCallback', e.message], e),
                            props
                        );
                        errs = concatError(context, errs, err);
                    }
                }
                // report Error
                reportError(context, errs, props);
            }

            function parseErrMsg(err) {
                var msg;

                if (_.isArray(err)) {
                    var _msg;
                    for (var i=0; i<err.length; i++) {
                        if (_.isUndef(msg)) msg = '';
                        _msg = parseErrMsg(msg);
                        if (!_.isEmpty(_msg)) {
                            msg += ('\n' + _msg);
                        }
                    }
                } else if (_.notNull(err)) {
                    msg = _.trim(err.message);
                }

                if (_.isUndef(msg)) msg = '';

                return msg;
            }
        },
        rendered: function() {
            var renderedOpt = this.getOption('rendered'),
                argsOrg = _.__aslice.call(arguments),
                args = argsOrg;
            if (_.isFunction(renderedOpt)) {
                var renderErr, rendered;
                try {
                    args = renderedOpt.apply(this.getContext() || this, argsOrg);
                    if (!_.isArray(args)) {
                        args = argsOrg;
                    }
                    renderErr = args[0];
                    rendered = args[1];
                } catch (e) {
                    var cbErr = this.makeError('callback', ['rendered', e.message], e);
                    args[0] = _.concatError(renderErr, cbErr);
                }
            }
            return args;
        },
        /**
         * 编译模板
         * @name compile
         * @param source     {String}    模板字符串
         * @param filename   {String}    模板名称
         *
         * @returns  {Function}  渲染方法
         */
        compile: function(source, filename) {

            var options = this.__options__ || {}, self = this;

            try {

                var Render = this.compiler(source);

            } catch (e) {

                e.filename = filename || 'anonymous';
                e.name = 'Syntax Error';

                return function() {
                    return e;
                };

            }


            // 对编译结果进行一次包装

            function render (data) {

                try {

                    // render 执行上下文设为当前 Template 实例，上下文环境改变后更新 utils
                    if (Render.prototype !== this.utils) {
                        render.prototype = Render.prototype = this.utils;
                    }

                    if (Render.__tag_source__) {
                        data = _.extend({}, data, Render.__tag_source__);
                    }

                    return new Render(data, filename) + '';

                } catch (e) {

                    // 运行时出错后自动开启调试模式重新编译
                    if (!options.debug) {
                        options.debug = true;
                        return self.compile(source, filename)(data);
                    }

                    return e;

                }

            }


            render.prototype = Render.prototype;
            render.toString = function () {
                return Render.toString();
            };


            if (filename && options.cache) {
                Template.cache[filename] = render;
            }


            return render;

        },
        /**
         * 生成模板编译器
         * @name compiler
         * @param source {String} 模板字符串
         *
         * @returns  {Function}  编译器构造函数
         */
        compiler: function(source) {
            var self = this, options = self.__options__;

            var debug = options.debug;
            var openTag = options.openTag;
            var closeTag = options.closeTag;
            var comment = options.comment;
            var compress = options.compress;
            var escape = options.escape;

            var parser;

            if (_.isFunction(options.parser)) {
                parser = options.parser;
            } else {
                parser = this.parser;
            }

            var line = 1;
            var uniq = {$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1};

            var isNewEngine = ''.trim;// '__proto__' in {}
            var replaces = isNewEngine
                ? ["$out='';", "$out+=", ";", "$out"]
                : ["$out=[];", "$out.push(", ");", "$out.join('')"];

            var concat = isNewEngine
                ? "$out+=text;return $out;"
                : "$out.push(text);";

            var print = "function(){"
                +      "var text=''.concat.apply('',arguments);"
                +      "return text;"
                +  "}";

            var include = "function(filename,data){"
                +      "var args=Array.prototype.slice.call(arguments);"
                +      "args.push($data,$filename);"
                +      "var text=$utils.$include.apply($utils,args);"
                +      "return text;"
                +   "}";

            var headerCode = "'use strict';"
                + "var $utils=this,$helpers=$utils.$helpers,"
                + (debug ? "$line=0," : "");

            var mainCode = replaces[0];

            var footerCode = "return new String(" + replaces[3] + ");";

            source = _.trim(source);

            // 处理注释内容
            if (!comment) {
                source = trimComment(source);
            }

            // 处理模板标签文本内容
            var tagSrc = trimTagSource(source);
            source = tagSrc.source;

            // html与逻辑语法分离
            Template.each(source.split(openTag), function (code) {
                code = code.split(closeTag);

                var $0 = code[0];
                var $1 = code[1];

                // code: [html]
                if (code.length === 1) {

                    mainCode += html($0);

                } else {

                    // code: {body}
                    if (Template.REGEXP_MAIN_OPEN.test($0) && Template.REGEXP_MAIN_CLOSE.test($1)) {

                        mainCode += html(
                            $0.replace(Template.REGEXP_MAIN_OPEN, '{{{')
                        );

                        mainCode += html(
                            $1.replace(Template.REGEXP_MAIN_CLOSE, '}}}')
                        );

                        // code: [logic, html]
                    } else {

                        mainCode += logic($0);

                        if ($1) {
                            mainCode += html($1);
                        }

                    }
                }

            });

            var code = headerCode + mainCode + footerCode;

            // 调试语句
            if (debug) {
                code = "try{" + code + "}catch(e){"
                    +       "$line = $line || 0;"
                    +       "var $source = " + stringify(source) + ";"
                    +       "throw {"
                    +           "filename:$filename,"
                    +           "name:'Render Error',"
                    +           "message:e.message,"
                    +           "line:$line,"
                    +           "source:("
                    +             "$line"
                    +               "?$source.split(/\\n/)[$line-1]"
                    +               ":$source"
                    +           ").replace(/^\\s+/,'')"
                    +       "};"
                    + "}";
            }



            try {


                var Render = new Function("$data", "$filename", code);
                Render.prototype = self.utils;

                _.def(Render, '__tag_source__', tagSrc.map);

                return Render;

            } catch (e) {
                e.temp = "function anonymous($data,$filename) {" + code + "}";
                throw e;
            }

            // 处理注释内容
            function trimComment (source) {
                var _source = '';
                // 分离注释内容
                Template.each(source.split(Template.REGEXP_COMMENT_START), function (code) {
                    code = code.split(Template.REGEXP_COMMENT_END);

                    var $0 = code[0];
                    var $1 = code[1];

                    if (code.length === 1) {
                        _source += $0;
                    } else {
                        _source += $1;
                    }
                });
                return _source;
            }

            // 处理包含<script type="text/html"><script>标签的模板文本内容
            function trimTagSource (source) {
                var srcId = 0, srcMatches, srcMap, srcKey;
                while ((srcMatches = Template.REGEXP_TAG_SOURCE.exec(source)) != null) {
                    srcKey = '__TEMPLATE_TAG_SRC_' + srcId + '__';
                    srcMap = srcMap || {};
                    srcMap[srcKey] = srcMatches[0];
                    srcKey = '{{' + srcKey + '}}';
                    source = source.substring(0, srcMatches.index) + srcKey + source.substring(Template.REGEXP_TAG_SOURCE.lastIndex);
                    Template.REGEXP_TAG_SOURCE.lastIndex = srcMatches.index + srcKey.length + 1;
                    srcId ++;
                }
                return {source: source, map: srcMap};
            }

            // 处理 HTML 语句
            function html (code) {

                // 记录行号
                line += code.split(/\n/).length - 1;

                // 压缩多余空白与注释
                if (compress) {
                    code = code
                        .replace(/\s+/g, ' ')
                        .replace(/<!--[\w\W]*?-->/g, '');
                }

                if (code) {
                    code = replaces[1] + stringify(code) + replaces[2] + "\n";
                }

                return code;
            }


            // 处理逻辑语句
            function logic (code) {

                var thisLine = line;

                if (_.isFunction(parser)) {

                    // 语法转换插件钩子
                    code = self.parser(code, options);

                } else if (debug) {

                    // 记录行号
                    code = code.replace(/\n/g, function () {
                        line ++;
                        return "$line=" + line +  ";";
                    });

                }


                // 输出语句. 编码: <%=value%> 不编码:<%=#value%>
                // <%=#value%> 等同 v2.0.3 之前的 <%==value%>
                if (code.indexOf('=') === 0) {

                    var escapeSyntax = escape && !/^=[=#]/.test(code);

                    code = code.replace(/^=[=#]?|[\s;]*$/g, '');

                    // 对内容编码
                    if (escapeSyntax) {

                        var name = code.replace(/\s*\([^\)]+\)/, '');

                        // 排除 utils.* | include | print

                        if (!self.utils[name] && !/^(include|print)$/.test(name)) {
                            code = "$escape(" + code + ")";
                        }

                        // 不编码
                    } else {
                        code = "$string(" + code + ")";
                    }


                    code = replaces[1] + code + replaces[2];

                }

                if (debug) {
                    code = "$line=" + thisLine + ";" + code;
                }

                // 提取模板中的变量名
                Template.each(getVariable(code), function (name) {

                    // name 值可能为空，在安卓低版本浏览器下
                    if (!name || uniq[name]) {
                        return;
                    }

                    var value;

                    // 声明模板变量
                    // 赋值优先级:
                    // [include, print] > utils > helpers > data
                    if (name === 'print') {

                        value = print;

                    } else if (name === 'include') {

                        value = include;

                    } else if (self.utils[name]) {

                        value = "$utils." + name;

                    } else if (self.utils.$helpers[name]) {

                        value = "$helpers." + name;

                    } else {

                        value = "$data." + name;
                    }

                    headerCode += name + "=" + value + ",";
                    uniq[name] = true;


                });

                return code + "\n";
            }

            // 获取变量
            function getVariable (code) {
                return code
                    .replace(Template.REGEXP_OBJECT_KEY, "{'$1':")
                    .replace(Template.REGEXP_REMOVE, '')
                    .replace(Template.REGEXP_SPLIT, ',')
                    .replace(Template.REGEXP_KEYWORDS, '')
                    .replace(Template.REGEXP_NUMBER, '')
                    .replace(Template.REGEXP_BOUNDARY, '')
                    .split(Template.REGEXP_SPLIT2);
            }

            // 字符串转义
            function stringify (code) {
                return "'" + (
                        code == null ? '' : (code + "")
                    )
                    // 单引号与反斜杠转义
                    .replace(/('|\\)/g, '\\$1')
                    // 换行符转义(windows + linux)
                    .replace(/\r/g, '\\r')
                    .replace(/\n/g, '\\n') + "'";
            }

        },
        /**
         * 语法解析器
         * @param code
         * @param options
         * @returns {*}
         */
        parser: function(code, options) {

            options = options || this.__options__ || {};

            if (_.isFunction(options.parser)) {
                var _code;

                try {
                    _code = options.parser.apply(this.getContext() || this, arguments);
                } catch (e) {
                    Template.Event.trigger('Error',
                        this.makeError('callback', ["parser", e.message], e)
                    );
                    _code = code;
                }

                return _code;
            }

            // var match = code.match(/([\w\$]*)(\b.*)/);
            // var key = match[1];
            // var args = match[2];
            // var split = args.split(' ');
            // split.shift();

            code = code.replace(/^\s/, '');

            var split = code.split(' ');
            var key = split.shift();
            var args = split.join(' ');


            switch (key) {

                case 'if':

                    code = 'if(' + args + '){';
                    break;

                case 'else':

                    if (split.shift() === 'if') {
                        split = ' if(' + split.join(' ') + ')';
                    } else {
                        split = '';
                    }

                    code = '}else' + split + '{';
                    break;

                case '/if':

                    code = '}';
                    break;

                case 'each':

                    var object = split[0] || '$data';
                    var as     = split[1] || 'as';
                    var value  = split[2] || '$value';
                    var index  = split[3] || '$index';

                    var param   = value + ',' + index;

                    if (as !== 'as') {
                        object = '[]';
                    }

                    code =  '$each(' + object + ',function(' + param + '){';
                    break;

                case '/each':

                    code = '});';
                    break;

                case 'echo':

                    code = 'print(' + args + ');';
                    break;

                case 'print':
                case 'include':

                    code = key + '(' + split.join(',') + ');';
                    break;

                default:

                    // 过滤器（辅助方法）
                    // {{value | filterA:'abcd' | filterB}}
                    // >>> $helpers.filterB($helpers.filterA(value, 'abcd'))
                    // TODO: {{ddd||aaa}} 不包含空格
                    if (/^\s*\|\s*[\w\$]/.test(args)) {

                        var escape = true;

                        // {{#value | link}}
                        if (code.indexOf('#') === 0) {
                            code = code.substr(1);
                            escape = false;
                        }

                        var i = 0;
                        var array = code.split('|');
                        var len = array.length;
                        var val = array[i++];

                        for (; i < len; i ++) {
                            val = Template.filtered(val, array[i]);
                        }

                        code = (escape ? '=' : '=#') + val;

                        // 即将弃用 {{helperName value}}
                    } else if (this.utils.$helpers[key]) {

                        code = '=#' + key + '(' + split.join(',') + ');';

                        // 内容直接输出 {{value}}
                    } else {

                        code = '=' + code;
                    }

                    break;
            }


            return code;
        },
        makeError: function(id, option, originalError) {
            var errorMaker = this.__error_maker__, err;
            if (!errorMaker) {
                _.def(this, '__error_maker__', _.errorMaker(Template.Error, this.getContext()));
                errorMaker = this.__error_maker__;
            }
            err = errorMaker.apply(this, arguments);
            return err;
        }
    };

    Template.toString = function (value, type) {

        if (!_.isString(value)) {

            type = typeof value;
            if (type === 'number') {
                value += '';
            } else if (type === 'function') {
                value = Template.toString(value.call(value));
            } else {
                value = '';
            }
        }

        return value;

    };

    // 特殊字符映射
    Template.ESCAPE_MAP = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    };

    // 特殊字符编码
    Template.escapeFn = function (s) {
        return Template.ESCAPE_MAP[s];
    };

    // html文本编码
    Template.escapeHTML = function (content) {
        return Template.toString(content)
            .replace(/&(?![\w#]+;)|[<>"']/g, Template.escapeFn);
    };

    // 遍历
    Template.each = function (data, callback) {
        var i, len;
        if (_.isArray(data)) {
            for (i = 0, len = data.length; i < len; i++) {
                callback.call(data, data[i], i, data);
            }
        } else {
            for (i in data) {
                callback.call(data, data[i], i);
            }
        }
    };

    // 建立helper引用
    Template.filtered = function (js, filter) {
        var parts = filter.split(':');
        var name = parts.shift();
        var args = parts.join(':') || '';

        if (args) {
            args = ', ' + args;
        }

        return '$helpers.' + name + '(' + js + args + ')';
    };

    // 标准化数据
    Template.normalizeData = function(data) {

        if (_.notNull(data)) {
            if (_.isArray(data) || !_.isObject(data)) {
                data = {data: data};
            }
        } else {
            data = {};
        }

        return data;
    };

    /**
     * 获取远程模板文本内容
     * @param filepath  {String}    必选。模板地址
     * @param callback  {Function}  可选。回调函数，传入参数为 { [err] - 请求错误信息 }, { { filename: [模板（地址）名], source: [模板文本内容] } }
     *
     * @returns {Deferred.promise}  jquery延迟promise对象。done状态下的回调函数同callback
     */
    Template.remote = function(filepath, callback) {
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
                        callback.apply(this, arguments);
                        _.normalizeCallbackArgs(callback, arguments);
                    } catch (e) {
                        Template.Event.trigger('CallbackError',
                            self.makeError('callback', ['remote callback', e.message], e)
                        );
                    }
                });
            }

            var fileContent, options;

            if (self && self.__options__) {
                options = self.__options__;
            } else {
                options = Template.DEFAULTS;
            }

            if (options.cache && !_.isUndef(fileContent = Template.remoteCache[filepath])) {
                def.resolve(_.__undef__, {filename: filepath, source: fileContent});
            } else {
                var fileUrl = normalizeFileUrl(filepath);

                if (fileUrl.indexOf(ROOT_URL) == 0) {
                    filepath = fileUrl.substring(ROOT_URL.length - 1);
                } else {
                    filepath = fileUrl;
                }

                var ajax, ajaxOpt;

                if (options.remote) {
                    ajaxOpt = options.remote;
                } else {
                    ajaxOpt = Template.DEFAULTS.remote;
                }

                if (context.ajax instanceof Ajax) {
                    ajax = context.ajax;
                } else {
                    if (!Template.ajax) {
                        Template.ajax = new Ajax(Template.DEFAULTS.remote);
                    }
                    ajax = Template.ajax;
                }

                fileUrl = _.extend({}, ajaxOpt, {url: fileUrl});

                ajax.get(fileUrl, function(err, resp) {
                    if (err && _.isFunction(this.removeError)) {
                        this.removeError(err);
                    }
                    if (!err && !_.isUndef(resp)) {
                        fileContent = _.trim(resp);
                        // cache fileContent
                        if (options.cache) {
                            Template.remoteCache[fileUrl] = fileContent;
                        }
                    } else {
                        err = self.makeError('remote_error', [filepath], err)
                    }
                    def.resolve(err, {filename: filepath, source: fileContent});
                });
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

                filepath = filepath + (query ? '?' + query : '');

                return filepath;
            }

        })(def, filepath, callback, context);

        return def.promise();
    };

    Template.makeError = function () {
        return Template.Error.make.apply(Template.Error, arguments);
    };

    function __helper(name, fn) {
        name = _.trim(name);
        if (name && _.isFunction(fn)) {
            this[name] = fn;
        }
    }

    function __helpers(helpers) {
        if (_.notNull(helpers) && _.isObject(helpers)) {
            for (var key in helpers) {
                if (_.__hasOwn.call(helpers, key)) {
                    __helper.call(this, key, helpers[key]);
                }
            }
        }
    }

    function concatError(ctx, errs, err) {
        if (arguments.length < 3) {
            err = errs;
            errs = _.__undef__;
        }
        if (!_.isEmpty(err)) {
            if (_.notNull(ctx) && _.isFunction(ctx.addError)) {
                ctx.addError(err);
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
        return errs;
    }

    function reportError(ctx, errs, filter) {
        var _errs = sliceError(ctx, errs, filter);
        if (!_.isEmpty(_errs)) {
            Template.Event.trigger('Error', _errs);
        }
    }

    function sliceError(ctx, errs, filter) {
        var _errs;
        if (_.notNull(ctx) && _.isFunction(ctx.sliceError)) {
            _errs = ctx.sliceError(
                _.extend({
                    NS: Template.NAMESPACE
                }, filter)
            );
        } else {
            _errs = errs;
        }
        return _errs;
    }

    return Template;
});

define('yfjs/spa/util/template-helpers', ['./helpers'], function(_) {

    var JSON = _.JSON;

    return {
        trim: function(s) {
            return _.trim(s);
        },
        trimLeft: function(s) {
            return _.trimLeft(s);
        },
        trimRight: function(s) {
            return _.trimRight(s);
        },
        // types
        otype: function(o) {
            return _.otype(o);
        },
        is$: function(o) {
            return _.is$(o);
        },
        isUndef: function(o) {
            return _.isUndef(o);
        },
        eqNull: function(o) {
            return _.eqNull(o);
        },
        isNull: function(o) {
            return _.isNull(o);
        },
        notNull: function(o) {
            return _.notNull(o);
        },
        isNumber: function(o) {
            return _.isNumber(o);
        },
        isBoolean: function(o) {
            return _.isBoolean(o);
        },
        isString: function(o) {
            return _.isString(o);
        },
        isObject: function(o) {
            return _.isObject(o);
        },
        isPlainObject: function(o) {
            return _.isPlainObject(o);
        },
        isArray: function(o) {
            return _.isArray(o);
        },
        isFunction: function(o) {
            return _.isFunction(o);
        },
        isEmpty: function(o) {
            return _.isEmpty(o);
        },
        inArray: function(o, array) {
            return _.inArray(o, array);
        },
        // json
        stringify: function(o) {
            if (!_.notNull(o)) return '';
            if (!_.isObject(o)) return _.trim(o);
            return JSON.stringify(o);
        },
        parseJSON: function(os) {
            os = _.trim(os);
            if (!os.length) return {};
            return JSON.parse(os);
        }
    };
});
define('yfjs/spa/util/view', [
    '../version', './helpers', './event', './error', './widget'
], function(
    Version, _, Event, Error, Widget
) {

    var NAMESPACE = "View";

    var View = Widget({
        NAMESPACE : NAMESPACE,
        VERSION : Version(NAMESPACE),

        DEFAULTS : {
            /**
             * 当前 view 使用的布局 {String|Function}
             * - 相对于 layouts 目录
             * - 只有最上层的 view 的 layout 配置项起作用
             * - 为 Function 类型时获取返回结果。this 指针指向当前 view 的接口实例
             */
            layout: _.__undef__
        },

        CONTAINER_ID : "app-view",
        BIND_KEY     : "data-view",

        Event : Event(NAMESPACE),
        Error : Error(NAMESPACE),

        defaultState: function(state) {
            return state || {};
        }
    });

    View.Error.translate({
        'script_unfound': "加载 {0} 视图失败。找不到依赖文件或模块 {1}",
        'script_timeout': "加载 {0} 视图失败。依赖文件或模块 {1} 加载超时",
        'script_error': "加载 {0} 视图失败。文件 {1} 存在错误：{2}",
        'script_invalid_return': "加载 {0} 视图失败。视图文件 {1} 必须明确返回视图实例",
        'callback': "执行 {0} 视图的 {1} 时发生了错误: {2}",
        'style_unfound': "视图 {0} 错误。{1}",
        'load_fail': "加载 {0} 视图失败。{1}"
    });

    View.Error.translate(
        'setter',
        "视图 {0} 设置错误。无法设置实例属性 {1}，因为它是视图实例的固有属性"
    );

    View.Error.translate(
        'include_limit',
        "视图 {0} 模板引入错误。引入 {1} 时超过最大引入层数（" + Widget.INCLUDE_LEVEL_LIMIT +"）限制"
    );

    return View;
});
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
                                    _.def(resLoad.getInstance(), 'context', context);
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
                    Widget.updateState.call(included.getInstance(), 'dispose');
                    included.ajax.abort(false);
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
            _.def(this, 'context', widget.CONTEXT || this, {
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