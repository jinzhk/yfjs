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
                                            bodyHtml = wrapIncluded('{{#'+bodyKey+'}}');
                                        } else {
                                            bodyHtml = wrapIncluded('');
                                        }
                                        try {
                                            rendered = rendered.replace(
                                                new RegExp('\\{\\{#' + bodyKey + '\\}\\}', "g"), bodyHtml
                                            );
                                        } catch (e) {
                                            bodyKey = '{{# ' + bodyKey + '}}';
                                            var pos;
                                            while ((pos = rendered.indexOf(bodyKey)) > -1) {
                                                rendered = rendered.substring(0, pos) + bodyHtml + rendered.substring(pos + bodyKey.length);
                                            }
                                        }
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

                    // code: [logic, html]
                } else {

                    mainCode += logic($0);

                    if ($1) {
                        mainCode += html($1);
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
