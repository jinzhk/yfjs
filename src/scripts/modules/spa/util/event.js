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