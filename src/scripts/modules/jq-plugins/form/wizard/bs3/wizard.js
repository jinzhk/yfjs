/*
 * Copyright (C) 2013 Panopta, Andrew Moffat
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*
 * =========================================================
 *
 * Updated by 靳志凯(jinzhk) @ 2015-06-15
 * 1、为了使表单的提交和检验更灵活，将表单分散到了每一个card下面
 *      支持定义每个card下表单的样式自定义
 *       formClass: "form-horizontal"
 *       或
 *       formClass: ["form-horizontal", "", "form-vertical", "form-inline"]
 *       当formClass为数组时，将依照顺序为form表单添加相应class
 *       当formClass为对象时，将按照键索引为form表单添加相应class。其中 '_default' 对应的值为未索引到的所有表单添加class；
*        索引键可以为数字或者card的name，其中card的name优先级较高
 *       例:
 *       formClass: {
 *          '_default': "form-horizontal",
 *          0: "form-inline",
 *          2: "form-vertical"
 *       }
 * 2、改写了WizardCard的select方法等，使支持根据配置在最后一步之前提交表单
 *      submitCards: 0 或 submitCards: [0] 或 submitCards: ['name']
 *      submitCards对应的(数组)值为card的顺序索引或者name索引，name索引优先级较高
 * 3、改写了WizardCard的validate方法，使支持自定义表单校验方法
 *      validate: {i: fn($form)}
 *      其键为card的顺序索引或者name索引，name索引优先级较高；值为返回true或false的自定义校验方法
 * 4、非最后一步提交表单，提交数据将仅处理该步(包含)之前的表单数据
 * 5、wizard对象下添加了方法serializeObject，用于以对象形式返回表单数据
 *
 * Updated by 靳志凯(jinzhk) @ 2015-06-16
 * 添加了对事件show、shown、close、nextClick、backClick等事件的监控
 *
 * Updated by 李永信 @ 2015-06-29
 * 修复最后一步出现两个提交按钮问题
 *
 * Updated by 靳志凯(jinzhk) @ 2015-07-18
 * 1、弹窗框添加了拖拽效果
 * 2、自定义校验方法validate添加异步校验功能，异步校验需要返回jquery的Deferred对象
 * 3、原自定义提交card配置项submitEnabled改为了submitCards
 * =========================================================
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // if AMD loader is available, register as an anonymous module.
        define(['jquery', 'bs/modal'], factory);
    } else {
        // OR use browser globals if AMD is not present
        factory(jQuery, Modal);
    }
}(function ($, Modal) {

    $.fn.wizard = function(args) {
        return new Wizard(this, args);
    };

    $.fn.wizard.logging = false;

    var WizardCard = function(wizard, card, index, prev, next) {
        this.wizard 	= wizard;
        this.index 		= index;
        this.prev 		= prev;
        this.next 		= next;
        this.el 		= card;
        this.title 		= card.find("h3").first().text() || '';
        this.name 		= card.data("cardname") || this.title;

        this.nav 		= this._createNavElement(this.title, index);

        this._disabled 	= false;
        this._loaded 	= false;
        this._events =	 {};
    };

    WizardCard.prototype = {
        select: function() {
            this.log("selecting");
            if (!this.isSelected()) {
                this.nav.addClass("active");
                this.el.show();

                if (!this._loaded) {
                    this.trigger("loaded");
                    this.reload();
                }

                this.trigger("selected");
            }

            /*
             * this is ugly, but we're handling the changing of the wizard's
             * buttons here, in the WizardCard select.  so when a card is
             * selected, we're figuring out if we're the first card or the
             * last card and changing the wizard's buttons via the guts of
             * the wizard
             *
             * ideally this logic should be encapsulated by some wizard methods
             * that we can call from here, instead of messing with the guts
             */
            var w = this.wizard;

            // The back button is only disabled on this first card...
            w.backButton.toggleClass("disabled", this.index == 0);

            w.removeSubmitButton();

            if (this.index >= w._cards.length-1) {
                this.log("on last card, changing next button to submit");

                w.changeNextButton(w.args.buttons.submitText, "btn-success");
                w._readyToSubmit = true;
                w.trigger("readySubmit");
            } else {
                if (
                    (
                        $.isArray(w.args.submitCards) && (
                            $.inArray(this.name, w.args.submitCards) > -1 || $.inArray(this.index, w.args.submitCards) > -1
                        )
                    ) ||
                    (
                        (w.args.submitCards || typeof w.args.submitCards === "number") && (
                            w.args.submitCards === this.name || w.args.submitCards == this.index
                        )
                    )
                ) {
                    this.log("on card " + this.name ? "'"+this.name+"'" : this.index + ", enable submit button");

                    w.createSubmitButton(w.args.buttons.submitText, "btn-success");
                }
                w._readyToSubmit = false;
                w.changeNextButton(w.args.buttons.nextText, "btn-primary");
            }

            return this;
        },

        _createNavElement: function(name, i) {
            var li = $('<li class="wizard-nav-item"></li>');
            var a = $('<a class="wizard-nav-link"></a>');
            a.data("navindex", i);
            li.append(a);
            a.append('<span class="glyphicon glyphicon-chevron-right"></span> ');
            a.append(name);
            return li;
        },

        markVisited: function() {
            this.log("marking as visited");
            this.nav.addClass("already-visited");
            this.trigger("markVisited");
            return this;
        },

        unmarkVisited: function() {
            this.log("unmarking as visited");
            this.nav.removeClass("already-visited");
            this.trigger("unmarkVisited");
            return this;
        },

        deselect: function() {
            this.nav.removeClass("active");
            this.el.hide();
            this.trigger("deselect");
            return this;
        },

        enable: function() {
            this.log("enabling");

            // Issue #38 Hiding navigation link when hide card
            // Awaiting approval
            //
            // this.nav.removeClass('hide');

            this.nav.addClass("active");
            this._disabled = false;
            this.trigger("enabled");
            return this;
        },

        disable: function(hideCard) {
            this.log("disabling");
            this._disabled = true;
            this.nav.removeClass("active already-visited");
            if (hideCard) {
                this.el.hide();
                // Issue #38 Hiding navigation link when hide card
                // Awaiting approval
                //
                // this.nav.addClass('hide');
            }
            this.trigger("disabled");
            return this;
        },

        isDisabled: function() {
            return this._disabled;
        },

        alreadyVisited: function() {
            return this.nav.hasClass("already-visited");
        },

        isSelected: function() {
            return this.nav.hasClass("active");
        },

        reload: function() {
            this._loaded = true;
            this.trigger("reload");
            return this;
        },

        on: function() {
            return this.wizard.on.apply(this, arguments);
        },

        trigger: function() {
            this.callListener("on"+arguments[0]);
            return this.wizard.trigger.apply(this, arguments);
        },

        /*
         * displays an alert box on the current card
         */
        toggleAlert: function(msg, toggle) {
            this.log("toggling alert to: " + toggle);

            toggle = typeof(toggle) == "undefined" ? true : toggle;

            if (toggle) {this.trigger("showAlert");}
            else {this.trigger("hideAlert");}

            var div;
            var alert = this.el.children("h3").first().next("div.alert");

            if (alert.length == 0) {
                /*
                 * we're hiding anyways, so no need to create anything.
                 * we'll do that if we ever are actually showing the alert
                 */
                if (!toggle) {return this;}

                this.log("couldn't find existing alert div, creating one");
                div = $("<div />");
                div.addClass("alert");
                div.addClass("hide");
                div.insertAfter(this.el.find("h3").first());
            }
            else {
                this.log("found existing alert div");
                div = alert.first();
            }

            if (toggle) {
                if (msg != null) {
                    this.log("setting alert msg to", msg);
                    div.html(msg);
                }
                div.show();
            }
            else {
                div.hide();
            }
            return this;
        },

        /*
         * this looks for event handlers embedded into the html of the
         * wizard card itself, in the form of a data- attribute
         */
        callListener: function(name) {
            // a bug(?) in jquery..can't access data-<name> if name is camelCase
            name = name.toLowerCase();

            this.log("looking for listener " + name);
            var listener = window[this.el.data(name)];
            if (listener) {
                this.log("calling listener " + name);
                var wizard = this.wizard;

                try {
                    var vret = listener(this);
                }
                catch (e) {
                    this.log("exception calling listener " + name + ": ", e);
                }
            }
            else {
                this.log("didn't find listener " + name);
            }
        },

        problem: function(toggle) {
            this.nav.find("a").toggleClass("wizard-step-error", toggle);
        },

        validate: function() {
            var failures = false;
            var w = this.wizard;

            if (w.args.validate && typeof w.args.validate === "object"
                && (typeof w.args.validate[this.name] === "function" || typeof w.args.validate[this.index] === "function")) {
                if(typeof w.args.validate[this.name] === "function") {
                    failures = w.args.validate[this.name].call(this, this.el.find("form"));
                } else {
                    failures = w.args.validate[this.index].call(this, this.el.find("form"));
                }
                return failures;
            }

            var self = this;

            /*
             * run all the validators embedded on the inputs themselves
             */
            this.el.find("[data-validate]").each(function(i, el) {
                self.log("validating individiual inputs");
                el = $(el);

                var v = el.data("validate");
                if (!v) {return;}

                var ret = {
                    status: true,
                    title: "Error",
                    msg: ""
                };

                var vret = window[v](el);
                $.extend(ret, vret);

                // Add-On
                // This allows the use of a INPUT+BTN used as one according to boostrap layout
                // for the wizard it is required to add an id with btn-(ID of Input)
                // this will make sure the popover is drawn on the correct element
                if ( $('#btn-' + el.attr('id')).length === 1 ) {
                    el = $('#btn-' + el.attr('id'));
                }

                if (!ret.status) {
                    failures = true;

                    // Updated to show error on correct form-group
                    el.parents("div.form-group").toggleClass("has-error", true);

                    // This allows the use of a INPUT+BTN used as one according to boostrap layout
                    // for the wizard it is required to add an id with btn-(ID of Input)
                    // this will make sure the popover is drawn on the correct element
                    if ( $('#btn-' + el.attr('id')).length === 1 ) {
                        el = $('#btn-' + el.attr('id'));
                    }

                    self.wizard.errorPopover(el, ret.msg);
                } else {
                    el.parents("div.form-group").toggleClass("has-error", false);

                    // This allows the use of a INPUT+BTN used as one according to boostrap layout
                    // for the wizard it is required to add an id with btn-(ID of Input)
                    // this will make sure the popover is drawn on the correct element
                    if ( $('#btn-' + el.attr('id')).length === 1 ) {
                        el = $('#btn-' + el.attr('id'));
                    }

                    try {
                        el.popover("destroy");
                    }
                        /*
                         * older versions of bootstrap don't have a destroy call
                         * for popovers
                         */
                    catch (e) {
                        el.popover("hide");
                    }
                }
            });
            this.log("after validating inputs, failures is", failures);

            /*
             * run the validator embedded in the card
             */
            var cardValidator = window[this.el.data("validate")];
            if (cardValidator) {
                this.log("running html-embedded card validator");
                var cardValidated = cardValidator(this);
                if (typeof(cardValidated) == "undefined" || cardValidated == null) {
                    cardValidated = true;
                }
                if (!cardValidated) failures = true;
                this.log("after running html-embedded card validator, failures is", failures);
            }

            /*
             * run the validate listener
             */
            this.log("running listener validator");
            var listenerValidated = this.trigger("validate");
            if (typeof(listenerValidated) == "undefined" || listenerValidated == null) {
                listenerValidated = true;
            }
            if (!listenerValidated) failures = true;
            this.log("after running listener validator, failures is", failures);

            var validated = !failures;
            if (validated) {
                this.log("validated, calling listeners");
                this.trigger("validated");
            }
            else {
                this.log("invalid");
                this.trigger("invalid");
            }
            return validated;
        },

        log: function() {
            if (!window.console || !$.fn.wizard.logging) {return;}
            var prepend = "card '"+this.name+"': ";
            var args = [prepend];
            args.push.apply(args, arguments);

            console.log.apply(console, args);
        },

        isActive: function() {
            return this.nav.hasClass("active");
        }
    };

    var Wizard = function(markup, args) {

        /* TEMPLATE */
        this.wizard_template = [
            '<div class="wizard-steps pull-left">',
                '<div class="wizard-nav-container">',
                    '<ul class="nav wizard-nav-list">',
                    '</ul>',
                '</div>',
                '<div class="wizard-progress-container">',
                    '<div class="progress progress-striped">',
                        '<div class="progress-bar" style="width: 0%;"></div>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="wizard-cards">',
                '<div class="wizard-card-container">',
                '</div>',
                '<div class="wizard-footer">',
                    '<div class="wizard-buttons-container">',
                        '<button class="btn wizard-cancel wizard-close" type="button">Cancel</button>',
                        '<div class="btn-group-single pull-right">',
                            '<button class="btn wizard-back" type="button">Back</button>',
                            '<button class="btn btn-primary wizard-next" type="button">Next</button>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ];

        this.args = {
            keyboard: true,
            backdrop: true,
            show: false,
            animation: true,
            draggable: true,
            submitUrl: "",
            submitCards: null,
            validate: null,
            showCancel: false,
            showClose: true,
            progressBarCurrent: false,
            increaseHeight: 0,
            contentHeight: 300,
            contentWidth: 580,
            contentMaxHeight: '100%',
            buttons: {
                cancelText: "取消",
                nextText: "下一步",
                backText: "上一步",
                submitText: "提交",
                submittingText: "提交中...",
                validatingText: "验证信息中..."
            },
            formClass: "form-horizontal"
        };

        $.extend(this.args, args || {});

        this._create(markup);
    };

    Wizard.prototype = {
        log: function() {
            if (!window.console || !$.fn.wizard.logging) {return;}
            var prepend = "wizard "+this.modal.id+": ";
            var args = [prepend];
            args.push.apply(args, arguments);
            console.log.apply(console, args);
        },

        _create: function(markup) {
            this.element                =   $(markup);
            this.title					= 	this.element.data('title');
            this.markup                 =   this.element.children().clone(true);
            this.markup_bak             =   this.markup.clone(true);

            this.element.empty();

            var wizardCardSelector      =   ".wizard-card",
                submitCards             =   ".wizard-error,.wizard-failure,.wizard-success,.wizard-loading";

            this.submitCards 			= 	this.markup.filter(submitCards);
            this.submitCards            =   this.submitCards.add(this.markup.find(submitCards));

            var self = this;

            this.dialogModal                  =   new Modal({
                type: '',
                title: self.title,
                message: this.wizard_template.join('\n'),
                closable: self.args.showClose,
                backdrop: self.args.backdrop,
                closeByKeyboard: self.args.keyboard,
                closeByBackdrop: self.args.backdrop === "static" ? false : true,
                cssClass: "wizard",
                position: "center",
                size: {
                    height: this.args.contentHeight,
                    maxHeight: this.args.contentMaxHeight,
                    width: this.args.contentWidth
                },
                animation: self.args.animation,
                draggable: self.args.draggable,
                buttons: null,
                onrealized: function() {
                    self.wizardCardContainer && self.footer
                    && self.wizardCardContainer.css('bottom', self.footer.outerHeight());
                    self.dialogModal.setSize({
                        height: self.dialog.outerHeight() + self.header.outerHeight()
                    }, true);
                    self.trigger("realized");
                },
                onshow: function() {
                    self.trigger("show");
                },
                onshown: function() {
                    self.trigger("shown");
                },
                onhide: function() {
                    self.trigger("close");
                },
                onhidden: function() {
                    self.reset();
                    self.element.empty().append(self.markup_bak);
                    self.markup_bak = null;
                    self.realized = false;
                    self.trigger("closed");
                }
            });

            this.dialogModal.realize();

            this.dialogModal.getModalContent().addClass("wizard-content");
            this.dialogModal.getModalDialog().addClass("wizard-dialog");
            this.dialogModal.getModalHeader().addClass("wizard-header");
            this.dialogModal.getModalHeader().find(".close").addClass("wizard-close");
            this.dialogModal.getModalHeader().find(".modal-title").addClass("wizard-title");
            this.dialogModal.getModalHeader().append('<span class="wizard-subtitle"></span>');
            this.dialogModal.getModalBody().addClass("wizard-body");
            this.dialogModal.getModalFooter().hide();

            this.el                     =   this.dialogModal.getModal();
            this.modal                  =   this.el;

            this.content 				= 	this.modal.find('.wizard-content');
            this.dialog 				=	this.dialogModal.getModalDialog();
            this.header 				= 	this.dialog.find('.wizard-header');
            this.body 					= 	this.dialog.find('.wizard-body');
            this.wizardSteps			= 	this.body.find('.wizard-steps');
            this.wizardCards			=	this.body.find('.wizard-cards');
            this.wizardCardContainer	=	this.body.find('.wizard-card-container');
            this.wizardCardContainer
                .append(this.markup.filter(wizardCardSelector).add(this.markup.find(wizardCardSelector)))
                .append(this.submitCards);
            this.navContainer 			= 	this.body.find('.wizard-nav-container');
            this.navList				= 	this.body.find('.wizard-nav-list');
            this.progressContainer		= 	this.body.find('.wizard-progress-container');
            this.progress				= 	this.progressContainer.find('.progress-bar');
            this.closeButton 			= 	this.content.find('button.wizard-close.close');
            this.cardsContainer			=	this.body.find('wizard-cards-container');
            this.footer 				= 	this.body.find(".wizard-footer");
            this.cancelButton 			= 	this.footer.find(".wizard-cancel");
            this.backButton 			= 	this.footer.find(".wizard-back");
            this.nextButton 			= 	this.footer.find(".wizard-next");

            this._cards 				= 	[];
            this.cards 					= 	{};
            this._readyToSubmit 		= 	false;
            this.percentComplete 		=	0;
            this._submitting 			= 	false;
            this._events 				= 	{};
            this._firstShow 			= 	true;

            this._createCards();

            this.cancelButton.text(this.args.buttons.cancelText);
            this.backButton.text(this.args.buttons.backText);
            this.nextButton.text(this.args.buttons.nextText);

            this.form                   =   $( [] );
            $.each(this._cards, function(i, currentCard) {
                if(!self.form) {
                    self.form = currentCard.el.find("form");
                } else {
                    self.form = self.form.add(currentCard.el.find("form"));
                }
            });

            // Apply Form Class(es)
            if(typeof this.args.formClass === "string") {
                this.form.addClass(this.args.formClass);
            } else if(typeof this.args.formClass === "object") {
                var formClass;
                $.each(this._cards, function(i, currentCard) {
                    formClass = self.args.formClass[currentCard.name] || self.args.formClass[i] || self.args.formClass['_default'];
                    formClass && currentCard.el.find("form").addClass(formClass);
                });
                formClass = null;
            }

            // Register Array Holder for popovers
            this.popovers				= [];

            if ( this.title.length != 0 ) {
                this.setTitle(this.title);
            }

            // attach Events
            this.nextButton.off("click").on("click", this, this._handleNextClick);
            this.backButton.off("click").on("click", this, this._handleBackClick);

            var _close = function() {
                self.close();
            };

            // Register Close Button
            this.closeButton.off("click").on("click", _close);
            this.cancelButton.off("click").on("click", _close);

            this.wizardSteps.off("click").on("click", "li.already-visited a.wizard-nav-link", this,
                function(event) {
                    var index = parseInt($(event.target).data("navindex"));
                    event.data.setCard(index);
                });

            this.on("submit", this._defaultSubmit);

            this.realized = true;

            this.args.show && this.show();
        },

        setTitle: function(title) {
            this.log("setting title to", title);
            this.header.find(".wizard-title").first().text(title);
            return this;
        },

        setSubtitle: function(title) {
            this.log("setting subtitle to", title);
            this.header.find(".wizard-subtitle").first().text(title);
            return this;
        },

        errorPopover: function(el, msg, allowHtml) {
            this.log("launching popover on", el);
            allowHtml = typeof allowHtml !== "undefined" ? allowHtml : false;
            var popover = el.popover({
                content: msg,
                trigger: "manual",
                html: allowHtml,
                container: el.parents('.form-group')
            }).addClass("error-popover").popover("show").next(".popover");

            el.parents('.form-group').find('.popover').addClass("error-popover");

            this.popovers.push(el);

            return popover;
        },

        destroyPopover: function(pop) {
            pop = $(pop);

            /*
             * this is the element that the popover was created for
             */
            try {
                pop.popover("destroy");
            }
                /*
                 * older versions of bootstrap don't have a destroy call
                 * for popovers
                 */
            catch (e) {
                pop.popover("hide");
            }
        },

        hidePopovers: function(el) {
            this.log("hiding all popovers");
            var self = this;

            $.each(this.popovers, function(i, p) {
                self.destroyPopover(p);
            });

            this.body.find('.has-error').removeClass('has-error');
            this.popovers = [];
        },

        eachCard: function(fn) {
            $.each(this._cards, fn);
            return this;
        },

        getActiveCard: function() {
            this.log("getting active card");
            var currentCard = null;

            $.each(this._cards, function(i, card) {
                if (card.isActive()) {
                    currentCard = card;
                    return false;
                }
            });
            if (currentCard) {this.log("found active card", currentCard);}
            else {this.log("couldn't find an active card");}
            return currentCard;
        },

        changeNextButton: function(text, cls) {
            this.log("changing next button, text: " + text, "class: " + cls);
            if (typeof(cls) != "undefined") {
                this.nextButton.removeClass("btn-success btn-primary");
            }

            if (cls) {
                this.nextButton.addClass(cls);
            }
            this.nextButton.text(text);
            return this;
        },

        createSubmitButton: function(text, cls) {
            var self = this;
            if(!this.submitButton || this.submitButton.length <= 0) {
                this.log("creating submit button, text: " + text, "class: " + cls);
                var $btn = $('<button/>').addClass('btn wizard-submit');
                if (text) {
                    $btn.text(text);
                }
                if (cls) {
                    $btn.addClass(cls);
                }
                this.nextButton.before($btn);
                this.submitButton = this.nextButton.siblings('.wizard-submit:first');
                this.submitButton.on('click', this, function(e) {
                    var wizard = e.data;
                    var currentCard = wizard ? wizard.getActiveCard() : null, valid;
                    if(currentCard && (valid = currentCard.validate())) {
                        wizard._submittingCard = currentCard;
                        var doSubmit = function(wizard) {
                            wizard._initFormToSubmit();
                            wizard._submit();
                        };
                        if (wizard._isDeferred(valid)) {
                            wizard._validateDeferred(currentCard, valid.validatingText);
                            (function(wizard) {
                                $.when(valid)
                                 .done(function(res) {
                                    wizard._validateResolve();
                                    if(res || typeof res === "undefined") doSubmit(wizard);
                                 })
                                 .fail(function() {
                                    wizard._validateResolve();
                                 });
                            })(wizard);

                        } else {
                            doSubmit(wizard);
                        }
                    }
                    currentCard = null;
                    wizard = null;
                });
            }
            return this;
        },

        removeSubmitButton: function() {
            if(this.submitButton) {
                this.submitButton.off('click');
                this.submitButton.remove();
                this.submitButton = null;
            }
            return this;
        },

        hide: function() {
            this.log("hiding");
            this.dialogModal.close();
            return this;
        },

        close: function() {
            this.log("closing");
            this.dialogModal.close();
            return this;
        },

        show: function(modalOptions) {
            this.log("showing");
            if(!this.realized) {
                this._create(this.element);
            }
            if (this._firstShow) {
                this.setCard(0);
                this._firstShow = false;
            }
            if (this.args.showCancel) {
                this.cancelButton.show();
            } else {
                this.cancelButton.hide();
            }
            if (this.args.showClose) { this.closeButton.show(); }
            this.dialogModal.open();

            return this;
        },

        on: function(name, fn) {
            this.log("adding listener to event " + name);
            this._events[name] = fn;
            return this;
        },

        trigger: function() {
            var name = arguments[0];
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            args.unshift(this);

            this.log("firing event " + name);
            var handler = this._events[name];
            if (handler === undefined && this.wizard !== undefined) {
                handler = this.wizard._events[name];
            }
            var ret = null, self = this;

            if (typeof(handler) == "function") {
                this.log("found event handler, calling " + name);
                try {
                    ret = handler.apply(this, args);
                    // 单独处理提交事件
                    if (name === "submit" && this._isDeferred(ret)) {
                        $.when(ret)
                         .done(function(res) {
                            if (res || typeof res === "undefined") {
                                self.submitSuccess();
                            } else {
                                self.submitError();
                            }
                         })
                         .fail(function(xhr, status, res) {
                            self.submitFailure();
                         });
                    }
                }
                catch (e) {
                    this.log("event handler " + name + " had an exception");
                }
            }
            else {
                this.log("couldn't find an event handler for " + name);
            }
            return ret;
        },


        reset: function() {
            if (this.realized) {
                this.log("resetting");

                this.updateProgressBar(0);
                this.hideSubmitCards();

                this.setCard(0);
                this.lockCards();

                this.enableNextButton();
                this.showButtons();

                this.hidePopovers();

                this.trigger("reset");
            }

            return this;
        },

        /*
         * this handles switching to the next card or previous card, taking
         * care to skip over disabled cards
         */
        _abstractIncrementStep: function(direction, getNext) {
            var current = this.getActiveCard();
            var next;

            if (current) {
                /*
                 * loop until we find a card that isn't disabled
                 */
                this.log("searching for valid next card");
                while (true) {
                    next = getNext(current);
                    if (next) {
                        this.log("looking at card", next.index);
                        if (next.isDisabled()) {
                            this.log("card " + next.index + " is disabled/locked, continuing");
                            current = next;
                            continue;
                        }
                        else {
                            return this.setCard(current.index+direction);
                        }
                    }
                    else {
                        this.log("next card is not defined, breaking");
                        break;
                    }
                }
            }
            else {
                this.log("current card is undefined");
            }
        },


        incrementCard: function() {
            this.log("incrementing card");
            var card = this._abstractIncrementStep(1, function(current){return current.next;});
            this.trigger("incrementCard");
            return card;
        },

        decrementCard: function() {
            this.log("decrementing card");
            var card = this._abstractIncrementStep(-1, function(current){return current.prev;});
            this.trigger("decrementCard");
            return card;
        },

        setCard: function(i) {
            this.log("setting card to " + i);
            this.hideSubmitCards();
            var currentCard = this.getActiveCard();

            if (this._submitting) {
                this.log("we're submitting the wizard already, can't change cards");
                return currentCard;
            }

            var newCard = this._cards[i];
            if (newCard) {
                if (newCard.isDisabled()) {
                    this.log("new card is currently disabled, returning");
                    return currentCard;
                }

                var self = this;

                if (currentCard) {

                    /*
                     * here, we're only validating if we're going forward,
                     * not if we're going backwards in a step
                     */
                    if (i > currentCard.index) {
                        var cardToValidate = currentCard;
                        var ok = false;

                        /*
                         * we need to loop over every card between our current
                         * card and the card that we clicked, and re-validate
                         * them.  if there's an error, we need to select the
                         * first card to have an error
                         */
                        while (cardToValidate.index != newCard.index) {
                            /*
                             * unless we're validating the card that we're
                             * leaving, we need to select the card, so that
                             * any validators that trigger errorPopovers can
                             * display correctly
                             */
                            if (cardToValidate.index != currentCard.index) {
                                cardToValidate.prev.deselect();
                                cardToValidate.prev.markVisited();
                                cardToValidate.select();
                            }
                            ok = cardToValidate.validate();
                            if (!ok) {
                                return cardToValidate;
                            } else if (this._isDeferred(ok)) {
                                this._validateDeferred(cardToValidate, ok.validatingText);
                                $.when(ok)
                                    .done(function(res) {
                                        if (res || typeof res === "undefined") {
                                            self._validateResolve(true);
                                            self.setCard(newCard.index);
                                        } else {
                                            self._validateResolve();
                                        }
                                    })
                                    .fail(function() {
                                        self._validateResolve();
                                    });
                                return cardToValidate;
                            }
                            cardToValidate = cardToValidate.next;
                        }

                        cardToValidate.prev.deselect();
                        cardToValidate.prev.markVisited();
                    }

                    currentCard.deselect();
                    currentCard.markVisited();
                }

                newCard.select();

                if (this.args.progressBarCurrent) {
                    this.percentComplete = i * 100.0 / this._cards.length;
                    this.updateProgressBar(this.percentComplete);
                }
                else {
                    var lastPercent = this.percentComplete;
                    this.percentComplete = i * 100.0 / this._cards.length;
                    this.percentComplete = Math.max(lastPercent, this.percentComplete);
                    this.updateProgressBar(this.percentComplete);
                }

                return newCard;
            }
            else {
                this.log("couldn't find card " + i);
            }
        },

        updateProgressBar: function(percent, active) {
            this.log("updating progress to " + percent + "%");
            this.progress.css({width: percent + "%"});
            this.percentComplete = percent;

            this.trigger("progressBar", percent);

            typeof active === "undefined" && (active = true);

            if (percent >= 100) {
                this.log("progress is 100, animating progress bar");
                if (active) {
                    this.progressContainer.find('.progress').addClass("active");
                } else {
                    this.progressContainer.find('.progress').removeClass("active");
                }
            }
            else if (percent <= 0) {
                this.log("progress is 0, disabling animation");
                this.progressContainer.find('.progress').removeClass("active");
            }
        },

        getNextCard: function() {
            var currentCard = this.getActiveCard();
            if (currentCard) return currentCard.next;
        },

        lockCards: function() {
            this.log("locking nav cards");
            this.eachCard(function(i,card){card.unmarkVisited();});
            return this;
        },

        disableCards: function() {
            this.log("disabling all nav cards");
            this.eachCard(function(i,card){card.disable();});
            return this;
        },

        enableCards: function() {
            this.log("enabling all nav cards");
            this.eachCard(function(i,card){card.enable();});
            return this;
        },

        hideCards: function() {
            this.log("hiding cards");
            this.eachCard(function(i,card){card.deselect();});
            this.hideSubmitCards();
            return this;
        },

        hideButtons: function() {
            this.log("hiding buttons");
            this.dialogModal.setClosable(false);
            this.cancelButton.hide();
            this.nextButton.hide();
            this.backButton.hide();
            this.submitButton && this.submitButton.hide();
            return this;
        },

        showButtons: function() {
            this.log("showing buttons");
            this.dialogModal.setClosable(true);
            if (this.args.showCancel) {
                this.cancelButton.show();
            } else {
                this.cancelButton.hide();
            }
            this.nextButton.show();
            this.backButton.show();
            this.submitButton && this.submitButton.show();
            return this;
        },

        getCard: function(el) {
            var cardDOMEl = $(el).parents(".wizard-card").first()[0];
            if (cardDOMEl) {
                var foundCard = null;
                this.eachCard(function(i, card) {
                    if (cardDOMEl == card.el[0]) {
                        foundCard = card;
                        return false;
                    }
                    return true;
                });
                return foundCard;
            }
            else {
                return null;
            }
        },

        _createCards: function() {
            var prev = null;
            var next = null;
            var currentCard = null;
            var wizard = this;
            var self = this;

            self.log("Creating Cards");

            var cards = this.body.find(".wizard-cards .wizard-card");
            $.each(cards, function(i, card) {
                card = $(card);

                // wrap form
                if(!card.is("form") && card.find("form").length <= 0) {
                    card.wrapInner('<form class="wizard-form"></form>');
                }

                prev = currentCard;
                currentCard = new WizardCard(wizard, card, i, prev, next);
                self._cards.push(currentCard);
                if (currentCard.name) {
                    self.cards[currentCard.name] = currentCard;
                }
                if (prev) {prev.next = currentCard;}

                self.body.find(".wizard-steps .wizard-nav-list").append(currentCard.nav);
            });
        },

        showSubmitCard: function(name) {
            this.log("showing "+name+" submit card");

            var card = this.submitCards.filter(".wizard-"+name);
            if (card.length) {
                this.hideCards();
                card.show();
                return true;
            }
            else {
                this.log("couldn't find submit card "+name);
                return false;
            }
        },

        hideSubmitCard: function(name) {
            this.log("hiding "+name+" submit card");
            this.submitCards.filter(".wizard-"+name).hide();
        },

        hideSubmitCards: function() {
            var wizard = this;
            $.each(["success", "error", "failure", "loading"], function(i, name) {
                wizard.hideSubmitCard(name);
            });
        },

        enableNextButton: function() {
            this.log("enabling next button");
            this.nextButton.removeAttr("disabled");
            return this;
        },

        disableNextButton: function() {
            this.log("disabling next button");
            this.nextButton.attr("disabled", "disabled");
            return this;
        },

        serializeArray: function() {
            var doSerializeArray = function($form) {
                if(!$form) return [];
                var data;
                if($form.length > 1) {
                    data = [];
                    $.each($form, function(i, form) {
                        data = data.concat(doSerializeArray($(form)));
                    });
                } else if($form.length > 0) {
                    data = $form.serializeArray() || [];
                    var formObj;
                    $form.find('input[disabled][data-serialize="1"]').each(function() {
                        if($(this).attr('name')) {
                            formObj = {
                                name: $(this).attr('name'),
                                value: $(this).val()
                            };
                            data.push(formObj);
                        }
                    });
                    formObj = null;
                }
                return data;
            };

            return doSerializeArray(this._formToSubmit || this.form);
        },

        serializeObject: function() {
            var o = {};
            var a = this.serializeArray();
            if(a) {
                $.each(a, function() {
                    if(typeof this.name !== "undefined") {
                        if(typeof o[this.name] !== 'undefined') {
                            if($.isArray(o[this.name])) {
                                o[this.name].push(this.value || '');
                            } else {
                                o[this.name] = [o[this.name]];
                            }
                        } else {
                            o[this.name] = this.value || '';
                        }
                    }
                });
            }
            a = null;
            return o;
        },

        serialize: function() {
            var doSerialize = function($form) {
                if(!$form) return '';
                var data;
                if($form.length > 1) {
                    data = '';
                    $.each($form, function(i, form) {
                        var ret = doSerialize($(form));
                        if(ret) {
                            data += ((data.length ? '&' : '') + ret);
                        }
                        ret = null;
                    });
                } else if($form.length > 0) {
                    data = $form.serialize() || '';
                    $form.find('input[disabled][data-serialize="1"]').each(function() {
                        var ret = $(this).attr('name') + '=' + $(this).val();
                        if(ret) {
                            data += ((data.length ? '&' : '') + ret);
                        }
                        ret = null;
                    });
                }
                return data;
            };

            return doSerialize(this._formToSubmit || this.form);
        },

        find: function(selector) {
            return this.modal.find(selector);
        },


        /*
         * the next 3 functions are to be called by the custom submit event
         * handler.  the idea is that after you make an ajax call to submit
         * your wizard data (or whatever it is you want to do at the end of
         * the wizard), you call one of these 3 handlers to display a specific
         * card for either success, failure, or error
         */
        submitSuccess: function() {
            this.log("submit success");
            this._submitting = false;
            this.hideButtons();
            this.updateProgressBar(100, false);
            this.showSubmitCard("success");
            this.trigger("submitSuccess");
        },

        submitFailure: function() {
            this.log("submit failure");
            this._submitting = false;
            if (!this.showSubmitCard("failure")) {
                this.resetSubmitCard();
            } else {
                this.updateProgressBar(100, false);
                this.dialogModal.setClosable(true);
            }
            this.trigger("submitFailure");
        },

        submitError: function() {
            this.log("submit error");
            this._submitting = false;
            if (!this.showSubmitCard("error")) {
                this.resetSubmitCard();
            } else {
                this.updateProgressBar(100, false);
                this.dialogModal.setClosable(true);
            }
            this.trigger("submitError");
        },

        resetSubmitCard: function() {
            if (this._submittingCard) {
                this.eachCard(function(i, card) {
                    card.enable();
                    card.deselect();
                    if (!card._loaded) {
                        card.unmarkVisited();
                    } else {
                        card.markVisited();
                    }
                    if (card.index < this.wizard._submittingCard.index) {
                        card.markVisited();
                    } else if(card.index == this.wizard._submittingCard.index) {
                        card.enable();
                        card.el.show();
                    }
                });

                this.showButtons();

                this.dialogModal.setClosable(true);

                this.changeNextButton(this.args.buttons.nextText, "btn-primary");
                this.enableNextButton();

                this.updateProgressBar(this._submittingCard.index / this._cards.length * 100);

                this._submittingCard.select();

                delete this._submittingCard;
            } else {
                this.reset();
            }
            this.hideSubmitCards();
        },


        _submit: function() {
            this.log("submitting wizard");
            this._submitting = true;

            this.removeSubmitButton();

            this.lockCards();
            this.cancelButton.hide();
            this.closeButton.hide();
            this.backButton.hide();

            this.dialogModal.setClosable(false);

            this.showSubmitCard("loading");
            this.updateProgressBar(100);

            this.changeNextButton(this.args.buttons.submittingText, false);
            this.disableNextButton();

            var ret = this.trigger("submit");
            this.trigger("loading");

            return ret;
        },

        _initFormToSubmit: function() {
            // init submit enabled form
            this._formToSubmit = null;
            var currentCard = this.getActiveCard();
            for (var i=0; i<=currentCard.index; i++) {
                if (!this._formToSubmit) {
                    this._formToSubmit = this._cards[i].el.find("form");
                } else {
                    this._formToSubmit = this._formToSubmit.add(this._cards[i].el.find("form"));
                }
            }
        },

        _onNextClick: function() {
            this.log("handling 'next' button click");
            var self = this, currentCard = this.getActiveCard(), valid;
            if (this._readyToSubmit && (valid = currentCard.validate())) {
                this._submittingCard = currentCard;
                if (this._isDeferred(valid)) {
                    this._validateDeferred(currentCard, valid.validatingText);
                    $.when(valid)
                     .done(function(res) {
                        self._validateResolve();
                        if(res || typeof res === "undefined") self._submit();
                     })
                     .fail(function() {
                        self._validateResolve();
                     });
                } else {
                    this._submit();
                }
            }
            else {
                currentCard = this.incrementCard();
            }
            this.trigger("nextClick");
        },

        _onBackClick: function() {
            this.log("handling 'back' button click");
            var currentCard = this.decrementCard();
            this.trigger("backClick");
        },

        _handleNextClick: function(event) {
            var wizard = event.data;
            wizard._onNextClick.call(wizard);
        },

        _handleBackClick: function(event) {
            var wizard = event.data;
            wizard._onBackClick.call(wizard);
        },

        _isDeferred: function(o) {
            return o && typeof o === "object" && (typeof o.done === "function" && typeof o.fail === "function");
        },

        _validateDeferred: function(validateCard, validatingText) {
            this._validatingCard = validateCard;
            this.disableCards();

            this.cancelButton.hide();
            this.closeButton.hide();
            this.backButton.hide();
            this.submitButton && this.submitButton.hide();

            this.dialogModal.setClosable(false);

            validatingText = validatingText || this.args.buttons.validatingText;
            this.changeNextButton(validatingText, false);
            this.disableNextButton();
        },

        _validateResolve: function(res) {
            this.eachCard(function(i, card) {
                card.enable();
                card.deselect();
                if (!card._loaded) {
                    card.unmarkVisited();
                } else {
                    card.markVisited();
                }
                if (this.wizard._validatingCard) {
                    if (card.index < this.wizard._validatingCard.index) {
                        !card.alreadyVisited() && card.markVisited();
                    }
                    if (card.index == (res ? this.wizard._validatingCard.index + 1 : this.wizard._validatingCard.index)) {
                        card.enable();
                        card.el.show();
                    }
                }
            });
            this._validatingCard && (delete this._validatingCard);

            this.showButtons();

            this.dialogModal.setClosable(true);

            this.changeNextButton(this.args.buttons.nextText, "btn-primary");
            this.enableNextButton();
        },


        /*
         * this function is attached by default to the wizard's "submit" event.
         * if you choose to implement your own custom submit logic, you should
         * copy how this function works
         */
        _defaultSubmit: function(wizard) {
            return $.ajax({
                type: "POST",
                url: wizard.args.submitUrl,
                data: wizard.serialize(),
                dataType: "json"
            });
        }
    };


}));
