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