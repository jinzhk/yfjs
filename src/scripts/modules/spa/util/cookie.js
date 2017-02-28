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
