/* ========================================================================
 * Bootstrap: modal.js v3.3.4
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* =========================================================
 * Updated by 靳志凯 @ 2015-04-21
 * 1、为便于作为模块调用，将之改为AMD模块式写法
 *
 * Updated by 靳志凯 @ 2015-05-06
 * 1、版本号更改为v3.3.4_x1
 * 2、改写了backdrop属性设置方式，使支持自定义遮罩层颜色和透明度，如['#fff', '0.5']
 * 3、backdrop设置为有效的数组时，点击backdrop后将等同于'static'，不关闭当前Modal
 * 4、添加了弹出框位置(position)设置
 *    设置规则为字符串"{左位置} {上位置}"或数组[{左位置}, {上位置}]，
 *    {左位置}可设为left|center|right三者之一，{上位置}可设为top|center|bottom三者之一，此时左位置和上位置顺序可任意
 *    另{左位置}和{上位置}亦可设为百分比字符串值（如"15%"）、px/em单位字符串值(如"200px"或"200em")、数字（如200，单位默认为px）
 *    若{左位置}和{上位置}值相等，则可简写为"[左&上位置]"，如"center center"或["center","center"]可简写为"center"或["center"]，"200 200px"可简写为["200"]或者["200px"]等
 *    默认值为"center"（居中）
 *
 * Updated by 靳志凯 @ 2015-06-11
 * 1、dialog中添加了配置项defdom，设为false将不再生成header、body和footer
 * 2、loader更名为loading，一般用于整个页面内容的加载。完善了相关接口功能，支持自定义加载图片
 * 3、完善了dialog下的warning、error（原danger）、success方法，添加了等效的info方法
 * 4、添加了processing方法，用于显示操作处理过程的提示
 *
 * Updated by 靳志凯 @ 2015-06-12
 * 1、完善了Dialog.configDefaultOptions方法，使支持批量设置其下的各种类型弹出框的默认设置，如
 *    Dialog.configDefaultOptions('loading', [options])
 *    或
 *    Dialog.configDefaultOptions(['info','warning','error','success'], [options])
 *
 * Updated by 靳志凯 @ 2015-06-29
 * 1、当backdrop设为 false|null|"" 等非有效值时，弹出框将作为非modal（模态）框显示
 * 2、调整了remote配置项，使支持异步加载数据并渲染弹出框内容
 *    {string} 请求页面，响应内容直接添加至弹出框内
 *    {object} 异步请求配置，除$.ajax可传入配置参数（async配置false无效，只支持异步）外，另可传入loader和callback
 *              loader: {string|object} 加载中效果
 *                      若为string，将作为自定义图片或class类名
 *                      若为object，将使用默认加载效果，默认加载效果支持以下配置
 *                      {
 *                        size       : {number} 加载区域的大小，默认32，默认单位像素(px)
 *                        beginFrame : {number} 加载效果起始标记的位置，[1-8]
 *                        delay      : {number} 加载延迟，默认150，默认单位毫秒(ms)
 *                      }
 *              callback: {function} 异步请求后的回调，fn(response, status, xhr)
 *                        当前上下文(this)是remote配置项
 *                        remote: {
 *                          renderTo     : {jQuery对象} 弹出框内容区域
 *                          loader       : {jQuery对象} 加载效果dom
 *                          context      : {Object} 当前弹出框对象
 *                          ajaxSettings : {Object} 异步请求配置
 *                        }
 *                        返回值将渲染至弹出框内，若未返回任何内容，需手动渲染
 *    {jqXHR} jQuery异步请求对象，此时需监控事件'loaded.bs.modal', 在事件回调中手动渲染弹出框内容
 *            如：
 *            {modal对象}.on('loaded.bs.modal', function(e) {
 *              // { response: xxx, status: xxx, xhr: xxx}
 *              var loadedData = $(this).data('loaded.bs.modal');
 *            })
 *
 * Updated by 靳志凯 @ 2015-07-02
 * 1、position设置支持 r|b前缀形式，即 rxxx 和 bxxx 分别对 距右侧距离 和 距底部距离 进行设置
 * 2、添加了事件'realized.bs.modal'，监控弹出框已准备好弹出的事件（此时弹出框大小、位置等均已初始化）
 *
 * Updated by 靳志凯 @ 2015-07-03
 * 当body的overflow-y初始为hidden时，滚动条宽度计算将返回0
 *
 * Updated by 靳志凯 @ 2015-07-04
 * 左侧position设为r开头的有效值或右侧position设为b开头的有效值时动画显示效果等同于分别设为'right'和'bottom'了
 *
 * Updated by 靳志凯 @ 2016-11-04
 * 添加了 dispose 方法，用以销毁弹出框且不再调用 onhide 和 onhidden 回调方法
 *
 * Updated by 靳志凯 @ 2016-11-09
 * 修复了通过 dispose 销毁的 note 类型的弹出框实例无法正常销毁的问题
 *
 * Updated by 靳志凯 @ 2017-01-13
 * alert形式的弹出框的"确定"按钮添加了 btn-primary 样式
 *
 * Updated by 靳志凯 @ 2017-01-25
 * 完善了 message 配置项处理，message 配置项为 Promise 对象时，同 remote 设置
 * 
 * Updated by 靳志凯 @ 2017-04-24
 * 1. 对按钮添加了默认的防抖处理（间隔时间内只会响应一次点击事件）
 * 2. 模态框属性 BUTTON_CLICK_TIMEOUT 可设置防抖处理间隔时间（默认为 1s），另可以为按钮添加配置项 clickTimeout，以设置某个按钮的防抖处理间隔时间（单位 ms）
 * 3. 模态框实例 dialog 添加了禁用按钮和启用按钮方法（disableButton() 和 enableButton()，按钮禁用状态下将不响应 action 回调）
 * 4. 按钮的 action 回调若返回了一个 Promise/Ajax 对象，则自动禁用按钮并在 Promise 对象执行 resolve 或 Ajax 请求返回后启用按钮
 * =========================================================
 */

define(['jquery'], function ($) {
    'use strict';

    var oType = function(o) {
        switch (typeof o) {
            case 'undefined':
            case 'number':
            case 'string':
            case 'boolean':
            case 'function':
                return typeof o;
            default:
                break;
        }
        if (o instanceof $) {
            return 'jquery';
        }
        return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
    };

    var isObject = function(o) {
        return oType(o) === "object";
    };

    /**
     * 判断是否是纯粹的对象（即通过字面量或Object类或自定义类（构造器）创建的对象）
     * @param o
     * @returns {boolean}
     */
    var isPlainObject = function(o) {
        return o !== null && typeof(o) === "object" && 'isPrototypeOf' in o && oType(o) === "object";
    };

    var isImageSrc = function(src) {
        return typeof src === "string" && /\.(gif|png|jpg|jpeg|bmp)]$/i.test(src);
    };

    var is$ = function (o) {
        return o && o instanceof $;
    };

    var isDom = function(o) {
        var type = oType(o);
        return type === "window" || type === "global" || o === window || type === "htmldocument" || o === document || /^html(\w+)element$/.test(type);
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

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function (element, options) {
        this.options             = $.extend({}, Modal.DEFAULTS, options);
        this.$win                = $(window);
        this.$body               = $(document.body);
        this.$element            = $(element);
        this.$dialog             = this.$element.find('.modal-dialog');
        this.$backdrop           = null;
        this.isShown             = null;
        this.originalBodyPad     = null;
        this.scrollbarWidth      = 0;
        this.ignoreBackdropClick = false;

        this.position            = null;
        this.relatedDialog       = options ? (options.relatedDialog || null) : null;
        this.showDeferred        = $.Deferred();

        this.remote              = this.remoteOptions();

        this.bodyLocked          = false;

        this.isDispose           = false;

        // init position
        if($.isArray(this.options.position)) {
            this.options.position = this.options.position.join(' ');
        }
        if(typeof this.options.position === "string") {
            this.options.position = $.trim(this.options.position);
            this.options.position = this.options.position.replace(/\s+/g, " ");
            this.options.position = this.options.position.replace(/^(bottom|top)\s(left|right)$/, "$2 $1");
            this.options.position = this.options.position.split(" ");
        }
        if($.isArray(this.options.position)) {
            if(this.options.position.length == 0) {
                this.options.position[0] = this.options.position[1] = "center";
            } else if (this.options.position.length < 2) {
                this.options.position[1] = this.options.position[0];
            }
        } else {
            this.options.position = ['center', 'center'];
        }
    };

    Modal.VERSION  = '3.3.4_x1';

    Modal.TRANSITION_DURATION = 300;
    Modal.BACKDROP_TRANSITION_DURATION = 150;

    Modal.ORIGINAL_BODY_OVERFLOW_X = $(document.body).css('overflow-x');
    Modal.ORIGINAL_BODY_OVERFLOW_Y = $(document.body).css('overflow-y');

    Modal.DEFAULTS = {
        position: "center",
        backdrop: true,
        keyboard: true,
        show: true
    };

    Modal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    };

    Modal.prototype.show = function (_relatedTarget) {
        var that = this;
        var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

        this.$element.trigger(e);

        if (this.isShown || e.isDefaultPrevented()) return;

        this.isShown = true;

        this.checkScrollbar();
        this.setScrollbar();

        this.lockBody();

        this.escape();
        this.resize();

        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

        this.$dialog.on('mousedown.dismiss.bs.modal', function () {
            that.$element.one('mouseup.dismiss.bs.modal', function (e) {
                if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
            })
        });

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade');

            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body); // don't move modals dom position
            }

            // init animate position
            if(that.options.position[0] === 'left') {
                that.$backdrop ?
                    that.$dialog.addClass('left') :
                    that.$element.addClass('left');
            } else if(that.options.position[0] === 'right' || /^\s*r\d+(\.\d+)?(px|r?em|%)?\s*$/.test(that.options.position[0])) {
                that.$backdrop ?
                    that.$dialog.addClass('right') :
                    that.$element.addClass('right');
            }
            if(that.options.position[0] === 'top') {
                that.$backdrop ?
                    that.$dialog.addClass('top') :
                    that.$element.addClass('top');
            } else if(that.options.position[1] === 'bottom' || /^\s*b\d+(\.\d+)?(px|r?em|%)?\s*$/.test(that.options.position[1])) {
                that.$backdrop ?
                    that.$dialog.addClass('bottom') :
                    that.$element.addClass('bottom');
            }

            that.handleRemote(_relatedTarget);

            that.$element
                .show()
                .scrollTop(0);

            that.adjustDialog();

            that.adjustPosition();

            that.$element.trigger($.Event('realized.bs.modal'));

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
                .attr('aria-hidden', false);

            if(that.$backdrop) {
                that.$element.addClass('in')
            } else {
                setTimeout(function() {
                    that.$element.addClass('in')
                }, 200)
            }

            that.enforceFocus();

            var onShown = function() {
                that.showDeferred.resolve();
                if(!that.$backdrop) {
                    // 非modal模式
                    that.releaseBody();
                    that.resetScrollbar();
                }
                var messageOpt = that.relatedDialog ? that.relatedDialog.options.message : that.options.message;
                if (!isPromise(messageOpt)) {
                    var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });
                    that.$element.trigger('focus').trigger(e);
                }
            };

            transition ?
                that.$dialog // wait for modal to slide in
                    .one('bsTransitionEnd', onShown)
                    .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                onShown();
        })
    };

    Modal.prototype.hide = function (e) {
        if (e) e.preventDefault();

        this.isDispose = (e === false);

        if (this.relatedDialog) {
            this.relatedDialog.isDispose = this.isDispose;
        }

        e = $.Event('hide.bs.modal');

        this.$element.trigger(e);

        if (!this.isShown || e.isDefaultPrevented()) return;

        this.isShown = false;

        if(!this.$backdrop) {
            // 非modal模式
            this.checkScrollbar();
            this.setScrollbar();
            this.lockBody();
        }

        this.escape();
        this.resize();

        $(document).off('focusin.bs.modal');

        this.$element
            .removeClass('in')
            .attr('aria-hidden', true)
            .off('click.dismiss.bs.modal')
            .off('mouseup.dismiss.bs.modal');

        this.$dialog.off('mousedown.dismiss.bs.modal');

        var that = this;

        var onHidden = function() {
            that.hideModal();
        };

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
                .one('bsTransitionEnd', onHidden)
                .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
            onHidden()
    };

    Modal.prototype.remoteOptions = function(options) {
        options = options || this.options;
        var remoteDefaults = {
            url: null,
            data: null,
            callback: null,
            promise: null,
            loader: {
                size: 32,
                beginFrame: 1,
                delay: 150
            }
        };
        var remote = null;
        if (options.remote) {
            if(typeof options.remote === "function") {
                options.remote = options.remote(this.relatedDialog || this);
            }
            if(typeof options.remote === "string") {
                remote = $.extend({}, remoteDefaults, {url: options.remote});
            } else if(isPromise(options.remote)) {
                remote = $.extend({}, remoteDefaults, {promise: options.remote});
            } else if(options.remote && options.remote.url != null) {
                remote = $.extend({}, remoteDefaults, options.remote);
                if(isPlainObject(options.remote.loader)) {
                    remote.loader = $.extend({}, remoteDefaults.loader, options.remote.loader);
                }
            }
        } else {
            var messageOpt = this.relatedDialog ? this.relatedDialog.options.message : options.message;
            if (isPromise(messageOpt)) {
                remote = $.extend({}, remoteDefaults, {promise: messageOpt});
            }
        }
        if(remote != null) {
            remote.renderTo = this.$element.find('.modal-body:first');
            remote.renderTo.length <= 0 && (remote.renderTo = this.$dialog);

            var $loader;
            if(remote.loader && typeof remote.loader === "string") {
                if(isImageSrc(remote.loader)) {
                    $loader = $('<div class="loader"><img src="'+remote.loader+'" alt="Loading..."/></div>');
                } else {
                    $loader = $('<div class="'+remote.loader+'"></div>');
                }
            } else {
                $loader = $('<div class="loader" data-frame="'+remote.loader.beginFrame+'" data-delay="'+remote.loader.delay+'"></div>').css({ margin: '0 auto' });
                if(typeof remote.loader.size !== "number" || remote.loader.size <= 0) {
                    remote.loader.size = remoteDefaults.loader.size;
                }
                $loader.css({
                    fontSize: remote.loader.size + 'px',
                    width: remote.loader.size + 'px',
                    height: remote.loader.size + 'px'
                });
            }
            remote.loader = $loader;

            remote.context = this.relatedDialog || this;

            var ajaxExcludes = ['callback', 'loader', 'renderTo', 'context', 'promise'],
                ajaxSettings = $.extend({}, remote);

            for(var i in ajaxExcludes) {
                var optName = ajaxExcludes[i];
                delete ajaxSettings[optName];
            }

            for(var index in remote) {
                if($.inArray(index, ajaxExcludes) == -1) {
                    delete remote[index];
                }
            }

            if(ajaxSettings.url) {
                remote.ajaxSettings = $.extend({}, ajaxSettings, {
                    async: true,
                    relatedContext: this,
                    beforeSend: function(xhr, settings) {
                        var modal = settings.relatedContext;
                        try {
                            modal.remote.renderTo.empty().append(modal.remote.loader);
                            if(modal.remote.loader.is(".loader") && modal.remote.loader.attr('data-frame')) {
                                modal.remote.loader.loader();
                            }
                        } catch (e) {}
                        typeof modal.remote.beforeSend === "function" && modal.remote.beforeSend.call(modal.remote, xhr, settings);
                    }
                });
            }
        }
        return remote;
    };

    Modal.prototype.handleRemote = function(_relatedTarget) {
        var that = this;
        var remoteHandler = function() {
            var args = arguments[0], responses = [], status, response, xhr;
            if (args) {
                if ($.isArray(args)) {
                    if (args.length == 3 && args[2].always) {
                        responses.push(args[0]);
                        status   = args[1];
                        xhr      = args[2];
                    } else {
                        $.each(args, function(i, arg) {
                            if($.isArray(arg) && arg.length == 3 && arg[2].always) {
                                responses.push(arg[0]);
                            } else {
                                responses.push(arg);
                            }
                        });
                        if(responses.length > 0) {
                            status = "success";
                            $.each(args, function(i, arg) {
                                !xhr && (xhr = []);
                                if ($.isArray(arg) && arg.length == 3 && arg[2].always) {
                                    xhr.push(arg[2]);
                                } else {
                                    xhr.push(undefined);
                                }
                            });
                        } else {
                            status   = arguments[1] || "error";
                            response = arguments[0];
                            xhr      = arguments[2];
                        }
                    }
                } else {
                    response = args;
                }
            } else {
                status   = arguments[1] || "error";
                response = arguments[2];
                xhr      = arguments[0];
            }
            var modal = this.relatedContext || that,
                renderHtml = responses.length ? responses.join('<br/>') : response;
            if(modal.remote) {
                modal.remote.resolve = function() {
                    if(modal.remote.loader.is(".loader") && modal.remote.loader.attr('data-frame')) {
                        modal.remote.loader.loader('destroy');
                    }
                    modal.remote.resolve = $.noop();
                };
                modal.remote.resolve();
                if(typeof modal.remote.callback === "function") {
                    renderHtml = modal.remote.callback.call(modal.remote, responses.length ? responses : response, status, xhr);
                }
                if(renderHtml) {
                    if (that.relatedDialog) {
                        renderHtml = that.relatedDialog.formatStringContent(renderHtml);
                    }
                    modal.remote.renderTo.empty().append(renderHtml);
                }
            }
            modal.adjustPosition();
            var messageOpt = that.relatedDialog ? that.relatedDialog.options.message : that.options.message;
            if (isPromise(messageOpt)) {
                var evtShown = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });
                that.$element.trigger('focus').trigger(evtShown);
            }
            var evtLoaded = $.Event('loaded.bs.modal');
            modal.$element.data('loaded.bs.modal', { remote: modal.remote, response: responses.length ? responses : response, status: status, xhr: xhr }).trigger(evtLoaded);
        };
        if (this.remote) {
            if (this.remote.promise || this.remote.ajaxSettings) {
                this.remote.renderTo.empty().append(this.remote.loader);
                if(this.remote.loader.is(".loader") && this.remote.loader.attr('data-frame')) {
                    this.remote.loader.loader();
                }
                if (this.remote.promise) {
                    $.when(this.remote.promise, this.showDeferred).always(remoteHandler);
                } else if(this.remote.ajaxSettings) {
                    $.when($.ajax(this.remote.ajaxSettings), this.showDeferred).always(remoteHandler);
                }
            }
        }
    };

    Modal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.bs.modal') // guard against infinite focus loop
            .on('focusin.bs.modal', $.proxy(function (e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    };

    Modal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.bs.modal')
        }
    };

    Modal.prototype.resize = function () {
        if (this.isShown) {
            $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
        } else {
            $(window).off('resize.bs.modal')
        }
    };

    Modal.prototype.lockBody = function() {
        this.$body.addClass('modal-open');
        if(!this.$backdrop) {
            this.$body.css('overflow-y') !== "hidden" && this.$body.css('overflow-y', "hidden");
            this.$body.css('overflow-x') !== "hidden" && this.$body.css('overflow-x', "hidden");
        }
        this.bodyLocked = true;
    };

    Modal.prototype.releaseBody = function() {
        this.$body.removeClass('modal-open');
        if(!this.$backdrop) {
            this.$body.css('overflow-x', Modal.ORIGINAL_BODY_OVERFLOW_X);
            this.$body.css('overflow-y', Modal.ORIGINAL_BODY_OVERFLOW_Y);
        }
        this.bodyLocked = false;
    };

    Modal.prototype.hideModal = function () {
        var that = this;
        this.$element.hide();
        this.backdrop(function () {
            that.releaseBody();
            that.resetAdjustments();
            that.resetScrollbar();
            that.$element.trigger('hidden.bs.modal')
        })
    };

    Modal.prototype.removeBackdrop = function () {
        if(this.$backdrop) {
            var $style = this.$backdrop.data('in-style');
            $style && $style.remove();
            $style = null;
            this.$backdrop.removeData('in-style');
            this.$backdrop.remove();
        }
        this.$backdrop = null
    };

    Modal.prototype.backdrop = function (callback) {
        var that = this;
        var animate = this.$element.hasClass('fade') ? 'fade' : '';

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                .appendTo(this.$body);

            this.injectBackdropStyle();

            this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
                if (this.ignoreBackdropClick) {
                    this.ignoreBackdropClick = false;
                    return
                }
                if (e.target !== e.currentTarget) return;
                this.options.backdrop == 'static' || ($.isArray(this.options.backdrop) && this.options.backdrop.length)
                    ? this.$element[0].focus()
                    : this.hide()
            }, this));

            if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

            this.$backdrop.addClass('in');

            if (!callback) return;

            doAnimate ?
                this.$backdrop
                    .one('bsTransitionEnd', callback)
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in');

            var callbackRemove = function () {
                that.removeBackdrop();
                callback && callback()
            };
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                    .one('bsTransitionEnd', callbackRemove)
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callbackRemove()

        } else {
            typeof callback === "function" && callback()
        }
    };

    Modal.prototype.injectBackdropStyle = function() {
        if(this.$backdrop && $.isArray(this.options.backdrop) && this.options.backdrop.length) {
            // inject backdrop style when backdrop option is array
            this.$backdrop.css('background-color', this.options.backdrop[0]);
            var opacity;
            if(this.options.backdrop[1] && !isNaN(opacity = parseFloat(this.options.backdrop[1])) && (opacity > 0 && opacity <= 1)) {
                var $style = $('<style type="text/css"></style>');
                this.$backdrop.data('in-style', $style);
                $style.text('.modal-backdrop.in{filter:alpha(opacity='+(opacity*100)+');opacity:'+opacity+'}');
                $style.insertBefore(this.$backdrop);
            }
        }
    };

    // these following methods are used to handle overflowing modals

    Modal.prototype.handleUpdate = function () {
        this.adjustDialog();
        this.adjustPosition();
    };

    Modal.prototype.adjustDialog = function () {
        if(!this.$backdrop) {
            // 非modal模式
            var dialogW = this.$dialog.outerWidth();
            this.$element.attr('aria-backdropedby', "false").css('padding', 0).width(dialogW);
        } else {
            // modal模式
            var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

            this.$element.css({
                paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
                paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
            });

            this.$element.removeAttr('aria-backdropedby');
        }
    };

    Modal.prototype.adjustPosition = function() {
        // update dialog size
        this.relatedDialog && this.relatedDialog.updateSize();
        // reset position
        !this.position && (this.position = []);
        var that = this;
        var wrapperW = this.$backdrop ?
                this.$element.innerWidth() :
            this.$body.innerWidth() - (this.bodyLocked ? this.scrollbarWidth : 0),
            wrapperH = this.$backdrop ? this.$element.innerHeight() : this.$win.height(),
            dialogW = this.$dialog.outerWidth(), dialogH = this.$dialog.outerHeight();
        var topPos = function() {
                // top
                var _top = that.options.position[1];
                if(_top === 'center' || _top === 'left' || _top === 'right' || /^r\d+(px|r?em|%)?$/i.test(_top)) {
                    var dh = wrapperH - dialogH;
                    _top = (dh < 0 ? 0 : (dh/3 > dialogH ? (dh - dialogH)/2 : dh/2));
                } else if(_top === 'top') {
                    _top = 0;
                } else if(_top === 'bottom') {
                    _top = wrapperH - dialogH;
                } else if(typeof _top === "string") {
                    var boundary = false;
                    if(/^b/i.test(_top)) {
                        boundary = true;
                        _top = _top.replace(/^b/i, '');
                    }
                    if(/%$/.test(_top)) {
                        _top = wrapperH * parseFloat(_top) / 100;
                    } else if(/r?em$/.test(_top)) {
                        var fontSize = /rem$/.test(_top) ?
                            parseInt(that.$body.css('fontSize')) :
                            parseInt(that.$dialog.css('fontSize'));
                        isNaN(fontSize) && (fontSize = 14);
                        _top = fontSize * parseFloat(_top);
                    } else if(/^\d+(\.\d+)?/.test(_top)) {
                        _top = parseFloat(_top);
                    }
                    if(boundary) {
                        _top = wrapperH - dialogH - _top;
                    }
                    isNaN(_top) && (_top = 0);
                } else if(typeof _top !== "number") {
                    _top = 0;
                }
                _top = _top < 0 ? 0 : _top;
                that.position[1] = _top;
                return (_top == 0 ? 0 : _top + 'px');
            }(),
            leftPos = function() {
                // left
                var _left = that.options.position[0];
                if(_left === 'center' || _left === 'top' || _left === 'bottom' || /^b\d+(px|r?em|%)?$/i.test(_left)) {
                    _left = (wrapperW - dialogW)/2;
                    if(that.$backdrop) {
                        that.position[0] = _left;
                        return '';
                    }
                } else if(_left === 'left') {
                    _left = 0;
                } else if(_left === 'right') {
                    _left = wrapperW - dialogW;
                } else if(typeof _left === "string") {
                    var boundary = false;
                    if(/^r/i.test(_left)) {
                        boundary = true;
                        _left = _left.replace(/^r/i, '');
                    }
                    if(/%$/.test(_left)) {
                        _left = wrapperW * parseFloat(_left) / 100;
                    } else if(/r?em$/.test(_left)) {
                        var fontSize = /rem$/.test(_left) ?
                            parseInt(that.$body.css('fontSize')) :
                            parseInt(that.$dialog.css('fontSize'));
                        isNaN(fontSize) && (fontSize = 14);
                        _left = fontSize * parseFloat(_left);
                    } else if(/^\d+(\.\d+)?/.test(_left)) {
                        _left = parseFloat(_left);
                    }
                    if(boundary) {
                        _left = wrapperW - dialogW - _left;
                    }
                    isNaN(_left) && (_left = 0);
                } else if(typeof _left !== "number") {
                    _left = 0;
                }
                _left = _left < -dialogW ? -dialogW : _left;
                that.position[0] = _left;
                _left != 0 && (_left = _left + 'px');
                return (that.$backdrop ? ' ' + _left : _left);
            }();
        if(this.$backdrop) {
            this.$dialog.css('margin', topPos + ' auto auto' + leftPos);
        } else {
            this.$dialog.css('margin', 0);
            this.$element.css({top: topPos, left: leftPos});
        }
    };

    Modal.prototype.resetAdjustments = function () {
        this.$element.css({
            paddingLeft: '',
            paddingRight: ''
        })
    };

    Modal.prototype.checkScrollbar = function () {
        var fullWindowWidth = window.innerWidth;
        if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
            var documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
        this.scrollbarWidth = this.measureScrollbar()
    };

    Modal.prototype.setScrollbar = function () {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
        this.originalBodyPad = document.body.style.paddingRight || '';
        if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
    };

    Modal.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', this.originalBodyPad)
    };

    Modal.prototype.measureScrollbar = function () { // thx walsh
        if(Modal.ORIGINAL_BODY_OVERFLOW_Y === "hidden") {
            return 0;
        }
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure';
        this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.$body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    };


    // MODAL PLUGIN DEFINITION
    // =======================

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('bs.modal');
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('bs.modal', (data = new Modal(this, options)));
            if (typeof option == 'string') data[option](_relatedTarget);
            else if (options.show) data.show(_relatedTarget)
        })
    }

    var old = $.fn.modal;

    $.fn.modal             = Plugin;
    $.fn.modal.Constructor = Modal;


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
        $.fn.modal = old;
        return this;
    };


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this   = $(this);
        var href    = $this.attr('href');
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); // strip for ie7
        var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

        if ($this.is('a')) e.preventDefault();

        $target.one('show.bs.modal', function (showEvent) {
            if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
            $target.one('hidden.bs.modal', function () {
                $this.is(':visible') && $this.trigger('focus')
            })
        });
        Plugin.call($target, option, this)
    });


    /* ================================================
     * Make use of Bootstrap's modal more monkey-friendly.
     *
     * For Bootstrap 3. v1.34.4
     *
     * javanoob@hotmail.com
     *
     * https://github.com/nakupanda/bootstrap3-dialog
     *
     * Licensed under The MIT License.
     *
     * Updated by 靳志凯 @ 2015-05-06
     *
     * 1、修复了某些情况下存在垂直滚动条时body内padding设置错误的问题
     * 2、可移动时鼠标按下后添加了 mousedown class标志
     * 3、添加了loader方法
     * 4、公开了backdrop和position属性接口，使支持自定义遮罩层颜色和透明度设置以及位置的设置
     *
     * Updated by 靳志凯 @ 2015-07-01
     * 1、添加了对事件onloaded的监听
     * 2、size配置增强
     *    若为数字(字符串)或px、(r)em、%结尾的字符串，将直接作为弹出框宽度进行设置，否则，将添加为弹出框的class样式
     *    另支持定义为对象，允许属性为
     *    {
     *      width: 弹出框的宽度。数字(字符串)或px、(r)em、%结尾的字符串
     *      height: 弹出框的高度。数字(字符串)或px、(r)em、%结尾的字符串
     *      minWidth: 弹出框的最小宽度，常配合 width:'auto' 使用。数字(字符串)或px、(r)em、%结尾的字符串
     *      maxWidth: 弹出框的最大宽度。数字(字符串)或px、(r)em、%结尾的字符串
     *      minHeight: 弹出框的最小高度，常配合 height:'auto' 使用。数字(字符串)或px、(r)em、%结尾的字符串
     *      maxHeight: 弹出框的最大高度。数字(字符串)或px、(r)em、%结尾的字符串
     *    }
     *
     * Updated by 靳志凯 @ 2015-07-04
     * 1、processing、info、warning、error、success形式的弹出框归类为note（标签/便签）
     * 2、分别添加了loading、processing、info、warning、error、success等形式弹出框的对应字面类型
     *
     * Update by fengyongqing @ 2016-09-14
     * processing的弹出框添加不同类型（success，error，warning）的timeout
     * ================================================ */

    var DialogModal = function(element, options) {
        Modal.call(this, element, options);
    };

    DialogModal.ORIGINAL_BODY_PADDING = parseFloat($('body').css('padding-right')) || 0;
    DialogModal.METHODS_TO_OVERRIDE = {
        /**
         * Overrided.
         *
         * @returns {undefined}
         */
        setScrollbar: function() {
            var bodyPad = DialogModal.ORIGINAL_BODY_PADDING;
            if (this.bodyIsOverflowing) {
                this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
            }
        },
        /**
         * Overrided.
         *
         * @returns {undefined}
         */
        resetScrollbar: function() {
            var openedDialogs = this.getGlobalOpenedDialogs();
            if (openedDialogs.length === 0 || !this.$backdrop) {
                this.$body.css('padding-right', DialogModal.ORIGINAL_BODY_PADDING);
            }
        },
        /**
         * Overrided.
         *
         * @returns {undefined}
         */
        lockBody: function() {
            var that = this;
            var openedDialogs = this.getGlobalOpenedDialogs();
            $.each(openedDialogs, function(i, dialog) {
                var modal = dialog.getModal().data('bs.modal');
                if(modal && !modal.bodyLocked) {
                    modal.bodyLocked = true;
                    !that.lockedDialogs && (that.lockedDialogs = []);
                    that.lockedDialogs.push(dialog);
                }
                modal = null;
            });
            this.$body.addClass('modal-open');
            if(!this.$backdrop) {
                this.$body.css('overflow-y') !== "hidden" && this.$body.css('overflow-y', "hidden");
                this.$body.css('overflow-x') !== "hidden" && this.$body.css('overflow-x', "hidden");
            }
            this.bodyLocked = true;
        },
        /**
         * Overrided.
         *
         * @returns {undefined}
         */
        releaseBody: function() {
            this.bodyLocked = false;
            if(this.lockedDialogs) {
                $.each(this.lockedDialogs, function(i, dialog) {
                    var modal = dialog.getModal().data('bs.modal');
                    modal && (modal.bodyLocked = false);
                });
                delete this.lockedDialogs;
            }
            var openedDialogs = this.getGlobalOpenedDialogs(), bodyLocked = true;
            if(openedDialogs.length === 0) {
                this.$body.removeClass('modal-open');
                bodyLocked = false;
            } else {
                for(var i=0; i<openedDialogs.length; i++) {
                    var dialog = openedDialogs[i],
                        modal = dialog.getModal().data('bs.modal');
                    if(modal.bodyLocked) {
                        bodyLocked = true;
                        break;
                    }
                    bodyLocked = false;
                    modal = null;
                    dialog = null;
                }
            }
            if(!bodyLocked) {
                this.$body.css('overflow-x', Modal.ORIGINAL_BODY_OVERFLOW_X);
                this.$body.css('overflow-y', Modal.ORIGINAL_BODY_OVERFLOW_Y);
            }
        },
        /**
         * Overrided.
         *
         * @returns {undefined}
         */
        hideModal: function () {
            var that = this;
            this.$element.hide();
            this.backdrop(function () {
                var openedDialogs = that.getGlobalOpenedDialogs(), hasBackdrop = false;
                for(var i=0; i<openedDialogs.length; i++) {
                    var dialog = openedDialogs[i],
                        modal = dialog.getModal().data('bs.modal');
                    if(modal.$backdrop) {
                        hasBackdrop = true;
                    }
                    modal = null;
                    dialog = null;
                }
                that.releaseBody();
                that.resetAdjustments();
                if(!hasBackdrop) {
                    that.resetScrollbar();
                }
                that.$element.trigger('hidden.bs.modal')
            })
        }
    };
    DialogModal.prototype = {
        constructor: DialogModal,
        /**
         * New function, to get the dialogs that opened by Dialog.
         *
         * @returns {undefined}
         */
        getGlobalOpenedDialogs: function() {
            var openedDialogs = [];
            $.each(Dialog.dialogs, function(id, dialogInstance) {
                if (dialogInstance.isRealized() && dialogInstance.isOpened()) {
                    openedDialogs.push(dialogInstance);
                }
            });

            return openedDialogs;
        },
        /**
         * 动态改变弹出框位置
         * @param leftPos
         * @param topPos
         */
        setPosition: function(leftPos, topPos) {
            !this.options.position && (this.options.position = []);
            typeof leftPos !== "undefined" && leftPos !== null && (this.options.position[0] = leftPos);
            typeof topPos !== "undefined" && topPos !== null && (this.options.position[1] = topPos);
            this.adjustPosition();
        },
        getPosition: function() {
            return this.position;
        }
    };

    // Add compatible methods.
    DialogModal.prototype = $.extend(DialogModal.prototype, Modal.prototype, DialogModal.METHODS_TO_OVERRIDE);

    /* ================================================
     * Definition of Dialog.
     * ================================================ */
    var Dialog = function(options) {
        this.defaultOptions = $.extend(true, {
            id: Dialog.newGuid(),
            buttons: [],
            data: {},
            onshow: null,
            onshown: null,
            onhide: null,
            onhidden: null,
            onloaded: null
        }, Dialog.defaultOptions);
        this.indexedButtons = {};
        this.registeredButtonHotkeys = {};
        this.draggableData = {
            isMouseDown: false,
            mouseOffset: {}
        };
        this.realized = false;
        this.opened = false;
        this.isDispose = false;
        this.initOptions(options);
        this.holdThisInstance();
    };

    Dialog.Modal = DialogModal;

    /**
     *  Some constants.
     */
    Dialog.NAMESPACE = 'dialog-modal';
    Dialog.TYPE_DEFAULT = 'type-default';
    Dialog.TYPE_INFO = 'type-info';
    Dialog.TYPE_PRIMARY = 'type-primary';
    Dialog.TYPE_SUCCESS = 'type-success';
    Dialog.TYPE_WARNING = 'type-warning';
    Dialog.TYPE_ERROR = 'type-error';
    Dialog.TYPE_LOADING = 'type-loading';
    Dialog.TYPE_NOTE = 'type-note';
    Dialog.TYPE_NOTE_PROCESSING = Dialog.TYPE_NOTE + '-processing';
    Dialog.TYPE_NOTE_INFO = Dialog.TYPE_NOTE + '-info';
    Dialog.TYPE_NOTE_WARNING = Dialog.TYPE_NOTE + '-warning';
    Dialog.TYPE_NOTE_ERROR = Dialog.TYPE_NOTE + '-error';
    Dialog.TYPE_NOTE_SUCCESS = Dialog.TYPE_NOTE + '-success';
    Dialog.DEFAULT_TEXTS = {};
    Dialog.DEFAULT_TEXTS[Dialog.TYPE_DEFAULT] = 'Information';
    Dialog.DEFAULT_TEXTS[Dialog.TYPE_INFO] = 'Information';
    Dialog.DEFAULT_TEXTS[Dialog.TYPE_PRIMARY] = 'Information';
    Dialog.DEFAULT_TEXTS[Dialog.TYPE_SUCCESS] = 'Success';
    Dialog.DEFAULT_TEXTS[Dialog.TYPE_WARNING] = 'Warning';
    Dialog.DEFAULT_TEXTS[Dialog.TYPE_ERROR] = 'Error';
    Dialog.DEFAULT_TEXTS['OK'] = '确定';
    Dialog.DEFAULT_TEXTS['CANCEL'] = '取消';
    Dialog.DEFAULT_TEXTS['CONFIRM'] = 'Confirmation';
    Dialog.SIZE_NORMAL = 'size-normal';
    Dialog.SIZE_SMALL = 'size-small';
    Dialog.SIZE_WIDE = 'size-wide';    // size-wide is equal to modal-lg
    Dialog.SIZE_LARGE = 'size-large';
    Dialog.BUTTON_SIZES = {};
    Dialog.BUTTON_SIZES[Dialog.SIZE_NORMAL] = '';
    Dialog.BUTTON_SIZES[Dialog.SIZE_SMALL] = '';
    Dialog.BUTTON_SIZES[Dialog.SIZE_WIDE] = '';
    Dialog.BUTTON_SIZES[Dialog.SIZE_LARGE] = 'btn-lg';
    Dialog.ICON_SPINNER = 'glyphicon glyphicon-asterisk';
    Dialog.BUTTON_CLICK_TIMEOUT = 1000; // 按钮防止连点（防抖）处理间隔时间（即每个间隔时间内只允许一次点击/热键触发事件）

    /**
     * Default options.
     */
    Dialog.defaultOptions = {
        backdrop: 'static',
        position: 'center',
        type: Dialog.TYPE_PRIMARY,
        size: Dialog.SIZE_NORMAL,
        cssClass: '',
        defdom: true,
        title: null,
        message: null,
        nl2br: false,
        closable: true,
        closeByBackdrop: true,
        closeByKeyboard: true,
        spinicon: Dialog.ICON_SPINNER,
        autodestroy: true,
        draggable: false,
        animate: true,
        description: ''
    };

    /**
     * Config default options.
     */
    Dialog.configDefaultOptions = function(options) {
        if(arguments.length > 1) {
            var typeApi = arguments[0];
            options = arguments[1];
            var callApi = function(api) {
                if(api && Dialog[api] && typeof Dialog[api].configDefaultOptions === "function") {
                    Dialog[api].configDefaultOptions.call(Dialog[api], options);
                }
            };
            if(typeof typeApi === "string") {
                callApi(typeApi);
            } else if($.isArray(typeApi)) {
                $.each(typeApi, function(i, typeApi) {
                    callApi(typeApi);
                });
            }
        } else {
            Dialog.defaultOptions = $.extend(true, Dialog.defaultOptions, options);
        }
    };

    /**
     * Open / Close all created dialogs all at once.
     */
    Dialog.dialogs = {};
    Dialog.openAll = function() {
        $.each(Dialog.dialogs, function(id, dialogInstance) {
            dialogInstance.open();
        });
    };
    Dialog.closeAll = function() {
        $.each(Dialog.dialogs, function(id, dialogInstance) {
            dialogInstance.close();
        });
    };

    /**
     * Move focus to next visible dialog.
     */
    Dialog.moveFocus = function() {
        var lastDialogInstance = null;
        $.each(Dialog.dialogs, function(id, dialogInstance) {
            lastDialogInstance = dialogInstance;
        });
        if (lastDialogInstance !== null && lastDialogInstance.isRealized()) {
            lastDialogInstance.getModal().focus();
        }
    };

    Dialog.prototype = {
        constructor: Dialog,
        initOptions: function(options) {
            this.options = $.extend(true, this.defaultOptions, options);

            return this;
        },
        holdThisInstance: function() {
            Dialog.dialogs[this.getId()] = this;

            return this;
        },
        initModalStuff: function() {
            this.setModal(this.createModal())
                .setModalDialog(this.createModalDialog());

            this.getModal().append(this.getModalDialog());

            if(this.options.defdom) {
                this.setModalContent(this.createModalContent())
                    .setModalHeader(this.createModalHeader())
                    .setModalBody(this.createModalBody())
                    .setModalFooter(this.createModalFooter());

                this.getModalDialog().append(this.getModalContent());
                this.getModalContent()
                    .append(this.getModalHeader())
                    .append(this.getModalBody())
                    .append(this.getModalFooter());
            }

            return this;
        },
        createModal: function() {
            var $modal = $('<div class="modal" tabindex="-1" role="dialog" aria-hidden="true"></div>');
            $modal.prop('id', this.getId()).attr('aria-labelledby', this.getId() + '_title');

            return $modal;
        },
        getModal: function() {
            return this.$modal;
        },
        setModal: function($modal) {
            this.$modal = $modal;

            return this;
        },
        createModalDialog: function() {
            return $('<div class="modal-dialog"></div>');
        },
        getModalDialog: function() {
            return this.$modalDialog;
        },
        setModalDialog: function($modalDialog) {
            this.$modalDialog = $modalDialog;

            return this;
        },
        createModalContent: function() {
            return $('<div class="modal-content"></div>');
        },
        getModalContent: function() {
            return this.$modalContent;
        },
        setModalContent: function($modalContent) {
            this.$modalContent = $modalContent;

            return this;
        },
        createModalHeader: function() {
            return $('<div class="modal-header"></div>');
        },
        getModalHeader: function() {
            return this.$modalHeader;
        },
        setModalHeader: function($modalHeader) {
            this.$modalHeader = $modalHeader;

            return this;
        },
        createModalBody: function() {
            return $('<div class="modal-body"></div>');
        },
        getModalBody: function() {
            return this.$modalBody;
        },
        setModalBody: function($modalBody) {
            this.$modalBody = $modalBody;

            return this;
        },
        createModalFooter: function() {
            return $('<div class="modal-footer"></div>');
        },
        getModalFooter: function() {
            return this.$modalFooter;
        },
        setModalFooter: function($modalFooter) {
            this.$modalFooter = $modalFooter;

            return this;
        },
        createDynamicContent: function(rawContent) {
            var content = null;
            if (typeof rawContent === 'function') {
                content = rawContent.call(rawContent, this);
            } else {
                content = rawContent;
            }
            if (typeof content === 'string') {
                content = this.formatStringContent(content);
            }

            return content;
        },
        formatStringContent: function(content) {
            if (this.options.nl2br) {
                return content.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
            }

            return content;
        },
        setData: function(key, value) {
            this.options.data[key] = value;

            return this;
        },
        getData: function(key) {
            return this.options.data[key];
        },
        setId: function(id) {
            this.options.id = id;

            return this;
        },
        getId: function() {
            return this.options.id;
        },
        getType: function() {
            return this.options.type;
        },
        setType: function(type) {
            this.options.type = type;
            this.updateType();

            return this;
        },
        updateType: function() {
            if (this.isRealized()) {
                var types = [Dialog.TYPE_DEFAULT,
                    Dialog.TYPE_INFO,
                    Dialog.TYPE_PRIMARY,
                    Dialog.TYPE_SUCCESS,
                    Dialog.TYPE_WARNING,
                    Dialog.TYPE_ERROR];

                this.getModal().removeClass(types.join(' ')).addClass(this.getType());
            }

            return this;
        },
        testType: function(type) {
            var selfType = this.getType() || '';
            if (!type) return false;
            return (selfType == type || selfType.indexOf(type + '-') == 0);
        },
        getSize: function() {
            return this.options.size;
        },
        setSize: function(size, adjustPosition) {
            this.options.size = size;
            this.updateSize();

            if(adjustPosition) {
                var modal = this.getModal().data('bs.modal');
                modal && modal.adjustPosition();
            }

            return this;
        },
        updateSize: function() {
            if (this.isRealized()) {
                var dialog = this;

                var sizeDefaults = [
                        Dialog.SIZE_NORMAL,
                        Dialog.SIZE_SMALL,
                        Dialog.SIZE_WIDE,
                        Dialog.SIZE_LARGE
                    ],
                    defaultSize = {
                        width: !isPlainObject(Dialog.defaultOptions.size) ? Dialog.defaultOptions.size  : Dialog.SIZE_NORMAL,
                        minWidth: "none",
                        maxWidth: "100%",
                        height: "auto",
                        minHeight: "none",
                        maxHeight: "none"
                    };

                var size = this.getSize();

                var modal = this.getModal().data('bs.modal');

                var formatSize = function(size) {
                    if(typeof size !== "undefined") {
                        typeof size === "string" && (size = $.trim(size));
                        if(typeof size === "number" || /^\d+(\.\d+)?$/.test(size)) {
                            return (size + 'px');
                        }
                        if(typeof size === "string") {
                            if(/^\d+(\.\d+)?((px)|(r?em)|%)$/.test(size)) {
                                return size;
                            } else if(/^\d/.test(size)) {
                                size = parseInt(size);
                                if(!isNaN(size))
                                    return (size + 'px');
                            }
                        }
                    }
                    return null;
                };

                var formatWidth = function(w) {
                    w = formatSize(w);
                    if(w !== null) {
                        if(/%$/.test(w)) {
                            w = parseFloat(w);
                            if(isNaN(w)) {
                                w = null;
                            } else {
                                var wrapperW = modal.$backdrop ? modal.$element.innerWidth() : modal.$body.innerWidth();
                                w = (wrapperW * w / 100) + "px";
                            }
                        }
                    }
                    return w;
                };

                var formatHeight = function(h) {
                    h = formatSize(h);
                    if(h !== null) {
                        if(/r?em$/.test(h)) {
                            var fontSize = /rem$/.test(h) ?
                                parseInt(modal.$body.css('fontSize')) :
                                parseInt(dialog.getModalDialog().css('fontSize'));
                            isNaN(fontSize) && (fontSize = 14);
                            h = fontSize * parseFloat(h);
                        } else if(/%$/.test(h)) {
                            var winH = modal.$win.height();
                            h = parseFloat(h);
                            h = isNaN(h) ? null : (winH * h / 100);
                        } else {
                            h = parseFloat(h);
                            isNaN(h) && (h = null);
                        }
                    }
                    return h;
                };

                var clearDialogWidth = function() {
                    var styles = dialog.getModalDialog().attr('style');
                    if(styles) {
                        styles = styles.replace(/\s*width\s*\:[^;]+;?$/, "");
                        styles = styles.replace(/\s*width\s*\:[^;]+;\s*/, " ");
                        dialog.getModalDialog().attr('style', styles);
                    }
                };

                // Dialog size
                if(size && (typeof size === "string" || typeof size === "number")) {
                    this.getModal().removeClass("modal-auto");

                    var fsize = formatWidth(formatSize(size));

                    if(fsize) {
                        this.getModalDialog().css('width', fsize);
                    } else if(typeof size === "string") {
                        clearDialogWidth();
                        this.getModal()
                            .removeClass(sizeDefaults.join(' '))
                            .addClass(size === "auto" ? "modal-auto" : size);
                    }

                    // Smaller dialog.
                    this.getModalDialog().removeClass('modal-sm');
                    if (size === Dialog.SIZE_SMALL) {
                        this.getModalDialog().addClass('modal-sm');
                    }

                    // Wider dialog.
                    this.getModalDialog().removeClass('modal-lg');
                    if (size === Dialog.SIZE_WIDE) {
                        this.getModalDialog().addClass('modal-lg');
                    }
                } else if(size && isPlainObject(size)) {
                    size = $.extend({}, defaultSize, size);

                    var fwidth = formatWidth(size.width),
                        fmaxWidth = formatWidth(size.maxWidth),
                        fminWidth = formatWidth(size.minWidth),
                        fheight = formatHeight(size.height),
                        fminHeight = formatHeight(size.minHeight),
                        fmaxHeight = formatHeight(size.maxHeight);

                    if(fwidth !== null) {
                        this.getModalDialog().css('width', fwidth);
                    } else if(size.width === "auto") {
                        clearDialogWidth();
                        this.getModalDialog().removeClass("modal-sm modal-lg");
                        this.getModal().addClass("modal-auto");
                    }
                    if(fminWidth !== null) {
                        this.getModalDialog().css('minWidth', fminWidth);
                    } else {
                        this.getModalDialog().css('minWidth', "none");
                    }
                    if(fmaxWidth !== null) {
                        this.getModalDialog().css('maxWidth', fmaxWidth);
                    } else {
                        this.getModalDialog().css('maxWidth', "none");
                    }

                    var $parent = this.getModalContent() || this.getModalDialog(),
                        $content = this.getModalBody() || this.getModalDialog(),
                        headerH = this.getModalHeader() && this.getModalHeader().is(':visible') ? this.getModalHeader().outerHeight() : 0,
                        footerH = this.getModalFooter() && this.getModalFooter().is(':visible') ? this.getModalFooter().outerHeight() : 0,
                        diffH =  $parent ? ($parent.outerHeight() - $parent.height()) : 0;

                    diffH += (headerH + footerH);

                    if(fheight !== null || fminHeight !== null || fmaxHeight !== null) {
                        $content.css('overflow-y', "auto");
                        var minH = function(h) {
                            h -= diffH;
                            return h <= 0 ? 1 : h;
                        };
                        fheight !== null && $content.css('height', minH(fheight) + 'px');
                        fminHeight !== null && $content.css('minHeight', minH(fminHeight) + 'px');
                        fmaxHeight !== null && $content.css('maxHeight', minH(fmaxHeight) + 'px');
                    } else {
                        $content.css('height', "auto");
                        $content.css('minHeight', "none");
                        $content.css('maxHeight', "none");
                    }
                }

                // Button size
                $.each(this.options.buttons, function(index, button) {
                    var $button = dialog.getButton(button.id);
                    var buttonSizes = ['btn-lg', 'btn-sm', 'btn-xs'];
                    var sizeClassSpecified = false;
                    if (typeof button['cssClass'] === 'string') {
                        var btnClasses = button['cssClass'].split(' ');
                        $.each(btnClasses, function(index, btnClass) {
                            if ($.inArray(btnClass, buttonSizes) !== -1) {
                                sizeClassSpecified = true;
                            }
                        });
                    }
                    if (!sizeClassSpecified) {
                        $button.removeClass(buttonSizes.join(' '));
                        $button.addClass(dialog.getButtonSize());
                    }
                });
            }

            return this;
        },
        getCssClass: function() {
            return this.options.cssClass;
        },
        setCssClass: function(cssClass) {
            this.options.cssClass = cssClass;

            return this;
        },
        getTitle: function() {
            return this.options.title;
        },
        setTitle: function(title) {
            this.options.title = title;
            this.updateTitle();

            return this;
        },
        updateTitle: function() {
            if (this.isRealized() && this.getModalHeader()) {
                var title = this.getTitle() !== null ? this.createDynamicContent(this.getTitle()) : this.getDefaultText();
                this.getModalHeader().find('.modal-title').html('').append(title).prop('id', this.getId() + '_title');
            }

            return this;
        },
        getMessage: function() {
            return this.options.message;
        },
        setMessage: function(message) {
            this.options.message = message;
            this.updateMessage();

            var modal = this.getModal().data('bs.modal');
            modal && modal.adjustPosition.apply(modal, arguments);

            return this;
        },
        updateMessage: function() {
            if (this.isRealized()) {
                var message = this.createDynamicContent(this.getMessage());
                if(this.getModalBody()) {
                    this.getModalBody().html('').append(message);
                } else {
                    this.getModalDialog().html('').append(message);
                }
            }

            return this;
        },
        setPosition: function(leftPos, topPos) {
            var modal = this.getModal().data('bs.modal');
            modal && modal.setPosition.apply(modal, arguments);
        },
        getPosition: function() {
            var modal = this.getModal().data('bs.modal');
            if(modal) {
                return modal.getPosition.apply(modal, arguments);
            } else {
                return null;
            }
        },
        isClosable: function() {
            return this.options.closable;
        },
        setClosable: function(closable) {
            this.options.closable = closable;
            this.updateClosable();

            return this;
        },
        setCloseByBackdrop: function(closeByBackdrop) {
            this.options.closeByBackdrop = closeByBackdrop;

            return this;
        },
        canCloseByBackdrop: function() {
            return this.options.closeByBackdrop;
        },
        setCloseByKeyboard: function(closeByKeyboard) {
            this.options.closeByKeyboard = closeByKeyboard;

            return this;
        },
        canCloseByKeyboard: function() {
            return this.options.closeByKeyboard;
        },
        isAnimate: function() {
            return this.options.animate;
        },
        setAnimate: function(animate) {
            this.options.animate = animate;

            return this;
        },
        updateAnimate: function() {
            if (this.isRealized()) {
                this.getModal().toggleClass('fade', this.isAnimate());
            }

            return this;
        },
        getSpinicon: function() {
            return this.options.spinicon;
        },
        setSpinicon: function(spinicon) {
            this.options.spinicon = spinicon;

            return this;
        },
        addButton: function(button) {
            this.options.buttons.push(button);

            return this;
        },
        addButtons: function(buttons) {
            var that = this;
            $.each(buttons, function(index, button) {
                that.addButton(button);
            });

            return this;
        },
        getButtons: function() {
            return this.options.buttons;
        },
        setButtons: function(buttons) {
            this.options.buttons = buttons;
            this.updateButtons();

            return this;
        },
        /**
         * If there is id provided for a button option, it will be in dialog.indexedButtons list.
         *
         * In that case you can use dialog.getButton(id) to find the button.
         *
         * @param {type} id
         * @returns {undefined}
         */
        getButton: function(id) {
            if (typeof this.indexedButtons[id] !== 'undefined') {
                return this.indexedButtons[id];
            }

            return null;
        },
        getButtonSize: function() {
            if (typeof Dialog.BUTTON_SIZES[this.getSize()] !== 'undefined') {
                return Dialog.BUTTON_SIZES[this.getSize()];
            }

            return '';
        },
        updateButtons: function() {
            if (this.isRealized() && this.getModalFooter()) {
                if (this.getButtons().length === 0) {
                    this.getModalFooter().hide();
                } else {
                    this.getModalFooter().show().html('').append(this.createFooterButtons());
                }
            }

            return this;
        },
        isAutodestroy: function() {
            return this.options.autodestroy;
        },
        setAutodestroy: function(autodestroy) {
            this.options.autodestroy = autodestroy;
        },
        getDescription: function() {
            return this.options.description;
        },
        setDescription: function(description) {
            this.options.description = description;

            return this;
        },
        getDefaultText: function() {
            return Dialog.DEFAULT_TEXTS[this.getType()];
        },
        getNamespace: function(name) {
            return Dialog.NAMESPACE + '-' + name;
        },
        createHeaderContent: function() {
            var $container = this.getModalHeader();
            if($container) {
                $container.html('');
                // title
                $container.append(this.createTitleContent());
                // Close button
                $container.prepend(this.createCloseButton());
            }

            return $container;
        },
        createTitleContent: function() {
            var $title = $('<h4 class="modal-title"></h4>');

            return $title;
        },
        createCloseButton: function() {
            var $closeBtn = $('<button class="close" aria-label="Close" type="button">&times;</button>');
            $closeBtn.on('click', {dialog: this}, function(event) {
                event.data.dialog.close();
            });

            return $closeBtn;
        },
        createFooterContent: function() {
            var $container = this.getModalFooter();
            if($container) {
                $container.html('').append(this.createFooterButtons());
            }

            return $container;
        },
        createFooterButtons: function() {
            var that = this;
            var $container = $('<div></div>');
            $container.addClass(this.getNamespace('footer-buttons'));
            this.indexedButtons = {};
            this.options.buttons = this.options.buttons || [];
            $.each(this.options.buttons, function(index, button) {
                if (!button.id) {
                    button.id = Dialog.newGuid();
                }
                var $button = that.createButton(button);
                that.indexedButtons[button.id] = $button;
                $container.append($button);
            });

            return $container;
        },
        createButton: function(button) {
            var $button = $('<button class="btn"></button>');
            $button.prop('id', button.id);
            $button.data('button', button);

            // Icon
            if (typeof button.icon !== 'undefined' && $.trim(button.icon) !== '') {
                $button.append(this.createButtonIcon(button.icon));
            }

            // Label
            if (typeof button.label !== 'undefined') {
                $button.append(button.label);
            }

            // Css class
            if (typeof button.cssClass !== 'undefined' && $.trim(button.cssClass) !== '') {
                $button.addClass(button.cssClass);
            } else {
                $button.addClass('btn-default');
            }

            // Hotkey
            if (typeof button.hotkey !== 'undefined') {
                this.registeredButtonHotkeys[button.hotkey] = $button;
            }

            // Button on click
            $button.on('click', {dialog: this, $button: $button, button: button}, function(event) {
                var dialog = event.data.dialog;
                var $button = event.data.$button;
                var button = $button.data('button') || {};

                // 禁用状态下不响应事件
                if ($button.prop('disabled')) return this;

                // 防止连点（防抖）处理
                var clickTimeout = button.clickTimeout != null ? button.clickTimeout : Dialog.BUTTON_CLICK_TIMEOUT;
                var lastClickTimeKey = '__LAST_CLICK_TIME__';
                var lastClickTime = $button.data(lastClickTimeKey) || 0;
                var nowTime = (new Date()).getTime();
                $button.data(lastClickTimeKey, nowTime);
                if (lastClickTime != 0 && (nowTime - lastClickTime < clickTimeout)) {
                    return this;
                }

                if (typeof button.action === 'function') {
                    var result = button.action.call($button, dialog, event);
                    if (isPromise(result)) {
                        dialog.disableButton($button);
                        result.always(function() {
                            dialog.enableButton($button);
                            if (button.autospin) {
                                $button.toggleSpin(false);
                            }
                        });
                    }
                }

                if (button.autospin) {
                    $button.toggleSpin(true);
                }
            });

            // Dynamically add extra functions to $button
            this.enhanceButton($button);

            return $button;
        },
        /**
         * Dynamically add extra functions to $button
         *
         * Using '$this' to reference 'this' is just for better readability.
         *
         * @param {type} $button
         * @returns {_L13.BootstrapDialog.prototype}
         */
        enhanceButton: function($button) {
            $button.dialog = this;

            // Enable / Disable
            $button.toggleEnable = function(enable) {
                var $this = this;
                if (typeof enable !== 'undefined') {
                    $this.prop("disabled", !enable).toggleClass('disabled', !enable);
                } else {
                    $this.prop("disabled", !$this.prop("disabled"));
                }

                return $this;
            };
            $button.enable = function() {
                var $this = this;
                $this.toggleEnable(true);

                return $this;
            };
            $button.disable = function() {
                var $this = this;
                $this.toggleEnable(false);

                return $this;
            };

            // Icon spinning, helpful for indicating ajax loading status.
            $button.toggleSpin = function(spin) {
                var $this = this;
                var dialog = $this.dialog;
                var $icon = $this.find('.' + dialog.getNamespace('button-icon'));
                if (typeof spin === 'undefined') {
                    spin = !($button.find('.icon-spin').length > 0);
                }
                if (spin) {
                    $icon.hide();
                    $button.prepend(dialog.createButtonIcon(dialog.getSpinicon()).addClass('icon-spin'));
                } else {
                    $icon.show();
                    $button.find('.icon-spin').remove();
                }

                return $this;
            };
            $button.spin = function() {
                var $this = this;
                $this.toggleSpin(true);

                return $this;
            };
            $button.stopSpin = function() {
                var $this = this;
                $this.toggleSpin(false);

                return $this;
            };

            return this;
        },
        createButtonIcon: function(icon) {
            var $icon = $('<i></i>');
            $icon.addClass(this.getNamespace('button-icon')).addClass(icon);

            return $icon;
        },
        /**
         * Invoke this only after the dialog is realized.
         *
         * @param {type} enable
         * @returns {undefined}
         */
        enableButtons: function(enable) {
            $.each(this.indexedButtons, function(id, $button) {
                $button.toggleEnable(enable);
            });

            return this;
        },
        toggleButtonEnable: function(selector, enable) {
            var $button;
            if (isDom(selector)) {
                selector = $(selector);
            }
            if (!is$(selector)) {
                var $dialog = this.getModalDialog();
                try {
                    $button = $(selector, $dialog);
                } catch(e) {
                    $button = null;
                }
            } else {
                $button = selector;
            }
            if (is$($button)) {
                if (typeof $button.toggleEnable == "function") {
                    $button.toggleEnable(enable);
                } else {
                    if (typeof enable !== 'undefined') {
                        $button.prop("disabled", !enable).toggleClass('disabled', !enable);
                    } else {
                        $button.prop("disabled", !$button.prop("disabled"));
                    }
                }
            }
            return this;
        },
        enableButton: function(selector) {
            this.toggleButtonEnable(selector, true);
            return this;
        },
        disableButton: function(selector) {
            this.toggleButtonEnable(selector, false);
            return this;
        },
        /**
         * Invoke this only after the dialog is realized.
         *
         * @returns {undefined}
         */
        updateClosable: function() {
            if (this.isRealized()) {
                // Close button
                this.getModalHeader() && this.getModalHeader().find('button.close').toggle(this.isClosable());
            }

            return this;
        },
        /**
         * Set handler for modal event 'show.bs.modal'.
         * This is a setter!
         */
        onShow: function(onshow) {
            this.options.onshow = onshow;

            return this;
        },
        /**
         * Set handler for modal event 'shown.bs.modal'.
         * This is a setter!
         */
        onShown: function(onshown) {
            this.options.onshown = onshown;

            return this;
        },
        /**
         * Set handler for modal event 'hide.bs.modal'.
         * This is a setter!
         */
        onHide: function(onhide) {
            this.options.onhide = onhide;

            return this;
        },
        /**
         * Set handler for modal event 'hidden.bs.modal'.
         * This is a setter!
         */
        onHidden: function(onhidden) {
            this.options.onhidden = onhidden;

            return this;
        },
        isRealized: function() {
            return this.realized;
        },
        setRealized: function(realized) {
            this.realized = realized;

            return this;
        },
        isOpened: function() {
            return this.opened;
        },
        setOpened: function(opened) {
            this.opened = opened;

            return this;
        },
        handleModalEvents: function() {
            this.getModal().on('realized.bs.modal', {dialog: this}, function(event) {
                var dialog = event.data.dialog;
                dialog.isModalEvent(event) && typeof dialog.options.onrealized === 'function' && dialog.options.onrealized(dialog);
            });
            this.getModal().on('show.bs.modal', {dialog: this}, function(event) {
                var dialog = event.data.dialog;
                dialog.setOpened(true);
                if (dialog.isModalEvent(event) && typeof dialog.options.onshow === 'function') {
                    var openIt = dialog.options.onshow(dialog);
                    if (openIt === false) {
                        dialog.setOpened(false);
                    }

                    return openIt;
                }
            });
            this.getModal().on('shown.bs.modal', {dialog: this}, function(event) {
                var dialog = event.data.dialog;
                dialog.isModalEvent(event) && typeof dialog.options.onshown === 'function' && dialog.options.onshown(dialog);
            });
            this.getModal().on('hide.bs.modal', {dialog: this}, function(event) {
                var dialog = event.data.dialog;
                dialog.setOpened(false);
                if (dialog.isDispose && dialog.testType(Dialog.TYPE_NOTE)) {
                    dialog.getModal().removeClass("right left top bottom").addClass("closing");
                }
                if (!dialog.isDispose && dialog.isModalEvent(event) && typeof dialog.options.onhide === 'function') {
                    var hideIt = dialog.options.onhide(dialog);
                    if (hideIt === false) {
                        dialog.setOpened(true);
                    }

                    return hideIt;
                }
            });
            this.getModal().on('hidden.bs.modal', {dialog: this}, function(event) {
                var dialog = event.data.dialog;
                if (dialog.isAutodestroy()) {
                    dialog.setRealized(false);
                    delete Dialog.dialogs[dialog.getId()];
                    $(this).remove();
                }
                Dialog.moveFocus();
                if (dialog.isDispose && dialog.testType(Dialog.TYPE_NOTE)) {
                    Dialog.notes.remove(dialog);
                    dialog.getModal().removeClass("closing");
                }
                !dialog.isDispose && dialog.isModalEvent(event) && typeof dialog.options.onhidden === 'function' && dialog.options.onhidden(dialog);
            });
            this.getModal().on('loaded.bs.modal', {dialog: this}, function(event) {
                var dialog = event.data.dialog;
                var loadedData = $(this).data('loaded.bs.modal');
                dialog.isModalEvent(event) && typeof dialog.options.onloaded === 'function' && dialog.options.onloaded.call(loadedData, dialog);
                loadedData.remote && typeof loadedData.remote.resolve === "function" && loadedData.remote.resolve();
            });

            // Backdrop, I did't find a way to change bs3 backdrop option after the dialog is popped up, so here's a new wheel.
            this.handleModalBackdropEvent();

            // ESC key support
            this.getModal().on('keyup', {dialog: this}, function(event) {
                event.which === 27 && event.data.dialog.isClosable() && event.data.dialog.canCloseByKeyboard() && event.data.dialog.close();
            });

            // Button hotkey
            this.getModal().on('keyup', {dialog: this}, function(event) {
                var dialog = event.data.dialog;
                if (typeof dialog.registeredButtonHotkeys[event.which] !== 'undefined') {
                    var $button = $(dialog.registeredButtonHotkeys[event.which]);
                    !$button.prop('disabled') && $button.focus().trigger('click');
                }
            });

            return this;
        },
        handleModalBackdropEvent: function() {
            this.getModal().on('click', {dialog: this}, function(event) {
                event.target === this && event.data.dialog.isClosable() && event.data.dialog.canCloseByBackdrop() && event.data.dialog.close();
            });

            return this;
        },
        isModalEvent: function(event) {
            return typeof event.namespace !== 'undefined' && event.namespace === 'bs.modal';
        },
        makeModalDraggable: function() {
            if (this.options.draggable && this.getModalHeader()) {
                this.getModalHeader().addClass('draggable').on('mousedown', {dialog: this}, function(event) {
                    var dialog = event.data.dialog;
                    dialog.draggableData.isMouseDown = true;
                    dialog.getModalHeader().addClass("mousedown");
                    var dialogOffset = dialog.getModalDialog().offset();
                    dialog.draggableData.mouseOffset = {
                        top: event.clientY - dialogOffset.top,
                        left: event.clientX - dialogOffset.left
                    };
                });
                this.getModal().on('mouseup mouseleave', {dialog: this}, function(event) {
                    var dialog = event.data.dialog;
                    dialog.getModalHeader().removeClass("mousedown");
                    dialog.draggableData.isMouseDown = false;
                });
                $('body').on('mousemove', {dialog: this}, function(event) {
                    var dialog = event.data.dialog;
                    if (!dialog.draggableData.isMouseDown) {
                        return;
                    }
                    var dialogModal = dialog.getModal().data('bs.modal');
                    var moveTarget = dialogModal.$backdrop ? dialog.getModalDialog() : dialog.getModal();
                    moveTarget.offset({
                        top: event.clientY - dialog.draggableData.mouseOffset.top,
                        left: event.clientX - dialog.draggableData.mouseOffset.left
                    });
                });
            }

            return this;
        },
        realize: function() {
            this.initModalStuff();
            this.getModal().addClass(Dialog.NAMESPACE)
                .addClass(this.getCssClass());
            if(this.getDescription()) {
                this.getModal().attr('aria-describedby', this.getDescription());
            }
            this.createFooterContent();
            this.createHeaderContent();
            this.getModal().data('bs.modal', new DialogModal(this.getModal(), {
                relatedDialog: this,
                backdrop: this.options.backdrop,
                position: this.options.position,
                remote: this.options.remote,
                keyboard: false,
                show: false
            }));
            this.makeModalDraggable();
            this.handleModalEvents();
            this.setRealized(true);
            this.updateButtons();
            this.updateType();
            this.updateTitle();
            this.updateMessage();
            this.updateClosable();
            this.updateAnimate();
            this.updateSize();

            return this;
        },
        /**
         * add backdrop mark
         */
        updateBackdrop: function() {
            var $modal = this.getModal();
            var $backdrop = $modal.data('bs.modal').$backdrop;
            if(!$backdrop) return;
            var ariaBackdropedby = this.getId() + '_backdrop';
            $backdrop.attr('aria-backdropedby', ariaBackdropedby);
            var $style = $backdrop.data('in-style');
            $style && $style.text() && $style.text($style.text().replace(/.modal-backdrop/g, '.modal-backdrop[aria-backdropedby="' + ariaBackdropedby + '"]'));
        },
        /**
         * To make multiple opened dialogs look better.
         *
         * Will be removed in later version, after Bootstrap Modal >= 3.3.0, updating z-index is unnecessary.
         */
        updateZIndex: function() {
            var zIndexBackdrop = 1040;
            var zIndexModal = 1050;
            var dialogCount = 0;
            $.each(Dialog.dialogs, function(dialogId, dialogInstance) {
                dialogCount++;
            });
            var $modal = this.getModal();
            var $backdrop = $modal.data('bs.modal').$backdrop;
            $modal.css('z-index', zIndexModal + (dialogCount - 1) * 20);
            $backdrop && $backdrop.css('z-index', zIndexBackdrop + (dialogCount - 1) * 20);

            return this;
        },
        open: function() {
            !this.isRealized() && this.realize();
            this.getModal().modal('show');
            this.updateBackdrop();
            this.updateZIndex();

            return this;
        },
        close: function() {
            this.getModal().modal('hide');

            return this;
        },
        /**
         * 销毁弹出框，不调用 onhide 和 onhidden 回调
         * @returns {Dialog}
         */
        dispose: function() {
            this.getModal().modal('hide', false);

            return this;
        }
    };

    /**
     * RFC4122 version 4 compliant unique id creator.
     *
     * Added by https://github.com/tufanbarisyildirim/
     *
     *  @returns {String}
     */
    Dialog.newGuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    /* ================================================
     * For lazy people
     * ================================================ */

    /**
     * Shortcut function: show
     *
     * @param {type} options
     * @returns the created dialog instance
     */
    Dialog.show = function(options) {
        return new Dialog(options).open();
    };

    /**
     * Alert window
     *
     * @returns the created dialog instance
     */
    Dialog.alert = function() {
        var options = {};
        var defaultOptions = Dialog.alert.defaultOptions;

        if (typeof arguments[0] === 'object' && arguments[0].constructor === {}.constructor) {
            options = $.extend(true, {}, defaultOptions, arguments[0]);
        } else {
            options = $.extend(true, {}, defaultOptions, {
                message: arguments[0],
                callback: typeof arguments[1] !== 'undefined' ? arguments[1] : null
            });
        }

        return new Dialog({
            type: options.type,
            title: options.title,
            cssClass: 'type-alert',
            message: (options.icon ? '<i class="modal-icon-alert' + (typeof options.icon === "string" ? options.icon : '') + '"></i>' : '') + (options.message || ''),
            closable: options.closable,
            draggable: options.draggable,
            closeByBackdrop: false,
            closeByKeyboard: false,
            data: {
                callback: options.callback
            },
            onhide: function(dialog) {
                !dialog.getData('btnClicked') && dialog.isClosable() && typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(false);
            },
            buttons: [{
                cssClass: 'btn-primary',
                label: options.buttonLabel,
                action: function(dialog) {
                    dialog.setData('btnClicked', true);
                    typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
                    dialog.close();
                }
            }]
        }).open();
    };
    Dialog.alert.defaultOptions = {
        type: Dialog.TYPE_PRIMARY,
        title: "警告提示",
        icon: true,
        message: null,
        closable: true,
        draggable: false,
        buttonLabel: Dialog.DEFAULT_TEXTS.OK,
        callback: null
    };
    Dialog.alert.configDefaultOptions = function(options) {
        Dialog.alert.defaultOptions = $.extend({}, Dialog.alert.defaultOptions, options);
    };

    /**
     * Confirm window
     *
     * @returns the created dialog instance
     */
    Dialog.confirm = function() {
        var options = {};
        var defaultOptions = Dialog.confirm.defaultOptions;

        if (typeof arguments[0] === 'object' && arguments[0].constructor === {}.constructor) {
            options = $.extend(true, {}, defaultOptions, arguments[0]);
        } else {
            options = $.extend(true, {}, defaultOptions, {
                message: arguments[0],
                buttonLabel: Dialog.DEFAULT_TEXTS.OK,
                callback: typeof arguments[1] !== 'undefined' ? arguments[1] : null
            });
        }
        if (options.btnOKClass === null) {
            options.btnOKClass = ['btn', options.type.split('-')[1]].join('-');
        }

        return new Dialog({
            type: options.type,
            title: options.title,
            cssClass: 'type-confirm',
            message: (options.icon ? '<i class="modal-icon-confirm' + (typeof options.icon === "string" ? options.icon : '') + '"></i>' : '') + (options.message || ''),
            closable: options.closable,
            draggable: options.draggable,
            closeByBackdrop: false,
            closeByKeyboard: false,
            data: {
                callback: options.callback
            },
            onhide: function(dialog) {
                if (!dialog.getData('btnClicked') && dialog.isClosable()) {
                    var callback = dialog.getData('callback');
                    typeof callback === 'function' && callback.call(dialog, false);
                }
            },
            buttons: [{
                label: options.btnCancelLabel,
                action: function(dialog) {
                    dialog.setData('btnClicked', true);
                    dialog.close();
                    var callback = dialog.getData('callback');
                    typeof callback === 'function' && callback.call(dialog, false);
                }
            }, {
                label: options.btnOKLabel,
                cssClass: options.btnOKClass,
                action: function(dialog) {
                    dialog.setData('btnClicked', true);
                    dialog.close();
                    var callback = dialog.getData('callback');
                    typeof callback === 'function' && callback.call(dialog, true);
                }
            }]
        }).open();
    };
    Dialog.confirm.defaultOptions = {
        type: Dialog.TYPE_PRIMARY,
        title: "确认提示",
        icon: true,
        message: null,
        closable: true,
        draggable: false,
        btnCancelLabel: Dialog.DEFAULT_TEXTS.CANCEL,
        btnOKLabel: Dialog.DEFAULT_TEXTS.OK,
        btnOKClass: null,
        callback: null
    };
    Dialog.confirm.configDefaultOptions = function(options) {
        Dialog.confirm.defaultOptions = $.extend({}, Dialog.confirm.defaultOptions, options);
    };

    /**
     * Dialog for page loading
     *
     * @returns the created dialog instance
     */
    Dialog.loading = function(message, callback) {
        if(!Dialog.loading.instance && message !== "remove") {
            var options = {};
            var defaultOptions = Dialog.loading.defaultOptions;

            if (typeof message === 'object' && message.constructor === {}.constructor) {
                options = $.extend({}, defaultOptions, message);
                if(typeof message.size !== "number") {
                    options.size = defaultOptions.size;
                } else if(options.size < 12) {
                    options.size = 12;
                }
            } else if(typeof message === "string") {
                options = $.extend({}, defaultOptions, {message: message});
            } else {
                options = $.extend({}, defaultOptions);
                if(typeof message === "function") {
                    callback = message;
                }
            }
            $.extend(options, typeof callback === 'function' ? {onhidden: callback} : {});

            Dialog.loading.timeout = options.minin;

            Dialog.loading.instance = new Dialog({
                backdrop: ['#aaa', 0.3],
                size: '100%',
                message: function() {
                    return (
                        (
                            options.loader ?
                                (isImageSrc(options.loader) ? '<div class="loader"><img src="'+options.loader+'" alt="Loading..."/></div>' : '<div class="'+options.loader+'"></div>')
                                : '<div class="loader" data-frame="'+options.beginFrame+'" data-delay="'+options.delay+'"></div>'
                        ) +
                        (
                            options.message ? '<p class="loader-text">' + options.message + '</p>' : ''
                        )
                    );
                }(),
                defdom: false,
                closable: false,
                animate: false,
                onshow: function(dialog) {
                    var $modalDialog = dialog.getModalDialog();
                    $modalDialog.css({
                        'text-align': "center",
                        background: "none",
                        border: '0 none',
                        'box-shadow': 'none'
                    });
                    var $loader = (!options.loader || isImageSrc(options.loader))
                        ? $modalDialog.find(".loader:first")
                        : $modalDialog.find(options.loader.replace(/\s/g, '')+":first");
                    $loader.css({
                        margin: '0 auto',
                        fontSize: options.size + 'px',
                        width: options.size + 'px',
                        height: options.size + 'px'
                    });
                    if(!options.loader && $loader.is(".loader") && $loader.attr('data-frame')) {
                        $loader.loader();
                    }
                    typeof options.onshow === "function" && options.onshow(dialog);
                },
                onhidden: options.onhidden
            });
            Dialog.loading.instance.realize();
            Dialog.loading.instance.open();

            Dialog.loading.stime = new Date().getTime();
        } else {
            if(typeof arguments[0] === "string") {
                if(arguments[0] === "remove") {
                    var eTime = new Date().getTime();
                    Dialog.loading.timeout = Dialog.loading.timeout || eTime;
                    Dialog.loading.stime = Dialog.loading.stime || eTime;
                    var dTime = Dialog.loading.timeout - (eTime - Dialog.loading.stime);
                    delete Dialog.loading.timeout;
                    delete Dialog.loading.stime;
                    var doRemove = function() {
                        if (Dialog.loading.instance) {
                            Dialog.loading.instance.close();
                            delete Dialog.loading.instance;
                        }
                    };
                    if(dTime > 0) {
                        window.setTimeout(doRemove, dTime);
                    } else {
                        doRemove();
                    }
                }
            }
        }
        return Dialog.loading.instance;
    };
    Dialog.loading.defaultOptions = {
        message: "",
        size: 32,
        minin: 300,
        loader: null,
        beginFrame: 1,
        delay: 150,
        onshow: null,
        onhidden: null
    };
    Dialog.loading.configDefaultOptions = function(options) {
        Dialog.loading.defaultOptions = $.extend({}, Dialog.loading.defaultOptions, options);
    };

    /**
     * 缓存 processing、info、success、warning、error形式的弹出框
     */
    Dialog.notes = {};
    Dialog.notes.list = [];
    Dialog.notes.remove = function(note) {
        if(!note) return;
        var notes = [], index, deltaT = 0;
        $.each(Dialog.notes.list, function(i, _note) {
            if(_note.getId() === note.getId()) {
                index = i;
                deltaT = -(note.getModal().outerHeight() + 3);
            } else {
                notes.push(_note);
            }
        });
        Dialog.notes.list = notes;
        var top = 0, pos;
        $.each(Dialog.notes.list, function(i, note) {
            if(typeof index !== "undefined" && i >= index) {
                pos = note.getPosition();
                top = pos ? pos[1] : 0;
                note.setPosition(null, top + deltaT);
            }
        });
    };
    Dialog.notes.push = function(note) {
        Dialog.notes.list.unshift(note);
        var deltaT = 0, top = 0, pos;
        $.each(Dialog.notes.list, function(i, note) {
            pos = note.getPosition();
            top = pos ? pos[1] : 0;
            note.setPosition(null, top + deltaT);
            deltaT = note.getModal().outerHeight() + 3;
        });
    };

    /**
     * Dialog for Processing
     *
     * @returns the Processor instance
     */
    Dialog.processing = function(message, callback) {
        var options = {};
        var defaultOptions = Dialog.processing.defaultOptions;

        if (typeof message === 'object' && message.constructor === {}.constructor) {
            options = $.extend(true, {}, defaultOptions, message);
        } else if(typeof message === "string") {
            options = $.extend(true, {}, defaultOptions, {message: message});
        } else {
            options = $.extend({}, defaultOptions);
        }
        $.extend(options, typeof callback === 'function' ? {onhidden: callback} : {});

        var Processor = function(dialog, timeout, icons) {
            this.dialog = dialog;
            this.timeout = timeout || defaultOptions.timeout;
            this.icons = $.extend({}, defaultOptions, icons);
            this.warning = function(message) {
                this.timeout = this.timeout.warning || this.timeout.default;
                this._update("warning", message);
            };
            this.error = function(message) {
                this.timeout = this.timeout.error || this.timeout.default;
                this._update("error", message);
            };
            this.success = function(message) {
                this.timeout = this.timeout.success || this.timeout.default;
                this._update("success", message);
            };
            this.open = function() {
                if(this.dialog) {
                    typeof this.dialog.open === "function" && this.dialog.open();
                }
                return this;
            };
            this.close = function() {
                if(this.dialog) {
                    typeof this.dialog.close === "function" && this.dialog.close();
                }
            };
            this._update = function(type, message) {
                if(this.dialog) {
                    this.dialog.setMessage(this._createMessageContent(type, message));
                    this.dialog.updateMessage();
                }
                this._bindCloseEvent();
                this._bindTimeout();
            };
            this._createMessageContent = function(type, message) {
                return (
                    '<div class="alert alert-'+(type==='error'?'danger':type)+'" role="alert">'+
                        '<button type="button" class="close" aria-label="Close">&times;</button>'+
                        '<i class="'+(this.icons[type]||'')+'"></i>'+
                        '<p>'+message+'</p>'+
                    '</div>'
                );
            };
            this._bindCloseEvent = function() {
                if(this.dialog) {
                    var $alert = this.dialog.getModalDialog().find('[role="alert"]');
                    $alert.find("button.close").one('click', this, function(e) {
                        e.data.close();
                    });
                }
            };
            this._bindTimeout = function() {
                if(this.dialog && this.timeout > 0) {
                    var $alertDialog = this.dialog.getModalDialog(), that = this, t;
                    var _clearTimeout = function() {
                        t && clearTimeout(t);
                        t = null;
                    };
                    var _setTimeout = function() {
                        _clearTimeout();
                        t = setTimeout(function() {
                            that.close();
                        }, that.timeout);
                    };
                    _setTimeout();
                    $alertDialog.on("mouseenter", {call: _clearTimeout}, function(e) {
                        e.data.call();
                    }).on("mouseleave", {call: _setTimeout}, function(e) {
                        e.data.call();
                    });
                }
            };
        };

        var dialog = new Dialog({
            type: Dialog.TYPE_NOTE_PROCESSING,
            size: options.size,
            backdrop: options.backdrop,
            position: options.position,
            nl2br: options.nl2br,
            message: function() {
                return (
                    '<div class="alert alert-info" role="alert">'+
                        '<button type="button" class="close" aria-label="Close">&times;</button>'+
                        '<i class="'+(!options.icons.processing || isImageSrc(options.icons.processing) ? 'loader' : options.icons.processing)+'">'+
                            (isImageSrc(options.icons.processing) ? '<img src="'+options.icons.processing+'" alt="Processing..."/>' : '')+
                        '</i>'+
                        '<p>'+options.message+'</p>'+
                    '</div>'
                );
            }(),
            defdom: false,
            closeByBackdrop: false,
            closeByKeyboard: false,
            onrealized: function(dialog) {
                Dialog.notes.push(dialog);
            },
            onshow: function(dialog) {
                var $alert = dialog.getModalDialog().find('[role="alert"]');
                $alert.find('i:first').css({
                    width: "14px",
                    height: "14px",
                    fontSize: "14px"
                });
                !options.icons.processing && $alert.find('i:first').loader();
                $alert.find("button.close").one('click', {dialog: dialog}, function(e) {
                    dialog.close();
                });
            },
            onhide: function(dialog) {
                dialog.getModal().removeClass("right left top bottom").addClass("closing");
            },
            onhidden: function(dialog) {
                Dialog.notes.remove(dialog);
                dialog.getModal().removeClass("closing");
                typeof options.onhidden === "function" && options.onhidden.call(dialog, dialog);
            }
        });

        return new Processor(dialog, options.timeout, options.icons).open();
    };
    Dialog.processing.defaultOptions = {
        backdrop: false,
        position: 'right top',
        size: {
            width: 'auto',
            minWidth: '20em',
            maxWidth: '40em'
        },
        timeout: {
            success: null,
            error: null,
            warning: null,
            default: 3500
        },
        icons: {
            processing: null,
            warning: "fa fa-exclamation-triangle",
            error: "fa fa-bug",
            success: "fa fa-check-circle"
        },
        nl2br: false,
        message: 'Processing...'
    };
    Dialog.processing.configDefaultOptions = function(options) {
        Dialog.processing.defaultOptions = $.extend({}, Dialog.processing.defaultOptions, options, {'timeout': $.extend({}, Dialog.processing.defaultOptions.timeout, options.timeout)});
    };

    /**
     * Info window
     *
     * @param {type} message
     * @returns the created dialog instance
     */
    Dialog.info = function(message, callback) {
        var options = {};
        var defaultOptions = Dialog.info.defaultOptions;

        if (typeof message === 'object' && message.constructor === {}.constructor) {
            options = $.extend({}, defaultOptions, message);
        } else if(typeof message === "string") {
            options = $.extend({}, defaultOptions, {message: message});
        } else {
            options = $.extend({}, defaultOptions);
        }
        $.extend(options, typeof callback === 'function' ? {onhidden: callback} : {});

        return new Dialog({
            type: Dialog.TYPE_NOTE_INFO,
            size: options.size,
            backdrop: options.backdrop,
            position: options.position,
            nl2br: options.nl2br,
            message: function() {
                return (
                    '<div class="alert alert-info" role="alert">'+
                        '<button type="button" class="close" aria-label="Close">&times;</button>'+
                        '<i class="'+options.icon+'"></i>'+
                        '<p>'+options.message+'</p>'+
                    '</div>'
                );
            }(),
            defdom: false,
            data: { timeout: options.timeout },
            onrealized: function(dialog) {
                Dialog.notes.push(dialog);
            },
            onshow: function(dialog) {
                var $alert = dialog.getModalDialog().find('[role="alert"]');
                $alert.find("button.close").one('click', {dialog: dialog}, function(e) {
                    dialog.close();
                });
            },
            onshown: function(dialog) {
                var timeout = dialog.getData('timeout');
                if (timeout && timeout > 0) {
                    var $alertDialog = dialog.getModalDialog(), t;
                    var _clearTimeout = function() {
                        t && clearTimeout(t);
                        t = null;
                    };
                    var _setTimeout = function() {
                        _clearTimeout();
                        t = setTimeout(function() {
                            dialog.close();
                        }, timeout);
                    };
                    _setTimeout();
                    $alertDialog.on("mouseenter", {call: _clearTimeout}, function(e) {
                        e.data.call();
                    }).on("mouseleave", {call: _setTimeout}, function(e) {
                        e.data.call();
                    });
                }
            },
            onhide: function(dialog) {
                dialog.getModal().removeClass("right left top bottom").addClass("closing");
            },
            onhidden: function(dialog) {
                Dialog.notes.remove(dialog);
                dialog.getModal().removeClass("closing");
                typeof options.onhidden === "function" && options.onhidden.call(dialog, dialog);
            }
        }).open();
    };
    Dialog.info.defaultOptions = {
        backdrop: false,
        position: 'right top',
        size: {
            width: 'auto',
            minWidth: '20em',
            maxWidth: '40em'
        },
        timeout: 3500,
        icon: 'fa fa-info-circle',
        nl2br: false,
        message: 'Info.'
    };
    Dialog.info.configDefaultOptions = function(options) {
        Dialog.info.defaultOptions = $.extend({}, Dialog.info.defaultOptions, options);
    };

    /**
     * Warning window
     *
     * @param {type} message
     * @returns the created dialog instance
     */
    Dialog.warning = function(message, callback) {
        var options = {};
        var defaultOptions = Dialog.warning.defaultOptions;

        if (typeof message === 'object' && message.constructor === {}.constructor) {
            options = $.extend({}, defaultOptions, message);
        } else if(typeof message === "string") {
            options = $.extend({}, defaultOptions, {message: message});
        } else {
            options = $.extend({}, defaultOptions);
        }
        $.extend(options, typeof callback === 'function' ? {onhidden: callback} : {});

        return new Dialog({
            type: Dialog.TYPE_NOTE_WARNING,
            size: options.size,
            backdrop: options.backdrop,
            position: options.position,
            nl2br: options.nl2br,
            message: function() {
                return (
                    '<div class="alert alert-warning" role="alert">'+
                        '<button type="button" class="close" aria-label="Close">&times;</button>'+
                        '<i class="'+options.icon+'"></i>'+
                        '<p>'+options.message+'</p>'+
                    '</div>'
                );
            }(),
            defdom: false,
            data: { timeout: options.timeout },
            onrealized: function(dialog) {
                Dialog.notes.push(dialog);
            },
            onshow: function(dialog) {
                var $alert = dialog.getModalDialog().find('[role="alert"]');
                $alert.find("button.close").one('click', {dialog: dialog}, function(e) {
                    dialog.close();
                });
            },
            onshown: function(dialog) {
                var timeout = dialog.getData('timeout');
                if (timeout && timeout > 0) {
                    var $alertDialog = dialog.getModalDialog(), t;
                    var _clearTimeout = function() {
                        t && clearTimeout(t);
                        t = null;
                    };
                    var _setTimeout = function() {
                        _clearTimeout();
                        t = setTimeout(function() {
                            dialog.close();
                        }, timeout);
                    };
                    _setTimeout();
                    $alertDialog.on("mouseenter", {call: _clearTimeout}, function(e) {
                        e.data.call();
                    }).on("mouseleave", {call: _setTimeout}, function(e) {
                        e.data.call();
                    });
                }
            },
            onhide: function(dialog) {
                dialog.getModal().removeClass("right left top bottom").addClass("closing");
            },
            onhidden: function(dialog) {
                Dialog.notes.remove(dialog);
                dialog.getModal().removeClass("closing");
                typeof options.onhidden === "function" && options.onhidden.call(dialog, dialog);
            }
        }).open();
    };
    Dialog.warning.defaultOptions = {
        backdrop: false,
        position: 'right top',
        size: {
            width: 'auto',
            minWidth: '20em',
            maxWidth: '40em'
        },
        timeout: 3500,
        icon: 'fa fa-exclamation-triangle',
        nl2br: false,
        message: 'Warning!'
    };
    Dialog.warning.configDefaultOptions = function(options) {
        Dialog.warning.defaultOptions = $.extend({}, Dialog.warning.defaultOptions, options);
    };

    /**
     * Error window
     *
     * @param {type} message
     * @returns the created dialog instance
     */
    Dialog.error = function(message, callback) {
        var options = {};
        var defaultOptions = Dialog.error.defaultOptions;

        if (typeof message === 'object' && message.constructor === {}.constructor) {
            options = $.extend({}, defaultOptions, message);
        } else if(typeof message === "string") {
            options = $.extend({}, defaultOptions, {message: message});
        } else {
            options = $.extend({}, defaultOptions);
        }
        $.extend(options, typeof callback === 'function' ? {onhidden: callback} : {});

        return new Dialog({
            type: Dialog.TYPE_NOTE_ERROR,
            size: options.size,
            backdrop: options.backdrop,
            position: options.position,
            nl2br: options.nl2br,
            message: function() {
                return (
                    '<div class="alert alert-danger" role="alert">'+
                        '<button type="button" class="close" aria-label="Close">&times;</button>'+
                        '<i class="'+options.icon+'"></i>'+
                        '<p>'+options.message+'</p>'+
                    '</div>'
                );
            }(),
            defdom: false,
            data: { timeout: options.timeout },
            onrealized: function(dialog) {
                Dialog.notes.push(dialog);
            },
            onshow: function(dialog) {
                var $alert = dialog.getModalDialog().find('[role="alert"]');
                $alert.find("button.close").one('click', {dialog: dialog}, function(e) {
                    dialog.close();
                });
            },
            onshown: function(dialog) {
                var timeout = dialog.getData('timeout');
                if (timeout && timeout > 0) {
                    var $alertDialog = dialog.getModalDialog(), t;
                    var _clearTimeout = function() {
                        t && clearTimeout(t);
                        t = null;
                    };
                    var _setTimeout = function() {
                        _clearTimeout();
                        t = setTimeout(function() {
                            dialog.close();
                        }, timeout);
                    };
                    _setTimeout();
                    $alertDialog.on("mouseenter", {call: _clearTimeout}, function(e) {
                        e.data.call();
                    }).on("mouseleave", {call: _setTimeout}, function(e) {
                        e.data.call();
                    });
                }
            },
            onhide: function(dialog) {
                dialog.getModal().removeClass("right left top bottom").addClass("closing");
            },
            onhidden: function(dialog) {
                Dialog.notes.remove(dialog);
                dialog.getModal().removeClass("closing");
                typeof options.onhidden === "function" && options.onhidden.call(dialog, dialog);
            }
        }).open();
    };
    Dialog.error.defaultOptions = {
        backdrop: false,
        position: 'right top',
        size: {
            width: 'auto',
            minWidth: '20em',
            maxWidth: '40em'
        },
        timeout: 3500,
        icon: 'fa fa-bug',
        nl2br: false,
        message: 'Error!'
    };
    Dialog.error.configDefaultOptions = function(options) {
        Dialog.error.defaultOptions = $.extend({}, Dialog.error.defaultOptions, options);
    };

    /**
     * Success window
     *
     * @param {type} message
     * @returns the created dialog instance
     */
    Dialog.success = function(message, callback) {
        var options = {};
        var defaultOptions = Dialog.success.defaultOptions;

        if (typeof message === 'object' && message.constructor === {}.constructor) {
            options = $.extend({}, defaultOptions, message);
        } else if(typeof message === "string") {
            options = $.extend({}, defaultOptions, {message: message});
        } else {
            options = $.extend({}, defaultOptions);
        }
        $.extend(options, typeof callback === 'function' ? {onhidden: callback} : {});

        return new Dialog({
            type: Dialog.TYPE_NOTE_SUCCESS,
            size: options.size,
            backdrop: options.backdrop,
            position: options.position,
            nl2br: options.nl2br,
            message: function() {
                return (
                    '<div class="alert alert-success" role="alert">'+
                        '<button type="button" class="close" aria-label="Close">&times;</button>'+
                        '<i class="'+options.icon+'"></i>'+
                        '<p>'+options.message+'</p>'+
                    '</div>'
                );
            }(),
            defdom: false,
            data: { timeout: options.timeout },
            onrealized: function(dialog) {
                Dialog.notes.push(dialog);
            },
            onshow: function(dialog) {
                var $alert = dialog.getModalDialog().find('[role="alert"]');
                $alert.find("button.close").one('click', {dialog: dialog}, function(e) {
                    dialog.close();
                });
            },
            onshown: function(dialog) {
                var timeout = dialog.getData('timeout');
                if (timeout && timeout > 0) {
                    var $alertDialog = dialog.getModalDialog(), t;
                    var _clearTimeout = function() {
                        t && clearTimeout(t);
                        t = null;
                    };
                    var _setTimeout = function() {
                        _clearTimeout();
                        t = setTimeout(function() {
                            dialog.close();
                        }, timeout);
                    };
                    $alertDialog.on("mouseenter", {call: _clearTimeout}, function(e) {
                        e.data.call();
                    }).on("mouseleave", {call: _setTimeout}, function(e) {
                        e.data.call();
                    });
                    _setTimeout();
                }
            },
            onhide: function(dialog) {
                dialog.getModal().removeClass("right left top bottom").addClass("closing");
            },
            onhidden: function(dialog) {
                Dialog.notes.remove(dialog);
                dialog.getModal().removeClass("closing");
                typeof options.onhidden === "function" && options.onhidden.call(dialog, dialog);
            }
        }).open();
    };
    Dialog.success.defaultOptions = {
        backdrop: false,
        position: 'right top',
        size: {
            width: 'auto',
            minWidth: '20em',
            maxWidth: '40em'
        },
        timeout: 3500,
        icon: 'fa fa-check-circle',
        nl2br: false,
        message: 'Success!'
    };
    Dialog.success.configDefaultOptions = function(options) {
        Dialog.success.defaultOptions = $.extend({}, Dialog.success.defaultOptions, options);
    };

    return Dialog;
});