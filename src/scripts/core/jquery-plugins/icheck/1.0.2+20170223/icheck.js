/*!
 * iCheck v1.0.2, http://git.io/arlzeA
 * ===================================
 * Powerful jQuery and Zepto plugin for checkboxes and radio buttons customization
 *
 * (c) 2013 Damir Sultanov, http://fronteed.com
 * MIT Licensed
 */

/*
 * =========================================================
 * Updated by jinzhk @ 2015-05-13
 * 1、className在初始化时支持多种class name并存
 * 2、添加了自动初始化接口
 * 3、支持使用属性初始化配置项，格式为data-icheck-[optName]，如data-icheck-checkboxClass="icheckbox-primary"
 * Updated by jinzhk @ 2017-02-23
 * 支持读取默认含有的 icheckbox-* 或 iradio-* 类名作为配置项
 * =========================================================
 */

(function($) {

  // Cached vars
  var _iCheck = 'iCheck',
      _iCheckHelper = _iCheck + '-helper',
      _checkbox = 'checkbox',
      _radio = 'radio',
      _checked = 'checked',
      _unchecked = 'un' + _checked,
      _disabled = 'disabled',
      _determinate = 'determinate',
      _indeterminate = 'in' + _determinate,
      _update = 'update',
      _type = 'type',
      _click = 'click',
      _touch = 'touchbegin.i touchend.i',
      _add = 'addClass',
      _remove = 'removeClass',
      _callback = 'trigger',
      _label = 'label',
      _cursor = 'cursor',
      _mobile = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);

  var _DEFAULTS = {

    // 'checkbox' or 'radio' to style only checkboxes or radio buttons, both by default
    handle: '',

    // base class added to customized checkboxes
    checkboxClass: 'icheckbox',

    // base class added to customized radio buttons
    radioClass: 'iradio',

    // class added on checked state (input.checked = true)
    checkedClass: _checked,

    // if not empty, used instead of 'checkedClass' option (input type specific)
    checkedCheckboxClass: '',
    checkedRadioClass: '',

    // if not empty, added as class name on unchecked state (input.checked = false)
    uncheckedClass: '',

    // if not empty, used instead of 'uncheckedClass' option (input type specific)
    uncheckedCheckboxClass: '',
    uncheckedRadioClass: '',

    // class added on disabled state (input.disabled = true)
    disabledClass: _disabled,

    // if not empty, used instead of 'disabledClass' option (input type specific)
    disabledCheckboxClass: '',
    disabledRadioClass: '',

    // if not empty, added as class name on enabled state (input.disabled = false)
    enabledClass: '',

    // if not empty, used instead of 'enabledClass' option (input type specific)
    enabledCheckboxClass: '',
    enabledRadioClass: '',

    // class added on indeterminate state (input.indeterminate = true)
    indeterminateClass: _indeterminate,

    // if not empty, used instead of 'indeterminateClass' option (input type specific)
    indeterminateCheckboxClass: '',
    indeterminateRadioClass: '',

    // if not empty, added as class name on determinate state (input.indeterminate = false)
    determinateClass: '',

    // if not empty, used instead of 'determinateClass' option (input type specific)
    determinateCheckboxClass: '',
    determinateRadioClass: '',

    // class added on hover state (pointer is moved onto input)
    hoverClass: 'hover',

    // class added on focus state (input has gained focus)
    focusClass: 'focus',

    // class added on active state (mouse button is pressed on input)
    activeClass: 'active',

    // adds hoverClass to customized input on label hover and labelHoverClass to label on input hover
    labelHover: true,

    // class added to label if labelHover set to true
    labelHoverClass: 'hover',

    // increase clickable area by given % (negative number to decrease)
    increaseArea: '',

    // true to set 'pointer' CSS cursor over enabled inputs and 'default' over disabled
    cursor: false,

    // set true to inherit original input's class name
    inheritClass: false,

    // if set to true, input's id is prefixed with 'iCheck-' and attached
    inheritID: false,

    // set true to activate ARIA support
    aria: false,

    // add HTML code or text inside customized input
    insert: ''

  };

  // Plugin init
  $.fn[_iCheck] = function(options, fire) {

    // Walker
    var handle = 'input[type="' + _checkbox + '"], input[type="' + _radio + '"]',
        stack = $(),
        walker = function(object) {
          object.each(function() {
            var self = $(this);

            if (self.is(handle)) {
              stack = stack.add(self);
            } else {
              stack = stack.add(self.find(handle));
            }
          });
        };

    // Check if we should operate with some method
    if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(options)) {

      // Normalize method's name
      options = options.toLowerCase();

      // Find checkboxes and radio buttons
      walker(this);

      return stack.each(function() {
        var self = $(this);

        if (options == 'destroy') {
          tidy(self, 'ifDestroyed');
        } else {
          operate(self, true, options);
        }

        // Fire method's callback
        if ($.isFunction(fire)) {
          fire();
        }
      });

      // Customization
    } else if (typeof options == 'object' || !options) {

      // Check if any options were passed
      var settings = $.extend({
            checkedClass: _checked,
            disabledClass: _disabled,
            indeterminateClass: _indeterminate,
            labelHover: true
          }, options),

          selector = settings.handle,
          hoverClass = settings.hoverClass || 'hover',
          focusClass = settings.focusClass || 'focus',
          activeClass = settings.activeClass || 'active',
          labelHover = !!settings.labelHover,
          labelHoverClass = settings.labelHoverClass || 'hover',

      // Setup clickable area
          area = ('' + settings.increaseArea).replace('%', '') | 0;

      // Selector limit
      if (selector == _checkbox || selector == _radio) {
        handle = 'input[type="' + selector + '"]';
      }

      // Clickable area limit
      if (area < -50) {
        area = -50;
      }

      // Walk around the selector
      walker(this);

      return stack.each(function() {
        var self = $(this);

        var _settings = initSettings(self, settings);

        // If already customized
        tidy(self);

        var node = this,
            id = node.id,

        // Layer styles
            offset = -area + '%',
            size = 100 + (area * 2) + '%',
            layer = {
              position: 'absolute',
              top: offset,
              left: offset,
              display: 'block',
              width: size,
              height: size,
              margin: 0,
              padding: 0,
              background: '#fff',
              border: 0,
              opacity: 0
            },

        // Choose how to hide input
            hide = _mobile ? {
              position: 'absolute',
              visibility: 'hidden'
            } : area ? layer : {
              position: 'absolute',
              opacity: 0
            },

        // Get proper class
            //className = node[_type] == _checkbox ? settings.checkboxClass || 'i' + _checkbox : settings.radioClass || 'i' + _radio,
            className = node[_type] == _checkbox ? 'i' + _checkbox + (_settings.checkboxClass ? ' ' + _settings.checkboxClass : '') : 'i' + _radio + (_settings.radioClass ? ' ' + _settings.radioClass : '' ),

        // Find assigned labels
            label = $(_label + '[for="' + id + '"]').add(self.closest(_label)),

        // Check ARIA option
            aria = !!_settings.aria,

        // Set ARIA placeholder
            ariaID = _iCheck + '-' + Math.random().toString(36).substr(2,6),

        // Parent & helper
            parent = '<div class="' + className + '" ' + (aria ? 'role="' + node[_type] + '" ' : ''),
            helper;

        // Set ARIA "labelledby"
        if (aria) {
          label.each(function() {
            parent += 'aria-labelledby="';

            if (this.id) {
              parent += this.id;
            } else {
              this.id = ariaID;
              parent += ariaID;
            }

            parent += '"';
          });
        }

        // Wrap input
        parent = self.wrap(parent + '/>')[_callback]('ifCreated').parent().append(_settings.insert);

        // Layer addition
        helper = $('<ins class="' + _iCheckHelper + '"/>').css(layer).appendTo(parent);

        // Finalize customization
        self.data(_iCheck, {o: _settings, s: self.attr('style')}).css(hide);
        !!_settings.inheritClass && parent[_add](node.className || '');
        !!_settings.inheritID && id && parent.attr('id', _iCheck + '-' + id);
        parent.css('position') == 'static' && parent.css('position', 'relative');
        operate(self, true, _update);

        // Label events
        if (label.length) {
          label.on(_click + '.i mouseover.i mouseout.i ' + _touch, function(event) {
            var type = event[_type],
                item = $(this);

            // Do nothing if input is disabled
            if (!node[_disabled]) {

              // Click
              if (type == _click) {
                if ($(event.target).is('a')) {
                  return;
                }
                operate(self, false, true);

                // Hover state
              } else if (labelHover) {

                // mouseout|touchend
                if (/ut|nd/.test(type)) {
                  parent[_remove](hoverClass);
                  item[_remove](labelHoverClass);
                } else {
                  parent[_add](hoverClass);
                  item[_add](labelHoverClass);
                }
              }

              if (_mobile) {
                event.stopPropagation();
              } else {
                return false;
              }
            }
          });
        }

        // Input events
        self.on(_click + '.i focus.i blur.i keyup.i keydown.i keypress.i', function(event) {
          var type = event[_type],
              key = event.keyCode;

          // Click
          if (type == _click) {
            return false;

            // Keydown
          } else if (type == 'keydown' && key == 32) {
            if (!(node[_type] == _radio && node[_checked])) {
              if (node[_checked]) {
                off(self, _checked);
              } else {
                on(self, _checked);
              }
            }

            return false;

            // Keyup
          } else if (type == 'keyup' && node[_type] == _radio) {
            !node[_checked] && on(self, _checked);

            // Focus/blur
          } else if (/us|ur/.test(type)) {
            parent[type == 'blur' ? _remove : _add](focusClass);
          }
        });

        // Helper events
        helper.on(_click + ' mousedown mouseup mouseover mouseout ' + _touch, function(event) {
          var type = event[_type],

          // mousedown|mouseup
              toggle = /wn|up/.test(type) ? activeClass : hoverClass;

          // Do nothing if input is disabled
          if (!node[_disabled]) {

            // Click
            if (type == _click) {
              operate(self, false, true);

              // Active and hover states
            } else {

              // State is on
              if (/wn|er|in/.test(type)) {

                // mousedown|mouseover|touchbegin
                parent[_add](toggle);

                // State is off
              } else {
                parent[_remove](toggle + ' ' + activeClass);
              }

              // Label hover
              if (label.length && labelHover && toggle == hoverClass) {

                // mouseout|touchend
                label[/ut|nd/.test(type) ? _remove : _add](labelHoverClass);
              }
            }

            if (_mobile) {
              event.stopPropagation();
            } else {
              return false;
            }
          }
        });
      });
    } else {
      return this;
    }
  };

  // Do something with inputs
  function operate(input, direct, method) {
    var node = input[0],
        state = /er/.test(method) ? _indeterminate : /bl/.test(method) ? _disabled : _checked,
        active = method == _update ? {
          checked: node[_checked],
          disabled: node[_disabled],
          indeterminate: input.attr(_indeterminate) == 'true' || input.attr(_determinate) == 'false'
        } : node[state];

    // Check, disable or indeterminate
    if (/^(ch|di|in)/.test(method) && !active) {
      on(input, state);

      // Uncheck, enable or determinate
    } else if (/^(un|en|de)/.test(method) && active) {
      off(input, state);

      // Update
    } else if (method == _update) {

      // Handle states
      for (var each in active) {
        if (active[each]) {
          on(input, each, true);
        } else {
          off(input, each, true);
        }
      }

    } else if (!direct || method == 'toggle') {

      // Helper or label was clicked
      if (!direct) {
        input[_callback]('ifClicked');
      }

      // Toggle checked state
      if (active) {
        if (node[_type] !== _radio) {
          off(input, state);
        }
      } else {
        on(input, state);
      }
    }
  }

  // Add checked, disabled or indeterminate state
  function on(input, state, keep) {
    var node = input[0],
        parent = input.parent(),
        checked = state == _checked,
        indeterminate = state == _indeterminate,
        disabled = state == _disabled,
        callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
        regular = option(input, callback + capitalize(node[_type])),
        specific = option(input, state + capitalize(node[_type]));

    // Prevent unnecessary actions
    if (node[state] !== true) {

      // Toggle assigned radio buttons
      if (!keep && state == _checked && node[_type] == _radio && node.name) {
        var form = input.closest('form'),
            inputs = 'input[name="' + node.name + '"]';

        inputs = form.length ? form.find(inputs) : $(inputs);

        inputs.each(function() {
          if (this !== node && $(this).data(_iCheck)) {
            off($(this), state);
          }
        });
      }

      // Indeterminate state
      if (indeterminate) {

        // Add indeterminate state
        node[state] = true;

        // Remove checked state
        if (node[_checked]) {
          off(input, _checked, 'force');
        }

        // Checked or disabled state
      } else {

        // Add checked or disabled state
        if (!keep) {
          node[state] = true;
        }

        // Remove indeterminate state
        if (checked && node[_indeterminate]) {
          off(input, _indeterminate, false);
        }
      }

      // Trigger callbacks
      callbacks(input, checked, state, keep);
    }

    // Add proper cursor
    if (node[_disabled] && !!option(input, _cursor, true)) {
      parent.find('.' + _iCheckHelper).css(_cursor, 'default');
    }

    // Add state class
    parent[_add](specific || option(input, state) || '');

    // Set ARIA attribute
    if (!!parent.attr('role') && !indeterminate) {
      parent.attr('aria-' + (disabled ? _disabled : _checked), 'true');
    }

    // Remove regular state class
    parent[_remove](regular || option(input, callback) || '');
  }

  // Remove checked, disabled or indeterminate state
  function off(input, state, keep) {
    var node = input[0],
        parent = input.parent(),
        checked = state == _checked,
        indeterminate = state == _indeterminate,
        disabled = state == _disabled,
        callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
        regular = option(input, callback + capitalize(node[_type])),
        specific = option(input, state + capitalize(node[_type]));

    // Prevent unnecessary actions
    if (node[state] !== false) {

      // Toggle state
      if (indeterminate || !keep || keep == 'force') {
        node[state] = false;
      }

      // Trigger callbacks
      callbacks(input, checked, callback, keep);
    }

    // Add proper cursor
    if (!node[_disabled] && !!option(input, _cursor, true)) {
      parent.find('.' + _iCheckHelper).css(_cursor, 'pointer');
    }

    // Remove state class
    parent[_remove](specific || option(input, state) || '');

    // Set ARIA attribute
    if (!!parent.attr('role') && !indeterminate) {
      parent.attr('aria-' + (disabled ? _disabled : _checked), 'false');
    }

    // Add regular state class
    parent[_add](regular || option(input, callback) || '');
  }

  // Remove all traces
  function tidy(input, callback) {
    if (input.data(_iCheck)) {

      // Remove everything except input
      input.parent().html(input.attr('style', input.data(_iCheck).s || ''));

      // Callback
      if (callback) {
        input[_callback](callback);
      }

      // Unbind events
      input.off('.i').unwrap();
      $(_label + '[for="' + input[0].id + '"]').add(input.closest(_label)).off('.i');
    }
  }

  // Get some option
  function option(input, state, regular) {
    if (input.data(_iCheck)) {
      return input.data(_iCheck).o[state + (regular ? '' : 'Class')];
    }
  }

  // Capitalize some string
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Executable handlers
  function callbacks(input, checked, callback, keep) {
    if (!keep) {
      if (checked) {
        input[_callback]('ifToggled');
      }

      input[_callback]('ifChanged')[_callback]('if' + capitalize(callback));
    }
  }

  function initSettings($input, settings) {
    var _settings = $.extend({}, settings);
    var input = $input ? $input[0] : null,
        type = input ? input[_type] : null,
        className = $.trim(input.className),
        classNameRegExp, classNameMatch;
    var baseClassName = "i" + $.trim(type), baseClassNamePos;
    try {
      classNameRegExp = new RegExp("\\b"+ baseClassName + "(?:\\-\\S+)*\\b", "g");
    } catch (e) {
      classNameRegExp = null;
    }
    for(var optName in _DEFAULTS) {
      // First check if an option was passed in via the constructor
      var val = _settings[optName];
      // check className
      if ($input && (input = $input[0])) {
        if (typeof val === 'undefined' && optName === (type + "Class") && classNameRegExp != null) {
          classNameMatch = className.match(classNameRegExp);
          if ($.isArray(classNameMatch)) {
            val = classNameMatch.join(" ");
          }
        }
      }
      // If no data attrib, then check data atrributes
      val = (!input || typeof val !== 'undefined') ? val : val = getDataAttrib(input, optName);
      // remove base className
      if (type != null && optName === (type + "Class") && val != null) {
        classNameMatch = (val + "").split(/\s+/);
        baseClassNamePos = $.inArray(baseClassName, classNameMatch);
        baseClassNamePos > -1 && classNameMatch.splice(baseClassNamePos, 1);
        val = classNameMatch.join(" ");
      }
      // Finally, if nothing was specified, use the defaults
      val = (val != null) ? val : _DEFAULTS[optName];

      // init settings
      _settings[optName] = val;

      val = null;
    }
    return _settings;
  }

  // Get option value from attr.
  function getDataAttrib(element, optName) {
    var dataName = "data-opt-" + optName.toLowerCase();
    var dataValString = element.getAttribute(dataName);

    if(!dataValString) return dataValString;

    try {
      return JSON.parse(dataValString);
    }
    catch(err) {
      try {
        return JSON.parse(dataValString.replace(/'/g, '"'));
      } catch(err1) {
        return dataValString;
      }
      return dataValString;
    }
  }

  // iCheck DATA-API
  // =====================
  $(window).on('load.bs.check.data-api', function () {
    $('[data-spy="iCheck"]').each(function () {
      var $iCheck = $(this);
      $iCheck[_iCheck]();
      $iCheck = null;
    });
  });
})(window.jQuery || window.Zepto);
