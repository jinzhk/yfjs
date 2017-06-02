/*
 * Fuel UX Wizard
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the BSD New license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// For more information on UMD visit:
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

/*!
 * Updated by jinzhk on 2015-11-09
 *
 * 1、添加配置项orient，支持设置步骤菜单和内容排列顺序
 * 2、添加对步骤表单的支持
 *  1) 支持动态设置可提交的步骤数
 *  2) 支持动态设置步骤的可提交状态
 *  3) 支持自定义提交参数
 *  4) 支持自定义提交操作
 *  5) 支持自定义步骤表单的校验方法
 */

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {
	// -- END UMD WRAPPER PREFACE --

	// -- BEGIN MODULE CODE HERE --

	var old = $.fn.wizardStep;

	// WIZARD CONSTRUCTOR AND PROTOTYPE

	var Wizard = function (element, options) {
		var kids;

		this.$element = $(element);
		this.options = $.extend(true, {}, Wizard.DEFAULTS, options);
		this.options.disablePreviousStep = (this.$element.attr('data-restrict') === 'previous') ? true : this.options.disablePreviousStep;
        if (options && options.formSubmitting && $.isArray(options.formSubmitting.steps)) {
            this.options.formSubmitting.steps = [].concat(options.formSubmitting.steps);
        }

        this.borderH       = 0;  // 边框高
        this.actionsH      = 0;  // 操作按钮包裹层高
        this.stepContentDH = 0;  // stepContent与stepPane的高度差

		this.currentStep = this.options.stepIndex;
		this.numSteps = this.$element.find('.steps li').length;

		this.$prevBtn = this.$element.find('.btn-prev');
		this.$nextBtn = this.$element.find('.btn-next');
        this.$submitBtn = this.$element.find('.btn-submit');

        this.$submitBtn.hide();
        this.disableSubmit();

        this.$element.removeClass("wizard-orient-horizontal wizard-orient-vertical").addClass("wizard-orient-" + this.options.orient);

        this.borderH = this.$element.outerHeight() - this.$element.innerHeight();
        this.actionsH = this.$element.find(".actions").outerHeight();

        if (this.options.orient === "vertical") {
            var $stepContent = this.$element.find(".step-content:first"),
                stepContentPt = parseFloat($stepContent.css('padding-top')) || 0,
                stepContentPb = parseFloat($stepContent.css('padding-bottom')) || 0,
                stepContentBorderH = $stepContent.outerHeight() - $stepContent.innerHeight();
            $stepContent.css('bottom', this.actionsH);
            this.stepContentDH = this.actionsH + stepContentPt + stepContentPb + stepContentBorderH;
        }

		kids = this.$nextBtn.children().detach();
		this.nextText = $.trim(this.$nextBtn.text());
		this.$nextBtn.append(kids);

		// handle events
		this.$prevBtn.on('click.bs.wizard', $.proxy(this.previous, this));
		this.$nextBtn.on('click.bs.wizard', $.proxy(this.next, this));
        this.$submitBtn.on('click.bs.wizard', $.proxy(this.submit, this));
		this.$element.on('click.bs.wizard', 'li.complete', $.proxy(this.stepclicked, this));
        this.$element.on('changed.bs.wizard', $.proxy(this.changed, this));

		this.selectStep(this.options.stepIndex);

		if (this.options.disablePreviousStep) {
			this.$prevBtn.prop('disabled', true);
			this.$element.find('.steps').addClass('previous-disabled');
		}
	};

    Wizard.DEFAULTS = {
        disablePreviousStep: false,
        // 为 -1 则自动查找其下含有 "active" 样式class的元素设置步骤
        stepIndex: -1,
        // 高度设置
        height: "auto",
        // 最小高度设置
        minHeight: 0,
        // 步骤菜单和内容排版方式，可选 horizontal（水平排列） 或 vertical（垂直排列）
        orient: "horizontal",
        // 是否启用表单模式。若启用，最后一步自动触发提交事件
        formMode: false,
        // 表单提交时配置
        formSubmitting: {
            // 设置（除最后一步外）可提交的步骤数。每项可为 data-step 或 data-name 对应值
            steps: [],
            // 提交时ajax参数，可为 string 或 object 类型
            ajaxOptions: null,
            // 表单验证，object类型，每项如{stepIndex: function() {}}, stepIndex 可为 data-step 或 data-name 对应值
            validations: {},
            // 自定义提交操作
            action: null,
            // 提交成功后的回调。设置action时无效
            success: null,
            // 提交失败后的回调。设置action时无效
            error: null
        },
        // 步骤改变后的回调
        onChanged: null
    };

	Wizard.prototype = {

		constructor: Wizard,

		destroy: function () {
			this.$element.remove();
			// any external bindings [none]
			// empty elements to return to original markup [none]
			// returns string of markup
			return this.$element[0].outerHTML;
		},

		//index is 1 based
		//second parameter can be array of objects [{ ... }, { ... }] or you can pass n additional objects as args
		//object structure is as follows (all params are optional): { badge: '', label: '', pane: '' }
		addSteps: function (index) {
			var items = [].slice.call(arguments).slice(1);
			var $steps = this.$element.find('.steps');
			var $stepContent = this.$element.find('.step-content');
			var i, l, $pane, $startPane, $startStep, $step;

			index = (index === -1 || (index > (this.numSteps + 1))) ? this.numSteps + 1 : index;
			if (items[0] instanceof Array) {
				items = items[0];
			}

			$startStep = $steps.find('li:nth-child(' + index + ')');
			$startPane = $stepContent.find('.step-pane:nth-child(' + index + ')');
			if ($startStep.length < 1) {
				$startStep = null;
			}

			for (i = 0, l = items.length; i < l; i++) {
				$step = $('<li data-step="' + index + '"><span class="badge badge-info"></span></li>');
				$step.append(items[i].label || '').append('<span class="chevron"></span>');
				$step.find('.badge').append(items[i].badge || index);

                if (items[i].name) {
                    $step.attr('data-name', items[i].name);
                }

				$pane = $('<div class="step-pane" data-step="' + index + '"></div>');
				$pane.append(items[i].pane || '');

				if (!$startStep) {
					$steps.append($step);
					$stepContent.append($pane);
				} else {
					$startStep.before($step);
					$startPane.before($pane);
				}

				index++;
			}

			this.syncSteps();
			this.numSteps = $steps.find('li').length;
			this.setState();
		},

		//index is 1 based, howMany is number to remove
		removeSteps: function (index, howMany) {
			var action = 'nextAll';
			var i = 0;
			var $steps = this.$element.find('.steps');
			var $stepContent = this.$element.find('.step-content');
			var $start;

            var removed = [];

			howMany = (howMany !== undefined) ? howMany : 1;

			if (index > $steps.find('li').length) {
				$start = $steps.find('li:last');
			} else {
				$start = $steps.find('li:nth-child(' + index + ')').prev();
				if ($start.length < 1) {
					action = 'children';
					$start = $steps;
				}

			}

			$start[action]().each(function () {
				var item = $(this);
				var step = item.attr('data-step'), stepName = item.attr('data-name');
				if (i < howMany) {
					var removedItem = item.remove(),
                        removedStepPane = $stepContent.find('.step-pane[data-step="' + step + '"]:first').remove();
                    var badge = removedItem.find(".badge").html(),
                        pane = removedStepPane.html(),
                        label = "", startLabel = false;
                    $.each(this.childNodes, function(n, node) {
                        if (startLabel) {
                            if ($(node).is(".chevron")) {
                                startLabel = false;
                                return false;
                            }
                            if (node.nodeName === "#text") {
                                label += node.nodeValue;
                            } else {
                                label += node.outerHTML;
                            }
                        } else if ($(node).is(".badge")) {
                            startLabel = true;
                        }
                    });
                    removed.push({
                        name: stepName,
                        badge: badge,
                        label: label,
                        pane: pane
                    });
				} else {
					return false;
				}

				i++;
			});

			this.syncSteps();
			this.numSteps = $steps.find('li').length;
			this.setState();

            return removed;
		},

		setState: function () {
			var canMovePrev = (this.currentStep > 1);//remember, steps index is 1 based...
			var isFirstStep = (this.currentStep === 1);
			var isLastStep = (this.currentStep === this.numSteps);

            // current step
            var $currentStep = this.getStep();

			// disable buttons based on current step
			if (!this.options.disablePreviousStep) {
				this.$prevBtn.prop('disabled', (isFirstStep === true || canMovePrev === false));
			}
            if (this.options.formMode) {
                if (isLastStep || ~$.inArray(this.currentStep, this.options.formSubmitting.steps)
                    || ~$.inArray($currentStep.attr('data-name'), this.options.formSubmitting.steps)) {
                    this.enableSubmit();
                    this.$submitBtn.show();
                } else {
                    this.$submitBtn.hide();
                    this.disableSubmit();
                }
                if (isLastStep) {
                    this.$nextBtn.hide();
                    this.disableNext();
                } else {
                    this.enableNext();
                    this.$nextBtn.show();
                }
            }

			// change button text of last step, if specified
			var last = this.$nextBtn.attr('data-last');
			if (last) {
                this.lastText = last;
				// replace text
				var text = this.nextText;
				if (isLastStep === true) {
                    text = this.lastText;
					// add status class to wizard
					this.$element.addClass('complete');
				} else {
					this.$element.removeClass('complete');
				}

				var kids = this.$nextBtn.children().detach();
				this.$nextBtn.text(text).append(kids);
			}

			// reset classes for all steps
			var $steps = this.$element.find('.steps li');
			$steps.removeClass('active').removeClass('complete');
			$steps.find('span.badge').removeClass('badge-info').removeClass('badge-success');

			// set class for all previous steps
			var prevSelector = '.steps li:lt(' + (this.currentStep - 1) + ')';
			var $prevSteps = this.$element.find(prevSelector);
			$prevSteps.addClass('complete');
			$prevSteps.find('span.badge').addClass('badge-success');

			// set class for current step
			$currentStep.addClass('active');
			$currentStep.find('span.badge').addClass('badge-info');

			// set display of target element
			var $stepContent = this.$element.find('.step-content');
            var $currentStepPane = this.getStepPane();
			$stepContent.find('.step-pane').removeClass('active');
            $currentStepPane.addClass('active');

			// reset the wizard position to the left
			this.$element.find('.steps').first().attr('style', 'margin-left: 0');

            if (this.options.orient === "horizontal") {
                // check if the steps are wider than the container div when orient is horizontal
                var totalWidth = 0;
                this.$element.find('.steps > li').each(function () {
                    totalWidth += $(this).outerWidth();
                });
                var containerWidth = 0;
                if (this.$element.find('.actions').length) {
                    containerWidth = this.$element.width() - this.$element.find('.actions').first().outerWidth();
                } else {
                    containerWidth = this.$element.width();
                }

                if (totalWidth > containerWidth) {
                    // set the position so that the last step is on the right
                    var newMargin = totalWidth - containerWidth;
                    this.$element.find('.steps').first().attr('style', 'margin-left: -' + newMargin + 'px');

                    // set the position so that the active step is in a good
                    // position if it has been moved out of view
                    if (this.$element.find('li.active').first().position().left < 200) {
                        newMargin += this.$element.find('li.active').first().position().left - 200;
                        if (newMargin < 1) {
                            this.$element.find('.steps').first().attr('style', 'margin-left: 0');
                        } else {
                            this.$element.find('.steps').first().attr('style', 'margin-left: -' + newMargin + 'px');
                        }

                    }

                }
            }

            this.updateSize();

			// only fire changed event after initializing
			if (typeof (this.initialized) !== 'undefined') {
				var e = $.Event('changed.bs.wizard');
				this.$element.trigger(e, {
                    step: this.currentStep,
                    name: $currentStep.attr('data-name')
                });
			}

			this.initialized = true;
		},

        updateSize: function() {
            var isNumeric = function(arg) {
                return typeof arg === "number" || /^\d+(\.\d+)?$/.test(arg);
            };
            if (this.options.height !== "auto") {
                // init size from options
                this.$element.css('height', this.options.height + (isNumeric(this.options.height) ? "px" : ''));
            } else if (this.options.orient === "vertical") {
                // update minHeight from steps and step-pane and actions
                var minHeight, $currentStepPane = this.getStepPane();
                minHeight = Math.max(
                    this.$element.find('.steps').outerHeight() + this.actionsH + this.borderH,
                    $currentStepPane.outerHeight(true) + this.stepContentDH + this.borderH
                );
                // update height
                this.$element.css('height', minHeight + "px");
            }
            if (this.options.minHeight) {
                this.$element.css('minHeight', this.options.minHeight + (isNumeric(this.options.minHeight) ? "px" : ''));
            }
            if (this.options.orient === "horizontal" && (this.options.height !== "auto" || this.options.minHeight)) {
                var $stepContent = this.$element.find(".step-content:first");
                $stepContent.css('height', (this.$element.outerHeight() - this.actionsH) + "px");
                this.$element.css('height', "auto");
            }
        },

		stepclicked: function (e) {
			var li = $(e.currentTarget);
			var index = this.$element.find('.steps li').index(li);

			if (index < this.currentStep && this.options.disablePreviousStep) {//enforce restrictions
				return;
			} else {
				var evt = $.Event('stepclicked.bs.wizard');
				this.$element.trigger(evt, {
					step: index + 1
				});
				if (evt.isDefaultPrevented()) {
					return;
				}

				this.currentStep = (index + 1);
				this.setState();
			}
		},

		syncSteps: function () {
			var i = 1;
			var $steps = this.$element.find('.steps');
			var $stepContent = this.$element.find('.step-content');

			$steps.children().each(function () {
				var item = $(this);
				var badge = item.find('.badge');
				var step = item.attr('data-step');

				if (!isNaN(parseInt(badge.html(), 10))) {
					badge.html(i);
				}

				item.attr('data-step', i);
				$stepContent.find('.step-pane[data-step="' + step + '"]:last').attr('data-step', i);
				i++;
			});
		},

        getStep: function(stepIndex) {
            stepIndex = stepIndex || this.currentStep;

            var isNumeric = typeof stepIndex === "number" || /^d+$/.test(stepIndex),
                currentSelector = isNumeric ?  '.steps li:eq(' + (stepIndex - 1) + ')' : '.steps li[data-name="' + stepIndex + '"]';

            return this.$element.find(currentSelector);
        },

        getStepPane: function(stepIndex) {
            var $currentStep = this.getStep(stepIndex);
            var target = $currentStep.attr('data-step');
            return this.$element.find('.step-content .step-pane[data-step="' + target + '"]:first');
        },

        setStepPane: function(dom, stepIndex) {
            if (dom) {
                var $stepPane = this.getStepPane(stepIndex);
                $stepPane.html(dom);
                this.updateSize();
            }
        },

        disablePrevious: function() {
            this.$prevBtn.prop('disabled', true);

            var $prevSteps = this.$element.find('.steps li:lt(' + (this.currentStep - 1) + ')');
            $prevSteps.removeClass('active').removeClass('complete');
            $prevSteps.find('span.badge').removeClass('badge-info').removeClass('badge-success');
        },

        enablePrevious: function() {
            this.$prevBtn.prop('disabled', false);

            var $prevSteps = this.$element.find('.steps li:lt(' + (this.currentStep - 1) + ')');
            $prevSteps.addClass('complete');
            $prevSteps.find('span.badge').addClass('badge-success');
        },

		previous: function () {
			if (this.options.disablePreviousStep || this.currentStep === 1 || this.$prevBtn.prop('disabled')) {
				return this;
			}

			var e = $.Event('actionclicked.bs.wizard');
			this.$element.trigger(e, {
				step: this.currentStep,
				direction: 'previous'
			});
			if (e.isDefaultPrevented()) {
				return;
			}// don't increment ...what? Why?

			this.currentStep -= 1;
			this.setState();

			// only set focus if focus is still on the $nextBtn (avoid stomping on a focus set programmatically in actionclicked callback)
			if (this.$prevBtn.is(':focus')) {
				var firstFormField = this.$element.find('.active').find('input, select, textarea')[0];

				if (typeof firstFormField !== 'undefined') {
					// allow user to start typing immediately instead of having to click on the form field.
					$(firstFormField).focus();
				} else if (this.$element.find('.active input:first').length === 0 && this.$prevBtn.is(':disabled')) {
					//only set focus on a button as the last resort if no form fields exist and the just clicked button is now disabled
					this.$nextBtn.focus();
				}

			}
		},

        disableNext: function() {
            this.$nextBtn.prop('disabled', true);
        },

        enableNext: function() {
            this.$nextBtn.prop('disabled', false);
        },

		next: function () {
            if (this.$nextBtn.prop('disabled')) {
                return this;
            }

            this.validateStep(function() {

                if (this.currentStep < this.numSteps) {
                    var e = $.Event('actionclicked.bs.wizard');
                    this.$element.trigger(e, {
                        step: this.currentStep,
                        direction: 'next'
                    });
                    if (e.isDefaultPrevented()) {
                        return;
                    }// don't increment ...what? Why?

                    this.currentStep += 1;
                    this.setState();
                } else {//is last step
                    this.$element.trigger('finished.bs.wizard');
                    if (this.options.formMode) {
                        this.submit();
                    }
                }

                // only set focus if focus is still on the $nextBtn (avoid stomping on a focus set programmatically in actionclicked callback)
                if (this.$nextBtn.is(':focus')) {
                    var firstFormField = this.$element.find('.active').find('input, select, textarea')[0];

                    if (typeof firstFormField !== 'undefined') {
                        // allow user to start typing immediately instead of having to click on the form field.
                        $(firstFormField).focus();
                    } else if (this.$element.find('.active input:first').length === 0 && this.$nextBtn.is(':disabled')) {
                        //only set focus on a button as the last resort if no form fields exist and the just clicked button is now disabled
                        this.$prevBtn.focus();
                    }

                }
            });
		},

        changed: function(e, args) {
            if (typeof this.options.onChanged === "function") {
                this.options.onChanged.call(this, args);
            }
        },

        setSubmitStep: function(index, enable) {
            if (typeof enable === "undefined") {
                enable = true;
            }

            var that = this, containsCurrent = false;

            var doSetSubmitStep = function(stepIndex) {
                var stepPos = $.inArray(stepIndex, that.options.formSubmitting.steps);
                if (~stepPos && !enable) {
                    that.options.formSubmitting.steps.splice(stepPos, 1);
                } else if (enable) {
                    that.options.formSubmitting.steps.push(stepIndex);
                }
            };

            var containsCurrentStep = function(stepIndex) {
                if (containsCurrent === true) return;
                if (!containsCurrent && (that.currentStep == stepIndex
                    || that.currentStep == that.$element.find('.steps li').index( that.$element.find('.steps li[data-name="' + stepIndex + '"]') ) ) ) {
                    containsCurrent = true;
                }
            };

            if ($.isArray(index)) {
                $.each(index, function(i, stepIndex) {
                    containsCurrentStep(stepIndex);
                    doSetSubmitStep(stepIndex);
                });
            } else {
                containsCurrentStep(index);
                doSetSubmitStep(index);
            }

            if (containsCurrent && this.currentStep !== this.numSteps) {
                if (enable) {
                    this.enableSubmit();
                    this.$submitBtn.show();
                } else {
                    this.$submitBtn.hide();
                    this.disableSubmit();
                }
            }
        },

        disableSubmit: function() {
            this.$submitBtn.prop('disabled', true);
        },

        enableSubmit: function() {
            this.$submitBtn.prop('disabled', false);
        },

        submit: function() {
            if (!this.options.formMode || this.$submitBtn.prop('disabled')) return this;

            this.validateStep(function() {
                var submitOptions = this.options.formSubmitting;
                if (typeof submitOptions.action === "function") {
                    submitOptions.action.call(this);
                } else {
                    var that = this, ajaxOptions;
                    if (typeof (submitOptions.ajaxOptions) === "string") {
                        ajaxOptions = {url: submitOptions.ajaxOptions};
                    } else {
                        ajaxOptions = $.extend({}, submitOptions.ajaxOptions);
                    }
                    if (ajaxOptions.url) {
                        if (ajaxOptions.data) {
                            var formData;
                            if (typeof ajaxOptions.data === "string") {
                                formData = this.serialize();
                                if (formData) {
                                    ajaxOptions.data = formData + "&" + ajaxOptions.data;
                                }
                            } else if ($.isArray(ajaxOptions.data)) {
                                formData = this.serializeArray();
                                if (formData.length) {
                                    ajaxOptions.data = ajaxOptions.data.concat(formData);
                                }
                            } else {
                                formData = this.serializeObject();
                                ajaxOptions.data = $.extend({}, formData, ajaxOptions.data)
                            }
                        } else {
                            ajaxOptions.data = $.extend({}, this.serializeObject());
                        }

                        if (typeof ajaxOptions.success === "function") {
                            submitOptions.success = ajaxOptions.success;
                            delete ajaxOptions.success;
                        }
                        if (typeof ajaxOptions.error === "function") {
                            submitOptions.error = ajaxOptions.error;
                            delete ajaxOptions.error;
                        }
                        this.disableButtons();
                        $.ajax(ajaxOptions).then(function() {
                            // success
                            that.enableButtons();
                            if (typeof submitOptions.success === "function") {
                                submitOptions.success.apply(that, arguments);
                            }
                        }, function() {
                            // error
                            that.enableButtons();
                            if (typeof submitOptions.error === "function") {
                                submitOptions.error.apply(that, arguments);
                            }
                        });
                    }
                }
            });
        },

        validateStep: function(validCallback, invalidCallback) {
            // callbacks
            var hasValidCallback = typeof validCallback === "function",
                hasInvalidCallback = typeof invalidCallback === "function";
            // check form mode
            if (!this.options.formMode) {
                hasValidCallback && validCallback.call(this);
                return this;
            }
            // validations
            var validations = this.options.formSubmitting.validations, $currentStep = this.getStep();
            // form validator
            var formValidator = validations[$currentStep.attr('data-name')] || validations[this.currentStep], valid;
            // validate
            if (typeof formValidator === "function") {
                valid = formValidator.call(this, this.getStepPane());
            }
            if (typeof valid === "undefined" || valid)  {
                if (valid && typeof valid.done === "function") {
                    this.disableButtons();
                    valid.done($.proxy(function(res) {
                        if (typeof res === "undefined" || res) {
                            hasValidCallback && validCallback.apply(this, arguments);
                        } else {
                            hasInvalidCallback && invalidCallback.apply(this, arguments);
                        }
                    }, this)).fail($.proxy(function() {
                        hasInvalidCallback && invalidCallback.apply(this, arguments);
                    }, this)).always($.proxy(function() {
                        this.enableButtons();
                    }, this));
                } else if (hasValidCallback) {
                    if (typeof valid !== "undefined") {
                        validCallback.call(this, valid);
                    } else {
                        validCallback.call(this);
                    }
                }
            } else {
                hasInvalidCallback && invalidCallback.call(this, valid);
            }
            return this;
        },

        disableButtons: function() {
            this.disablePrevious();
            this.disableNext();
            this.disableSubmit();
        },

        enableButtons: function() {
            this.enablePrevious();
            this.enableNext();
            this.enableSubmit();
        },

        serializeObject: function(currentStep) {
            var o = {};
            var a = this.serializeArray(currentStep);
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
        },

        serializeArray: function(currentStep) {
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

            return doSerializeArray(this.getSelectedForms(currentStep));
        },

        serialize: function(currentStep) {
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

            return doSerialize(this.getSelectedForms(currentStep));
        },

        getSelectedForms: function(currentStep) {
            currentStep = currentStep || this.currentStep;
            if (currentStep < 1 || currentStep > this.numSteps) {
                currentStep = this.numSteps;
            }
            var $form = $([]), $stepPane;
            for (var i=0; i<currentStep; i++) {
                $stepPane = this.getStepPane(i + 1);
                $form = $form.add($stepPane.find('form'));
            }
            return $form;
        },

        selectStep: function (stepIndex) {
			var retVal, step;

			if (stepIndex) {
				step = stepIndex || -1;

				if (typeof step === "number" && step >= 1 && step <= this.numSteps) {
					this.currentStep = step;
					this.setState();
				} else {
                    if (typeof step === "string") {
                        step = this.$element.find('.steps li[data-name="' + step + '"]:first').attr('data-step');
                    } else {
                        step = this.$element.find('.steps li.active:first').attr('data-step');
                    }
					if (!isNaN(step)) {
						this.currentStep = parseInt(step, 10);
						this.setState();
					}
				}

				retVal = this;
			} else {
				retVal = {
					step: this.currentStep,
                    name: this.getStep().attr('data-name')
				};
			}

			return retVal;
		}
	};


	// WIZARD PLUGIN DEFINITION

	$.fn.wizardStep = function (option) {
		var args = Array.prototype.slice.call(arguments, 1);
		var methodReturn;

		var $set = this.each(function () {
			var $this = $(this);
			var data = $this.data('bs.wizard');
			var options = typeof option === 'object' && option;

			if (!data) {
				$this.data('bs.wizard', (data = new Wizard(this, options)));
			}

			if (typeof option === 'string') {
				methodReturn = data[option].apply(data, args);
			}
		});

		return (methodReturn === undefined) ? $set : methodReturn;
	};

	$.fn.wizardStep.Constructor = Wizard;

	$.fn.wizardStep.noConflict = function () {
		$.fn.wizardStep = old;
		return this;
	};


	// DATA-API

	$(document).on('mouseover.bs.wizard.data-api', '[data-toggle="wizardStep"]', function (e) {
		var $control = $(e.target).closest('.wizard-step');
		if (!$control.data('bs.wizard')) {
			$control.wizardStep($control.data());
		}
	});

	// Must be domReady for AMD compatibility
	$(function () {
		$('[data-toggle="wizardStep"]').each(function () {
			var $this = $(this);
			if ($this.data('bs.wizard')) return;
			$this.wizardStep($this.data());
		});
	});

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --