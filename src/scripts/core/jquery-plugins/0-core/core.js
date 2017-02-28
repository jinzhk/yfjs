/*!
 * check jquery plugin & version >= 1.9.1
 */
if (typeof jQuery === 'undefined') {
    throw new Error('This JavaScript Lib requires jQuery')
}
+function ($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
        throw new Error('This JavaScript Lib requires jQuery version 1.9.1 or higher')
    }
    /**
     * parse all form field elements into an object
     *
     * { name1: value1, name2: [value21, value22] }
     */
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        if(a) {
            $.each(a, function() {
                if(typeof this.name !== "undefined") {
                    if(typeof o[this.name] !== 'undefined') {
                        if($.isArray(o[this.name])) {
                            o[this.name].push(this.value);
                        } else {
                            o[this.name] = [o[this.name]].concat(this.value);
                        }
                    } else {
                        o[this.name] = this.value;
                    }
                }
            });
        }
        a = null;
        return o;
    };
    /**
     * 将一个param字符串或一个url中的query部分的参数转换为JSON对象（$.param方法的逆向处理）
     * Turns a params string or url into an array of params
     *
     * example:
     * 		file.js?a=1&b[c]=3.0&b[d]=four&a_false_value=false&a_null_value=null
     * return:
     * 		{"a":1,"b":{"c":3,"d":"four"},"a_false_value":false,"a_null_value":null}
     *
     * example:
     * 		file.js?a[b]=1&a[c]=2&d[]=3&d[]=4&d[2][e]=5
     * return:
     *      {"a":{"b":1,"c":2},"d":[3,4,{"e":5}]}
     */
    $.parseQuery = function(queryString) {
        // Prepare
        var params = String(queryString);
        // Remove url if need be
        params = params.substring(params.indexOf('?')+1);
        // params = params.substring(params.indexOf('#')+1);
        // Change + to %20, the %20 is fixed up later with the decode
        params = params.replace(/\+/g, '%20');
        // Do we have JSON string
        if ( likeJSON(params) ) {
            // We have a JSON string
            try {
                return eval(decodeURIComponent(params));
            } catch (e) {
                // not a valid json string
            }
        }
        // We have a params string
        params = params.split(/\&(amp\;)?/);
        var objRegExp = new RegExp('\\[([^\\]]*)\\]', "g"),
            digitRegExp = /^\d+$/,
            numberRegExp = /^\s*\d*(\.\d*)?\s*$/;
        var json = {}, posEq;
        // We have params
        for ( var i = 0, n = params.length; i < n; ++i ) {
            // Adjust
            var param = params[i] || null;
            if ( param === null ) { continue; }
            // 兼容处理 "key=val" 和 "key=val?key1=val"(val是一个带参数的url) 的情况
            posEq = param.indexOf('=');
            if (posEq < 0) {
                param = [param];
            } else {
                param = [
                    param.substring(0, posEq),
                    param.substring(posEq + 1)
                ];
            }
            // ^ We now have "var=blah" into ["var","blah"]

            // Get
            var key = param[0] || null;
            if ( key === null ) { continue; }
            if ( typeof param[1] === 'undefined' ) { continue; }
            var value = param[1];
            // ^ We now have the parts

            // Fix
            key = decodeURIComponent(encodeURIComponent(key));
            value = decodeURIComponent(encodeURIComponent(value));

            // Parse
            var trimVal = typeof value === 'string' ? value.replace(/(^\s*)|(\s*$)/g, '') : value;
            if (
                // number
                numberRegExp.test(trimVal)
                // true|false
                || trimVal === "true" || trimVal === "false"
                // json string
                || likeJSON(trimVal)
                // array string
                || likeArray(trimVal)
            ) {
                try {
                    // value can be converted
                    value = eval(trimVal);
                } catch ( e ) {
                    // value is a normal string
                }
            }

            // 消除eval时执行document.getElementById方法返回DOM的问题
            if (typeof value === "object" && value.nodeType != null) {
                if (value.nodeType == 3) {
                    value = value.nodeValue;
                } else {
                    value = decodeURIComponent(encodeURIComponent(param[1]));
                }
            }

            // Set
            // check key likes a or a[b]
            var keys = objRegExp.exec(key);
            if ( keys == null ) {
                // Simple
                json[key] = value;
            } else {
                var keyLastIndex = objRegExp.lastIndex;
                // extract key a[b] to a
                var keyOuter = key.replace(objRegExp, "");
                // recreating object
                objRegExp.lastIndex = keyLastIndex;
                var valueObj = json, keyInner;
                while (keys != null) {
                    keyInner = keys[1];
                    try {
                        if (keyInner != "") {
                            if (digitRegExp.test(keyInner)) {
                                keyInner = eval(keyInner);
                            }
                        } else {
                            keyInner = -1;
                        }
                    } catch ( e ) {
                        // keyInner is a normal string
                    }
                    if (typeof valueObj[keyOuter] === "undefined") {
                        if (typeof keyInner === "string") {
                            valueObj[keyOuter] = {};
                        } else {
                            valueObj[keyOuter] = [];
                            if (keyInner == -1) {
                                keyInner = 0;
                            }
                        }
                    } else if ($.isArray(valueObj[keyOuter])) {
                        // fixed a[0][b]
                        if (keyInner == -1) {
                            keyInner = valueObj[keyOuter].length;
                        }
                    }
                    valueObj = valueObj[keyOuter];
                    keyOuter = keyInner;
                    keys = objRegExp.exec(key);
                    if (keys == null) {
                        valueObj[keyOuter] = value;
                    }
                }
            }
            // ^ We now have the parts added to your JSON object
        }
        return json;
    };

    function likeJSON(s) {
        return /^\{/.test(s) && /\}$/.test(s);
    }

    function likeArray(s) {
        return /^\[/.test(s) && /\]$/.test(s);
    }
}(jQuery);