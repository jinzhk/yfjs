
/*
 * Fuel UX Loader V3.6.3
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the BSD New license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// For more information on UMD visit:
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

/*
 * Updated by jinzhk @ 2015-05-06
 * 1、模块写法直接改为了jquery插件形式
 * 2、初始化方式改为了bootstrap风格
 * 3、去除了fu标记
 * Updated by jinzhk @ 2016-11-02
 * 默认支持动画
 * Updated by jinzhk @ 2016-11-08
 * 完善了动画样式重写逻辑
 */

;(function ($) {

    // LOADER CONSTRUCTOR AND PROTOTYPE

    var Loader = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.loader.defaults, options);

        this.begin = (this.$element.is('[data-begin]')) ? parseInt(this.$element.attr('data-begin'), 10) : 1;
        this.delay = (this.$element.is('[data-delay]')) ? parseFloat(this.$element.attr('data-delay')) : 150;
        this.end = (this.$element.is('[data-end]')) ? parseInt(this.$element.attr('data-end'), 10) : 8;
        this.frame = (this.$element.is('[data-frame]')) ? parseInt(this.$element.attr('data-frame'), 10) : this.begin;
        this.isIElt9 = false;
        this.timeout = {};

        var ieVer = this.msieVersion();
        if (ieVer !== false && ieVer < 9) {
            this.$element.addClass('iefix');
            this.isIElt9 = true;
        }

        this.play();

        this.$element.attr('data-frame', this.frame + '');
    };

    Loader.STYLE_ID = 'loader-styles';

    Loader.prototype = {

        constructor: Loader,

        destroy: function () {
            clearStyle();
            this.$element.remove();
            // any external bindings
            // [none]
            // empty elements to return to original markup
            // [none]
            // returns string of markup
            return this.$element[0].outerHTML;
        },

        ieRepaint: function () {
            if (this.isIElt9) {
                this.$element.addClass('iefix_repaint').removeClass('iefix_repaint');
            }
        },

        msieVersion: function () {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
            } else {
                return false;
            }
        },

        next: function () {
            this.frame++;
            if (this.frame > this.end) {
                this.frame = this.begin;
            }

            this.$element.attr('data-frame', this.frame + '');
            this.ieRepaint();
        },

        pause: function () {
            if ($.support.transition) {
                var duration = (this.delay * 7) + "ms";
                initStyle({
                    '-webkit-animation-duration': duration,
                    '-webkit-animation-play-state': "paused",
                    'animation-duration': duration,
                    'animation-play-state': "paused"
                });
            } else {
                clearTimeout(this.timeout);
            }
        },

        play: function () {
            if ($.support.transition) {
                var duration = (this.delay * 7) + "ms";
                initStyle({
                    '-webkit-animation-duration': duration,
                    '-webkit-animation-play-state': "running",
                    'animation-duration': duration,
                    'animation-play-state': "running"
                });
            } else {
                var self = this;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    self.next();
                    self.play();
                }, this.delay);
            }
        },

        previous: function () {
            this.frame--;
            if (this.frame < this.begin) {
                this.frame = this.end;
            }

            this.$element.attr('data-frame', this.frame + '');
            this.ieRepaint();
        },

        reset: function () {
            this.frame = this.begin;
            this.$element.attr('data-frame', this.frame + '');
            this.ieRepaint();
        }
    };

    function initStyle(styles) {
        styles = styles || {};
        var styleHtml = '';
        for (var key in styles) {
            if (!styleHtml) {
                styleHtml = '.loader:after{';
            }
            styleHtml += (key + ': ' + styles[key] + ';');
        }
        if (styleHtml) {
            styleHtml += '}';
        }
        if (styleHtml) {
            var $style = $('#' + Loader.STYLE_ID);
            if (!$style.length) {
                $style = $('<style id="'+Loader.STYLE_ID+'" type="text/css"></style>');
                $style.text(styleHtml);
                $('head').append($style);
            } else {
                $style.text(styleHtml);
            }
        }
    }

    function clearStyle() {
        var $style = $('#' + Loader.STYLE_ID);
        if ($style.length) {
            $style.remove();
        }
    }

    // LOADER PLUGIN DEFINITION

    $.fn.loader = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        var methodReturn;

        var $set = this.each(function () {
            var $this = $(this);
            var data = $this.data('loader');
            var options = typeof option === 'object' && option;

            if (!data) {
                var $loader = $this;
                if (!$this.is(".loader")) {
                    $loader = $($this.is('ul,ol') ? '<li class="loader"></li>' : '<div class="loader"></div>');
                    $this.is('[data-begin]') && $loader.attr('data-begin', $this.attr('data-begin'));
                    $this.is('[data-delay]') && $loader.attr('data-delay', $this.attr('data-delay'));
                    $this.is('[data-end]') && $loader.attr('data-end', $this.attr('data-end'));
                    $this.is('[data-frame]') && $loader.attr('data-frame', $this.attr('data-frame'));
                    $this.append($loader);
                }
                $this.data('loader', (data = new Loader($loader[0], options)));
            }

            if (typeof option === 'string') {
                methodReturn = data[option].apply(data, args);
            }
        });

        return (methodReturn === undefined) ? $set : methodReturn;
    };

    var old = $.fn.loader;

    $.fn.loader.defaults = {};

    $.fn.loader.Constructor = Loader;

    $.fn.loader.noConflict = function () {
        $.fn.loader = old;
        return this;
    };

    // INIT LOADER ON DOMCONTENTLOADED

    $(window).on('load', function () {
        $('[data-spy="loader"]').each(function () {
            var $this = $(this);
            if (!$this.data('loader')) {
                $this.loader($this.data());
            }
        });
    });

})(jQuery);
