/*!
 * check jquery plugin & version >= 1.9.1
 */
if (typeof jQuery === 'undefined') {
    throw new Error('This JavaScript Lib requires jQuery')
}
(function ($) {
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

})(jQuery);

/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */
(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

})(jQuery);
