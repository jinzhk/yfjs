/**
 * Created by jinzk on 2015/5/8.
 *
 * jQuery Validation Plugin fixed for bootstrap3.
 *
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

	// overwritten methods
	$.validator.prototype.hideErrors = function() {
		try {
			var elements = this.elements();
			for(var i=0; i<elements.length; i++) {
				var element = elements[i], $element = $(element);
				$element.parents('.form-group').removeClass(this.settings.errorClass);
				if(typeof this.settings.errorPlacement !== "function") {
					$element.popover('destroy');
				} else {
					var $error = $element.data('error');
					$error && $error instanceof $ && $error.remove();
					$error = null;
					$element.removeData('error');
				}
				$element = null;
				element = null;
			}
			elements = null;
		} catch (e) {
			elements = null;
		}
	};

	$.validator.prototype.resetForm = function(resetData) {
		if (resetData !== false) {
			if ( $.fn.resetForm ) {
				$( this.currentForm ).resetForm();
			} else if ( typeof this.currentForm.reset === "function" ) {
				this.currentForm.reset();
			}
		}
		this.submitted = {};
		this.lastElement = null;
		this.prepareForm();
		this.hideErrors();
		this.elements()
			.removeClass( this.settings.errorClass )
			.removeData( "previousValue" )
			.removeAttr( "aria-invalid" )
			.parents('.form-group').removeClass(this.settings.validClass);
	};

	// reset defaults
	$.validator.setDefaults({
		errorClass: "has-error",
		validClass: "has-success",
		errorIcon: "glyphicon glyphicon-exclamation-sign",
		showErrors: function(map, list) {
			var that = this;
			if(typeof that.settings.errorPlacement === "function") {
				$.each(list, function(index, error) {
					$(error.element).parents('.form-group').removeClass(that.settings.validClass).addClass(that.settings.errorClass);
					var $errorElement = $(error.element);
					if(!$errorElement.data('error')) {
						var errorTag = that.settings.errorElement || 'label';
						try {
							errorTag = document.createElement(errorTag);
						} catch (e) {
							errorTag = document.createElement('label');
						}
						errorTag.innerHTML = error.message;
						var $errorTag = $(errorTag).addClass("text-error");
						$errorElement.data('error', $errorTag);
						that.settings.errorPlacement.call(that, $errorTag, $errorElement);
						errorTag = null; $errorTag = null;
					}
					$errorElement = null
				});
				$.each(this.successList, function(index, element) {
					$(element).parents('.form-group').removeClass(that.settings.errorClass).addClass(that.settings.validClass);
					var $error = $(error.element).data('error');
					$error && $error instanceof $ && $error.remove();
					$error = null;
					$(error.element).removeData('error');
				});
			} else {
				$.each(list, function(index, error) {
					$(error.element).parents('.form-group').removeClass(that.settings.validClass).addClass(that.settings.errorClass);
					var _content = '<i class="'+that.settings.errorIcon+'"></i>' + error.message;
					var _errorPlacement = 'right', attrErrorPlacement;
					if(attrErrorPlacement = error.element.getAttribute('data-error-placement')) {
						_errorPlacement = attrErrorPlacement;
					} else if(typeof that.settings.errorPlacement === "string") {
						_errorPlacement = that.settings.errorPlacement;
					} else if(that.currentForm) {
						if($(that.currentForm).hasClass("form-inline")) {
							_errorPlacement = 'left top';
						} else if($(that.currentForm).hasClass("form-horizontal")) {
							_errorPlacement = 'right';
						} else {
							_errorPlacement = 'left bottom';
						}
					}
					attrErrorPlacement = null;
					var _errorContainer, attrErrorContainer;
					if(attrErrorContainer = error.element.getAttribute('data-error-container')) {
						_errorContainer = $(attrErrorContainer);
					}
					if(!_errorContainer || !_errorContainer.length) {
						if(typeof that.settings.errorContainer === "string") {
							try {
								if(that.settings.errorContainer === '_form') {
									_errorContainer = $(that.currentForm);
								} else if(that.settings.errorContainer === '_form-group') {
									_errorContainer = $(error.element).parents('.form-group:first');
								} else {
									_errorContainer = $(that.settings.errorContainer);
								}
							} catch (e) {
								_errorContainer = null;
							}
						} else {
							_errorContainer = that.settings.errorContainer;
						}
					}
					if(!_errorContainer || !_errorContainer.length) {
						_errorContainer = that.containers;
					}
					if(!_errorContainer || !_errorContainer.length) {
						_errorContainer = $('body');
					}
					(_errorContainer && _errorContainer instanceof $) && _errorContainer.css('position', "relative");
					attrErrorContainer = null;
					$(error.element).popover({
						container: _errorContainer,
						className: 'popover-danger',
						content: _content,
						placement: _errorPlacement,
						trigger: 'manual',
						html: true
					}).popover('show');
					_errorPlacement = null;
					_content = null;
				});
				$.each(this.successList, function(index, element) {
					$(element).parents('.form-group').removeClass(that.settings.errorClass).addClass(that.settings.validClass);
					$(element).popover('destroy');
				});
			}
		}
	});

}));