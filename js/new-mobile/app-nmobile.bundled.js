// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

;(function($, window, document, undefined){
	var isOperaMini = Object.prototype.toString.call(window.operamini) === "[object OperaMini]" || (navigator.userAgent.indexOf('Opera Mini') > -1);

	if(isOperaMini){
		$.fn.fadeIn = $.fn.show;
		$.fn.fadeOut = $.fn.hide;
	}
})(jQuery, window, document);

/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2014, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

(function ($, window, document, undefined) {
  'use strict';

  var header_helpers = function (class_array) {
    var i = class_array.length;
    var head = $('head');

    while (i--) {
      if(head.has('.' + class_array[i]).length === 0) {
        head.append('<meta class="' + class_array[i] + '" />');
      }
    }
  };

  header_helpers([
    'foundation-mq-small',
    'foundation-mq-small-only',
    'foundation-mq-medium',
    'foundation-mq-medium-only',
    'foundation-mq-large',
    'foundation-mq-large-only',
    'foundation-mq-xlarge',
    'foundation-mq-xlarge-only',
    'foundation-mq-xxlarge',
    'foundation-data-attribute-namespace']);

  // Enable FastClick if present

  $(function() {
    if (typeof FastClick !== 'undefined') {
      // Don't attach to body if undefined
      if (typeof document.body !== 'undefined') {
        FastClick.attach(document.body);
      }
    }
  });

  // private Fast Selector wrapper,
  // returns jQuery object. Only use where
  // getElementById is not available.
  var S = function (selector, context) {
    if (typeof selector === 'string') {
      if (context) {
        var cont;
        if (context.jquery) {
          cont = context[0];
          if (!cont) return context;
        } else {
          cont = context;
        }
        return $(cont.querySelectorAll(selector));
      }

      return $(document.querySelectorAll(selector));
    }

    return $(selector, context);
  };

  // Namespace functions.

  var attr_name = function (init) {
    var arr = [];
    if (!init) arr.push('data');
    if (this.namespace.length > 0) arr.push(this.namespace);
    arr.push(this.name);

    return arr.join('-');
  };

  var add_namespace = function (str) {
    var parts = str.split('-'),
        i = parts.length,
        arr = [];

    while (i--) {
      if (i !== 0) {
        arr.push(parts[i]);
      } else {
        if (this.namespace.length > 0) {
          arr.push(this.namespace, parts[i]);
        } else {
          arr.push(parts[i]);
        }
      }
    }

    return arr.reverse().join('-');
  };

  // Event binding and data-options updating.

  var bindings = function (method, options) {
    var self = this,
        should_bind_events = !S(this).data(this.attr_name(true));

    if (S(this.scope).is('[' + this.attr_name() +']')) {
      S(this.scope).data(this.attr_name(true) + '-init', $.extend({}, this.settings, (options || method), this.data_options(S(this.scope))));

      if (should_bind_events) {
        this.events(this.scope);
      }

    } else {
      S('[' + this.attr_name() +']', this.scope).each(function () {
        var should_bind_events = !S(this).data(self.attr_name(true) + '-init');
        S(this).data(self.attr_name(true) + '-init', $.extend({}, self.settings, (options || method), self.data_options(S(this))));

        if (should_bind_events) {
          self.events(this);
        }
      });
    }
    // # Patch to fix #5043 to move this *after* the if/else clause in order for Backbone and similar frameworks to have improved control over event binding and data-options updating.
    if (typeof method === 'string') {
      return this[method].call(this, options);
    }

  };

  var single_image_loaded = function (image, callback) {
    function loaded () {
      callback(image[0]);
    }

    function bindLoad () {
      this.one('load', loaded);

      if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var src = this.attr( 'src' ),
            param = src.match( /\?/ ) ? '&' : '?';

        param += 'random=' + (new Date()).getTime();
        this.attr('src', src + param);
      }
    }

    if (!image.attr('src')) {
      loaded();
      return;
    }

    if (image[0].complete || image[0].readyState === 4) {
      loaded();
    } else {
      bindLoad.call(image);
    }
  };

  /*
    https://github.com/paulirish/matchMedia.js
  */

  window.matchMedia = window.matchMedia || (function( doc ) {

    'use strict';

    var bool,
        docElem = doc.documentElement,
        refNode = docElem.firstElementChild || docElem.firstChild,
        // fakeBody required for <FF4 when executed in <head>
        fakeBody = doc.createElement( 'body' ),
        div = doc.createElement( 'div' );

    div.id = 'mq-test-1';
    div.style.cssText = 'position:absolute;top:-100em';
    fakeBody.style.background = 'none';
    fakeBody.appendChild(div);

    return function (q) {

      div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width: 42px; }</style>';

      docElem.insertBefore( fakeBody, refNode );
      bool = div.offsetWidth === 42;
      docElem.removeChild( fakeBody );

      return {
        matches: bool,
        media: q
      };

    };

  }( document ));

  /*
   * jquery.requestAnimationFrame
   * https://github.com/gnarf37/jquery-requestAnimationFrame
   * Requires jQuery 1.8+
   *
   * Copyright (c) 2012 Corey Frang
   * Licensed under the MIT license.
   */

  (function(jQuery) {

  // requestAnimationFrame polyfill adapted from Erik Möller
  // fixes from Paul Irish and Tino Zijdel
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

  var animating,
      lastTime = 0,
      vendors = ['webkit', 'moz'],
      requestAnimationFrame = window.requestAnimationFrame,
      cancelAnimationFrame = window.cancelAnimationFrame,
      jqueryFxAvailable = 'undefined' !== typeof jQuery.fx;

  for (; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
    requestAnimationFrame = window[ vendors[lastTime] + 'RequestAnimationFrame' ];
    cancelAnimationFrame = cancelAnimationFrame ||
      window[ vendors[lastTime] + 'CancelAnimationFrame' ] ||
      window[ vendors[lastTime] + 'CancelRequestAnimationFrame' ];
  }

  function raf() {
    if (animating) {
      requestAnimationFrame(raf);

      if (jqueryFxAvailable) {
        jQuery.fx.tick();
      }
    }
  }

  if (requestAnimationFrame) {
    // use rAF
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;

    if (jqueryFxAvailable) {
      jQuery.fx.timer = function (timer) {
        if (timer() && jQuery.timers.push(timer) && !animating) {
          animating = true;
          raf();
        }
      };

      jQuery.fx.stop = function () {
        animating = false;
      };
    }
  } else {
    // polyfill
    window.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime(),
        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
        id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };

  }

  }( $ ));


  function removeQuotes (string) {
    if (typeof string === 'string' || string instanceof String) {
      string = string.replace(/^['\\/"]+|(;\s?})+|['\\/"]+$/g, '');
    }

    return string;
  }

  window.Foundation = {
    name : 'Foundation',

    version : '{{VERSION}}',

    media_queries : {
      'small'       : S('.foundation-mq-small').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'small-only'  : S('.foundation-mq-small-only').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'medium'      : S('.foundation-mq-medium').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'medium-only' : S('.foundation-mq-medium-only').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'large'       : S('.foundation-mq-large').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'large-only'  : S('.foundation-mq-large-only').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'xlarge'      : S('.foundation-mq-xlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'xlarge-only' : S('.foundation-mq-xlarge-only').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'xxlarge'     : S('.foundation-mq-xxlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
    },

    stylesheet : $('<style></style>').appendTo('head')[0].sheet,

    global: {
      namespace: undefined
    },

    init : function (scope, libraries, method, options, response) {
      var args = [scope, method, options, response],
          responses = [];

      // check RTL
      this.rtl = /rtl/i.test(S('html').attr('dir'));

      // set foundation global scope
      this.scope = scope || this.scope;

      this.set_namespace();

      if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
        if (this.libs.hasOwnProperty(libraries)) {
          responses.push(this.init_lib(libraries, args));
        }
      } else {
        for (var lib in this.libs) {
          responses.push(this.init_lib(lib, libraries));
        }
      }

      S(window).load(function(){
        S(window)
          .trigger('resize.fndtn.clearing')
          .trigger('resize.fndtn.dropdown')
          .trigger('resize.fndtn.equalizer')
          .trigger('resize.fndtn.interchange')
          .trigger('resize.fndtn.joyride')
          .trigger('resize.fndtn.magellan')
          .trigger('resize.fndtn.topbar')
          .trigger('resize.fndtn.slider');
      });

      return scope;
    },

    init_lib : function (lib, args) {
      if (this.libs.hasOwnProperty(lib)) {
        this.patch(this.libs[lib]);

        if (args && args.hasOwnProperty(lib)) {
            if (typeof this.libs[lib].settings !== 'undefined') {
              $.extend(true, this.libs[lib].settings, args[lib]);
            }
            else if (typeof this.libs[lib].defaults !== 'undefined') {
              $.extend(true, this.libs[lib].defaults, args[lib]);
            }
          return this.libs[lib].init.apply(this.libs[lib], [this.scope, args[lib]]);
        }

        args = args instanceof Array ? args : new Array(args);
        return this.libs[lib].init.apply(this.libs[lib], args);
      }

      return function () {};
    },

    patch : function (lib) {
      lib.scope = this.scope;
      lib.namespace = this.global.namespace;
      lib.rtl = this.rtl;
      lib['data_options'] = this.utils.data_options;
      lib['attr_name'] = attr_name;
      lib['add_namespace'] = add_namespace;
      lib['bindings'] = bindings;
      lib['S'] = this.utils.S;
    },

    inherit : function (scope, methods) {
      var methods_arr = methods.split(' '),
          i = methods_arr.length;

      while (i--) {
        if (this.utils.hasOwnProperty(methods_arr[i])) {
          scope[methods_arr[i]] = this.utils[methods_arr[i]];
        }
      }
    },

    set_namespace: function () {

      // Description:
      //    Don't bother reading the namespace out of the meta tag
      //    if the namespace has been set globally in javascript
      //
      // Example:
      //    Foundation.global.namespace = 'my-namespace';
      // or make it an empty string:
      //    Foundation.global.namespace = '';
      //
      //

      // If the namespace has not been set (is undefined), try to read it out of the meta element.
      // Otherwise use the globally defined namespace, even if it's empty ('')
      var namespace = ( this.global.namespace === undefined ) ? $('.foundation-data-attribute-namespace').css('font-family') : this.global.namespace;

      // Finally, if the namsepace is either undefined or false, set it to an empty string.
      // Otherwise use the namespace value.
      this.global.namespace = ( namespace === undefined || /false/i.test(namespace) ) ? '' : namespace;
    },

    libs : {},

    // methods that can be inherited in libraries
    utils : {

      // Description:
      //    Fast Selector wrapper returns jQuery object. Only use where getElementById
      //    is not available.
      //
      // Arguments:
      //    Selector (String): CSS selector describing the element(s) to be
      //    returned as a jQuery object.
      //
      //    Scope (String): CSS selector describing the area to be searched. Default
      //    is document.
      //
      // Returns:
      //    Element (jQuery Object): jQuery object containing elements matching the
      //    selector within the scope.
      S : S,

      // Description:
      //    Executes a function a max of once every n milliseconds
      //
      // Arguments:
      //    Func (Function): Function to be throttled.
      //
      //    Delay (Integer): Function execution threshold in milliseconds.
      //
      // Returns:
      //    Lazy_function (Function): Function with throttling applied.
      throttle : function (func, delay) {
        var timer = null;

        return function () {
          var context = this, args = arguments;

          if (timer == null) {
            timer = setTimeout(function () {
              func.apply(context, args);
              timer = null;
            }, delay);
          }
        };
      },

      // Description:
      //    Executes a function when it stops being invoked for n seconds
      //    Modified version of _.debounce() http://underscorejs.org
      //
      // Arguments:
      //    Func (Function): Function to be debounced.
      //
      //    Delay (Integer): Function execution threshold in milliseconds.
      //
      //    Immediate (Bool): Whether the function should be called at the beginning
      //    of the delay instead of the end. Default is false.
      //
      // Returns:
      //    Lazy_function (Function): Function with debouncing applied.
      debounce : function (func, delay, immediate) {
        var timeout, result;
        return function () {
          var context = this, args = arguments;
          var later = function () {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, delay);
          if (callNow) result = func.apply(context, args);
          return result;
        };
      },

      // Description:
      //    Parses data-options attribute
      //
      // Arguments:
      //    El (jQuery Object): Element to be parsed.
      //
      // Returns:
      //    Options (Javascript Object): Contents of the element's data-options
      //    attribute.
      data_options : function (el, data_attr_name) {
        data_attr_name = data_attr_name || 'options';
        var opts = {}, ii, p, opts_arr,
            data_options = function (el) {
              var namespace = Foundation.global.namespace;

              if (namespace.length > 0) {
                return el.data(namespace + '-' + data_attr_name);
              }

              return el.data(data_attr_name);
            };

        var cached_options = data_options(el);

        if (typeof cached_options === 'object') {
          return cached_options;
        }

        opts_arr = (cached_options || ':').split(';');
        ii = opts_arr.length;

        function isNumber (o) {
          return ! isNaN (o-0) && o !== null && o !== '' && o !== false && o !== true;
        }

        function trim (str) {
          if (typeof str === 'string') return $.trim(str);
          return str;
        }

        while (ii--) {
          p = opts_arr[ii].split(':');
          p = [p[0], p.slice(1).join(':')];

          if (/true/i.test(p[1])) p[1] = true;
          if (/false/i.test(p[1])) p[1] = false;
          if (isNumber(p[1])) {
            if (p[1].indexOf('.') === -1) {
              p[1] = parseInt(p[1], 10);
            } else {
              p[1] = parseFloat(p[1]);
            }
          }

          if (p.length === 2 && p[0].length > 0) {
            opts[trim(p[0])] = trim(p[1]);
          }
        }

        return opts;
      },

      // Description:
      //    Adds JS-recognizable media queries
      //
      // Arguments:
      //    Media (String): Key string for the media query to be stored as in
      //    Foundation.media_queries
      //
      //    Class (String): Class name for the generated <meta> tag
      register_media : function (media, media_class) {
        if(Foundation.media_queries[media] === undefined) {
          $('head').append('<meta class="' + media_class + '"/>');
          Foundation.media_queries[media] = removeQuotes($('.' + media_class).css('font-family'));
        }
      },

      // Description:
      //    Add custom CSS within a JS-defined media query
      //
      // Arguments:
      //    Rule (String): CSS rule to be appended to the document.
      //
      //    Media (String): Optional media query string for the CSS rule to be
      //    nested under.
      add_custom_rule : function (rule, media) {
        if (media === undefined && Foundation.stylesheet) {
          Foundation.stylesheet.insertRule(rule, Foundation.stylesheet.cssRules.length);
        } else {
          var query = Foundation.media_queries[media];

          if (query !== undefined) {
            Foundation.stylesheet.insertRule('@media ' +
              Foundation.media_queries[media] + '{ ' + rule + ' }');
          }
        }
      },

      // Description:
      //    Performs a callback function when an image is fully loaded
      //
      // Arguments:
      //    Image (jQuery Object): Image(s) to check if loaded.
      //
      //    Callback (Function): Function to execute when image is fully loaded.
      image_loaded : function (images, callback) {
        var self = this,
            unloaded = images.length;

        if (unloaded === 0) {
          callback(images);
        }

        images.each(function () {
          single_image_loaded(self.S(this), function () {
            unloaded -= 1;
            if (unloaded === 0) {
              callback(images);
            }
          });
        });
      },

      // Description:
      //    Returns a random, alphanumeric string
      //
      // Arguments:
      //    Length (Integer): Length of string to be generated. Defaults to random
      //    integer.
      //
      // Returns:
      //    Rand (String): Pseudo-random, alphanumeric string.
      random_str : function () {
        if (!this.fidx) this.fidx = 0;
        this.prefix = this.prefix || [(this.name || 'F'), (+new Date).toString(36)].join('-');

        return this.prefix + (this.fidx++).toString(36);
      },

      // Description:
      //    Helper for window.matchMedia
      //
      // Arguments:
      //    mq (String): Media query
      //
      // Returns:
      //    (Boolean): Whether the media query passes or not
      match : function (mq) {
        return window.matchMedia(mq).matches;
      },

      // Description:
      //    Helpers for checking Foundation default media queries with JS
      //
      // Returns:
      //    (Boolean): Whether the media query passes or not

      is_small_up : function () {
        return this.match(Foundation.media_queries.small);
      },

      is_medium_up : function () {
        return this.match(Foundation.media_queries.medium);
      },

      is_large_up : function () {
        return this.match(Foundation.media_queries.large);
      },

      is_xlarge_up : function () {
        return this.match(Foundation.media_queries.xlarge);
      },

      is_xxlarge_up : function () {
        return this.match(Foundation.media_queries.xxlarge);
      },

      is_small_only : function () {
        return !this.is_medium_up() && !this.is_large_up() && !this.is_xlarge_up() && !this.is_xxlarge_up();
      },

      is_medium_only : function () {
        return this.is_medium_up() && !this.is_large_up() && !this.is_xlarge_up() && !this.is_xxlarge_up();
      },

      is_large_only : function () {
        return this.is_medium_up() && this.is_large_up() && !this.is_xlarge_up() && !this.is_xxlarge_up();
      },

      is_xlarge_only : function () {
        return this.is_medium_up() && this.is_large_up() && this.is_xlarge_up() && !this.is_xxlarge_up();
      },

      is_xxlarge_only : function () {
        return this.is_medium_up() && this.is_large_up() && this.is_xlarge_up() && this.is_xxlarge_up();
      }
    }
  };

  $.fn.foundation = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return this.each(function () {
      Foundation.init.apply(Foundation, [this].concat(args));
      return this;
    });
  };

}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.alert = {
    name : 'alert',

    version : '5.1.1',

    settings : {
      animation: 'fadeOut',
      speed: 300, // fade out speed
      callback: function (){}
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      var self = this,
          S = this.S;

      $(this.scope).off('.alert').on('click.fndtn.alert', '[' + this.attr_name() + '] a.close', function (e) {
          var alertBox = S(this).closest('[' + self.attr_name() + ']'),
              settings = alertBox.data(self.attr_name(true) + '-init') || self.settings;

        e.preventDefault();
        alertBox[settings.animation](settings.speed, function () {
          S(this).trigger('closed').remove();
          settings.callback();
        });
      });
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.abide = {
    name : 'abide',

    version : '{{VERSION}}',

    settings : {
      live_validate : true,
      validate_on_blur: true,
      focus_on_invalid : true,
      error_labels: true, // labels with a for="inputId" will recieve an `error` class
      error_class: 'error',
      timeout : 1000,
      patterns : {
        alpha: /^[a-zA-Z]+$/,
        alpha_numeric : /^[a-zA-Z0-9]+$/,
        integer: /^[-+]?\d+$/,
        number: /^[-+]?\d*(?:[\.\,]\d+)?$/,

        // amex, visa, diners
        card : /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        cvv : /^([0-9]){3,4}$/,

        // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
        email : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,

        url: /^(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
        // abc.de
        domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,8}$/,

        datetime: /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
        // YYYY-MM-DD
        date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,
        // HH:MM:SS
        time : /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,
        dateISO: /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
        // MM/DD/YYYY
        month_day_year : /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,
        // DD/MM/YYYY
        day_month_year : /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,

        // #FFF or #FFFFFF
        color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
      },
      validators : {
        equalTo: function(el, required, parent) {
          var from  = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value,
              to    = el.value,
              valid = (from === to);

          return valid;
        }
      }
    },

    timer : null,

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          form = self.S(scope).attr('novalidate', 'novalidate'),
          settings = form.data(this.attr_name(true) + '-init') || {};

      this.invalid_attr = this.add_namespace('data-invalid');

      form
        .off('.abide')
        .on('submit.fndtn.abide validate.fndtn.abide', function (e) {
          var is_ajax = /ajax/i.test(self.S(this).attr(self.attr_name()));
          return self.validate(self.S(this).find('input, textarea, select').get(), e, is_ajax);
        })
        .on('reset', function() {
          return self.reset($(this));
        })
        .find('input, textarea, select')
          .off('.abide')
          .on('blur.fndtn.abide change.fndtn.abide', function (e) {
            if (settings.validate_on_blur === true) {
              self.validate([this], e);
            }
          })
          .on('keydown.fndtn.abide', function (e) {
            if (settings.live_validate === true && e.which != 9) {
              clearTimeout(self.timer);
              self.timer = setTimeout(function () {
                self.validate([this], e);
              }.bind(this), settings.timeout);
            }
          });
    },

    reset : function (form) {
      form.removeAttr(this.invalid_attr);
      $(this.invalid_attr, form).removeAttr(this.invalid_attr);
      $('.' + this.settings.error_class, form).not('small').removeClass(this.settings.error_class);
    },

    validate : function (els, e, is_ajax) {
      var validations = this.parse_patterns(els),
          validation_count = validations.length,
          form = this.S(els[0]).closest('form'),
          submit_event = /submit/.test(e.type);

      // Has to count up to make sure the focus gets applied to the top error
      for (var i=0; i < validation_count; i++) {
        if (!validations[i] && (submit_event || is_ajax)) {
          if (this.settings.focus_on_invalid) els[i].focus();
          form.trigger('invalid').trigger('invalid.fndtn.abide');
          this.S(els[i]).closest('form').attr(this.invalid_attr, '');
          return false;
        }
      }

      if (submit_event || is_ajax) {
        form.trigger('valid').trigger('valid.fndtn.abide');
      }

      form.removeAttr(this.invalid_attr);

      if (is_ajax) return false;

      return true;
    },

    parse_patterns : function (els) {
      var i = els.length,
          el_patterns = [];

      while (i--) {
        el_patterns.push(this.pattern(els[i]));
      }

      return this.check_validation_and_apply_styles(el_patterns);
    },

    pattern : function (el) {
      var type = el.getAttribute('type'),
          required = typeof el.getAttribute('required') === 'string';

      var pattern = el.getAttribute('pattern') || '';

      if (this.settings.patterns.hasOwnProperty(pattern) && pattern.length > 0) {
        return [el, this.settings.patterns[pattern], required];
      } else if (pattern.length > 0) {
        return [el, new RegExp(pattern), required];
      }

      if (this.settings.patterns.hasOwnProperty(type)) {
        return [el, this.settings.patterns[type], required];
      }

      pattern = /.*/;

      return [el, pattern, required];
    },

    // TODO: Break this up into smaller methods, getting hard to read.
    check_validation_and_apply_styles : function (el_patterns) {
      var i = el_patterns.length,
          validations = [],
          form = this.S(el_patterns[0][0]).closest('[data-' + this.attr_name(true) + ']'),
          settings = form.data(this.attr_name(true) + '-init') || {};
      while (i--) {
        var el = el_patterns[i][0],
            required = el_patterns[i][2],
            value = el.value.trim(),
            direct_parent = this.S(el).parent(),
            validator = el.getAttribute(this.add_namespace('data-abide-validator')),
            is_radio = el.type === "radio",
            is_checkbox = el.type === "checkbox",
            label = this.S('label[for="' + el.getAttribute('id') + '"]'),
            valid_length = (required) ? (el.value.length > 0) : true,
            el_validations = [];

        var parent, valid;

        // support old way to do equalTo validations
        if(el.getAttribute(this.add_namespace('data-equalto'))) { validator = "equalTo" }

        if (!direct_parent.is('label') && !direct_parent.is('.twitter-typeahead')) {
          parent = direct_parent;
        } else {
          parent = direct_parent.parent();
        }

        if (validator) {
          valid = this.settings.validators[validator].apply(this, [el, required, parent]);
          el_validations.push(valid);
        }

        if (is_radio && required) {
          el_validations.push(this.valid_radio(el, required));
        } else if (is_checkbox && required) {
          el_validations.push(this.valid_checkbox(el, required));
        } else {

          if (el_patterns[i][1].test(value) && valid_length ||
            !required && el.value.length < 1 || $(el).attr('disabled')) {
            el_validations.push(true);
          } else {
            el_validations.push(false);
          }

          el_validations = [el_validations.every(function(valid){return valid;})];

          if(el_validations[0]){
            this.S(el).removeAttr(this.invalid_attr);
            el.setAttribute('aria-invalid', 'false');
            el.removeAttribute('aria-describedby');
            parent.removeClass(this.settings.error_class);
            if (label.length > 0 && this.settings.error_labels) {
              label.removeClass(this.settings.error_class).removeAttr('role');
            }
            $(el).triggerHandler('valid');
          } else {
            this.S(el).attr(this.invalid_attr, '');
            el.setAttribute('aria-invalid', 'true');

            // Try to find the error associated with the input
            var errorElem = parent.find('small.'+this.settings.error_class, 'span.'+this.settings.error_class);
            var errorID = errorElem.length > 0 ? errorElem[0].id : "";
            if (errorID.length > 0) el.setAttribute('aria-describedby', errorID);

            // el.setAttribute('aria-describedby', $(el).find('.error')[0].id);
            parent.addClass(this.settings.error_class);
            if (label.length > 0 && this.settings.error_labels) {
              label.addClass(this.settings.error_class).attr('role', 'alert');
            }
            $(el).triggerHandler('invalid');
          }
        }
        validations.push(el_validations[0]);
      }
      validations = [validations.every(function(valid){return valid;})];
      return validations;
    },

    valid_checkbox : function(el, required) {
      var el = this.S(el),
          valid = (el.is(':checked') || !required || el.get(0).getAttribute('disabled'));

      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
      } else {
        el.attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
      }

      return valid;
    },

    valid_radio : function (el, required) {
      var name = el.getAttribute('name'),
          group = this.S(el).closest('[data-' + this.attr_name(true) + ']').find("[name='"+name+"']"),
          count = group.length,
          valid = false,
          disabled = false;

      // Has to count up to make sure the focus gets applied to the top error
        for (var i=0; i < count; i++) {
            if( group[i].getAttribute('disabled') ){
                disabled=true;
                valid=true;
            } else {
                if (group[i].checked){
                    valid = true;
                } else {
                    if( disabled ){
                        valid = false;
                    }
                }
            }
        }

      // Has to count up to make sure the focus gets applied to the top error
      for (var i=0; i < count; i++) {
        if (valid) {
          this.S(group[i]).removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
        } else {
          this.S(group[i]).attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
        }
      }

      return valid;
    },

    valid_equal: function(el, required, parent) {
      var from  = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value,
          to    = el.value,
          valid = (from === to);

      if (valid) {
        this.S(el).removeAttr(this.invalid_attr);
        parent.removeClass(this.settings.error_class);
        if (label.length > 0 && settings.error_labels) label.removeClass(this.settings.error_class);
      } else {
        this.S(el).attr(this.invalid_attr, '');
        parent.addClass(this.settings.error_class);
        if (label.length > 0 && settings.error_labels) label.addClass(this.settings.error_class);
      }

      return valid;
    },

    valid_oneof: function(el, required, parent, doNotValidateOthers) {
      var el = this.S(el),
        others = this.S('[' + this.add_namespace('data-oneof') + ']'),
        valid = others.filter(':checked').length > 0;

      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
      } else {
        el.attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
      }

      if (!doNotValidateOthers) {
        var _this = this;
        others.each(function() {
          _this.valid_oneof.call(_this, this, null, null, true);
        });
      }

      return valid;
    }
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.reveal = {
    name : 'reveal',

    version : '{{VERSION}}',

    locked : false,

    settings : {
      animation: 'fadeAndPop',
      animation_speed: 250,
      close_on_background_click: true,
      close_on_esc: true,
      dismiss_modal_class: 'close-reveal-modal',
      bg_class: 'reveal-modal-bg',
      root_element: 'body',
      open: function(){},
      opened: function(){},
      close: function(){},
      closed: function(){},
      bg : $('.reveal-modal-bg'),
      css : {
        open : {
          'opacity': 0,
          'visibility': 'visible',
          'display' : 'block'
        },
        close : {
          'opacity': 1,
          'visibility': 'hidden',
          'display': 'none'
        }
      }
    },

    init : function (scope, method, options) {
      $.extend(true, this.settings, method, options);
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          S = self.S;

      S(this.scope)
        .off('.reveal')
        .on('click.fndtn.reveal', '[' + this.add_namespace('data-reveal-id') + ']:not([disabled])', function (e) {
          e.preventDefault();

          if (!self.locked) {
            var element = S(this),
                ajax = element.data(self.data_attr('reveal-ajax'));

            self.locked = true;

            if (typeof ajax === 'undefined') {
              self.open.call(self, element);
            } else {
              var url = ajax === true ? element.attr('href') : ajax;

              self.open.call(self, element, {url: url});
            }
          }
        });

      S(document)
        .on('click.fndtn.reveal', this.close_targets(), function (e) {
          e.preventDefault();
          if (!self.locked) {
            var settings = S('[' + self.attr_name() + '].open').data(self.attr_name(true) + '-init') || self.settings,
                bg_clicked = S(e.target)[0] === S('.' + settings.bg_class)[0];

            if (bg_clicked) {
              if (settings.close_on_background_click) {
                e.stopPropagation();
              } else {
                return;
              }
            }

            self.locked = true;
            self.close.call(self, bg_clicked ? S('[' + self.attr_name() + '].open') : S(this).closest('[' + self.attr_name() + ']'));
          }
        });

      if(S('[' + self.attr_name() + ']', this.scope).length > 0) {
        S(this.scope)
          // .off('.reveal')
          .on('open.fndtn.reveal', this.settings.open)
          .on('opened.fndtn.reveal', this.settings.opened)
          .on('opened.fndtn.reveal', this.open_video)
          .on('close.fndtn.reveal', this.settings.close)
          .on('closed.fndtn.reveal', this.settings.closed)
          .on('closed.fndtn.reveal', this.close_video);
      } else {
        S(this.scope)
          // .off('.reveal')
          .on('open.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.open)
          .on('opened.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.opened)
          .on('opened.fndtn.reveal', '[' + self.attr_name() + ']', this.open_video)
          .on('close.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.close)
          .on('closed.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.closed)
          .on('closed.fndtn.reveal', '[' + self.attr_name() + ']', this.close_video);
      }

      return true;
    },

    // PATCH #3: turning on key up capture only when a reveal window is open
    key_up_on : function (scope) {
      var self = this;

      // PATCH #1: fixing multiple keyup event trigger from single key press
      self.S('body').off('keyup.fndtn.reveal').on('keyup.fndtn.reveal', function ( event ) {
        var open_modal = self.S('[' + self.attr_name() + '].open'),
            settings = open_modal.data(self.attr_name(true) + '-init') || self.settings ;
        // PATCH #2: making sure that the close event can be called only while unlocked,
        //           so that multiple keyup.fndtn.reveal events don't prevent clean closing of the reveal window.
        if ( settings && event.which === 27  && settings.close_on_esc && !self.locked) { // 27 is the keycode for the Escape key
          self.close.call(self, open_modal);
        }
      });

      return true;
    },

    // PATCH #3: turning on key up capture only when a reveal window is open
    key_up_off : function (scope) {
      this.S('body').off('keyup.fndtn.reveal');
      return true;
    },


    open : function (target, ajax_settings) {
      var self = this,
          modal;

      if (target) {
        if (typeof target.selector !== 'undefined') {
          // Find the named node; only use the first one found, since the rest of the code assumes there's only one node
          modal = self.S('#' + target.data(self.data_attr('reveal-id'))).first();
        } else {
          modal = self.S(this.scope);

          ajax_settings = target;
        }
      } else {
        modal = self.S(this.scope);
      }

      var settings = modal.data(self.attr_name(true) + '-init');
      settings = settings || this.settings;


      if (modal.hasClass('open') && target.attr('data-reveal-id') == modal.attr('id')) {
        return self.close(modal);
      }

      if (!modal.hasClass('open')) {
        var open_modal = self.S('[' + self.attr_name() + '].open');

        if (typeof modal.data('css-top') === 'undefined') {
          modal.data('css-top', parseInt(modal.css('top'), 10))
            .data('offset', this.cache_offset(modal));
        }

        this.key_up_on(modal);    // PATCH #3: turning on key up capture only when a reveal window is open

        modal.on('open.fndtn.reveal').trigger('open.fndtn.reveal');

        if (open_modal.length < 1) {
          this.toggle_bg(modal, true);
        }

        if (typeof ajax_settings === 'string') {
          ajax_settings = {
            url: ajax_settings
          };
        }

        if (typeof ajax_settings === 'undefined' || !ajax_settings.url) {
          if (open_modal.length > 0) {
            this.hide(open_modal, settings.css.close);
          }

          this.show(modal, settings.css.open);
        } else {
          var old_success = typeof ajax_settings.success !== 'undefined' ? ajax_settings.success : null;

          $.extend(ajax_settings, {
            success: function (data, textStatus, jqXHR) {
              if ( $.isFunction(old_success) ) {
                var result = old_success(data, textStatus, jqXHR);
                if (typeof result == 'string') data = result;
              }

              modal.html(data);
              self.S(modal).foundation('section', 'reflow');
              self.S(modal).children().foundation();

              if (open_modal.length > 0) {
                self.hide(open_modal, settings.css.close);
              }
              self.show(modal, settings.css.open);
            }
          });

          $.ajax(ajax_settings);
        }
      }
      self.S(window).trigger('resize');
    },

    close : function (modal) {
      var modal = modal && modal.length ? modal : this.S(this.scope),
          open_modals = this.S('[' + this.attr_name() + '].open'),
          settings = modal.data(this.attr_name(true) + '-init') || this.settings;

      if (open_modals.length > 0) {
        this.locked = true;
        this.key_up_off(modal);   // PATCH #3: turning on key up capture only when a reveal window is open
        modal.trigger('close').trigger('close.fndtn.reveal');
        this.toggle_bg(modal, false);
        this.hide(open_modals, settings.css.close, settings);
      }
    },

    close_targets : function () {
      var base = '.' + this.settings.dismiss_modal_class;

      if (this.settings.close_on_background_click) {
        return base + ', .' + this.settings.bg_class;
      }

      return base;
    },

    toggle_bg : function (modal, state) {
      if (this.S('.' + this.settings.bg_class).length === 0) {
        this.settings.bg = $('<div />', {'class': this.settings.bg_class})
          .appendTo('body').hide();
      }

      var visible = this.settings.bg.filter(':visible').length > 0;
      if ( state != visible ) {
        if ( state == undefined ? visible : !state ) {
          this.hide(this.settings.bg);
        } else {
          this.show(this.settings.bg);
        }
      }
    },

    show : function (el, css) {
      // is modal
      if (css) {
        var settings = el.data(this.attr_name(true) + '-init') || this.settings,
            root_element = settings.root_element;

        if (el.parent(root_element).length === 0) {
          var placeholder = el.wrap('<div style="display: none;" />').parent();

          el.on('closed.fndtn.reveal.wrapped', function() {
            el.detach().appendTo(placeholder);
            el.unwrap().unbind('closed.fndtn.reveal.wrapped');
          });

          el.detach().appendTo(root_element);
        }

        var animData = getAnimationData(settings.animation);
        if (!animData.animate) {
          this.locked = false;
        }
        if (animData.pop) {
          css.top = $(window).scrollTop() - el.data('offset') + 'px';
          var end_css = {
            top: $(window).scrollTop() + el.data('css-top') + 'px',
            opacity: 1
          };

          return setTimeout(function () {
            return el
              .css(css)
              .animate(end_css, settings.animation_speed, 'linear', function () {
                this.locked = false;
                el.trigger('opened').trigger('opened.fndtn.reveal');
              }.bind(this))
              .addClass('open');
          }.bind(this), settings.animation_speed / 2);
        }

        if (animData.fade) {
          css.top = $(window).scrollTop() + el.data('css-top') + 'px';
          var end_css = {opacity: 1};

          return setTimeout(function () {
            return el
              .css(css)
              .animate(end_css, settings.animation_speed, 'linear', function () {
                this.locked = false;
                el.trigger('opened').trigger('opened.fndtn.reveal');
              }.bind(this))
              .addClass('open');
          }.bind(this), settings.animation_speed / 2);
        }

        return el.css(css).show().css({opacity: 1}).addClass('open').trigger('opened').trigger('opened.fndtn.reveal');
      }

      var settings = this.settings;

      // should we animate the background?
      if (getAnimationData(settings.animation).fade) {
        return el.fadeIn(settings.animation_speed / 2);
      }

      this.locked = false;

      return el.show();
    },

    hide : function (el, css) {
      // is modal
      if (css) {
        var settings = el.data(this.attr_name(true) + '-init');
        settings = settings || this.settings;

        var animData = getAnimationData(settings.animation);
        if (!animData.animate) {
          this.locked = false;
        }
        if (animData.pop) {
          var end_css = {
            top: - $(window).scrollTop() - el.data('offset') + 'px',
            opacity: 0
          };

          return setTimeout(function () {
            return el
              .animate(end_css, settings.animation_speed, 'linear', function () {
                this.locked = false;
                el.css(css).trigger('closed').trigger('closed.fndtn.reveal');
              }.bind(this))
              .removeClass('open');
          }.bind(this), settings.animation_speed / 2);
        }

        if (animData.fade) {
          var end_css = {opacity: 0};

          return setTimeout(function () {
            return el
              .animate(end_css, settings.animation_speed, 'linear', function () {
                this.locked = false;
                el.css(css).trigger('closed').trigger('closed.fndtn.reveal');
              }.bind(this))
              .removeClass('open');
          }.bind(this), settings.animation_speed / 2);
        }

        return el.hide().css(css).removeClass('open').trigger('closed').trigger('closed.fndtn.reveal');
      }

      var settings = this.settings;

      // should we animate the background?
      if (getAnimationData(settings.animation).fade) {
        return el.fadeOut(settings.animation_speed / 2);
      }

      return el.hide();
    },

    close_video : function (e) {
      var video = $('.flex-video', e.target),
          iframe = $('iframe', video);

      if (iframe.length > 0) {
        iframe.attr('data-src', iframe[0].src);
        iframe.attr('src', iframe.attr('src'));
        video.hide();
      }
    },

    open_video : function (e) {
      var video = $('.flex-video', e.target),
          iframe = video.find('iframe');

      if (iframe.length > 0) {
        var data_src = iframe.attr('data-src');
        if (typeof data_src === 'string') {
          iframe[0].src = iframe.attr('data-src');
        } else {
          var src = iframe[0].src;
          iframe[0].src = undefined;
          iframe[0].src = src;
        }
        video.show();
      }
    },

    data_attr: function (str) {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + str;
      }

      return str;
    },

    cache_offset : function (modal) {
      var offset = modal.show().height() + parseInt(modal.css('top'), 10);

      modal.hide();

      return offset;
    },

    off : function () {
      $(this.scope).off('.fndtn.reveal');
    },

    reflow : function () {}
  };

  /*
   * getAnimationData('popAndFade') // {animate: true,  pop: true,  fade: true}
   * getAnimationData('fade')       // {animate: true,  pop: false, fade: true}
   * getAnimationData('pop')        // {animate: true,  pop: true,  fade: false}
   * getAnimationData('foo')        // {animate: false, pop: false, fade: false}
   * getAnimationData(null)         // {animate: false, pop: false, fade: false}
   */
  function getAnimationData(str) {
    var fade = /fade/i.test(str);
    var pop = /pop/i.test(str);
    return {
      animate: fade || pop,
      pop: pop,
      fade: fade
    };
  }
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.accordion = {
    name : 'accordion',

    version : '{{VERSION}}',

    settings : {
      content_class: 'content',
      active_class: 'active',
      multi_expand: false,
      toggleable: true,
      callback : function () {}
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      var self = this;
      var S = this.S;
      S(this.scope)
      .off('.fndtn.accordion')
      .on('click.fndtn.accordion', '[' + this.attr_name() + '] > .accordion-navigation > a', function (e) {
        var accordion = S(this).closest('[' + self.attr_name() + ']'),
            groupSelector = self.attr_name() + '=' + accordion.attr(self.attr_name()),
            settings = accordion.data(self.attr_name(true) + '-init') || self.settings,
            target = S('#' + this.href.split('#')[1]),
            aunts = $('> .accordion-navigation', accordion),
            siblings = aunts.children('.'+settings.content_class),
            active_content = siblings.filter('.' + settings.active_class);

        e.preventDefault();

        if (accordion.attr(self.attr_name())) {
          siblings = siblings.add('[' + groupSelector + '] dd > '+'.'+settings.content_class);
          aunts = aunts.add('[' + groupSelector + '] .accordion-navigation');
        }

        if (settings.toggleable && target.is(active_content)) {
          target.parent('.accordion-navigation').toggleClass(settings.active_class, false);
          target.toggleClass(settings.active_class, false);
          settings.callback(target);
          target.triggerHandler('toggled', [accordion]);
          accordion.triggerHandler('toggled', [target]);
          return;
        }

        if (!settings.multi_expand) {
          siblings.removeClass(settings.active_class);
          aunts.removeClass(settings.active_class);
        }

        target.addClass(settings.active_class).parent().addClass(settings.active_class);
        settings.callback(target);
        target.triggerHandler('toggled', [accordion]);
        accordion.triggerHandler('toggled', [target]);
      });
    },

    off : function () {},

    reflow : function () {}
  };
}(jQuery, window, window.document));

/*! noUiSlider - 7.0.10 - 2014-12-27 14:50:46 */

(function(){

	'use strict';

var
/** @const */ FormatOptions = [
	'decimals',
	'thousand',
	'mark',
	'prefix',
	'postfix',
	'encoder',
	'decoder',
	'negativeBefore',
	'negative',
	'edit',
	'undo'
];

// General

	// Reverse a string
	function strReverse ( a ) {
		return a.split('').reverse().join('');
	}

	// Check if a string starts with a specified prefix.
	function strStartsWith ( input, match ) {
		return input.substring(0, match.length) === match;
	}

	// Check is a string ends in a specified postfix.
	function strEndsWith ( input, match ) {
		return input.slice(-1 * match.length) === match;
	}

	// Throw an error if formatting options are incompatible.
	function throwEqualError( F, a, b ) {
		if ( (F[a] || F[b]) && (F[a] === F[b]) ) {
			throw new Error(a);
		}
	}

	// Check if a number is finite and not NaN
	function isValidNumber ( input ) {
		return typeof input === 'number' && isFinite( input );
	}

	// Provide rounding-accurate toFixed method.
	function toFixed ( value, decimals ) {
		var scale = Math.pow(10, decimals);
		return ( Math.round(value * scale) / scale).toFixed( decimals );
	}


// Formatting

	// Accept a number as input, output formatted string.
	function formatTo ( decimals, thousand, mark, prefix, postfix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

		var originalInput = input, inputIsNegative, inputPieces, inputBase, inputDecimals = '', output = '';

		// Apply user encoder to the input.
		// Expected outcome: number.
		if ( encoder ) {
			input = encoder(input);
		}

		// Stop if no valid number was provided, the number is infinite or NaN.
		if ( !isValidNumber(input) ) {
			return false;
		}

		// Rounding away decimals might cause a value of -0
		// when using very small ranges. Remove those cases.
		if ( decimals !== false && parseFloat(input.toFixed(decimals)) === 0 ) {
			input = 0;
		}

		// Formatting is done on absolute numbers,
		// decorated by an optional negative symbol.
		if ( input < 0 ) {
			inputIsNegative = true;
			input = Math.abs(input);
		}

		// Reduce the number of decimals to the specified option.
		if ( decimals !== false ) {
			input = toFixed( input, decimals );
		}

		// Transform the number into a string, so it can be split.
		input = input.toString();

		// Break the number on the decimal separator.
		if ( input.indexOf('.') !== -1 ) {
			inputPieces = input.split('.');

			inputBase = inputPieces[0];

			if ( mark ) {
				inputDecimals = mark + inputPieces[1];
			}

		} else {

		// If it isn't split, the entire number will do.
			inputBase = input;
		}

		// Group numbers in sets of three.
		if ( thousand ) {
			inputBase = strReverse(inputBase).match(/.{1,3}/g);
			inputBase = strReverse(inputBase.join( strReverse( thousand ) ));
		}

		// If the number is negative, prefix with negation symbol.
		if ( inputIsNegative && negativeBefore ) {
			output += negativeBefore;
		}

		// Prefix the number
		if ( prefix ) {
			output += prefix;
		}

		// Normal negative option comes after the prefix. Defaults to '-'.
		if ( inputIsNegative && negative ) {
			output += negative;
		}

		// Append the actual number.
		output += inputBase;
		output += inputDecimals;

		// Apply the postfix.
		if ( postfix ) {
			output += postfix;
		}

		// Run the output through a user-specified post-formatter.
		if ( edit ) {
			output = edit ( output, originalInput );
		}

		// All done.
		return output;
	}

	// Accept a sting as input, output decoded number.
	function formatFrom ( decimals, thousand, mark, prefix, postfix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

		var originalInput = input, inputIsNegative, output = '';

		// User defined pre-decoder. Result must be a non empty string.
		if ( undo ) {
			input = undo(input);
		}

		// Test the input. Can't be empty.
		if ( !input || typeof input !== 'string' ) {
			return false;
		}

		// If the string starts with the negativeBefore value: remove it.
		// Remember is was there, the number is negative.
		if ( negativeBefore && strStartsWith(input, negativeBefore) ) {
			input = input.replace(negativeBefore, '');
			inputIsNegative = true;
		}

		// Repeat the same procedure for the prefix.
		if ( prefix && strStartsWith(input, prefix) ) {
			input = input.replace(prefix, '');
		}

		// And again for negative.
		if ( negative && strStartsWith(input, negative) ) {
			input = input.replace(negative, '');
			inputIsNegative = true;
		}

		// Remove the postfix.
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
		if ( postfix && strEndsWith(input, postfix) ) {
			input = input.slice(0, -1 * postfix.length);
		}

		// Remove the thousand grouping.
		if ( thousand ) {
			input = input.split(thousand).join('');
		}

		// Set the decimal separator back to period.
		if ( mark ) {
			input = input.replace(mark, '.');
		}

		// Prepend the negative symbol.
		if ( inputIsNegative ) {
			output += '-';
		}

		// Add the number
		output += input;

		// Trim all non-numeric characters (allow '.' and '-');
		output = output.replace(/[^0-9\.\-.]/g, '');

		// The value contains no parse-able number.
		if ( output === '' ) {
			return false;
		}

		// Covert to number.
		output = Number(output);

		// Run the user-specified post-decoder.
		if ( decoder ) {
			output = decoder(output);
		}

		// Check is the output is valid, otherwise: return false.
		if ( !isValidNumber(output) ) {
			return false;
		}

		return output;
	}


// Framework

	// Validate formatting options
	function validate ( inputOptions ) {

		var i, optionName, optionValue,
			filteredOptions = {};

		for ( i = 0; i < FormatOptions.length; i+=1 ) {

			optionName = FormatOptions[i];
			optionValue = inputOptions[optionName];

			if ( optionValue === undefined ) {

				// Only default if negativeBefore isn't set.
				if ( optionName === 'negative' && !filteredOptions.negativeBefore ) {
					filteredOptions[optionName] = '-';
				// Don't set a default for mark when 'thousand' is set.
				} else if ( optionName === 'mark' && filteredOptions.thousand !== '.' ) {
					filteredOptions[optionName] = '.';
				} else {
					filteredOptions[optionName] = false;
				}

			// Floating points in JS are stable up to 7 decimals.
			} else if ( optionName === 'decimals' ) {
				if ( optionValue >= 0 && optionValue < 8 ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}

			// These options, when provided, must be functions.
			} else if ( optionName === 'encoder' || optionName === 'decoder' || optionName === 'edit' || optionName === 'undo' ) {
				if ( typeof optionValue === 'function' ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}

			// Other options are strings.
			} else {

				if ( typeof optionValue === 'string' ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}
			}
		}

		// Some values can't be extracted from a
		// string if certain combinations are present.
		throwEqualError(filteredOptions, 'mark', 'thousand');
		throwEqualError(filteredOptions, 'prefix', 'negative');
		throwEqualError(filteredOptions, 'prefix', 'negativeBefore');

		return filteredOptions;
	}

	// Pass all options as function arguments
	function passAll ( options, method, input ) {
		var i, args = [];

		// Add all options in order of FormatOptions
		for ( i = 0; i < FormatOptions.length; i+=1 ) {
			args.push(options[FormatOptions[i]]);
		}

		// Append the input, then call the method, presenting all
		// options as arguments.
		args.push(input);
		return method.apply('', args);
	}

	/** @constructor */
	function wNumb ( options ) {

		if ( !(this instanceof wNumb) ) {
			return new wNumb ( options );
		}

		if ( typeof options !== "object" ) {
			return;
		}

		options = validate(options);

		// Call 'formatTo' with proper arguments.
		this.to = function ( input ) {
			return passAll(options, formatTo, input);
		};

		// Call 'formatFrom' with proper arguments.
		this.from = function ( input ) {
			return passAll(options, formatFrom, input);
		};
	}

	/** @export */
	window.wNumb = wNumb;

}());

/*jslint browser: true */
/*jslint white: true */

(function( $ ){

	'use strict';

// Helpers

	// Test in an object is an instance of jQuery or Zepto.
	function isInstance ( a ) {
		return a instanceof $ || ( $.zepto && $.zepto.isZ(a) );
	}


// Link types

	function fromPrefix ( target, method ) {

		// If target is a string, a new hidden input will be created.
		if ( typeof target === 'string' && target.indexOf('-inline-') === 0 ) {

			// By default, use the 'html' method.
			this.method = method || 'html';

			// Use jQuery to create the element
			this.target = this.el = $( target.replace('-inline-', '') || '<div/>' );

			return true;
		}
	}

	function fromString ( target ) {

		// If the string doesn't begin with '-', which is reserved, add a new hidden input.
		if ( typeof target === 'string' && target.indexOf('-') !== 0 ) {

			this.method = 'val';

			var element = document.createElement('input');
				element.name = target;
				element.type = 'hidden';
			this.target = this.el = $(element);

			return true;
		}
	}

	function fromFunction ( target ) {

		// The target can also be a function, which will be called.
		if ( typeof target === 'function' ) {
			this.target = false;
			this.method = target;

			return true;
		}
	}

	function fromInstance ( target, method ) {

		if ( isInstance( target ) && !method ) {

		// If a jQuery/Zepto input element is provided, but no method is set,
		// the element can assume it needs to respond to 'change'...
			if ( target.is('input, select, textarea') ) {

				// Default to .val if this is an input element.
				this.method = 'val';

				// Fire the API changehandler when the target changes.
				this.target = target.on('change.liblink', this.changeHandler);

			} else {

				this.target = target;

				// If no method is set, and we are not auto-binding an input, default to 'html'.
				this.method = 'html';
			}

			return true;
		}
	}

	function fromInstanceMethod ( target, method ) {

		// The method must exist on the element.
		if ( isInstance( target ) &&
			(typeof method === 'function' ||
				(typeof method === 'string' && target[method]))
		) {
			this.method = method;
			this.target = target;

			return true;
		}
	}

var
/** @const */
	creationFunctions = [fromPrefix, fromString, fromFunction, fromInstance, fromInstanceMethod];


// Link Instance

/** @constructor */
	function Link ( target, method, format ) {

		var that = this, valid = false;

		// Forward calls within scope.
		this.changeHandler = function ( changeEvent ) {
			var decodedValue = that.formatInstance.from( $(this).val() );

			// If the value is invalid, stop this event, as well as it's propagation.
			if ( decodedValue === false || isNaN(decodedValue) ) {

				// Reset the value.
				$(this).val(that.lastSetValue);
				return false;
			}

			that.changeHandlerMethod.call( '', changeEvent, decodedValue );
		};

		// See if this Link needs individual targets based on its usage.
		// If so, return the element that needs to be copied by the
		// implementing interface.
		// Default the element to false.
		this.el = false;

		// Store the formatter, or use the default.
		this.formatInstance = format;

		// Try all Link types.
		/*jslint unparam: true*/
		$.each(creationFunctions, function(i, fn){
			valid = fn.call(that, target, method);
			return !valid;
		});
		/*jslint unparam: false*/

		// Nothing matched, throw error.
		if ( !valid ) {
			throw new RangeError("(Link) Invalid Link.");
		}
	}

	// Provides external items with the object value.
	Link.prototype.set = function ( value ) {

		// Ignore the value, so only the passed-on arguments remain.
		var args = Array.prototype.slice.call( arguments ),
			additionalArgs = args.slice(1);

		// Store some values. The actual, numerical value,
		// the formatted value and the parameters for use in 'resetValue'.
		// Slice additionalArgs to break the relation.
		this.lastSetValue = this.formatInstance.to( value );

		// Prepend the value to the function arguments.
		additionalArgs.unshift(
			this.lastSetValue
		);

		// When target is undefined, the target was a function.
		// In that case, provided the object as the calling scope.
		// Branch between writing to a function or an object.
		( typeof this.method === 'function' ?
			this.method :
			this.target[ this.method ] ).apply( this.target, additionalArgs );
	};


// Developer API

/** @constructor */
	function LinkAPI ( origin ) {
		this.items = [];
		this.elements = [];
		this.origin = origin;
	}

	LinkAPI.prototype.push = function( item, element ) {
		this.items.push(item);

		// Prevent 'false' elements
		if ( element ) {
			this.elements.push(element);
		}
	};

	LinkAPI.prototype.reconfirm = function ( flag ) {
		var i;
		for ( i = 0; i < this.elements.length; i += 1 ) {
			this.origin.LinkConfirm(flag, this.elements[i]);
		}
	};

	LinkAPI.prototype.remove = function ( flag ) {
		var i;
		for ( i = 0; i < this.items.length; i += 1 ) {
			this.items[i].target.off('.liblink');
		}
		for ( i = 0; i < this.elements.length; i += 1 ) {
			this.elements[i].remove();
		}
	};

	LinkAPI.prototype.change = function ( value ) {

		if ( this.origin.LinkIsEmitting ) {
			return false;
		}

		this.origin.LinkIsEmitting = true;

		var args = Array.prototype.slice.call( arguments, 1 ), i;
		args.unshift( value );

		// Write values to serialization Links.
		// Convert the value to the correct relative representation.
		for ( i = 0; i < this.items.length; i += 1 ) {
			this.items[i].set.apply(this.items[i], args);
		}

		this.origin.LinkIsEmitting = false;
	};


// jQuery plugin

	function binder ( flag, target, method, format ){

		if ( flag === 0 ) {
			flag = this.LinkDefaultFlag;
		}

		// Create a list of API's (if it didn't exist yet);
		if ( !this.linkAPI ) {
			this.linkAPI = {};
		}

		// Add an API point.
		if ( !this.linkAPI[flag] ) {
			this.linkAPI[flag] = new LinkAPI(this);
		}

		var linkInstance = new Link ( target, method, format || this.LinkDefaultFormatter );

		// Default the calling scope to the linked object.
		if ( !linkInstance.target ) {
			linkInstance.target = $(this);
		}

		// If the Link requires creation of a new element,
		// Pass the element and request confirmation to get the changehandler.
		// Set the method to be called when a Link changes.
		linkInstance.changeHandlerMethod = this.LinkConfirm( flag, linkInstance.el );

		// Store the linkInstance in the flagged list.
		this.linkAPI[flag].push( linkInstance, linkInstance.el );

		// Now that Link have been connected, request an update.
		this.LinkUpdate( flag );
	}

	/** @export */
	$.fn.Link = function( flag ){

		var that = this;

		// Delete all linkAPI
		if ( flag === false ) {

			return that.each(function(){

				// .Link(false) can be called on elements without Links.
				// When that happens, the objects can't be looped.
				if ( !this.linkAPI ) {
					return;
				}

				$.map(this.linkAPI, function(api){
					api.remove();
				});

				delete this.linkAPI;
			});
		}

		if ( flag === undefined ) {

			flag = 0;

		} else if ( typeof flag !== 'string') {

			throw new Error("Flag must be string.");
		}

		return {
			to: function( a, b, c ){
				return that.each(function(){
					binder.call(this, flag, a, b, c);
				});
			}
		};
	};

}( window.jQuery || window.Zepto ));

/*jslint browser: true */
/*jslint white: true */

(function( $ ){

	'use strict';


	// Removes duplicates from an array.
	function unique(array) {
		return $.grep(array, function(el, index) {
			return index === $.inArray(el, array);
		});
	}

	// Round a value to the closest 'to'.
	function closest ( value, to ) {
		return Math.round(value / to) * to;
	}

	// Checks whether a value is numerical.
	function isNumeric ( a ) {
		return typeof a === 'number' && !isNaN( a ) && isFinite( a );
	}

	// Rounds a number to 7 supported decimals.
	function accurateNumber( number ) {
		var p = Math.pow(10, 7);
		return Number((Math.round(number*p)/p).toFixed(7));
	}

	// Sets a class and removes it after [duration] ms.
	function addClassFor ( element, className, duration ) {
		element.addClass(className);
		setTimeout(function(){
			element.removeClass(className);
		}, duration);
	}

	// Limits a value to 0 - 100
	function limit ( a ) {
		return Math.max(Math.min(a, 100), 0);
	}

	// Wraps a variable as an array, if it isn't one yet.
	function asArray ( a ) {
		return $.isArray(a) ? a : [a];
	}

	// Counts decimals
	function countDecimals ( numStr ) {
		var pieces = numStr.split(".");
		return pieces.length > 1 ? pieces[1].length : 0;
	}


	var
	// Cache the document selector;
	/** @const */
	doc = $(document),
	// Make a backup of the original jQuery/Zepto .val() method.
	/** @const */
	$val = $.fn.val,
	// Namespace for binding and unbinding slider events;
	/** @const */
	namespace = '.nui',
	// Determine the events to bind. IE11 implements pointerEvents without
	// a prefix, which breaks compatibility with the IE10 implementation.
	/** @const */
	actions = window.navigator.pointerEnabled ? {
		start: 'pointerdown',
		move: 'pointermove',
		end: 'pointerup'
	} : window.navigator.msPointerEnabled ? {
		start: 'MSPointerDown',
		move: 'MSPointerMove',
		end: 'MSPointerUp'
	} : {
		start: 'mousedown touchstart',
		move: 'mousemove touchmove',
		end: 'mouseup touchend'
	},
	// Re-usable list of classes;
	/** @const */
	Classes = [
/*  0 */  'noUi-target'
/*  1 */ ,'noUi-base'
/*  2 */ ,'noUi-origin'
/*  3 */ ,'noUi-handle'
/*  4 */ ,'noUi-horizontal'
/*  5 */ ,'noUi-vertical'
/*  6 */ ,'noUi-background'
/*  7 */ ,'noUi-connect'
/*  8 */ ,'noUi-ltr'
/*  9 */ ,'noUi-rtl'
/* 10 */ ,'noUi-dragable'
/* 11 */ ,''
/* 12 */ ,'noUi-state-drag'
/* 13 */ ,''
/* 14 */ ,'noUi-state-tap'
/* 15 */ ,'noUi-active'
/* 16 */ ,''
/* 17 */ ,'noUi-stacking'
	];


// Value calculation

	// Determine the size of a sub-range in relation to a full range.
	function subRangeRatio ( pa, pb ) {
		return (100 / (pb - pa));
	}

	// (percentage) How many percent is this value of this range?
	function fromPercentage ( range, value ) {
		return (value * 100) / ( range[1] - range[0] );
	}

	// (percentage) Where is this value on this range?
	function toPercentage ( range, value ) {
		return fromPercentage( range, range[0] < 0 ?
			value + Math.abs(range[0]) :
				value - range[0] );
	}

	// (value) How much is this percentage on this range?
	function isPercentage ( range, value ) {
		return ((value * ( range[1] - range[0] )) / 100) + range[0];
	}


// Range conversion

	function getJ ( value, arr ) {

		var j = 1;

		while ( value >= arr[j] ){
			j += 1;
		}

		return j;
	}

	// (percentage) Input a value, find where, on a scale of 0-100, it applies.
	function toStepping ( xVal, xPct, value ) {

		if ( value >= xVal.slice(-1)[0] ){
			return 100;
		}

		var j = getJ( value, xVal ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
	}

	// (value) Input a percentage, find where it is on the specified range.
	function fromStepping ( xVal, xPct, value ) {

		// There is no range group that fits 100
		if ( value >= 100 ){
			return xVal.slice(-1)[0];
		}

		var j = getJ( value, xPct ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
	}

	// (percentage) Get the step that applies at a certain value.
	function getStep ( xPct, xSteps, snap, value ) {

		if ( value === 100 ) {
			return value;
		}

		var j = getJ( value, xPct ), a, b;

		// If 'snap' is set, steps are used as fixed points on the slider.
		if ( snap ) {

			a = xPct[j-1];
			b = xPct[j];

			// Find the closest position, a or b.
			if ((value - a) > ((b-a)/2)){
				return b;
			}

			return a;
		}

		if ( !xSteps[j-1] ){
			return value;
		}

		return xPct[j-1] + closest(
			value - xPct[j-1],
			xSteps[j-1]
		);
	}


// Entry parsing

	function handleEntryPoint ( index, value, that ) {

		var percentage;

		// Wrap numerical input in an array.
		if ( typeof value === "number" ) {
			value = [value];
		}

		// Reject any invalid input, by testing whether value is an array.
		if ( Object.prototype.toString.call( value ) !== '[object Array]' ){
			throw new Error("noUiSlider: 'range' contains invalid value.");
		}

		// Covert min/max syntax to 0 and 100.
		if ( index === 'min' ) {
			percentage = 0;
		} else if ( index === 'max' ) {
			percentage = 100;
		} else {
			percentage = parseFloat( index );
		}

		// Check for correct input.
		if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
			throw new Error("noUiSlider: 'range' value isn't numeric.");
		}

		// Store values.
		that.xPct.push( percentage );
		that.xVal.push( value[0] );

		// NaN will evaluate to false too, but to keep
		// logging clear, set step explicitly. Make sure
		// not to override the 'step' setting with false.
		if ( !percentage ) {
			if ( !isNaN( value[1] ) ) {
				that.xSteps[0] = value[1];
			}
		} else {
			that.xSteps.push( isNaN(value[1]) ? false : value[1] );
		}
	}

	function handleStepPoint ( i, n, that ) {

		// Ignore 'false' stepping.
		if ( !n ) {
			return true;
		}

		// Factor to range ratio
		that.xSteps[i] = fromPercentage([
			 that.xVal[i]
			,that.xVal[i+1]
		], n) / subRangeRatio (
			that.xPct[i],
			that.xPct[i+1] );
	}


// Interface

	// The interface to Spectrum handles all direction-based
	// conversions, so the above values are unaware.

	function Spectrum ( entry, snap, direction, singleStep ) {

		this.xPct = [];
		this.xVal = [];
		this.xSteps = [ singleStep || false ];
		this.xNumSteps = [ false ];

		this.snap = snap;
		this.direction = direction;

		var index, ordered = [ /* [0, 'min'], [1, '50%'], [2, 'max'] */ ];

		// Map the object keys to an array.
		for ( index in entry ) {
			if ( entry.hasOwnProperty(index) ) {
				ordered.push([entry[index], index]);
			}
		}

		// Sort all entries by value (numeric sort).
		ordered.sort(function(a, b) { return a[0] - b[0]; });

		// Convert all entries to subranges.
		for ( index = 0; index < ordered.length; index++ ) {
			handleEntryPoint(ordered[index][1], ordered[index][0], this);
		}

		// Store the actual step values.
		// xSteps is sorted in the same order as xPct and xVal.
		this.xNumSteps = this.xSteps.slice(0);

		// Convert all numeric steps to the percentage of the subrange they represent.
		for ( index = 0; index < this.xNumSteps.length; index++ ) {
			handleStepPoint(index, this.xNumSteps[index], this);
		}
	}

	Spectrum.prototype.getMargin = function ( value ) {
		return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
	};

	Spectrum.prototype.toStepping = function ( value ) {

		value = toStepping( this.xVal, this.xPct, value );

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.fromStepping = function ( value ) {

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return accurateNumber(fromStepping( this.xVal, this.xPct, value ));
	};

	Spectrum.prototype.getStep = function ( value ) {

		// Find the proper step for rtl sliders by search in inverse direction.
		// Fixes issue #262.
		if ( this.direction ) {
			value = 100 - value;
		}

		value = getStep(this.xPct, this.xSteps, this.snap, value );

		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.getApplicableStep = function ( value ) {

		// If the value is 100%, return the negative step twice.
		var j = getJ(value, this.xPct), offset = value === 100 ? 2 : 1;
		return [this.xNumSteps[j-2], this.xVal[j-offset], this.xNumSteps[j-offset]];
	};

	// Outside testing
	Spectrum.prototype.convert = function ( value ) {
		return this.getStep(this.toStepping(value));
	};

/*	Every input option is tested and parsed. This'll prevent
	endless validation in internal methods. These tests are
	structured with an item for every option available. An
	option can be marked as required by setting the 'r' flag.
	The testing function is provided with three arguments:
		- The provided value for the option;
		- A reference to the options object;
		- The name for the option;

	The testing function returns false when an error is detected,
	or true when everything is OK. It can also modify the option
	object, to make sure all values can be correctly looped elsewhere. */

	/** @const */
	var defaultFormatter = { 'to': function( value ){
		return value.toFixed(2);
	}, 'from': Number };

	function testStep ( parsed, entry ) {

		if ( !isNumeric( entry ) ) {
			throw new Error("noUiSlider: 'step' is not numeric.");
		}

		// The step option can still be used to set stepping
		// for linear sliders. Overwritten if set in 'range'.
		parsed.singleStep = entry;
	}

	function testRange ( parsed, entry ) {

		// Filter incorrect input.
		if ( typeof entry !== 'object' || $.isArray(entry) ) {
			throw new Error("noUiSlider: 'range' is not an object.");
		}

		// Catch missing start or end.
		if ( entry.min === undefined || entry.max === undefined ) {
			throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
		}

		parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.dir, parsed.singleStep);
	}

	function testStart ( parsed, entry ) {

		entry = asArray(entry);

		// Validate input. Values aren't tested, as the public .val method
		// will always provide a valid location.
		if ( !$.isArray( entry ) || !entry.length || entry.length > 2 ) {
			throw new Error("noUiSlider: 'start' option is incorrect.");
		}

		// Store the number of handles.
		parsed.handles = entry.length;

		// When the slider is initialized, the .val method will
		// be called with the start options.
		parsed.start = entry;
	}

	function testSnap ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.snap = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'snap' option must be a boolean.");
		}
	}

	function testAnimate ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.animate = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'animate' option must be a boolean.");
		}
	}

	function testConnect ( parsed, entry ) {

		if ( entry === 'lower' && parsed.handles === 1 ) {
			parsed.connect = 1;
		} else if ( entry === 'upper' && parsed.handles === 1 ) {
			parsed.connect = 2;
		} else if ( entry === true && parsed.handles === 2 ) {
			parsed.connect = 3;
		} else if ( entry === false ) {
			parsed.connect = 0;
		} else {
			throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
		}
	}

	function testOrientation ( parsed, entry ) {

		// Set orientation to an a numerical value for easy
		// array selection.
		switch ( entry ){
		  case 'horizontal':
			parsed.ort = 0;
			break;
		  case 'vertical':
			parsed.ort = 1;
			break;
		  default:
			throw new Error("noUiSlider: 'orientation' option is invalid.");
		}
	}

	function testMargin ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'margin' option must be numeric.");
		}

		parsed.margin = parsed.spectrum.getMargin(entry);

		if ( !parsed.margin ) {
			throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.");
		}
	}

	function testLimit ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'limit' option must be numeric.");
		}

		parsed.limit = parsed.spectrum.getMargin(entry);

		if ( !parsed.limit ) {
			throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.");
		}
	}

	function testDirection ( parsed, entry ) {

		// Set direction as a numerical value for easy parsing.
		// Invert connection for RTL sliders, so that the proper
		// handles get the connect/background classes.
		switch ( entry ) {
		  case 'ltr':
			parsed.dir = 0;
			break;
		  case 'rtl':
			parsed.dir = 1;
			parsed.connect = [0,2,1,3][parsed.connect];
			break;
		  default:
			throw new Error("noUiSlider: 'direction' option was not recognized.");
		}
	}

	function testBehaviour ( parsed, entry ) {

		// Make sure the input is a string.
		if ( typeof entry !== 'string' ) {
			throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
		}

		// Check if the string contains any keywords.
		// None are required.
		var tap = entry.indexOf('tap') >= 0,
			drag = entry.indexOf('drag') >= 0,
			fixed = entry.indexOf('fixed') >= 0,
			snap = entry.indexOf('snap') >= 0;

		parsed.events = {
			tap: tap || snap,
			drag: drag,
			fixed: fixed,
			snap: snap
		};
	}

	function testFormat ( parsed, entry ) {

		parsed.format = entry;

		// Any object with a to and from method is supported.
		if ( typeof entry.to === 'function' && typeof entry.from === 'function' ) {
			return true;
		}

		throw new Error( "noUiSlider: 'format' requires 'to' and 'from' methods.");
	}

	// Test all developer settings and parse to assumption-safe values.
	function testOptions ( options ) {

		var parsed = {
			margin: 0,
			limit: 0,
			animate: true,
			format: defaultFormatter
		}, tests;

		// Tests are executed in the order they are presented here.
		tests = {
			'step': { r: false, t: testStep },
			'start': { r: true, t: testStart },
			'connect': { r: true, t: testConnect },
			'direction': { r: true, t: testDirection },
			'snap': { r: false, t: testSnap },
			'animate': { r: false, t: testAnimate },
			'range': { r: true, t: testRange },
			'orientation': { r: false, t: testOrientation },
			'margin': { r: false, t: testMargin },
			'limit': { r: false, t: testLimit },
			'behaviour': { r: true, t: testBehaviour },
			'format': { r: false, t: testFormat }
		};

		// Set defaults where applicable.
		options = $.extend({
			'connect': false,
			'direction': 'ltr',
			'behaviour': 'tap',
			'orientation': 'horizontal'
		}, options);

		// Run all options through a testing mechanism to ensure correct
		// input. It should be noted that options might get modified to
		// be handled properly. E.g. wrapping integers in arrays.
		$.each( tests, function( name, test ){

			// If the option isn't set, but it is required, throw an error.
			if ( options[name] === undefined ) {

				if ( test.r ) {
					throw new Error("noUiSlider: '" + name + "' is required.");
				}

				return true;
			}

			test.t( parsed, options[name] );
		});

		// Pre-define the styles.
		parsed.style = parsed.ort ? 'top' : 'left';

		return parsed;
	}

// Class handling

	// Delimit proposed values for handle positions.
	function getPositions ( a, b, delimit ) {

		// Add movement to current position.
		var c = a + b[0], d = a + b[1];

		// Only alter the other position on drag,
		// not on standard sliding.
		if ( delimit ) {
			if ( c < 0 ) {
				d += Math.abs(c);
			}
			if ( d > 100 ) {
				c -= ( d - 100 );
			}

			// Limit values to 0 and 100.
			return [limit(c), limit(d)];
		}

		return [c,d];
	}


// Event handling

	// Provide a clean event with standardized offset values.
	function fixEvent ( e ) {

		// Prevent scrolling and panning on touch events, while
		// attempting to slide. The tap event also depends on this.
		e.preventDefault();

		// Filter the event to register the type, which can be
		// touch, mouse or pointer. Offset changes need to be
		// made on an event specific basis.
		var  touch = e.type.indexOf('touch') === 0
			,mouse = e.type.indexOf('mouse') === 0
			,pointer = e.type.indexOf('pointer') === 0
			,x,y, event = e;

		// IE10 implemented pointer events with a prefix;
		if ( e.type.indexOf('MSPointer') === 0 ) {
			pointer = true;
		}

		// Get the originalEvent, if the event has been wrapped
		// by jQuery. Zepto doesn't wrap the event.
		if ( e.originalEvent ) {
			e = e.originalEvent;
		}

		if ( touch ) {
			// noUiSlider supports one movement at a time,
			// so we can select the first 'changedTouch'.
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY;
		}

		if ( mouse || pointer ) {

			// Polyfill the pageXOffset and pageYOffset
			// variables for IE7 and IE8;
			if( !pointer && window.pageXOffset === undefined ){
				window.pageXOffset = document.documentElement.scrollLeft;
				window.pageYOffset = document.documentElement.scrollTop;
			}

			x = e.clientX + window.pageXOffset;
			y = e.clientY + window.pageYOffset;
		}

		event.points = [x, y];
		event.cursor = mouse;

		return event;
	}


// DOM additions

	// Append a handle to the base.
	function addHandle ( direction, index ) {

		var handle = $('<div><div/></div>').addClass( Classes[2] ),
			additions = [ '-lower', '-upper' ];

		if ( direction ) {
			additions.reverse();
		}

		handle.children().addClass(
			Classes[3] + " " + Classes[3]+additions[index]
		);

		return handle;
	}

	// Add the proper connection classes.
	function addConnection ( connect, target, handles ) {

		// Apply the required connection classes to the elements
		// that need them. Some classes are made up for several
		// segments listed in the class list, to allow easy
		// renaming and provide a minor compression benefit.
		switch ( connect ) {
			case 1:	target.addClass( Classes[7] );
					handles[0].addClass( Classes[6] );
					break;
			case 3: handles[1].addClass( Classes[6] );
					/* falls through */
			case 2: handles[0].addClass( Classes[7] );
					/* falls through */
			case 0: target.addClass(Classes[6]);
					break;
		}
	}

	// Add handles to the slider base.
	function addHandles ( nrHandles, direction, base ) {

		var index, handles = [];

		// Append handles.
		for ( index = 0; index < nrHandles; index += 1 ) {

			// Keep a list of all added handles.
			handles.push( addHandle( direction, index ).appendTo(base) );
		}

		return handles;
	}

	// Initialize a single slider.
	function addSlider ( direction, orientation, target ) {

		// Apply classes and data to the target.
		target.addClass([
			Classes[0],
			Classes[8 + direction],
			Classes[4 + orientation]
		].join(' '));

		return $('<div/>').appendTo(target).addClass( Classes[1] );
	}

function closure ( target, options, originalOptions ){

// Internal variables

	// All variables local to 'closure' are marked $.
	var $Target = $(target),
		$Locations = [-1, -1],
		$Base,
		$Handles,
		$Spectrum = options.spectrum,
		$Values = [],
	// libLink. For rtl sliders, 'lower' and 'upper' should not be inverted
	// for one-handle sliders, so trim 'upper' it that case.
		triggerPos = ['lower', 'upper'].slice(0, options.handles);

	// Invert the libLink connection for rtl sliders.
	if ( options.dir ) {
		triggerPos.reverse();
	}

// Helpers

	// Shorthand for base dimensions.
	function baseSize ( ) {
		return $Base[['width', 'height'][options.ort]]();
	}

	// External event handling
	function fireEvents ( events ) {

		// Use the external api to get the values.
		// Wrap the values in an array, as .trigger takes
		// only one additional argument.
		var index, values = [ $Target.val() ];

		for ( index = 0; index < events.length; index += 1 ){
			$Target.trigger(events[index], values);
		}
	}

	// Returns the input array, respecting the slider direction configuration.
	function inSliderOrder ( values ) {

		// If only one handle is used, return a single value.
		if ( values.length === 1 ){
			return values[0];
		}

		if ( options.dir ) {
			return values.reverse();
		}

		return values;
	}

// libLink integration

	// Create a new function which calls .val on input change.
	function createChangeHandler ( trigger ) {
		return function ( ignore, value ){
			// Determine which array position to 'null' based on 'trigger'.
			$Target.val( [ trigger ? null : value, trigger ? value : null ], true );
		};
	}

	// Called by libLink when it wants a set of links updated.
	function linkUpdate ( flag ) {

		var trigger = $.inArray(flag, triggerPos);

		// The API might not have been set yet.
		if ( $Target[0].linkAPI && $Target[0].linkAPI[flag] ) {
			$Target[0].linkAPI[flag].change(
				$Values[trigger],
				$Handles[trigger].children(),
				$Target
			);
		}
	}

	// Called by libLink to append an element to the slider.
	function linkConfirm ( flag, element ) {

		// Find the trigger for the passed flag.
		var trigger = $.inArray(flag, triggerPos);

		// If set, append the element to the handle it belongs to.
		if ( element ) {
			element.appendTo( $Handles[trigger].children() );
		}

		// The public API is reversed for rtl sliders, so the changeHandler
		// should not be aware of the inverted trigger positions.
		// On rtl slider with one handle, 'lower' should be used.
		if ( options.dir && options.handles > 1 ) {
			trigger = trigger === 1 ? 0 : 1;
		}

		return createChangeHandler( trigger );
	}

	// Place elements back on the slider.
	function reAppendLink ( ) {

		var i, flag;

		// The API keeps a list of elements: we can re-append them on rebuild.
		for ( i = 0; i < triggerPos.length; i += 1 ) {
			if ( this.linkAPI && this.linkAPI[(flag = triggerPos[i])] ) {
				this.linkAPI[flag].reconfirm(flag);
			}
		}
	}

	target.LinkUpdate = linkUpdate;
	target.LinkConfirm = linkConfirm;
	target.LinkDefaultFormatter = options.format;
	target.LinkDefaultFlag = 'lower';

	target.reappend = reAppendLink;


	// Handler for attaching events trough a proxy.
	function attach ( events, element, callback, data ) {

		// This function can be used to 'filter' events to the slider.

		// Add the noUiSlider namespace to all events.
		events = events.replace( /\s/g, namespace + ' ' ) + namespace;

		// Bind a closure on the target.
		return element.on( events, function( e ){

			// jQuery and Zepto (1) handle unset attributes differently,
			// but always falsy; #208
			if ( !!$Target.attr('disabled') ) {
				return false;
			}

			// Stop if an active 'tap' transition is taking place.
			if ( $Target.hasClass( Classes[14] ) ) {
				return false;
			}

			e = fixEvent(e);
			e.calcPoint = e.points[ options.ort ];

			// Call the event handler with the event [ and additional data ].
			callback ( e, data );
		});
	}

	// Handle movement on document for handle and range drag.
	function move ( event, data ) {

		var handles = data.handles || $Handles, positions, state = false,
			proposal = ((event.calcPoint - data.start) * 100) / baseSize(),
			h = handles[0][0] !== $Handles[0][0] ? 1 : 0;

		// Calculate relative positions for the handles.
		positions = getPositions( proposal, data.positions, handles.length > 1);

		state = setHandle ( handles[0], positions[h], handles.length === 1 );

		if ( handles.length > 1 ) {
			state = setHandle ( handles[1], positions[h?0:1], false ) || state;
		}

		// Fire the 'slide' event if any handle moved.
		if ( state ) {
			fireEvents(['slide']);
		}
	}

	// Unbind move events on document, call callbacks.
	function end ( event ) {

		// The handle is no longer active, so remove the class.
		$('.' + Classes[15]).removeClass(Classes[15]);

		// Remove cursor styles and text-selection events bound to the body.
		if ( event.cursor ) {
			$('body').css('cursor', '').off( namespace );
		}

		// Unbind the move and end events, which are added on 'start'.
		doc.off( namespace );

		// Remove dragging class.
		$Target.removeClass(Classes[12]);

		// Fire the change and set events.
		fireEvents(['set', 'change']);
	}

	// Bind move events on document.
	function start ( event, data ) {

		// Mark the handle as 'active' so it can be styled.
		if( data.handles.length === 1 ) {
			data.handles[0].children().addClass(Classes[15]);
		}

		// A drag should never propagate up to the 'tap' event.
		event.stopPropagation();

		// Attach the move event.
		attach ( actions.move, doc, move, {
			start: event.calcPoint,
			handles: data.handles,
			positions: [
				$Locations[0],
				$Locations[$Handles.length - 1]
			]
		});

		// Unbind all movement when the drag ends.
		attach ( actions.end, doc, end, null );

		// Text selection isn't an issue on touch devices,
		// so adding cursor styles can be skipped.
		if ( event.cursor ) {

			// Prevent the 'I' cursor and extend the range-drag cursor.
			$('body').css('cursor', $(event.target).css('cursor'));

			// Mark the target with a dragging state.
			if ( $Handles.length > 1 ) {
				$Target.addClass(Classes[12]);
			}

			// Prevent text selection when dragging the handles.
			$('body').on('selectstart' + namespace, false);
		}
	}

	// Move closest handle to tapped location.
	function tap ( event ) {

		var location = event.calcPoint, total = 0, to;

		// The tap event shouldn't propagate up and cause 'edge' to run.
		event.stopPropagation();

		// Add up the handle offsets.
		$.each( $Handles, function(){
			total += this.offset()[ options.style ];
		});

		// Find the handle closest to the tapped position.
		total = ( location < total/2 || $Handles.length === 1 ) ? 0 : 1;

		location -= $Base.offset()[ options.style ];

		// Calculate the new position.
		to = ( location * 100 ) / baseSize();

		if ( !options.events.snap ) {
			// Flag the slider as it is now in a transitional state.
			// Transition takes 300 ms, so re-enable the slider afterwards.
			addClassFor( $Target, Classes[14], 300 );
		}

		// Find the closest handle and calculate the tapped point.
		// The set handle to the new position.
		setHandle( $Handles[total], to );

		fireEvents(['slide', 'set', 'change']);

		if ( options.events.snap ) {
			start(event, { handles: [$Handles[total]] });
		}
	}

	// Attach events to several slider parts.
	function events ( behaviour ) {

		var i, drag;

		// Attach the standard drag event to the handles.
		if ( !behaviour.fixed ) {

			for ( i = 0; i < $Handles.length; i += 1 ) {

				// These events are only bound to the visual handle
				// element, not the 'real' origin element.
				attach ( actions.start, $Handles[i].children(), start, {
					handles: [ $Handles[i] ]
				});
			}
		}

		// Attach the tap event to the slider base.
		if ( behaviour.tap ) {

			attach ( actions.start, $Base, tap, {
				handles: $Handles
			});
		}

		// Make the range dragable.
		if ( behaviour.drag ){

			drag = $Base.find( '.' + Classes[7] ).addClass( Classes[10] );

			// When the range is fixed, the entire range can
			// be dragged by the handles. The handle in the first
			// origin will propagate the start event upward,
			// but it needs to be bound manually on the other.
			if ( behaviour.fixed ) {
				drag = drag.add($Base.children().not( drag ).children());
			}

			attach ( actions.start, drag, start, {
				handles: $Handles
			});
		}
	}


	// Test suggested values and apply margin, step.
	function setHandle ( handle, to, noLimitOption ) {

		var trigger = handle[0] !== $Handles[0][0] ? 1 : 0,
			lowerMargin = $Locations[0] + options.margin,
			upperMargin = $Locations[1] - options.margin,
			lowerLimit = $Locations[0] + options.limit,
			upperLimit = $Locations[1] - options.limit;

		// For sliders with multiple handles,
		// limit movement to the other handle.
		// Apply the margin option by adding it to the handle positions.
		if ( $Handles.length > 1 ) {
			to = trigger ? Math.max( to, lowerMargin ) : Math.min( to, upperMargin );
		}

		// The limit option has the opposite effect, limiting handles to a
		// maximum distance from another. Limit must be > 0, as otherwise
		// handles would be unmoveable. 'noLimitOption' is set to 'false'
		// for the .val() method, except for pass 4/4.
		if ( noLimitOption !== false && options.limit && $Handles.length > 1 ) {
			to = trigger ? Math.min ( to, lowerLimit ) : Math.max( to, upperLimit );
		}

		// Handle the step option.
		to = $Spectrum.getStep( to );

		// Limit to 0/100 for .val input, trim anything beyond 7 digits, as
		// JavaScript has some issues in its floating point implementation.
		to = limit(parseFloat(to.toFixed(7)));

		// Return false if handle can't move.
		if ( to === $Locations[trigger] ) {
			return false;
		}

		// Set the handle to the new position.
		handle.css( options.style, to + '%' );

		// Force proper handle stacking
		if ( handle.is(':first-child') ) {
			handle.toggleClass(Classes[17], to > 50 );
		}

		// Update locations.
		$Locations[trigger] = to;

		// Convert the value to the slider stepping/range.
		$Values[trigger] = $Spectrum.fromStepping( to );

		linkUpdate(triggerPos[trigger]);

		return true;
	}

	// Loop values from value method and apply them.
	function setValues ( count, values ) {

		var i, trigger, to;

		// With the limit option, we'll need another limiting pass.
		if ( options.limit ) {
			count += 1;
		}

		// If there are multiple handles to be set run the setting
		// mechanism twice for the first handle, to make sure it
		// can be bounced of the second one properly.
		for ( i = 0; i < count; i += 1 ) {

			trigger = i%2;

			// Get the current argument from the array.
			to = values[trigger];

			// Setting with null indicates an 'ignore'.
			// Inputting 'false' is invalid.
			if ( to !== null && to !== false ) {

				// If a formatted number was passed, attemt to decode it.
				if ( typeof to === 'number' ) {
					to = String(to);
				}

				to = options.format.from( to );

				// Request an update for all links if the value was invalid.
				// Do so too if setting the handle fails.
				if ( to === false || isNaN(to) || setHandle( $Handles[trigger], $Spectrum.toStepping( to ), i === (3 - options.dir) ) === false ) {

					linkUpdate(triggerPos[trigger]);
				}
			}
		}
	}

	// Set the slider value.
	function valueSet ( input ) {

		// LibLink: don't accept new values when currently emitting changes.
		if ( $Target[0].LinkIsEmitting ) {
			return this;
		}

		var count, values = asArray( input );

		// The RTL settings is implemented by reversing the front-end,
		// internal mechanisms are the same.
		if ( options.dir && options.handles > 1 ) {
			values.reverse();
		}

		// Animation is optional.
		// Make sure the initial values where set before using animated
		// placement. (no report, unit testing);
		if ( options.animate && $Locations[0] !== -1 ) {
			addClassFor( $Target, Classes[14], 300 );
		}

		// Determine how often to set the handles.
		count = $Handles.length > 1 ? 3 : 1;

		if ( values.length === 1 ) {
			count = 1;
		}

		setValues ( count, values );

		// Fire the 'set' event. As of noUiSlider 7,
		// this is no longer optional.
		fireEvents(['set']);

		return this;
	}

	// Get the slider value.
	function valueGet ( ) {

		var i, retour = [];

		// Get the value from all handles.
		for ( i = 0; i < options.handles; i += 1 ){
			retour[i] = options.format.to( $Values[i] );
		}

		return inSliderOrder( retour );
	}

	// Destroy the slider and unbind all events.
	function destroyTarget ( ) {

		// Unbind events on the slider, remove all classes and child elements.
		$(this).off(namespace)
			.removeClass(Classes.join(' '))
			.empty();

		delete this.LinkUpdate;
		delete this.LinkConfirm;
		delete this.LinkDefaultFormatter;
		delete this.LinkDefaultFlag;
		delete this.reappend;
		delete this.vGet;
		delete this.vSet;
		delete this.getCurrentStep;
		delete this.getInfo;
		delete this.destroy;

		// Return the original options from the closure.
		return originalOptions;
	}

	// Get the current step size for the slider.
	function getCurrentStep ( ) {

		// Check all locations, map them to their stepping point.
		// Get the step point, then find it in the input list.
		var retour = $.map($Locations, function( location, index ){

			var step = $Spectrum.getApplicableStep( location ),

				// As per #391, the comparison for the decrement step can have some rounding issues.
				// Round the value to the precision used in the step.
				stepDecimals = countDecimals(String(step[2])),

				// Get the current numeric value
				value = $Values[index],

				// To move the slider 'one step up', the current step value needs to be added.
				// Use null if we are at the maximum slider value.
				increment = location === 100 ? null : step[2],

				// Going 'one step down' might put the slider in a different sub-range, so we
				// need to switch between the current or the previous step.
				prev = Number((value - step[2]).toFixed(stepDecimals)),

				// If the value fits the step, return the current step value. Otherwise, use the
				// previous step. Return null if the slider is at its minimum value.
				decrement = location === 0 ? null : (prev >= step[1]) ? step[2] : (step[0] || false);

			return [[decrement, increment]];
		});

		// Return values in the proper order.
		return inSliderOrder( retour );
	}

	// Get the original set of options.
	function getOriginalOptions ( ) {
		return originalOptions;
	}


// Initialize slider

	// Throw an error if the slider was already initialized.
	if ( $Target.hasClass(Classes[0]) ) {
		throw new Error('Slider was already initialized.');
	}

	// Create the base element, initialise HTML and set classes.
	// Add handles and links.
	$Base = addSlider( options.dir, options.ort, $Target );
	$Handles = addHandles( options.handles, options.dir, $Base );

	// Set the connect classes.
	addConnection ( options.connect, $Target, $Handles );

	// Attach user events.
	events( options.events );

// Methods

	target.vSet = valueSet;
	target.vGet = valueGet;
	target.destroy = destroyTarget;

	target.getCurrentStep = getCurrentStep;
	target.getOriginalOptions = getOriginalOptions;

	target.getInfo = function(){
		return [
			$Spectrum,
			options.style,
			options.ort
		];
	};

	// Use the public value method to set the start values.
	$Target.val( options.start );

}


	// Run the standard initializer
	function initialize ( originalOptions ) {

		// Test the options once, not for every slider.
		var options = testOptions( originalOptions, this );

		// Loop all items, and provide a new closed-scope environment.
		return this.each(function(){
			closure(this, options, originalOptions);
		});
	}

	// Destroy the slider, then re-enter initialization.
	function rebuild ( options ) {

		return this.each(function(){

			// The rebuild flag can be used if the slider wasn't initialized yet.
			if ( !this.destroy ) {
				$(this).noUiSlider( options );
				return;
			}

			// Get the current values from the slider,
			// including the initialization options.
			var values = $(this).val(), originalOptions = this.destroy(),

				// Extend the previous options with the newly provided ones.
				newOptions = $.extend( {}, originalOptions, options );

			// Run the standard initializer.
			$(this).noUiSlider( newOptions );

			// Place Link elements back.
			this.reappend();

			// If the start option hasn't changed,
			// reset the previous values.
			if ( originalOptions.start === newOptions.start ) {
				$(this).val(values);
			}
		});
	}

	// Access the internal getting and setting methods based on argument count.
	function value ( ) {
		return this[0][ !arguments.length ? 'vGet' : 'vSet' ].apply(this[0], arguments);
	}

	// Override the .val() method. Test every element. Is it a slider? Go to
	// the slider value handling. No? Use the standard method.
	// Note how $.fn.val expects 'this' to be an instance of $. For convenience,
	// the above 'value' function does too.
	$.fn.val = function ( arg ) {

		// this === instanceof $

		function valMethod( a ){
			return a.hasClass(Classes[0]) ? value : $val;
		}

		// If no value is passed, this is 'get'.
		if ( !arguments.length ) {
			var first = $(this[0]);
			return valMethod(first).call(first);
		}

		var isFunction = $.isFunction(arg);

		// Return the set so it remains chainable. Make sure not to break
		// jQuery's .val(function( index, value ){}) signature.
		return this.each(function( i ){

			var val = arg, $t = $(this);

			if ( isFunction ) {
				val = arg.call(this, i, $t.val());
			}

			valMethod($t).call($t, val);
		});
	};

// Extend jQuery/Zepto with the noUiSlider method.
	$.fn.noUiSlider = function ( options, rebuildFlag ) {

		switch ( options ) {
			case 'step': return this[0].getCurrentStep();
			case 'options': return this[0].getOriginalOptions();
		}

		return ( rebuildFlag ? rebuild : initialize ).call(this, options);
	};

	function getGroup ( $Spectrum, mode, values, stepped ) {

		// Use the range.
		if ( mode === 'range' || mode === 'steps' ) {
			return $Spectrum.xVal;
		}

		if ( mode === 'count' ) {

			// Divide 0 - 100 in 'count' parts.
			var spread = ( 100 / (values-1) ), v, i = 0;
			values = [];

			// List these parts and have them handled as 'positions'.
			while ((v=i++*spread) <= 100 ) {
				values.push(v);
			}

			mode = 'positions';
		}

		if ( mode === 'positions' ) {

			// Map all percentages to on-range values.
			return $.map(values, function( value ){
				return $Spectrum.fromStepping( stepped ? $Spectrum.getStep( value ) : value );
			});
		}

		if ( mode === 'values' ) {

			// If the value must be stepped, it needs to be converted to a percentage first.
			if ( stepped ) {

				return $.map(values, function( value ){

					// Convert to percentage, apply step, return to value.
					return $Spectrum.fromStepping( $Spectrum.getStep( $Spectrum.toStepping( value ) ) );
				});

			}

			// Otherwise, we can simply use the values.
			return values;
		}
	}

	function generateSpread ( $Spectrum, density, mode, group ) {

		var originalSpectrumDirection = $Spectrum.direction,
			indexes = {},
			firstInRange = $Spectrum.xVal[0],
			lastInRange = $Spectrum.xVal[$Spectrum.xVal.length-1],
			ignoreFirst = false,
			ignoreLast = false,
			prevPct = 0;

		// This function loops the spectrum in an ltr linear fashion,
		// while the toStepping method is direction aware. Trick it into
		// believing it is ltr.
		$Spectrum.direction = 0;

		// Create a copy of the group, sort it and filter away all duplicates.
		group = unique(group.slice().sort(function(a, b){ return a - b; }));

		// Make sure the range starts with the first element.
		if ( group[0] !== firstInRange ) {
			group.unshift(firstInRange);
			ignoreFirst = true;
		}

		// Likewise for the last one.
		if ( group[group.length - 1] !== lastInRange ) {
			group.push(lastInRange);
			ignoreLast = true;
		}

		$.each(group, function ( index ) {

			// Get the current step and the lower + upper positions.
			var step, i, q,
				low = group[index],
				high = group[index+1],
				newPct, pctDifference, pctPos, type,
				steps, realSteps, stepsize;

			// When using 'steps' mode, use the provided steps.
			// Otherwise, we'll step on to the next subrange.
			if ( mode === 'steps' ) {
				step = $Spectrum.xNumSteps[ index ];
			}

			// Default to a 'full' step.
			if ( !step ) {
				step = high-low;
			}

			// Low can be 0, so test for false. If high is undefined,
			// we are at the last subrange. Index 0 is already handled.
			if ( low === false || high === undefined ) {
				return;
			}

			// Find all steps in the subrange.
			for ( i = low; i <= high; i += step ) {

				// Get the percentage value for the current step,
				// calculate the size for the subrange.
				newPct = $Spectrum.toStepping( i );
				pctDifference = newPct - prevPct;

				steps = pctDifference / density;
				realSteps = Math.round(steps);

				// This ratio represents the ammount of percentage-space a point indicates.
				// For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
				// Round the percentage offset to an even number, then divide by two
				// to spread the offset on both sides of the range.
				stepsize = pctDifference/realSteps;

				// Divide all points evenly, adding the correct number to this subrange.
				// Run up to <= so that 100% gets a point, event if ignoreLast is set.
				for ( q = 1; q <= realSteps; q += 1 ) {

					// The ratio between the rounded value and the actual size might be ~1% off.
					// Correct the percentage offset by the number of points
					// per subrange. density = 1 will result in 100 points on the
					// full range, 2 for 50, 4 for 25, etc.
					pctPos = prevPct + ( q * stepsize );
					indexes[pctPos.toFixed(5)] = ['x', 0];
				}

				// Determine the point type.
				type = ($.inArray(i, group) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );

				// Enforce the 'ignoreFirst' option by overwriting the type for 0.
				if ( !index && ignoreFirst ) {
					type = 0;
				}

				if ( !(i === high && ignoreLast)) {
					// Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
					indexes[newPct.toFixed(5)] = [i, type];
				}

				// Update the percentage count.
				prevPct = newPct;
			}
		});

		// Reset the spectrum.
		$Spectrum.direction = originalSpectrumDirection;

		return indexes;
	}

	function addMarking ( CSSstyle, orientation, direction, spread, filterFunc, formatter ) {

		var style = ['horizontal', 'vertical'][orientation],
			element = $('<div/>');

		element.addClass('noUi-pips noUi-pips-'+style);

		function getSize( type, value ){
			return [ '-normal', '-large', '-sub' ][type];
		}

		function getTags( offset, source, values ) {
			return 'class="' + source + ' ' +
				source + '-' + style + ' ' +
				source + getSize(values[1], values[0]) +
				'" style="' + CSSstyle + ': ' + offset + '%"';
		}

		function addSpread ( offset, values ){

			if ( direction ) {
				offset = 100 - offset;
			}

			// Apply the filter function, if it is set.
			values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];

			// Add a marker for every point
			element.append('<div ' + getTags(offset, 'noUi-marker', values) + '></div>');

			// Values are only appended for points marked '1' or '2'.
			if ( values[1] ) {
				element.append('<div '+getTags(offset, 'noUi-value', values)+'>' + formatter.to(values[0]) + '</div>');
			}
		}

		// Append all points.
		$.each(spread, addSpread);

		return element;
	}

	$.fn.noUiSlider_pips = function ( grid ) {

	var mode = grid.mode,
		density = grid.density || 1,
		filter = grid.filter || false,
		values = grid.values || false,
		format = grid.format || {
			to: Math.round
		},
		stepped = grid.stepped || false;

		return this.each(function(){

		var info = this.getInfo(),
			group = getGroup( info[0], mode, values, stepped ),
			spread = generateSpread( info[0], density, mode, group );

			return $(this).append(addMarking(
				info[1],
				info[2],
				info[0].direction,
				spread,
				filter,
				format
			));
		});
	};

}( window.jQuery || window.Zepto ));

/* HTML5 Placeholder jQuery Plugin - v2.1.2
 * Copyright (c)2015 Mathias Bynens
 * 2015-06-09
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof module&&module.exports?require("jquery"):jQuery)}(function(a){function b(b){var c={},d=/^jQuery\d+$/;return a.each(b.attributes,function(a,b){b.specified&&!d.test(b.name)&&(c[b.name]=b.value)}),c}function c(b,c){var d=this,f=a(d);if(d.value==f.attr("placeholder")&&f.hasClass(m.customClass))if(f.data("placeholder-password")){if(f=f.hide().nextAll('input[type="password"]:first').show().attr("id",f.removeAttr("id").data("placeholder-id")),b===!0)return f[0].value=c;f.focus()}else d.value="",f.removeClass(m.customClass),d==e()&&d.select()}function d(){var d,e=this,f=a(e),g=this.id;if(""===e.value){if("password"===e.type){if(!f.data("placeholder-textinput")){try{d=f.clone().prop({type:"text"})}catch(h){d=a("<input>").attr(a.extend(b(this),{type:"text"}))}d.removeAttr("name").data({"placeholder-password":f,"placeholder-id":g}).bind("focus.placeholder",c),f.data({"placeholder-textinput":d,"placeholder-id":g}).before(d)}f=f.removeAttr("id").hide().prevAll('input[type="text"]:first').attr("id",g).show()}f.addClass(m.customClass),f[0].value=f.attr("placeholder")}else f.removeClass(m.customClass)}function e(){try{return document.activeElement}catch(a){}}var f,g,h="[object OperaMini]"==Object.prototype.toString.call(window.operamini),i="placeholder"in document.createElement("input")&&!h,j="placeholder"in document.createElement("textarea")&&!h,k=a.valHooks,l=a.propHooks;if(i&&j)g=a.fn.placeholder=function(){return this},g.input=g.textarea=!0;else{var m={};g=a.fn.placeholder=function(b){var e={customClass:"placeholder"};m=a.extend({},e,b);var f=this;return f.filter((i?"textarea":":input")+"[placeholder]").not("."+m.customClass).bind({"focus.placeholder":c,"blur.placeholder":d}).data("placeholder-enabled",!0).trigger("blur.placeholder"),f},g.input=i,g.textarea=j,f={get:function(b){var c=a(b),d=c.data("placeholder-password");return d?d[0].value:c.data("placeholder-enabled")&&c.hasClass(m.customClass)?"":b.value},set:function(b,f){var g=a(b),h=g.data("placeholder-password");return h?h[0].value=f:g.data("placeholder-enabled")?(""===f?(b.value=f,b!=e()&&d.call(b)):g.hasClass(m.customClass)?c.call(b,!0,f)||(b.value=f):b.value=f,g):b.value=f}},i||(k.input=f,l.value=f),j||(k.textarea=f,l.value=f),a(function(){a(document).delegate("form","submit.placeholder",function(){var b=a("."+m.customClass,this).each(c);setTimeout(function(){b.each(d)},10)})}),a(window).bind("beforeunload.placeholder",function(){a("."+m.customClass).each(function(){this.value=""})})}});
// doT.js
// 2011-2014, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

(function() {
	"use strict";

	var doT = {
		version: "1.0.3",
		templateSettings: {
			evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
			interpolate: /\{\{=([\s\S]+?)\}\}/g,
			encode:      /\{\{!([\s\S]+?)\}\}/g,
			use:         /\{\{#([\s\S]+?)\}\}/g,
			useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
			define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
			defineParams:/^\s*([\w$]+):([\s\S]+)/,
			conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
			iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
			varname:	"it",
			strip:		true,
			append:		true,
			selfcontained: false,
			doNotSkipEncoded: false
		},
		template: undefined, //fn, compile template
		compile:  undefined  //fn, for express
	}, _globals;

	doT.encodeHTMLSource = function(doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	};

	_globals = (function(){ return this || (0,eval)("this"); }());

	if (typeof module !== "undefined" && module.exports) {
		module.exports = doT;
	} else if (typeof define === "function" && define.amd) {
		define(function(){return doT;});
	} else {
		_globals.doT = doT;
	}

	var startend = {
		append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
		split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" }
	}, skip = /$^/;

	function resolveDefs(c, block, def) {
		return ((typeof block === "string") ? block : block.toString())
		.replace(c.define || skip, function(m, code, assign, value) {
			if (code.indexOf("def.") === 0) {
				code = code.substring(4);
			}
			if (!(code in def)) {
				if (assign === ":") {
					if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
						def[code] = {arg: param, text: v};
					});
					if (!(code in def)) def[code]= value;
				} else {
					new Function("def", "def['"+code+"']=" + value)(def);
				}
			}
			return "";
		})
		.replace(c.use || skip, function(m, code) {
			if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
				if (def[d] && def[d].arg && param) {
					var rw = (d+":"+param).replace(/'|\\/g, "_");
					def.__exp = def.__exp || {};
					def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
					return s + "def.__exp['"+rw+"']";
				}
			});
			var v = new Function("def", "return " + code)(def);
			return v ? resolveDefs(c, v, def) : v;
		});
	}

	function unescape(code) {
		return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
	}

	doT.template = function(tmpl, c, def) {
		c = c || doT.templateSettings;
		var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
			str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

		str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ")
					.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""): str)
			.replace(/'|\\/g, "\\$&")
			.replace(c.interpolate || skip, function(m, code) {
				return cse.start + unescape(code) + cse.end;
			})
			.replace(c.encode || skip, function(m, code) {
				needhtmlencode = true;
				return cse.startencode + unescape(code) + cse.end;
			})
			.replace(c.conditional || skip, function(m, elsecase, code) {
				return elsecase ?
					(code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
					(code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
			})
			.replace(c.iterate || skip, function(m, iterate, vname, iname) {
				if (!iterate) return "';} } out+='";
				sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
				return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
					+vname+"=arr"+sid+"["+indv+"+=1];out+='";
			})
			.replace(c.evaluate || skip, function(m, code) {
				return "';" + unescape(code) + "out+='";
			})
			+ "';return out;")
			.replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
			.replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
			//.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

		if (needhtmlencode) {
			if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = doT.encodeHTMLSource(c.doNotSkipEncoded);
			str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
				+ doT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
				+ str;
		}
		try {
			return new Function(c.varname, str);
		} catch (e) {
			if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
			throw e;
		}
	};

	doT.compile = function(tmpl, def) {
		return doT.template(tmpl, null, def);
	};
}());

/* global app */

/**
 * @file VConnect WAF Framework
 * @author VConnect Frontend Team
 * @version 1.0
 */
/*

$$\    $$\  $$$$$$\   $$$$$$\  $$\   $$\ $$\   $$\ $$$$$$$$\  $$$$$$\ $$$$$$$$\
$$ |   $$ |$$  __$$\ $$  __$$\ $$$\  $$ |$$$\  $$ |$$  _____|$$  __$$\\__$$  __|
$$ |   $$ |$$ /  \__|$$ /  $$ |$$$$\ $$ |$$$$\ $$ |$$ |      $$ /  \__|  $$ |
\$$\  $$  |$$ |      $$ |  $$ |$$ $$\$$ |$$ $$\$$ |$$$$$\    $$ |        $$ |
 \$$\$$  / $$ |      $$ |  $$ |$$ \$$$$ |$$ \$$$$ |$$  __|   $$ |        $$ |
	\$$$  /  $$ |  $$\ $$ |  $$ |$$ |\$$$ |$$ |\$$$ |$$ |      $$ |  $$\   $$ |
	 \$  /   \$$$$$$  | $$$$$$  |$$ | \$$ |$$ | \$$ |$$$$$$$$\ \$$$$$$  |  $$ |
		\_/     \______/  \______/ \__|  \__|\__|  \__|\________| \______/   \__|

===============================================================================
=============================== WAF FRAMEWORK =================================
===============================================================================
 */
;(function($){

	/**
	 * Creates a new WAF exception
	 * @class
	 * @global
	 */
	var WafException = function(message){
		this.name = 'WafException';
		this.message = message || 'An error has occurred.';
	};
	WafException.prototype = Object.create(Error.prototype);
	WafException.prototype.constructor = WafException;

	/**
	 * A component in the framework
	 * @typedef Component
	 */

	/**
	 * The main application object
	 * @namespace
	 * @global
	 */
	window.app = {
		/**
		 * The object containing the configuration options
		 */
		config:{
			tabletViewportSize: 1024,
			$singleMenu: $('.single-menu > a'),
			$loggedInMenu: $('.loggedin-menu'),
			$tabSearch: $('.tab-search > a'),
			$searchForm: $('li.search-form'),
			$disableMenuSet: $('.single-menu > a, .loggedin-menu, .tab-search > a'),
			$jumbotronContainer: $('.jumbotron-container'),
			$introMessage: $('.intro-message'),
			$searchBox: $('.search-box'),
			$menuExpanded: $('.menu-expanded'),
			$menuCollapsed: $('.menu-collapsed'),
			typeCursorOrientation: 'vertical',
			$bannerOverlay: $('.banner-overlay'),
			$allSearch: $('.jsearchterm, .searchterm, .jsearchlocation, .searchlocation'),
			$jSearchTerm: $('.jsearchterm'),
			$searchTerm: $('.searchterm'),
			$jSearchLocation: $('.jsearchlocation'),
			$searchLocation: $('.searchlocation'),
			$jSearchTermInput: $('.jsearchterm.tt-input'),
			$searchTermInput: $('.searchterm.tt-input'),
			$jSearchLocationInput: $('.jsearchlocation.tt-input'),
			$searchLocationInput: $('.searchlocation.tt-input'),
			$copyTextButton: $('.copybutton'),
			$copyText: $('.copytext'),
			zClipSwfPath: '/js/vendor/ZeroClipboard.swf',
			$imageThumbnail: $('.th'),
			termsURL: '../HomeWEB/KeywordAutoComplete?term=%QUERY',
			locationsURL: '../HomeWEB/LocationAutoComplete?term=%QUERY',
			$addPhotoModal: $('#addPhotoModal'),
			isJoyrideCookie: true,
			cookieName: 'newDealsQSearch',
			cookieDomain: false,
			picker:$.noop(),
			$locationBox: $('.location-box'),
			$uploadAvatar: $('#upload-avatar'),
			$leadFormsContainer: $('.lead-form-content .forms-container'),
			$leadFormSections: $('.lead-form-content .form-section'),
			$leadFormNavigationList: $('.lead-form-content .navigation-list'),
			$userProfileContainer: $('.userprofile-content'),
			dataNamespace: 'data-vc',
			alertContainerClass: 'alerts',
			alertTimeOut: 7000,
			roleEl: {},
			arrRoles: ['show', 'next', 'prev', 'skip', 'loading', 'review', 'follow', 'like', 'save'],
			scriptURLs: {
				cookie: '/js/vendor/jquery.cookie.js',
				textchanger: '/js/desktop/components/textchanger.js',
				pikaday: '/js/vendor/min/pikaday.min.js',
				skrollr: '/js/vendor/skrollr.min.js',
				dropzone: '/js/vendor/new/dropzone.min.js',
				swipebox: '/js/vendor/jquery.swipebox.min.js',
				unveil: '/js/vendor/jquery.unveil.min.js',
				selectize: '/js/vendor/new/selectize.min-master.js',
				elevatezoom: '/js/vendor/jquery.elevatezoom.min.js',
				zoom: '/js/vendor/jquery.zoom.min.js',
				owlcarousel: '/js/vendor/owl.carousel.min.js',
				test: '/js/test.js',
				zclip: '/js/vendor/jquery.zclip.js',
				gmap: 'https://maps.googleapis.com/maps/api/js?v=3&sensor=false',
				doT: '/js/vendor/doT.js',
				typeahead: '/js/vendor/new/typeahead.bundle.min.js',
				ntypeahead: '/js/vendor/typeahead/typeahead.bundle.min.js'
			}
		},

		/**
		 * Channels for the pubsub system
		 * @private
		 */
		channels: {},
		/**
		 * References the `this` object
		 * @readonly
		 */
		scope:this,

		/**
		 * Contains the various components of the application
		 * @private
		 */
		comps:{},

		/**
		 * Contains the utility functions
		 * @private
		 */
		utils:{

			/**
			 * Sends a notification to the user using the built-in notification system.
			 * @function app.notifyMe
			 * @param  {object|string} data An object containing the message and type
			 * @example
			 * app.notifyMe('Hello');
			 * app.notifyMe({
			 *		message: "You entered a wrong password.",
			 *		type: "error"
			 *	});
			 */
			notifyMe:function(data){
				// Used to notify the user
				/*
					data - an object containing the message and type
				*/
				var cf = this.config,
					self = this,
					container,
					tpl = '<div data-vc-role="alert" class="vc-alert alert-box"><p class="alert-content"></p><a href="#" class="close">&times;</a></div>';
				// console.log(arguments);
				var message = data.message || data,
					type = data.type || 'default' || 'success';

				if($('body').find('.' + cf.alertContainerClass).length > 0){
					container = $('.' + cf.alertContainerClass);
				}
				else{
					$('body').append($('<div>').addClass(cf.alertContainerClass));
					container = $('.' + cf.alertContainerClass);
				}

				var alertItem = {
					alertBox: {},
					alertTimer: {}
				};

				alertItem.alertBox = $(tpl).addClass(type);
				container.append(alertItem.alertBox);
				// console.log(this);
				alertItem.alertBox.find('.alert-content').html(message);
				self._log('Showing alert for message: ' + message);
				alertItem.alertBox.fadeIn();

				// alertItem.alertBox.height();
				// alertItem.alertBox.addClass('is-open');

				alertItem.alertTimer = setTimeout(function(){
					// console._log('hi');
					alertItem.alertBox.fadeOut(function(){
						$(this).remove();
					});
				}, cf.alertTimeOut);
				container.off('.alert').on('click.vc.alert','[' + self.attr_name('role') + '="alert"] a.close', function(e){
					e.preventDefault();
					$(this).closest('[' + self.attr_name('role') + '="alert"]').fadeOut(function(){
						$(this).remove();
					});
				});
				// console._log(container);
				// console._log(alertItem.alertBox);
				// $('#notificationModal .modal-content').html(text);
				// $('#notificationModal').foundation('reveal','open');
				return this;
			},

			/**
			 * Creates a namespaced attribute name based on the specified string parameter. The namespace is specified as a global configuration option. The default namespace is `data-vc-`.
			 * @function app.attr_name
			 * @param  {string} str The string to create the attribute name from
			 * @example
			 * app.attr_name("option");
			 * // Returns the namespaced attribute name .i.e. data-vc-option
			 */
			attr_name:function(str){
				// Used to generate application-specific data- attributes
				// e.g. data-vc-role
				var cf = this.config;
				this._log('Attribute for: ' + str);
				return cf.dataNamespace + '-' + str;
			},

			/**
			 * Converts a semicolon-seperated string into its described object
			 * @function app.data_options
			 * @param {string} options The string to be formatted into the object
			 * @returns {object} The object parsed from the `options` string
			 */
			data_options:function(options){
				var opts = {};
				// Idea from Foundation.js by Zurb
				if (typeof options === 'object') {
					return options;
				}

				var opts_arr = (options || '=').split(';'),
				ii = opts_arr.length;

				function isNumber (o) {
					return ! isNaN (o-0) && o !== null && o !== '' && o !== false && o !== true;
				}

				// Polyfill for trim function in IE8 down

					// var trim = function () {
					//   return this.replace(/^\s+|\s+$/g, '');
					// }

				function trim(str) {
					if (typeof str === 'string') return str.replace(/^\s+|\s+$/g, '');
					// return str;
				}

				while (ii--) {
					var p = opts_arr[ii].split('=');

					if (/true/i.test(p[1])) p[1] = true;
					if (/false/i.test(p[1])) p[1] = false;
					if (isNumber(p[1])) p[1] = parseInt(p[1], 10);

					if (p.length === 2 && p[0].length > 0) {
						opts[trim(p[0])] = trim(p[1]);
					}
				}

				return opts;
			},
			/**
			 * Installs a script file that is required by downloading it and executing its content. It checks to make sure the script is correctly installed by checking the value returned from the test function, and then it executes the callback function. If no test function or value is passed, it installs the script and then executes the callback.
			 * @function app.require
			 * @param  {string} script Specifies the key used to store the URL of the script in the `config.scriptURLs` object.
			 * @param  {function} test   Returns `true` if the script is installed successfully.
			 * @param  {function} func   Executed after successfully installing script.
			 * @example
			 * app.require('skrollr', function(){
			 * 	return typeof skrollr !== "undefined";
			 * }), function(){
			 * 		console._log("Successfully installed skrollr");
			 * 		skrollr.init();
			 * });
			 */
			require:function(script, test, func){
				// Used to install required scripts
				/*
					script: The name of the script to include
					test:  Test to run before installing
					func: Function to run after installing

					Pseudo:
						- `script` is required
						- check for script by running `test` function
						- if available then run `func` - the callback function
						- else install `script`
						- after installing, check if available again by running `test` function
						- if available then run `func`
						- else do nothing. Script URL or test function is wrong
				*/
				var self = this,
					cf = this.config,
					scriptURLs = cf.scriptURLs,
					testExists = true;
				/*
					One option: to be considered later
				var getScriptURL = function () {
					var scripts = document.getElementsByTagName('script');
					var index = scripts.length - 1;
					return scripts[index].src;
				}
				var getAssetsPath = function () {
					return getScriptURL().replace(/js\/.+\.js$/, '')
				}
				var installExternalScript = function (url) {
					document.write('<script type="text/javascript" src="' + url + '"></' + 'script>');
				}
				var installThirdPartyScript = function (fileName) {
					var assetsPath = getAssetsPath();
					var thirdPartyPath = assetsPath + 'js/thirdparty/';
					installExternalScript(thirdPartyPath + fileName);
				}
				*/

				var getScript = function(url, callback, cache){
					return jQuery.ajax({
						url: url,
						type: 'GET',
						dataType: 'script',
						success: callback,
						cache: cache || true
					});//.done(callback);
				};

				// func = func || test || function(){};
				// test =
				if(typeof func === 'undefined'){
					if(typeof test == 'undefined'){
						func = function(){};
						test = true;
					}
					else{
						func = test;
						test = true;
					}
					testExists = false;
				}

				if(test() && testExists){
					// run func
					self._log('Require script already exists: ' + script);
					self._log('Calling require callback for: ' + script);
					func();
					return true;
				}
				else{
					// install script
					self._log('Require script not found: ' + script);
					self._log('Get require script: ' + script);
					getScript(scriptURLs[script], function(){
						self._log('Require script gotten: ' + script);
						self._log('Require script URL: ' + scriptURLs[script]);
						if(test()){
							self._log('Require script test passed: ' + script);
							self._log('Calling require callback for: ' + script);
							func();
							return true;
						}
						self._log('Require script test not passed: ' + script);
					});
				}
				return this;
			},

			/**
			 * A simple function to render a template with the passed data. The render function is adopted from the [Nano templating engine by Trix](https://github.com/trix/nano).
			 * @function app.render
			 * @param  {string} template String containing the template to be used
			 * @param  {object} data     Object containing the data to be used in rendering the template
			 * @return {string}          The rendered string
			 */
			render:function(template, data){
				/* Nano Templates (Tomasz Mazur, Jacek Becela) */
				return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
					var keys = key.split('.'), v = data[keys.shift()];
					for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
					return (typeof v !== 'undefined' && v !== null) ? v : '';
				});
			},

			throttle:function(func, delay) {
				// Description:
				//    Executes a function a max of once every n milliseconds
				//
				// Arguments:
				//    Func (Function): Function to be throttled.
				//
				//    Delay (Integer): Function execution threshold in milliseconds.
				////
				// Returns:
				//    Lazy_function (Function): Function with throttling applied.
				var timer = null;

				return function () {
					var context = this, args = arguments;

					clearTimeout(timer);
					timer = setTimeout(function () {
						func.apply(context, args);
					}, delay);
				};
			},
			debounce:function(func, delay, immediate) {
				// Description:
				//    Executes a function when it stops being invoked for n seconds
				//    Modified version of _.debounce() http://underscorejs.org
				//
				// Arguments:
				//    Func (Function): Function to be debounced.
				//
				//    Delay (Integer): Function execution threshold in milliseconds.
				//
				//    Immediate (Bool): Whether the function should be called at the beginning
				//    of the delay instead of the end. Default is false.
				//
				// Returns:
				//    Lazy_function (Function): Function with debouncing applied.
				var timeout, result;
				return function() {
					var context = this, args = arguments;
					var later = function() {
						timeout = null;
						if (!immediate) result = func.apply(context, args);
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = setTimeout(later, delay);
					if (callNow) result = func.apply(context, args);
					return result;
				};
			},

			// PUBSUB SYSTEM
			// =============

			/**
			 * Publishes data to a specified channel, passing data to subscribers to the channel
			 * @function app.publish
			 * @param {string} channel Specifies the channel to publish to
			 * @param {object} data Specifies the data to be pushed to the subscribers
			 */
			publish:function(channel, data){
				// If the channel doesn't exist, just return. (It simply means there are no listeners)
				if(!this.channels.hasOwnProperty(channel)) return;
				data = data || {};

				// PATCH: For backward compatibility with old pubsub, add channel meta
				var e = {
					_channel: channel
				};
				e = $.extend({}, e, data);
				// data.serverid = _self.uuid;
				var lenListeners = this.channels[channel].length;
				for(var i = 0; i < lenListeners; i++){
					// Execute each listener
					// PATCH: For backward compatibility with old pubsub, add channel meta
					this.channels[channel][i] && this.channels[channel][i](e, data); // jshint ignore:line
					this._log('Listener called on: ' + channel);
				}
				this._log('Published to: ' + channel);
				return this;
			},
			/**
			 * @callback subscribeCallback
			 * @param {object} e Contains the publication event properties
			 * @param {object} data The data published to the channel
			 */

			/**
			 * Subscribes to a specified channel to receive data published into it
			 * @function app.subscribe
			 * @param {string} channel Specifies the channel to subscribe to
			 * @param {subscribeCallback} fn The callback function called when there is a publication
			 */
			subscribe:function(channel, fn){
				var _ = this;
				// If the channel doesn't exist, create the object
				if(!this.channels.hasOwnProperty(channel)) this.channels[channel] = [];

				// Add the listener to the queue
				var index = this.channels[channel].push(fn) - 1;
				this._log('Subscribed to: ' + channel);
				return {
					remove:function(){
						// delete this.channels[channel][index];
						_.channels[channel].splice(index, 1);
					}
				};
			},
			/**
			 * Unsubscribes from a specific channel
			 * @param {string} channel The channel to unsubscribe from
			 */
			unsubscribe:function(channel){
				delete this.channels[channel];
				this._log('Unsubscribed from: ' + channel);
			},

			// PUBSUB HELPER FUNCTIONS
			// =======================

			/**
			 * request for requesting for data from another component
			 * @function app.request
			 * @param  {string}   channel [name of channel]
			 * @param  {object}   [opts]    [Optional. data to be sent to replier]
			 * @param  {Function} fn      [callback function after request is responded to]
			 * @return {obj}           this
			 */
			request:function(channel, opts, fn){
				if(!fn){
					fn = opts;
					opts = {};
				}
				this.subscribe('reply:' + channel, fn);
				this.publish('request:' + channel, opts);
			},
			/**
			 * reply for replying to a request made to a channel
			 * @function app.reply
			 * @param  {string} channel [name of channel]
			 * @param  {function} data    [data or function that returns data to be passed to the requester]
			 * @return {obj}         this
			 */
			reply:function(channel, data){
				var self = this;

				this.subscribe('request:' + channel, function(e, opts){
					// If function was passed, use the returned value as data instead
					if(typeof data === 'function'){
						data = data(opts);
					}
					self.publish('reply:' + channel, data);
					// self.unsubscribe('reply:' + channel); //REMOVE: This should be done by the requester if he wants to
				});
				return this;
			},

			// DEBUG HELPER
			// ============
			/**
			 * Mainly used for development purposes. Logs data to the console in the development environment. Doesn't do anything in production environment. It should be used in replacement of console.log which cannot be controlled (since it is a native function).
			 * @function app.log
			 * @param {...String} message The message to log
			 *
			 */
			log:function(){
				if(this.config.env == 'development'){
					var args = [].slice.call(arguments, 0),
							suffix = Error().lineNumber ? 'line: '  + Error().lineNumber : '::WAF::'; // + Error().stack;
					// console.trace();
					console.log.apply(console, args.concat([suffix]));
				}
			},
			_log:function(msg){
				this.log('%c' + msg, 'color:green;font-weight:bold;background:#fafafa;padding:5px;');
			},

			/**
			 * reset URLs in component's config obj to root from the `siteRoot` config property
			 * @function app.reRootSiteURLs
			 * @param  {object}   should contain URLs eg {url :/path/to/endpoint}
			 * @param  {string}   the new root, usually cf.siteRoot which is === '/' for development
			 * @return {obj}      new URLsConfigObject having it's root-path set to `siteRoot` (or whater string passed)
			 * How to use on page/component. `self.reRootSiteURLs(opts, cf.siteRoot);`
			 */
			reRootSiteURLs : function (URLsConfigObject, newRoot) {
				var scripts = Object.keys(URLsConfigObject);

				scripts.forEach( function(url) {
					var _url = URLsConfigObject[url];
					// if _url starts with '//', means it must be the live-absolute-path, don't replace it.
					if (typeof _url === 'string' && _url.match(/^\//)  && !_url.match(/^\/\//)) {
						URLsConfigObject[url] = _url.replace(/\//, newRoot);
					}
				});

				return URLsConfigObject;
			},
		},

		/**
		 * @private
		 */
		debug:{
			noOfComps: 0,
			noOfCompErrors: 0
		},
		getSiteRootFromCookies : function getSiteRootFromCookies() {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i].split('=');
				if (cookie[0].trim() === 'siteRoot') {
					return cookie[1].trim();
				}
				return undefined;
			}
		},


		/**
		 * The initialization function called to initialize the framework
		 * @param {string} [comp] The name of the component to initialize
		 * @param {object} [config] The configuration options passed for initialization
		 * @returns {object} The this object.
		 * @since 1.0
		 */
		init:function(comp, config){
			var self = this,
				cf = this.config;

			if(typeof comp == 'object'){
				config = comp;
				comp = undefined;
			}

			// Set the config options
			$.extend(true, this.config, config || {});
		if(!this.initilized){
				// Provide utility functions in application
				$.extend(this, this.utils);

				// reset the root path of scriptURLs
				this.config.scriptURLs = this.reRootSiteURLs(this.config.scriptURLs, this.getSiteRootFromCookies() || this.config.siteRoot);
				// Set the behavior of the elements in the app
				app.initRoles();

				// Subscriptions
				this.subscribe('vc:notify', function(e, data){
					self.notifyMe(data);
				});
				this.subscribe('vc:init', function(e, data){
					self.init(data);
				});

				this.transitionEnd = this.transitionEndSelect();
				this.animationEnd = this.animationEndSelect();

				//initialize foundation
				if(jQuery().foundation){
					if(Foundation.libs.abide){
						Foundation.libs.abide.settings.patterns.password = /(?=^.{0,}$)[a-zA-Z0-9-\W+]+$/; /*/(?=^.{6,}$)([a-zA-Z0-9]+$)/;*/ ///^[a-zA-Z0-9]+$/;
						Foundation.libs.abide.settings.patterns.oldpassword = /(?=^.{0,}$)[a-zA-Z0-9-\W+]+$/; /*/(?=^.{6,}$)([a-zA-Z0-9]+$)/;*/
						// Foundation.libs.abide.settings.patterns.email = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; //<= From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address /*/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/;*/

						// From http://emailregex.com/
						Foundation.libs.abide.settings.patterns.email = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

						Foundation.libs.abide.settings.patterns.ghanaianphone = /^0[235]\d{8}/;
						Foundation.libs.abide.settings.patterns.nigerianphone = /^0?(([1-6]\d{6,7})|([7-9]([0-1]\d{8}|[2-9]\d{6,7})))$/; /*/0?(([7-9][0-1]\d{8})|([1-8]\d{6,7}))/;*/
						Foundation.libs.abide.settings.patterns.url = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([=#\?\/\w \.-]*)*\/?$/;
					}
					if(Foundation.libs.reveal)Foundation.libs.reveal.settings.animation = 'fade';
					$(document).foundation({
						joyride:{
							// expose:true,
							modal:true,
							prevButton:true,
							cookie_monster: cf.isJoyrideCookie,
							cookie_name: cf.cookieName,
							cookie_domain: cf.cookieDomain,
							template : { // HTML segments for tip layout
								link        : '<a href="#close" class="joyride-close-tip">&times;</a>',
								timer       : '<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator"></span></div>',
								tip         : '<div class="joyride-tip-guide"><span class="joyride-nub"></span></div>',
								wrapper     : '<div class="joyride-content-wrapper"></div>',
								button      : '<a href="#" class="tiny btn invert joyride-next-tip"></a>',
								prev_button : '<a href="#" class="tiny btn invert joyride-prev-tip"></a>',
								modal       : '<div class="joyride-modal-bg"></div>',
								expose      : '<div class="joyride-expose-wrapper"></div>',
								expose_cover: '<div class="joyride-expose-cover"></div>'
							}
						}
					});
					$(document).foundation('joyride', 'start');
				}

				// Idea from Foundation by Zurb
				for(comp in this.comps){
					if(this.comps.hasOwnProperty(comp)){
						this.debug.noOfComps++;
						this.init_comp(comp);
						this.log('waf: ' + comp + ' initialized.');
					}
				}
				// DEBUG:
				if(this.config.env == 'development'){
					var _debugMessage = 'Total number of components: ' + this.debug.noOfComps +
							', Number of Errors: ' + this.debug.noOfCompErrors +
							', Number of initialized components: ' + (this.debug.noOfComps - this.debug.noOfCompErrors);
					var _debugMessageType = (this.debug.noOfCompErrors)? 'error':'info';

					this.notifyMe({message: _debugMessage, type: _debugMessageType});
				}
			}

			if(comp)this.init_comp(comp);

			if(cf.isOperamini){
				$.fn.fadeIn = $.fn.show;
				$.fn.fadeOut = $.fn.hide;
			}

			this.initialized = true;
			return this;
		},

		/**
		 * Calls the `init` function for `comp`
		 * @param {string} comp The name of the component to initialize
		 */
		init_comp:function(comp){
			this.patch(this.comps[comp], comp);

			try{
				// reset the root-path of all component config object
				this.reRootSiteURLs(this.comps[comp].config[comp] || {}, this.getSiteRootFromCookies() || this.config.siteRoot);
				// TODO: Don't initialize component if the container or wrapper doesn't exist on the page.
				return this.comps[comp].init.apply(this.comps[comp], []);
			}
			catch(e){
				var errorMessage = '"' + comp + '" component has a bug. Error: ' + e.message;
				console.error(errorMessage, e.stack);
				// DEBUG:
				this.debug.noOfCompErrors++;
				if(this.config.env == 'development'){
					this.notifyMe({message: errorMessage, type: 'error'});
				}
			}
		},
		patch:function(comp, compName){
			var tmpObj = {};
			tmpObj[compName] = {};
			// Patch component: Assign component variables
			comp.config = $.extend(true, tmpObj, comp.config, this.config);

			//Provide access to utilities within component to all components
			$.extend(this.utils, comp.utils);

			// Provide access to utilities within component to application
			$.extend(this, comp.utils);

			// Provide access to utility functions in component
			$.extend(comp, this.utils);
			comp.channels = this.channels;
			comp.transitionEnd = this.transitionEnd;
			comp.animationEnd = this.animationEnd;

			// Work on natively supporting event delegation in framework
			// comp.$el;
		},
		initRoles:function(){
			// Sets the element roles in the application
			var cf = this.config,
				self = this;

			cf.roleEl = $.extend({}, cf.roleEl);

			// var attr_name = this.attr_name;

			var role_el = function(role){
				return $('[' + self.attr_name('role') + '="'+ role + '"]');
			};

			// cf.arrRoles = ['show', 'next', 'prev', 'skip', 'loading', 'review'];
			// cf.arrRoles.forEach(function(elem, index){
			// 	cf.roleEl[elem] = role_el(elem);
			// });
			$.each(cf.arrRoles, function(index, elem){
				cf.roleEl[elem] = role_el(elem);
			});

			// Show role
			var $showEls = cf.roleEl.show,
				$checkShowEls = $showEls.filter('input[type="checkbox"],input[type="radio"]');
				// $specificShowEls = $showEls.filter('[data-vc-role="show"]')
			$checkShowEls.on('change',function(){
				if($(this).is(':checked')){
					//when checked, show the input next to it
					$(this).next('input').fadeIn();
				}
				else{
					$(this).next('input').fadeOut();
				}
			}).next('input').hide();

			cf.roleEl.next.on('click', function(e){
				e.preventDefault();
				// e.stopPropagation();
			});
			cf.roleEl.prev.on('click', function(e){
				e.preventDefault();
			});
		},
		addUtility:function(utilName, utilFn){
			if(this.utils.hasOwnProperty(utilName)){
				throw new WafException('utility name:' + utilName + ' is already is use.');
			}
			this.utils[utilName] = utilFn;
			this[utilName] = utilFn;
		},
		transitionEndSelect:function(){
			var el = document.createElement('div');
			if (el.style.WebkitTransition) return 'webkitTransitionEnd';
			if (el.style.OTransition) return 'oTransitionEnd';
			return 'transitionend';
		},
		animationEndSelect:function(){
			// var el = document.createElement("div");
			// if (el.style.WebkitAnimation) return "webkitAnimationEnd";
			// if (el.style.OAnimation) return "oAnimationEnd";
			// return 'animationend';
			return 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd';
		}
	};
})(jQuery);

/**
 * app.addUtility('utilname', function(){
 * 	console.log('Ginks.');
 * });
 *
 * app.init('select', {
 * 	dd:2
 * });
 *
 * clicky.log( href, title, type )
 * _kmq.push(['trackClick', 'ELEMENT_ID_OR_CLASS', 'EVENT_NAME']);
 */

// ----------------------------------------------------------------------------
// -----------  NATIVE SUPPORT FOR EVENT DELEGATION IN FRAMEWORK --------------
// ----------------------------------------------------------------------------

// this.$el - jQuery object of the component element.

// elName - selector identifying the component's element. It uses framework's namespace (i.e. 'data-vc-') to identify element if selector begins with `@`. Used to set the values of the `this.$el` variable. Also its existence determines if the component is initialized or not, on the page, because if the element isn't found on the page, the component isn't initialized.

// elContainer - selector identifying the component's acclaimed container. Uses framework's namespace to identify element if selector begins with `@`. Used to set the values of the `this.$container` variable. Also used for binding delegated events. If not provided, `this.$el` is used instead.

// elEvents - an object containing hashes comprising of events and the respective element i.e. `event_name element_selector`, which are delegated, and their callbacks. The callbacks are methods in the `this` context of the components. The callbacks receive two arguments (e, el), the event object, and the element.

// ---------------------------------------------------------------------------
// ------------------------ EXAMPLE: app.almond.js ---------------------------
// ---------------------------------------------------------------------------

/**
	almond - component_description

	Usage: 'How to use component'
	Options:
		Option_name - Option_description
			Values: Possible_option_values
	Example:
		Option_example
*/
/*
;(function($, window, document, undefined){
	window.app.comps.almond = {
		config: {
			almond: {
				var1: 'a',
				var2: 'b'
			}
		},
		elName: '@almond',
		elContainer: '.o-checkout',
		elEvents: {
			'click .book': 'bookClicked',
			'hover .box': 'boxHovered'
		},
		init:function(){
			// Contains the initialization code
			// ...

			self.$el = $(elName);

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions

				$('.ddas').on('click', function(e){
					e.preventDefault();
					this.attr_name('asd');
				});

				this.attr_name('asd');
		},
		bookClicked:function(e, el){
			// callback function for the delegated click event of `.book`
			this.log('me');
		},

		boxHovered: function(e, el){

			$(this).find('p').text('BOX!');
		}

	};
}(jQuery, window, document));
*/

/**
	cookie - Handles the management of all the cookie-related tasks

	Usage: 'How to use component'
	Options:
		Option_name - Option_description
			Values: Possible_option_values
	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.cookies = {
		utils: {
			/**
			 * Gets the value of a cookie given its name
			 * @function app.getCookie
			 * @param {string} sKey The name of the cookie to be gotten
			 * @returns {string} The value of the cookie
			 */
			getCookie: function (sKey) {
				return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
			},
			/**
			 * Creates a cookie with the specified name and value
			 * @function app.createCookie
			 * @param {string} sKey The name of the cookie to create
			 * @param {string} sValue The string value of the cookie
			 * @param {number|string|date} [vEnd] The expiration date of the cookie
			 * @param {string} [sPath] The cookie path
			 * @param {string} [sDomain] The cookie domain
			 * @param {boolean} [bSecure] Specifies if the cookie should be secure
			 */
			createCookie: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
				if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
				var sExpires = "";
				if (vEnd) {
					switch (vEnd.constructor) {
						case Number:
							if (vEnd === Infinity) {
								sExpires =  "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
							}else{
								var date = new Date();
								date.setTime(date.getTime() + (vEnd * 24 * 60 * 60 * 1000));
								sExpires = "; expires=" + date.toGMTString();
							}
							break;
						case String:
							sExpires = "; expires=" + vEnd;
							break;
						case Date:
							sExpires = "; expires=" + vEnd.toUTCString();
							break;
					}
				}
				document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
				return true;
			},
			/**
			 * Removes a cookie with the specified name
			 * @function app.removeCookie
			 * @param {string} sKey The name of the cookie to remove
			 * @param {string} [sPath] The path of the cookie
			 * @param {string} [sDomain] The domain of the cookie
			 */
			removeCookie: function (sKey, sPath, sDomain) {
				if (!sKey || !this.hasCookie(sKey)) { return false; }
				document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
				return true;
			},
			/**
			 * Checks for the existence of a cookie with the specified name
			 * @function app.hasCookie
			 * @param {string} sKey The name of the cookie
			 * @returns {boolean} Returns true if the cookie is found, else it returns false
			 */
			hasCookie: function (sKey) {
				return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
			 },
		},
		init:function(){
			// Contains the initialization code
			// ...
			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
		},
	};
}(jQuery, window, document));

/**
	component_name - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.checkuserauth = {
		config: {
			checkuserauth: {
				loginUrl: '/account/loginpopup',
				mobileUrl: '/mobile/login.html'
			}
		},
		utils: {
			/**
			 * Checks if the current user is logged in, and runs the callback only if logged in
			 * @function app.checkAuth
			 * @param {function} callback The callback to run
			 */
			 checkAuth:function(callback, data){
			 		var self = window.app.comps.checkuserauth,
						cf = self.config,
						opts = cf.checkuserauth;
						var url;

					self.log('checking auth...');
					if(cf.loggedIn){
						return callback();
					}
					else {
						// self.publish('vc:alert','login-first');
						opts.postLoginData = data;
						self.log(opts.postLoginData, "post login data");

						if(!cf.isMobile){
							self.publish('vc:modal/open', {modal: 'login-modal'});
						}
						else {
							self.savePostLoginAction();
							// TODO: Redirect to the href link
							window.location = opts.mobileUrl;
						}
						// alert('You would need to log in to do that');
				 	}

			 	// return alert('do something');
			}


		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.checkuserauth;


			opts.$required = $('[' + self.attr_name('auth-required') + ']');
			opts.$requiredUrl = $('[' + self.attr_name('auth-url') + ']');
			opts.$container = $('[' + self.attr_name('login') + ']');
			opts.$form = $('[' + self.attr_name('login-form') + ']');
			opts.$redirects = opts.$container.find('.js-redirects');
			// opts.$loginExists = opts.$container.find('.js-login-exists-alert');
			// opts.$loginExistsLink = opts.$container.find('.js-login-exist-link');
			opts.emailAddress = '.js-emailaddress';
			opts.password = '.js-password';
			opts.rememberMe = '.js-remember-me';
			opts.authLocalName = 'vcAuth';
			opts.authCurUrl = 'curl';
			opts.loggedInCookie = 'loggedIn';
			opts.loggedInCookieData = 'first';
			var errorMessage;

			// if(!opts.$required.length)return false;
			// Code begins here...

			// TODO: Check if postLoginAction is stored in local storage/cookie
			// TODO: If stored, call the necessary AJAX request required to carry it out
			if(cf.loggedIn) {
				if(self.getCookie(opts.authLocalName)){
					try{
						var curStorage = JSON.parse(self.getCookie(opts.authLocalName));
						var ajaxConfigOpts = {
							type        : curStorage.method, // define the type of HTTP verb we want to use (GET for our form)
							url         : curStorage.url, // the url where we want to GET
							data        : curStorage.data, // our data object
							dataType    : 'json', // what type of data do we expect back from the server
							encode      : true
						};

						if(curStorage.data instanceof FormData ) {
							self.log('saving form data');
							ajaxConfigOpts.processData = false;
							ajaxConfigOpts.contentType = false;
						}
						$.ajax(ajaxConfigOpts)
						// using the done promise callback
						.done(function(data) {
							self.removeCookie(opts.authLocalName);
							if(curStorage.successMessage)self.notifyMe(curStorage.successMessage);
						});
					}
					catch(e){
						self.log(e, 'checkuserauth JSON data issue. Not an issue.');
					}
				}
				if(self.getCookie(opts.loggedInCookie)) {
					errorMessage = 'You have successfully logged in.';
					self.notifyMe({message:errorMessage, type:"success"});
					self.removeCookie(opts.loggedInCookie);
				}

				// self.removeCookie(opts.authCurUrl);

			}

			// self.publish('vc:alert','login-first');
			// self.publish('vc:modal/open', {modal: 'login-first'});

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.checkuserauth;

					opts.$required.off('click.vc.checkuserauth').on('click.vc.checkuserauth', function(e){
						e.preventDefault();
						self.log('clicked auth');
						opts.$authClicked = $(this);
						var authUrl = opts.$authClicked && opts.$authClicked.attr(self.attr_name('auth-url'));

						self.createCookie(opts.authCurUrl, authUrl);

						if(!cf.loggedIn){
							if(!cf.isMobile) {
								self.publish('vc:modal/open', {modal: 'login-modal'});
							}
							else {
								// self.savePostLoginAction();
								window.location = opts.mobileUrl;
							}
						}
						else {
							if(authUrl) {
								window.location = authUrl;
								self.removeCookie(opts.authCurUrl);
							}
							else {
								self.removeCookie(opts.authCurUrl);
							}

						}
					});

					opts.$redirects.off('click.vc.checkuserauth').on('click.vc.checkuserauth', function(e){
						e.preventDefault();
						self.log('clicked redirect');
						var $el = $(this);
						self.savePostLoginAction();
						// TODO: Get href value
						var url = $el.attr('href');
						// TODO: Redirect to the href link
						window.location = url;

					});

					// opts.$container.off('keyup.vc.checkuserauth', opts.password).on('keyup.vc.checkuserauth', opts.password, function(e){
					// 	if((e.keyCode) == 13){

					// 	}
					// });

					opts.$form.off('valid.vc.checkuserauth').on('valid.vc.checkuserauth', function (e) {
						e.preventDefault();
						self.log("clicked");
						var $el = $(this);

						var authUrl = opts.$authClicked && opts.$authClicked.attr(self.attr_name('auth-url'));
						var email = $el.find(opts.emailAddress);
						var password = $el.find(opts.password);
						var rememberMe = $el.find(opts.rememberMe);
						var emailVal  = email.val();
						var passwordVal = password.val();
						var errorMessage, rememberMeVal, type;

						// var authUrlExist = opts.$requiredUrl.length;

						// self.savePostLoginAction();
						self.log(authUrl, 'auth url');
						self.log(opts.postLoginData, 'data login');

						if($(rememberMe).is(':checked')) {
							$(rememberMe).attr("checked", true);
							rememberMeVal = true;
						}
						else {
							// $(rememberMe).attr("checked", false);
							$(rememberMe).removeAttr('checked');
							rememberMeVal = false;
						}

						var formData = {
							'email'    	: emailVal,
							'password'  : passwordVal,
							'Rememberme' : rememberMeVal
						};

						if(cf.env == 'development') {
							type = 'GET';
						}
						else {
							type = 'POST';
						}

						self.loading($el, 'start');

						// process the form
						$.ajax({
								type        : type, // define the type of HTTP verb we want to use (POST for our form)
								url         : opts.loginUrl, // the url where we want to POST
								data        : formData, // our data object
								dataType    : 'json', // what type of data do we expect back from the server
								encode      : true
						})
								// using the done promise callback
						.done(function(data) {

								// log data to the console so we can see
								self.log(data);

								if(data.status == 1) {

									if(opts.postLoginData) {
										self.log(opts.postLoginData, 'login complete.. send data..');
										var ajaxConfigOpts = {
											type        : opts.postLoginData.method, // define the type of HTTP verb we want to use (GET for our form)
											url         : opts.postLoginData.url, // the url where we want to GET
											data        : opts.postLoginData.data, // our data object
											dataType    : 'json', // what type of data do we expect back from the server
											encode      : true,
										};

										if(opts.postLoginData.data instanceof FormData ) {
											self.log('saving form data');
											ajaxConfigOpts.processData = false;
											ajaxConfigOpts.contentType = false;
										}
										$.ajax(ajaxConfigOpts)
										.always(function(data) {
											self.log(data);
											self.loading($el, 'stop');
											location.reload(true);
										});

									}
									else if(authUrl) {
										window.location = authUrl;
									}
									else {
										// self.removeCookie(opts.authCurUrl);
										// self.loading($el, 'stop');
										location.reload(true);
									}

									self.createCookie(opts.loggedInCookie, opts.loggedInCookieData);
									// errorMessage = 'You have successfully logged in.';
									// setTimeout(
									// 	self.notifyMe({message:errorMessage, type:"success"}),6000
									// );

								}
								// here we will handle errors and validation messages
								else if (data.status == 2) {
									errorMessage = 'Oops! Something went wrong. Please try again later.';
									self.notifyMe({message:errorMessage, type:"error"});
								}

								else if (data.status == 5) {
									errorMessage = 'Oops! Something went wrong. Please try again later.';
									self.notifyMe({message:errorMessage, type:"error"});
								}

								else if (data.status == 601) {
									// opts.$loginExists.fadeIn();
									// opts.$loginExistsLink.attr('href', data.resendLink);
									errorMessage = 'Email/User Exists But Not Verified. Click on the verification link that was sent to your mail to verify your Login ID. To get a new link, click <a href="' + data.resendLink + '">Resend</a>';
									self.notifyMe({message:errorMessage, type:"error"});
								}

								else if (data.status == 602) {
									errorMessage = 'Invalid Credentials.';
									self.notifyMe({message:errorMessage, type:"error"});
								}

								else if (data.status == 603) {
									errorMessage = 'Email/User Does Not Exists. Please Sign Up';
									self.notifyMe({message:errorMessage, type:"error"});
								}

						});
						// .always(function(data) {
						// 	errorMessage = 'You have successfully logged in.';
						// 	self.notifyMe({message:errorMessage, type:"success"});
						// });



					});

		},
		savePostLoginAction:function(){
			var self = this,
					cf = this.config,
					opts = cf.checkuserauth;

					if(opts.postLoginData && opts.postLoginData.url) {
						// TODO: Store postLoginData in local storage/cookie
						self.createCookie(opts.authLocalName, JSON.stringify(opts.postLoginData));
					}
		}
	};
}(jQuery, window, document));

;(function($, window, document, undefined){
	window.app.comps.tabs = {
		name: 'tabs',
		description: 'description',
		config:{
			hashPrefix: 'vc_',
		},
		init:function(){
			// Contains the initialization code
			var guid = null,
					self = this,
					cf = this.config;

			$('[data-tab]').each(function (e) {
				$(this).children('li').each(function(el) {
				var $this = $(this);


					//skip if the li is not for tab js-tab feature
					//the li must have a no-js-tab class for this to work
					if ($this.hasClass('no-js-tab')) {return true;}

					if (!$this.hasClass('active')) {
						$($this.children('a').attr('href')).addClass('hide');
					}
					// self.log('jhh');
					$this.click(function(e) {
						e.preventDefault();
						if (!$(this).hasClass('active')) {
							var self = this,
									// elid = $(self).attr('data-guid');
									actv = $(self).parent('[data-tab]').children('li.active'),
									curTarget = $(self).children('a').attr('href').replace('#','');

							$(actv).removeClass('active');
							$($(actv).children('a').attr('href')).addClass('hide');
							if ($('[data-header='+$($(actv).children('a').attr('href')).attr('data-footer')+']')) {
								$('[data-header='+$($(actv).children('a').attr('href')).attr('data-footer')+']').addClass('hide');
							}

							$(self).addClass('active');
							$($(self).children('a').attr('href')).removeClass('hide');
							if ($('[data-header='+$($(self).children('a').attr('href')).attr('data-footer')+']')) {
								$('[data-header='+$($(self).children('a').attr('href')).attr('data-footer')+']').removeClass('hide');
							}

							// var el = '#' + cf.hashPrefix + curTarget;
							// var id = el.id;
							// el.removeAttr('id');
							// location.hash = '#' + cf.hashPrefix + curTarget;
							// el.attr('id',id);

							// if(history.replaceState) {
							// history.replaceState(null, null, '#' + cf.hashPrefix + curTarget);
							// } else {
							// location.hash = '#' + cf.hashPrefix + curTarget;
							// }

							// window.scrollTo(0,document.body.scrollHeight);
							// window.location.hash ='#' + cf.hashPrefix + curTarget + '_top';
							// if(history.pushState) {
							// 	history.pushState(null, null, '#' + cf.hashPrefix + curTarget);
							// }
							// else {
							// 	location.hash = '#' + cf.hashPrefix + curTarget;
							// }
							// change the hash to trigger the hash change event

							// $(window).on('hashchange', function(){
							// 		// Your code goes here
							// 		$(window).scrollIntoView();
							// 		if(history.pushState) {
							// 		history.pushState(null, null, '#' + cf.hashPrefix + curTarget);
							// 	}
							// 	else {
							// 		location.hash = '#' + cf.hashPrefix + curTarget;
							// 	}
							// }).trigger('hashchange');
							// if (/#vc_/.test(window.location.href))  {
							// 	$('html, body').animate({
							// 		scrollTop: $('.bd-main-nav-wrapper').offset().top
							// 	}, 1000);

							// }
							if(history.pushState) {
								history.pushState(null, null, '#' + cf.hashPrefix + curTarget);
							}
							else {
								location.hash = '#' + cf.hashPrefix + curTarget;
							}


							$(window).trigger('hashchange');


						}
					});
				});
			});

			this.events();
		},
		/*guid:function () {
			var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
					LEN   = 10,
					result = '';
	    for (var i = LEN; i > 0; --i){
	    	result += CHARS[Math.round(Math.random() * (CHARS.length - 1))];
	    }
	    return result;
		},*/

		events:function(){
			// Contains the event bindings and subscriptions

			var self = this,
					cf = this.config;

			// quickfix: use hashchange event to display the relevant tab
			self.subscribe('vc:hashChange', function(e, data){
				self.log(data);
				var hash = data.hash.replace(cf.hashPrefix, '');
				var curTab = $('[data-tab] li a[href=#' + hash +']');
				var curActiveTab = $('[data-tab] li.active a[href=#' + hash +']');

				if(curTab.length){
					if(!curActiveTab.length){
						var actv = curTab.closest('[data-tab]').children('li.active');
						var curLi = curTab.parent('li');

						$(actv).removeClass('active');
						self.log(curTab);
						self.log(actv);
						$($(actv).children('a').attr('href')).addClass('hide');

						if ($('[data-header='+$($(actv).children('a').attr('href')).attr('data-footer')+']')) {
							$('[data-header='+$($(actv).children('a').attr('href')).attr('data-footer')+']').addClass('hide');
						}
						// self.log('ggg');
						$(curLi).addClass('active');
						$($(curLi).children('a').attr('href')).removeClass('hide');
						if ($('[data-header='+$($(curLi).children('a').attr('href')).attr('data-footer')+']')) {
							$('[data-header='+$($(curLi).children('a').attr('href')).attr('data-footer')+']').removeClass('hide');
						}
					}
				}

				if($('.business-details-wrapper').length) {
					if (/section/.test(window.location.href))  {
						$('html, body').animate({
							scrollTop: $('.bd-main-actions-wrapper').offset().top
						}, 1000);
					}
				}

			});
		}
	};
}(jQuery, window, document));

/**
	modal - script for the behaviour of modal boxes

	Usage: 'How to use component'
	Options:
		Option_name - Option_description
			Values: Possible_option_values
	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.modal = {
		config: {
			modal:{
				imgBgClass: 'image-bg',
				animationClass: 'fade',
				modalOpenClass: 'open',
				modalOpenAnchorClass: 'open-anchor',
				modalWrapperClass: 'modal-container',
				overlayClass: 'modal-overlay',
				oldOverlayClass: 'reveal-modal-bg',
				closeButtonClass: 'modal-close',
				closeButtonClassOld: 'close-reveal-modal',
				blurContainerClass: 'modal-blur',
				blurContainerSelector: '.wrapper',
				currentClass: 'current',
				hideClass: 'hide',
				modalBodyOpen: 'modal-noscroll',
				modalTop: 80,
				modals: {}
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.modal;

			opts.$modalTrigger = $('[' + this.attr_name('modal') + ']');
			// opts.$overlay = $('<div>').addClass(opts.overlayClass).addClass(opts.hideClass);
			// opts.$modalWrapper = $('<div>').addClass(opts.modalWrapperClass).addClass(opts.hideClass);
			// opts.$closeButton = $('<a href="#">&times;</a>').addClass(opts.closeButtonClass);
			// opts.$closeButton.appendTo(opts.$modalWrapper);
			opts.$blurContainer = $(opts.blurContainerSelector);
			opts.openModals = [];

			opts.$modalTrigger.each(function(){
				var modalID = $(this).attr(self.attr_name('modal')),
						$curModal = $('[' + self.attr_name('modal-id') + '="' + modalID + '"]');

				opts.modals[modalID] = {
					$modal: $curModal,
					$originalParent: $curModal.parent(),
					$modalTrigger: $(this),
					$overlay: $('<div>').addClass(opts.overlayClass).addClass(opts.hideClass).data('modal-id', modalID),
					$modalWrapper: $('<div>').addClass(opts.modalWrapperClass).addClass(opts.hideClass).data('modal-id', modalID),
					$closeButton: $('<a href="#">&times;</a>').addClass(opts.closeButtonClass).data('modal-id', modalID),
				};

				opts.modals[modalID].$closeButton.appendTo(opts.modals[modalID].$modalWrapper);

				$('body').append(opts.modals[modalID].$modalWrapper);
				$('body').append(opts.modals[modalID].$overlay);
			});

			// $('body').append(opts.$modalWrapper);
			// $('body').append(opts.$overlay);

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = self.config,
					opts = cf.modal;

			opts.$modalTrigger.off('click.vc.modal').on('click.vc.modal', function(e){
				var modalID = $(this).attr(self.attr_name('modal'));
				$('body').addClass(opts.modalBodyOpen);
				// self.log($('[' + self.attr_name('modal-id') + '="' + modalBox + '"]'));
				// var $curModal = $('[' + self.attr_name('modal-id') + '="' + modalBox + '"]');

				// PATCH: Backward compatibility with previous implementation using foundation's reveal
				if($('#' + modalID).length && $('#' + modalID)[0].hasAttribute('data-reveal')){
					$('#' + modalID).foundation('reveal', 'open');
				}
				else{
					self.openModal(modalID);
				}
				return false;
			});

			// opts.$overlay.off('click.vc.modal').on('click.vc.modal', function(e){
			// 	self.closeModal();
			// });
			// $(document).keypress(function(e) {
			// 	if (e.keyCode == 27) {
			// 		$('body').removeClass(opts.modalBodyOpen);
			// 			// window.close();
			// 	}
			// });

			// $(document).on('keyup',function(evt) {
			// 	if (evt.keyCode == 27) {
			// 		location.href="#close";
			// 	}
			// });

			$('body').off('click.vc.modal', '.' + opts.overlayClass).on('click.vc.modal', '.' + opts.overlayClass, function(e){
				self.closeModal($(this).data('modal-id'));
				$('body').removeClass(opts.modalBodyOpen);
				self.log($(this).data('modal-id'));
			});

			$('body').off('click.vc.modal', '.' + opts.oldOverlayClass).on('click.vc.modal', '.' + opts.oldOverlayClass, function(e){
				// self.closeModal($(this).data('modal-id'));
				$('body').removeClass(opts.modalBodyOpen);
				// self.log($(this).data('modal-id'));
			});

			$('body').off('click.vc.modal', '.' + opts.closeButtonClass).on('click.vc.modal', '.' + opts.closeButtonClass, function(e){
				e.preventDefault();
				self.closeModal($(this).data('modal-id'));
				$('body').removeClass(opts.modalBodyOpen);
				self.log($(this).data('modal-id'));
			});

			$('body').off('click.vc.modal', '.' + opts.closeButtonClassOld).on('click.vc.modal', '.' + opts.closeButtonClassOld, function(e){
				e.preventDefault();
				// self.closeModal($(this).data('modal-id'));
				$('body').removeClass(opts.modalBodyOpen);
				// self.log($(this).data('modal-id'));
			});
			// opts.$closeButton.off('click.vc.modal').on('click.vc.modal', function(e){
			// 	e.preventDefault();
			// 	self.closeModal();
			// });

			$('body').off('keyup.vc.modal').on('keyup.vc.modal', function(e){
				if(e.which == 27){
					// ESC key pressed
					if(opts.openModals.length)self.closeModal(opts.openModals[opts.openModals.length - 1]);
					$('body').removeClass(opts.modalBodyOpen);
					if($('.reveal-modal.open').length){
						$('body').removeClass(opts.modalBodyOpen);
					}

				}
			});

			self.subscribe('vc:modal/open', function(data){
				self.openModal(data.modal);
			});

			self.subscribe('vc:modal/close', function(data){
				self.closeModal(data.modal);
			});
		},
		openModal:function(curModal){
			var self = this,
					cf = self.config,
					opts = cf.modal;

			var $curModal = (typeof curModal == 'string')? $('[' + self.attr_name('modal-id') + '="' + curModal + '"]') : curModal;

			var modalID = $curModal.attr(self.attr_name('modal-id'));
			// If the modal is already open, don't do anything
			for (var i = opts.openModals.length - 1; i >= 0; i--) {
				if(opts.openModals[i] == modalID)return false;
			}

			// var $modalParent = $curModal.parent();
			// $curModal.detach().data('modal-parent', $modalParent).appendTo(opts.$modalWrapper);

			$curModal.detach().appendTo(opts.modals[modalID].$modalWrapper);
			// self.log($modalParent);
			opts.modals[modalID].$modalWrapper.addClass(opts.animationClass).removeClass(opts.hideClass);
			opts.modals[modalID].$overlay.addClass(opts.animationClass).removeClass(opts.hideClass);

			// force the browser to recalculate and recognize the elements.
			// This is so that CSS animation has a start point
			opts.modals[modalID].$modalWrapper.height();

			// DISABLED: REASON: Making modal always fixed on the screen, even if the user scrolls
			// // If the modal height is bigger than the current screen height,
			// // then just drop it
			// if(opts.modals[modalID].$modalWrapper.height() + opts.modalTop > $(window).height()){
			// 	opts.modals[modalID].$modalWrapper.addClass(opts.modalOpenAnchorClass);
			// }
			// // Else set it's top to position it on the page properly
			// else{
			// 	opts.modals[modalID].$modalWrapper.css('top', $(window).scrollTop() + opts.modalTop + 'px');
			// }

			opts.modals[modalID].$modalWrapper.addClass(opts.modalOpenAnchorClass);

			opts.openModals.push(modalID);

			self.setCurrentModal(modalID);

			opts.modals[modalID].$modalWrapper.addClass(opts.modalOpenClass);
			opts.modals[modalID].$overlay.addClass(opts.modalOpenClass);

			// opts.$blurContainer.addClass(opts.blurContainerClass);
		},
		closeModal:function(curModal){
			var self = this,
					cf = self.config,
					opts = cf.modal;
			var i;


			var $curModal = (typeof curModal == 'string')? $('[' + self.attr_name('modal-id') + '="' + curModal + '"]') : curModal;
			var modalID = $curModal && $curModal.attr(self.attr_name('modal-id'));

			if($curModal && $curModal.length){
				// PATCH: Backward compatibility with foundation's reveal modals
				if(!modalID && $curModal[0].hasAttribute('data-reveal')){
					$curModal.foundation('reveal', 'close');
					return true;
				}

				self._close(modalID);

				// Remove modal from openModals collection
				for (i = opts.openModals.length - 1; i >= 0; i--) {
					if(opts.openModals[i] == modalID)opts.openModals.splice(i, 1);
				}

				// Set current on the last modal in the array
				if(opts.openModals.length)self.setCurrentModal(opts.openModals[opts.openModals.length - 1]);
			}
			else{
				for (i = opts.openModals.length - 1; i >= 0; i--) {
					self._close(opts.openModals[i]);
				}

				// Empty openModals collection
				opts.openModals = [];
			}
			$('body').removeClass(opts.modalBodyOpen);
		},
		_close:function(curModal){
			var self = this,
					cf = self.config,
					opts = cf.modal;

			var modalID = curModal;

			opts.modals[modalID].$overlay.removeClass(opts.modalOpenClass);
			opts.modals[modalID].$modalWrapper.removeClass(opts.modalOpenClass);
			opts.modals[modalID].$modalWrapper.removeClass(opts.modalOpenAnchorClass);
			opts.modals[modalID].$modalWrapper.css('top', '');
			self.log('trans', self.transitionEnd);
			opts.modals[modalID].$overlay.off(self.transitionEnd).on(self.transitionEnd, function(){
				var $this = $(this);

				$this.off(self.transitionEnd);
				$this.addClass(opts.hideClass);
			});
				// opts.$overlay.addClass(opts.hideClass);

			opts.modals[modalID].$modalWrapper.off(self.transitionEnd).on(self.transitionEnd, function(){
				var $this = $(this);

				$this.off(self.transitionEnd);
				// for(var modalID in opts.modals){
				// 	if(opts.modals.hasOwnProperty(modalID)){
				// 		opts.modals[modalID].$modal.detach().appendTo(opts.modals[modalID].$originalParent);
				// 	}
				// }
				// Attach back to parent
				// if($curModal.data('modal-parent'))$curModal.detach().appendTo($curModal.data('modal-parent'));
				opts.modals[modalID].$modal.detach().appendTo(opts.modals[modalID].$originalParent);
				$this.addClass(opts.hideClass);
				self.log($this);
			});
				// opts.$modalWrapper.addClass(opts.hideClass);


			// opts.$blurContainer.removeClass(opts.blurContainerClass);
		},
		setCurrentModal:function(modalID){
			var self = this,
					cf = self.config,
					opts = cf.modal;

			// Remove any "current" class in all modals
			$('.' + opts.overlayClass).removeClass(opts.currentClass);
			$('.' + opts.modalWrapperClass).removeClass(opts.currentClass);

			opts.modals[modalID].$modalWrapper.addClass(opts.currentClass);
			opts.modals[modalID].$overlay.addClass(opts.currentClass);
		}
	};
}(jQuery, window, document));

;(function($, window, document, undefined){
	window.app.comps.geolocation = {
		name: 'geolocation',
		description: 'description',
		config:{
			geolocation:{
				cookieKey: 'vc',
			}
		},
		utils: {
			getLocation: function () {
				var self = this,
						cf = this.config,
						opts = cf.geolocation;
				return (self.getCookie(opts.cookieKey + '_getLoc') != "false") ? {
						lat: self.getCookie(opts.cookieKey + '_lat'),
						log: self.getCookie(opts.cookieKey + '_log'),
						neighborhood: self.getCookie(opts.cookieKey + '_neighborhood'),
						colloquial_area: self.getCookie(opts.cookieKey + '_colloquial_area'),
						sublocality: self.getCookie(opts.cookieKey + '_sublocality')
					} : false;
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.geolocation;

			if ("geolocation" in navigator) {

				self.publish("vc:geolocation/enabled");

				var geo_options = {
					enableHighAccuracy: false,
					maximumAge        : 30000,
					timeout           : 27000
				};
				navigator.geolocation.getCurrentPosition(function(pos){
					self.success(pos, self);
				}, this.error, geo_options);
			}else{
				console.warn('ERROR(GL001): Unable to access geolocation');
				self.createCookie(opts.cookieKey + "_getLoc", "false");
			}
			this.events();
		},
		success: function (position, app) {
			var self = app,
					cf = self.config,
					opts = cf.geolocation,
				loc_coords = position.coords,
				latitude   = loc_coords.latitude,
				longitude  = loc_coords.longitude,
				locationData = {},
				accuracy   = loc_coords.accuracy;

			$.ajax({
				url:"//maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&sensor=true",
				success:function(result){
					if (result.status === "OK") {
						// $.each(result.results, function(i){
							// self.createCookie(opts.cookieKey + '_'+this.types[0],this.formatted_address, 1/4);
							//self.locationData.(opts.cookieKey + '_'+this.types[0]) = this.formatted_address
							// if($.inArray('locality', this.types) > -1){
							// 	self.createCookie(opts.cookieKey + '_state',this.formatted_address, 1/4);
							// 	// self.log('i am', this);
							// }
						// });
						var mac = '';
						$.each(result.results[0].address_components, function(){
							if(self.anyMatch(['administrative_area_level_1', 'administrative_area_level_2', 'locality'], this.types)){
								if(!mac)mac = {name: this.long_name, type: this.types};
								// self.log('::::::::::::::::UNIQ:MAC: ', this.long_name, this.types);
							}
							// self.log('MAC: ', this.long_name, this.types);
						});
						self.log('Final state detected::', mac);
						self.createCookie(opts.cookieKey + '_state', mac.name, 1/4);
						// locality, administrative_area_level_2
						// self.log()
					}else{
						console.warn(result.status);
						self.createCookie(opts.cookieKey + "_getLoc","false");
					}
				}
			});

			self.createCookie(opts.cookieKey + "_lat",latitude, 1/4);
			self.createCookie(opts.cookieKey + "_log",longitude, 1/4);
			self.createCookie(opts.cookieKey + "_accuracy",accuracy, 1/4);
			self.publish("vc:geolocation/current-location");

		},

		error: function (error, app) {

			console.warn('ERROR(' + error.code + '): ' + error.message);
		},
		events:function(){
			// Contains the event bindings and subscriptions
		},
		anyMatch:function(arr1, arr2){
			for(var i = 0, iLen = arr1.length; i < iLen; i++){
				for(var j = 0, jLen = arr2.length; j < jLen; j++){
					if(arr1[i] == arr2[j])return true;
				}
			}
			return false;
		}

	};
}(jQuery, window, document));

/**
	productlist - logic for the product list/tag component

*/

;(function($, window, document, undefined){
	window.app.comps.productlist = {
		config:{
			$productsList: $('.products-list'),
			$viewProducts: $('.view-products'),
			majorLength: 20
		},
		init:function(){
			// Contains the initialization code
			// ...
			var cf = this.config;
			var validProductsList = cf.$productsList.filter(function(index, elem){
				return $(elem).children('li').length > cf.majorLength;
			});
			$('<a href="#">Show all</a>').addClass('view-products hover-underline').appendTo(validProductsList);
			cf.$viewProducts = $(cf.$viewProducts.selector);

			validProductsList.addClass('show-few').each(function(index, elem){
				$(elem).children('li').slice(0,cf.majorLength).addClass('major');
				// self.log(elem);
			});
			this.events();
		},
		events:function(){
			var self = this,
					cf = this.config;
			// Contains the event bindings and subscriptions
			cf.$viewProducts.on('click', function(e){
				// toggle class to show all
				e.preventDefault();
				var $curList = $(this).closest(cf.$productsList);
				$curList.toggleClass('show-few');
				if($curList.hasClass('show-few')){
					$curList.find(cf.$viewProducts).html('Show all');
				}
				else{
					$curList.find(cf.$viewProducts).html('Show less');
				}
			});

			cf.$productsList.find('a').on('click', function(e){
				// e.preventDefault();
				// self.publish('vc:productlist/select', this);
			});
		}
	};
}(jQuery, window, document));

/* global Pikaday */

/**
	Datepicker - Responsible for the datepicker logic

	Usage: Add 'data-vc-datepicker' attribute to the element
	Options:
		'data-vc-mindate' - Specifies the minimum date of the datepicker
			Values: 'today' or a specific date with the YYYY-MM-DD format
		'data-vc-yearrange' - Specifies the number of years the datepicker should span
			Values: '[2010,2015]' (specifies the year range in an array) or '[200]' (specifies the number of years)
		'data-vc-setminfor' - Specifies the selector of the picker to apply minimum date on
			Values: Any valid selector on an element eg. '.item', '#item'
		'data-vc-setmaxfor' - Specifies the selector of the picker to apply maximum date on
			Values: Any valid selector on an element eg. '.item', '#item'

	Example:
		<input type="text" data-vc-datepicker data-vc-mindate="1920-09-12" data-vc-yearrange="[120]">
*/

;(function($, window, document, undefined){
	window.app.comps.datepicker = {
		config: {
			pickers:[]
		},
		init:function(){
			// Contains the initialization code
			var cf = this.config,
				self = this;
				// self.log('ahoy!');
			//Handles datepicker
			if($('[' + self.attr_name('datepicker') + '], .datepicker').length){
				this.require('pikaday', function(){
					return typeof Pikaday !== 'undefined';
				}, function(){
					// Formerly $('.datepicker')
					$('[' + self.attr_name('datepicker') + '], .datepicker').each(function(index, elem){
						// Each instance of the plugin can be customized with data attributes on the elements

					// self.log('in date');
						// data-vc-mindate
						// today - Specifies the current date
						// YYYY-MM-DD - The specific date
						var isSettings = $('[' + self.attr_name('user-settings') + ']');
						var _minDate = $(elem).attr(self.attr_name('mindate'));
						if(!_minDate)_minDate = new Date('1890-01-01');
						else if(_minDate == 'today')_minDate = new Date();
						else _minDate = new Date(_minDate);

						
						var _maxDate = $(elem).attr(self.attr_name('maxdate'));
						if(!_maxDate)_maxDate = new Date('2050-12-31');
						else if(_maxDate == 'today')_maxDate = new Date();
						else _maxDate = new Date(_maxDate);


						if(isSettings.length){
							var currentDate = new Date(),
									earliestYear = currentDate.getFullYear() - 12,
									earliestMonth = currentDate.getMonth() + 1,
									earliestDay = currentDate.getDay() + 1,

									oldestYear = currentDate.getFullYear() - 100,
									oldestMonth = currentDate.getMonth() + 1,
									oldestDay = currentDate.getDay() + 1;



							_maxDate = new Date( earliestYear+'-'+earliestMonth+'-'+earliestDay);
							_minDate = new Date( oldestYear+'-'+oldestMonth+'-'+oldestDay);
						}


						// data-vc-yearrange
						// [2010,2015] - Specifies the year range in an array
						// [200] - Specifies the number of years
						var _yearRange = ($(elem).attr(self.attr_name('yearrange')))? JSON.parse($(elem).attr(self.attr_name('yearrange'))) : [1890,2050];

						var _setMinFor = $(elem).attr(self.attr_name('setminfor'));
						var _setMaxFor = $(elem).attr(self.attr_name('setmaxfor'));

						cf.pickers.push({
							element:elem,
							picker: new Pikaday({
								field: $(elem)[0],
								format: 'YYYY-MM-DD',
								firstDay: 1,
								minDate: _minDate,
								maxDate: _maxDate,
								yearRange: _yearRange,
								onSelect: function(){
									var curPicker;
									// self.log(this.getDate());
									// cf.pickers[0].picker.setMinDate(this.getDate());
									if(_setMinFor){
										curPicker = self.getPikaday(_setMinFor);
										self.log(_setMinFor);
										if(curPicker){
											curPicker.setMinDate(this.getDate());
											// curPicker.setDate(null);
											//self.log(curPicker);

										}
									}
									if(_setMaxFor){
										curPicker = self.getPikaday(_setMaxFor);
										if(curPicker){
											curPicker.setMaxDate(this.getDate());
										}
									}
								}
							})
						});
					});
					// cf.picker = new Pikaday({
					// 	field: $('.datepicker')[0],
					// 	format: 'YYYY-MM-DD',
					// 	firstDay: 1,
					// 	minDate: new Date('1890-01-01'),
					// 	maxDate: new Date(),
					// 	yearRange: [100]
					// });

				});

			}
			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
		},
		/**
		 * Gets the picker associated with the element associated with the provided selector
		 * @param  {string} selector String selector to identify the element
		 * @return {picker}          The matched picker object
		 */
		getPikaday:function(selector){
			var cf = this.config,
				self = this;
			for (var i = cf.pickers.length - 1; i >= 0; i--) {
				if($(cf.pickers[i].element).is(selector)){
					return cf.pickers[i].picker;
				}
			}
			return false;
		}
	};
}(jQuery, window, document));

/* global wNumb */
/**
	owl carousel - Handles the slider component

	element => [data-vc-owlcarousel] include this in your html
	options => [
		data-vc-nav => "true", "false"
		data-vc-stage => "0", "1" ...
		data-vc-loop => "true", "false"
		data-vc-autoplay => "true", "false"
	]

*/

;(function($, window, document, undefined){
	window.app.comps.owlcarousel = {
		config: {
		},
		init:function(){
			// Contains the initialization code
			var self 	= this,
					cf 		= this.config;
			cf.$els 	=  $('[' + self.attr_name('owlcarousel') + ']');
			self.log('in owl');
			if(cf.$els.length) {
				this.require('owlcarousel', function(){
					return (jQuery().owlCarousel);
				}, function() {
					self.log('after calling owl');
					cf.$els.each(function(index, elem){
						var $el = $(elem); //the current element

						// Set default options
						var carouselOptions = {
							loop:true,
							autoplay: false,
							autoplaySpeed: false,
							autoplayTimeout: 5000,
							stagePadding: 75,
							nav:true,
							items: 6,
							dots: false
						};

						if(typeof($el.attr(self.attr_name('nav'))) !== 'undefined'){
							if($el.attr(self.attr_name('nav')) == 'false')carouselOptions.nav = false;
							else carouselOptions.nav = true;
						}

						if(typeof($el.attr(self.attr_name('loop'))) !== 'undefined'){
							if($el.attr(self.attr_name('loop')) == 'false')carouselOptions.loop = false;
							else carouselOptions.loop = true;
						}

						if(typeof($el.attr(self.attr_name('autoplay'))) !== 'undefined'){
							if($el.attr(self.attr_name('autoplay')) == 'false')carouselOptions.autoplay = false;
							else carouselOptions.autoplay = true;
						}

						if(typeof($el.attr(self.attr_name('dots'))) !== 'undefined'){
							if($el.attr(self.attr_name('dots')) == 'false')carouselOptions.dots = false;
							else carouselOptions.dots = true;
						}

						if(typeof($el.attr(self.attr_name('autoplayspeed'))) !== 'undefined'){
							if($el.attr(self.attr_name('autoplayspeed')) == 'false')carouselOptions.autoplaySpeed = false;
							else carouselOptions.autoplaySpeed = true;
						}

						if($el.attr(self.attr_name('stage'))){
							carouselOptions.stagePadding = +$el.attr(self.attr_name('stage'));
						}

						if($el.attr(self.attr_name('itemno'))){
							carouselOptions.items = +$el.attr(self.attr_name('itemno'));
						}

						if($el.attr(self.attr_name('autoplaytimeout'))){
							carouselOptions.autoplayTimeout = +$el.attr(self.attr_name('autoplaytimeout'));
						}


						$el.owlCarousel(carouselOptions);

					});
				});
			}

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
		}
	};
}(jQuery, window, document));

/**
	select - Handles the behavior of the select dropdown element

	element => [data-vc-select]
	options => [
		data-vc-items => "1, 2, 3, 4, 5" //Specifies the intial selected values
		data-vc-options => "1, 2, 3, 4, 5" || nameOfPredefinedOptions //Specifies the available options
		data-vc-remote => urlOfRemoteSource?q={QUERY} //Specifies the URL for the remote source of the options
			- returns an array of objects with text and value properties
		data-vc-preload => true || false || focus //Specifies when the load function is to be called
	]

*/

;(function($, window, document, undefined){
	window.app.comps.select = {
		config:{
			select:{
				queryHolder: '{QUERY}',
				options: {
					openingHours: [
						'12:00AM',
						'12:30AM',
						'1:00AM',
						'1:30AM',
						'2:00AM',
						'2:30AM',
						'3:00AM',
						'3:30AM',
						'4:00AM',
						'4:30AM',
						'5:00AM',
						'5:30AM',
						'6:00AM',
						'6:30AM',
						'7:00AM',
						'7:30AM',
						'8:00AM',
						'8:30AM',
						'9:00AM',
						'9:30AM',
						'10:00AM',
						'10:30AM',
						'11:00AM',
						'11:30AM',
						'12:00PM',
						'12:30PM',
						'1:00PM',
						'1:30PM',
						'2:00PM',
						'2:30PM',
						'3:00PM',
						'3:30PM',
						'4:00PM',
						'4:30PM',
						'5:00PM',
						'5:30PM',
						'6:00PM',
						'6:30PM',
						'7:00PM',
						'7:30PM',
						'8:00PM',
						'8:30PM',
						'9:00PM',
						'9:30PM',
						'10:00PM',
						'10:30PM',
						'11:00PM',
						'11:30PM',
						'Closed'
					]
				}
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config;

					var els = $('[' + self.attr_name('select') + ']');

			if(els.length){
				this.require('selectize', function(){
					return (jQuery().selectize);
				}, function(){

					els.each(function(index, elem){
						var $el = $(elem), //the current element
								loadFn = null, //holds the load function
								remoteUrl = null, //holds the specified remoteUrl used for the load function
								options = null, //holds the specified options array
								items = null; //holds the specified items array

						// Set default options
						var selectOptions = {
							plugins: ['remove_button'],
							delimiter: ',',
							persist: false,
							create: false,
							valueField: 'value',
							labelField: 'text',
							preload: true
						};

						// If the remote attribute is set, then set the loadFn else set it to null
						loadFn = (remoteUrl = $el.attr(self.attr_name('remote')) || null) ? function(query, callback) {
							// if (!query.length) return callback();
							self.log('Select component: query=',query);
							$.ajax({
								url: remoteUrl.replace(cf.select.queryHolder, encodeURIComponent(query)),
								type: 'GET',
								error: function() {
									callback();
								},
								success: function(res) {
									callback(res);
								}
							});
						} : null;

						// Set load option if available
						if(loadFn)selectOptions.load = loadFn;

						// Set items option if available
						var elItems = $el.attr(self.attr_name('items'));
						if(elItems){
							items = elItems.split(',');
						}

						if(items)selectOptions.items = items;

						var elOptions = $el.attr(self.attr_name('options'));
						if(elOptions){
							// if options points to a predefined options object
							if(cf.select.options[elOptions]){
								options = cf.select.options[elOptions].map(function(item){
									return {
										text: item,
										value: item
									};
								});
							}
							// if options contains a comma-seperated list of options
							else{
								options = elOptions.split(',').map(function(item){
									return {
										text: item,
										value: item
									};
								});
							}
						}

						// Set element options if available
						if(options)selectOptions.options = options;

						// options: [{text: '1', value: '1'},{text: '2', value: '2'},{text: '3', value: '3'}]

						// Set preload option if available
						// if($el.attr(self.attr_name('preload'))){
						// 	selectOptions.preload = $el.attr(self.attr_name('preload'));
						// }

						// self.log($el, 'selectized.');
						$el.selectize(selectOptions);
					});
				});
			}

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
		}
	};
}(jQuery, window, document));

/* global Bloodhound */

/**
	sitesearch - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/


;(function($, window, document, undefined){
	window.app.comps.sitesearch = {
		config: {
			nTermsCategoryURL: '/terms-cat.json?%QUERY',
			scriptURLs: {
				ntypeahead: '/js/vendor/typeahead/typeahead.bundle.min.js'
			},
			sitesearch: {
				qsearchPattern: 'qsearch?sq=%SEARCH_TERM%&sl=%SEARCH_LOCATION%',
				isearchPattern: 'isearch?sq=%SEARCH_TERM%',
				popularSearchesTermList: ['Restaurants', 'Schools', 'Spas', 'Nightlife', 'Hotels'],
				popularSearchesLocationList: ['Current Location', 'Lagos', 'Rivers', 'Abuja', 'Kano', 'Kaduna'],
				recentSearchesTermLocalStorageKey: 'vc:nsearchterm:recent',
				recentSearchesLocationLocalStorageKey: 'vc:nsearchlocation:recent',
				recentSearchesMax: 5,
				defaultSearchTimeout: 2000,
				searchLocation: 'lagos',
				nLocationURL: '../HomeWEB/LocationAutoComplete?term=%QUERY',
				nKeywordsURL: '../HomeWEB/KeywordAutoComplete?term=%QUERY',
				destChoiceURL: '/SearchListWEB/DecideSearchPage?sq=%SEARCH_TERM%&sl=%SEARCH_LOCATION%&title=%SEARCH_TITLE%',
				limits: {
					recentSearches: 5,
					popularSearches: 5,
					myMain: Infinity, // 7,
					relatedProducts: Infinity, // 2
				}
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.sitesearch;

			self.log('destChoiceURL:', opts.destChoiceURL);

			opts.$container = $('[' + self.attr_name('search') + ']');
			opts.$containerTerm = $('[' + self.attr_name('search-term') + ']');
			opts.$containerLocation = $('[' + self.attr_name('search-location') + ']');
			// opts.$searchBtn = $('[' + self.attr_name('searchterm-btn') + ']');
			// opts.$searchLocation = $('[' + self.attr_name('location') + ']');
			// opts.$choiceDropdown = $('[' + self.attr_name('searchterm-choice') + ']');

			if(!opts.$container.length)return false;
			// if(!opts.$containerTerm.length)return false;
			// if(!opts.$containerLocation.length)return false;

			this.require('ntypeahead', function(){
				return (jQuery().typeahead);
			}, function(){
				opts.popularSearchesTermList = opts.popularSearchesTermList.map(function(val){
					return {
						content: val,
						which: 'isearch',
						urlType: 'autocomplete_popular'
					};
				});

				opts.recentSearches = function(q, sync){
					if(q === ''){
						sync(self.getRecentSearches(opts.recentSearchesTermLocalStorageKey));
					}
				};

				opts.popularSearches = function(q, sync){
					if(q === ''){
						sync(opts.popularSearchesTermList);
					}
				};

				opts._myMain = function(q, sync, async){
					if(q !== ''){
						opts.myMain.search(q, sync, async);
					}
				};
				opts.myMain = new Bloodhound({
					datumTokenizer: function(d){ return Bloodhound.tokenizers.whitespace(d.label); },
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					remote: {
						url: opts.nKeywordsURL,
						wildcard: '%QUERY',
						transform: function(response){
							return response.main || [];
						}
					}
				});

				opts._relatedProducts = function(q, sync, async){
					if(q !== ''){
						opts.relatedProducts.search(q, sync, async);
					}
				};
				opts.relatedProducts = new Bloodhound({
					datumTokenizer: function(d){ return Bloodhound.tokenizers.whitespace(d.label); },
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					remote: {
						url: opts.nKeywordsURL,
						wildcard: '%QUERY',
						transform: function(response){
							return response.related || [];
						}
					}
				});

				opts._suggestionSet = function(q, sync, async){
					if(q !== ''){
						opts.suggestionSet.search(q, sync, async);
					}
				};
				opts.suggestionSet = new Bloodhound({
					datumTokenizer: function(d){ return Bloodhound.tokenizers.whitespace(d.label); },
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					remote: {
						url: opts.nKeywordsURL,
						wildcard: '%QUERY',
						transform: function(response){
							return response.suggestions || [];
						}
					}
				});

				opts.deviceType = opts.$containerTerm.attr(self.attr_name('device'));
				if(opts.deviceType == 'mobile'){
					opts.limits.recentSearches = 4;
					opts.limits.popularSearches = 3;
					// opts.limits.myMain = 4;
				}

				opts.$containerTerm.typeahead({
					minLength: 0,
					highlight: true
				}, {
					name: 'popularSearches',
					source: opts.popularSearches,
					display: 'content',
					limit: opts.limits.popularSearches,
					templates: {
						header: '<div class="clearfix"><span class="autocomplete-subtle-header right">Popular Searches</span></div>'
					}
				}, {
					name: 'recentSearches',
					source: opts.recentSearches,
					display: 'content',
					limit: opts.limits.recentSearches,
					templates: {
						header: '<div class="clearfix"><span class="autocomplete-subtle-header right">Recent Searches</span></div>'
					}
				}, {
					name: 'myMain',
					source: opts._myMain,
					display: 'content',
					limit: opts.limits.myMain,
					templates: {
						suggestion: function(data){ return '<div><div>' + data.content + '</div><div class="autocomplete-subtle-type">' + data.contenttypetext + '</div></div>'; }
					}
				}, {
					name: 'relatedProducts',
					source: opts._relatedProducts,
					display: 'content',
					limit: opts.limits.relatedProducts,
					templates: {
						header: function(data){ return '<div class="clearfix"><span class="autocomplete-subtle-header right">Related Products</span></div>'; },
						suggestion: function(data){ return '<div class="clearfix"><div class="autocomplete-item-image"><img src="' + data.image + '"></div><div class="autocomplete-item-name">' + data.content + '</div><div class="autocomplete-item-price">&#8358;' + data.price + '</div></div>'; },
						// footer: function(data){ return '<div><a href="http://www.google.com" class="autocomplete-more-products-link">View more products<i class="icon-angle-right"></i></a></div>'; }
					}
				}, {
					name: 'suggestionSet',
					source: opts._suggestionSet,
					// display: 'content',
					limit: opts.limits.myMain,
					templates: {
						header: function(data){ return '<div class="autocomplete-dym-header">Did you mean:</div>'; },
						// suggestion: function(data){ return '<div><div class="autocomplete-dym-suggestion">' + data.content + '</div></div>'; }
					}
				});

				opts.popularSearchesLocationList = opts.popularSearchesLocationList.map(function(val){
					return {
						content: val,
						which: 'isearch',
						urlType: 'autocomplete_popular'
					};
				});

				opts.recentLocationSearches = function(q, sync){
					if(q === ''){
						sync(self.getRecentSearches(opts.recentSearchesLocationLocalStorageKey));
					}
				};

				opts.popularLocationSearches = function(q, sync){
					if(q === ''){
						sync(opts.popularSearchesLocationList);
					}
				};

				opts._location = function(q, sync, async){
					if(q !== ''){
						opts.location.search(q, sync, async);
					}
				};

				opts.location = new Bloodhound({
					datumTokenizer: function(d){ return Bloodhound.tokenizers.whitespace(d.label); },
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					remote: {
						url: opts.nLocationURL,
						wildcard: '%QUERY',
						transform: function(response){
							return response.location || [];
						}
					}
				});


				opts.deviceLocationType = opts.$containerLocation.attr(self.attr_name('device'));
				if(opts.deviceLocationType == 'mobile'){
					opts.limits.recentSearches = 4;
					opts.limits.popularSearches = 3;
					// opts.limits.myMain = 4;
				}

				opts.$containerLocation.typeahead({
					minLength: 0,
					highlight: true
				}, {
					name: 'popularLocationSearches',
					source: opts.popularLocationSearches,
					display: 'content',
					limit: opts.limits.popularSearches,
					templates: {
						header: '<div class="clearfix"><span class="autocomplete-subtle-header right">Popular Locations</span></div>'
					}
				},{
					name: 'recentLocationSearches',
					source: opts.recentLocationSearches,
					display: 'content',
					limit: opts.limits.recentSearches,
					templates: {
						header: '<div class="clearfix"><span class="autocomplete-subtle-header right">Recent Searches</span></div>'
					}
				},{
					name: 'location',
					source: opts._location,
					display: 'label',
					limit: opts.limits.myMain,
					templates: {
						suggestion: function(data){ return '<div><div>' + data.label + '</div></div>'; }
					}
				});
				self.autocompleteData(opts.$containerLocation.val());
				self.events();

			});

			// clear searchterm if on homepage
			if ($('.homepage-wrapper').length) {
				opts.$containerTerm.val('');
			}

			// opts = self.reRootSiteURLs(opts,cf.siteRoot);
			// this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.sitesearch;

			opts.$container.closest('form').off('submit').on('submit', function(e){
				// e.preventDefault();
				self.startSearch(this);
				self.autocompleteData(this);
				return false;
			});

			opts.$containerTerm.off('keyup.vc.sitesearch').on('keyup.vc.sitesearch', function(e){
				if((e.keyCode ? e.keyCode : e.which) == 13)self.startSearch($(this).closest(opts.$container));
				// self.autocompleteData(this);
			});

			opts.$containerLocation.off('keyup.vc.sitesearch').on('keyup.vc.sitesearch', function(e){
				if((e.keyCode ? e.keyCode : e.which) == 13)self.startSearch($(this).closest(opts.$container));
			});

			opts.$containerLocation.off('blur.vc.sitesearch').on('blur.vc.sitesearch', function(e){
				var $el = $(this);

				self.log($el.val(), 'new location');
				self.autocompleteData($el.val());
			});

			// opts.$searchBtn.off('click.vc.sitesearch').on('click.vc.sitesearch', function(e){
			// 	self.startSearch();
			// });

			opts.$containerTerm.off('typeahead:select').on('typeahead:select', function(e, data){
				self.log(e, data);

				opts.$searchTerm = $(this).closest('form').find(opts.$containerTerm);
				opts.searchTerm = opts.$searchTerm.val();

				opts.curSearchterm = encodeURIComponent(opts.searchTerm);

				if(data.url){
					// Specify the selected item's URL as the URL to navigate to
					opts.destURL = data.url;
					// Specify the selected item's URL type as the URL type, else just specify 'autocomplete'
					opts.destURLType = data.urlType || 'autocomplete';
					self.goToPage();
				}
				// else self.startSearch($(this).closest(opts.$container), data);

			});
		},
		getRecentSearches:function(key){
			var self = this,
					cf = this.config,
					opts = cf.sitesearch;

			// If localStorage isn't supported, dont do anything
			if(!('localStorage' in window))return [];

			var strRecentSearches = localStorage.getItem(key);

			var recentSearches = [];
			if(strRecentSearches){
				recentSearches = JSON.parse(strRecentSearches);
			}
			return recentSearches;
		},
		addToRecent:function(valToAdd, key){
			var self = this,
					cf = this.config,
					opts = cf.sitesearch,
					i;

			// If localStorage isn't supported, dont do anything
			if(!('localStorage' in window))return [];

			var recentSearches = self.getRecentSearches();

			// Remove value from array if it exists before
			for (i = recentSearches.length - 1; i >= 0; i--) {
				if(recentSearches[i].url == valToAdd.url){
					recentSearches.splice(i, 1);
					break;
				}
			}
			if(recentSearches.length >= opts.recentSearchesMax){
				recentSearches.shift(); //remove the oldest item in the set
			}

			// Add the value to the array
			recentSearches.push(valToAdd);

			// Set the stringified value to the local storage
			localStorage.setItem(key, JSON.stringify(recentSearches));



		},
		startSearch:function(form, searchData) {
			var self = this,
					cf = this.config,
					opts = cf.sitesearch;

					var $form = $(form);
					opts.$searchLocation = $form.find(opts.$containerLocation);
					opts.searchLocation = opts.$searchLocation.val();
					opts.$searchTerm = $form.find(opts.$containerTerm);
					opts.searchTerm = opts.$searchTerm.val();

					opts.searchTitle = $form.attr(self.attr_name('title'));

					// If the user doesn't enter any terms, do nothing
					if(!opts.searchTerm.replace(/\s/g, ''))return false;

					// Encode the search term string
					opts.curSearchterm = encodeURIComponent(opts.searchTerm);

					// http://www.vconnect.com/qsearch?sq=gh&sl=lagos


				var whichURL = searchData && searchData.which;
				// Set the URL type for the current search
				opts.destURLType = (searchData && searchData.urlType) || 'autocomplete';

				// Set the default destination URL based on the value of whichURL
				if(whichURL == 'isearch'){
					opts.destURL = opts.isearchPattern.replace(/%SEARCH_TERM%/g, opts.curSearchterm);
				}
				else{
					opts.destURL = opts.qsearchPattern.replace(/%SEARCH_TERM%/g, opts.curSearchterm).replace(/%SEARCH_LOCATION%/, opts.searchLocation);
				}

			// window.location.protocol + "//" + window.location.host + "/" + opts.qsearchPattern.replace(/%SEARCH_TERM%/g, opts.curSearchterm).replace('%SEARCH_LOCATION%', opts.searchLocation);
			// If whichURL is specified, no need to check which page to go to, just go.
			// Since it has already been specified above
			if(whichURL){
				self.goToPage();
				return true;
			}

			// Check which URL to use
			$.getJSON(opts.destChoiceURL.replace(/%SEARCH_TERM%/g, opts.curSearchterm).replace(/%SEARCH_LOCATION%/g, opts.searchLocation).replace(/%SEARCH_TITLE%/g, opts.searchTitle), function(data){
				// stop the default search timeout from occurring
				clearTimeout(opts.defaultSearchTimeout);
				if(data.isearch){
					opts.destURL = opts.isearchPattern.replace(/%SEARCH_TERM%/g, opts.curSearchterm).replace(/%SEARCH_LOCATION%/, opts.curSearchLocation);
					// opts.urlParams.sl = 'lagos';
				}
				// else{
					// if(opts.$choiceDropdown.val() == 'products'){
					// 	opts.destURL += '&om=1';
					// }
				// }

				self.goToPage();
			});

			opts.defaultSearchTimeoutHandle = setTimeout(function(){
				self.goToPage();
			}, opts.defaultSearchTimeout);

		},
		goToPage:function(){
			var self = this,
					cf = this.config,
					opts = cf.sitesearch;

			// So it doesn't load the page twice
			if(opts.isLoading)return false;
			self.log(opts.destURL);
			// location.replace(location.host + opts.destURL + '?' + $.param(opts.urlParams));
			// location.pathname = opts.destURL;

			// Set the stringified value to the local storage
			self.addToRecent({content: opts.searchLocation}, opts.recentSearchesLocationLocalStorageKey);
			self.addToRecent({content: opts.searchTerm, url: opts.destURL, urlType: 'autocomplete_recent'}, opts.recentSearchesTermLocalStorageKey);

			opts.isLoading = true;
			// window.location = '/' + opts.destURL + '&ref=' + opts.destURLType;
			var tmpLocation = cf.siteRoot + opts.destURL;
			// Remove page number from the URL
			tmpLocation  = tmpLocation.replace(/&?-?page=?\d+/, '');
			// self.log(self.getURLParameters(tmpLocation), 'urlParams');
			tmpLocation += (tmpLocation.indexOf('?') < 0)? '?' : '&';
			tmpLocation += 'ref=' + opts.destURLType;
			// if(opts.$containerTerm.val().replace(/\s/g, ''))tmpLocation += '&oterm=' + opts.curSearchterm;
			// Set the 'oterm' cookie to the search term
			// opts.searchTerm.replace(/\s/g, '') && self.createCookie('oterm', opts.searchTerm, null, '/');

			// Redirect to that page
			window.location = tmpLocation;
			// self.log(location.href);
		},
		autocompleteData:function(location){
			var self = this,
					cf = this.config,
					opts = cf.sitesearch;

			opts.myMain.remote.url = opts.nKeywordsURL + '&loc=' + location;
			opts.myMain.initialize(true);
			opts.myMain.clear();

			opts.relatedProducts.remote.url = opts.nKeywordsURL + '&loc=' + location;
			opts.relatedProducts.initialize(true);
			opts.relatedProducts.clear();

			opts.suggestionSet.remote.url = opts.nKeywordsURL + '&loc=' + location;
			opts.suggestionSet.initialize(true);
			opts.suggestionSet.clear();
		}

		// getParameterByName:function(name) {
		// 	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		// 	return match ? decodeURIComponent(match[1].replace(/+/g, ' ')): null;
		// }
	};
}(jQuery, window, document));

/* global wNumb */
/**
	owl carousel - Handles the slider component

	element => [data-vc-nslider] include this in your html
	options => [
		data-vc-arrows => "true", "false" // Initialize naviagation arrows
		data-vc-stage => "10, 20, 30" // Padding left and right to bring neighbours into partial view.
		data-vc-infinite => "true", "false" // Infinite loop. Duplicate last and first items to get loop illusion.
		data-vc-autoplay => "true", "false" // Initialize autoplay on slider
		data-vc-showno => "0, 1, 2, ..." // The number of items you want to see on the screen
		data-vc-slideno => "0, 1, 2, ..." // The number of items you want to slide when you navigate
		data-vc-autospeed => "true", "false" // Activate the timing of the autoplay on slider
		data-vc-autoplayspeed => "3000, 5000, 7000" // Set the timing of the autoplay on slider
		data-vc-variable => "true", "false"
	]

*/

;(function($, window, document, undefined){
	window.app.comps.nslider = {
		config: {
		},
		init:function(){
			// Contains the initialization code
			var self 	= this,
					cf 		= this.config,
					opts  = cf.nslider;

			opts.$els 	=  $('[' + self.attr_name('nslider') + ']');
			opts.sliderPagerPair = {};
			var mobileRez = 0;
			var tabletRez = 640;
			var desktopRez = 1020;

			if(opts.$els.length) {
				this.require('owlcarousel', function(){
					return (jQuery().owlCarousel);
				}, function() {
					opts.$els.each(function(index, elem){
						var $el = $(elem); //the current element
						var rel = '';

						// Set default options
						var carouselOptions = {
							loop: ($el.children().length > 1) && true || false,
							autoplay: false,
							autoplaySpeed: false,
							autoplayTimeout: 5000,
							stagePadding: 0,
							autoplayHoverPause: true,
							nav:true,
							autoWidth: true,
							item:1,
							responsive:{
									mobileRez:{
										items:3
									},
									tabletRez:{
										items:3
									},
									desktopRez:{
										items:6
									}
							},
							lazyLoad: true,
							dots: true,
						};

						if(typeof($el.attr(self.attr_name('nslider'))) !== 'undefined'){
							carouselOptions.dotsContainer = $('[' + self.attr_name('nslider-pager') + '="' + $el.attr(self.attr_name('nslider')) + '"]');
						}

						if(typeof($el.attr(self.attr_name('arrows'))) !== 'undefined'){
							if($el.attr(self.attr_name('arrows')) == 'false')carouselOptions.nav = false;
							else carouselOptions.nav = true;
						}

						if(typeof($el.attr(self.attr_name('infinite'))) !== 'undefined'){
							if($el.attr(self.attr_name('infinite')) == 'false')carouselOptions.loop = false;
							else carouselOptions.loop = ($el.children().length > 1) && true || false;
						}

						if(typeof($el.attr(self.attr_name('autoplay'))) !== 'undefined'){
							if($el.attr(self.attr_name('autoplay')) == 'false')carouselOptions.autoplay = false;
							else carouselOptions.autoplay = true;
						}

						if(typeof($el.attr(self.attr_name('dots'))) !== 'undefined'){
							if($el.attr(self.attr_name('dots')) == 'false')carouselOptions.dots = false;
							else carouselOptions.dots = true;
						}

						if(typeof($el.attr(self.attr_name('variable'))) !== 'undefined'){
							if($el.attr(self.attr_name('variable')) == 'false')carouselOptions.autoWidth = false;
							else carouselOptions.autoWidth = true;
						}

						if(typeof($el.attr(self.attr_name('autospeed'))) !== 'undefined'){
							if($el.attr(self.attr_name('autoplayspeed')) == 'false')carouselOptions.autoplaySpeed = false;
							else carouselOptions.autoplaySpeed = true;
						}

						if(typeof($el.attr(self.attr_name('autoplaypause'))) !== 'undefined'){
							if($el.attr(self.attr_name('autoplaypause')) == 'false')carouselOptions.autoplayHoverPause = false;
							else carouselOptions.autoplayHoverPause = true;
						}

						if(typeof($el.attr(self.attr_name('centermode'))) !== 'undefined'){
							if($el.attr(self.attr_name('centermode')) == 'false')carouselOptions.center = false;
							else carouselOptions.center = true;
						}

						if($el.attr(self.attr_name('stage'))){
							carouselOptions.stagePadding = +$el.attr(self.attr_name('stage'));
						}

						// if($el.attr(self.attr_name('mobile-showno'))){
						// 	carouselOptions.items = +$el.attr(self.attr_name('mobile-showno'));
						// }

						// if($el.attr(self.attr_name('tablet-showno'))){
						// 	carouselOptions.items = +$el.attr(self.attr_name('tablet-showno'));
						// }


						if($el.attr(self.attr_name('showno'))){
							carouselOptions.items = +$el.attr(self.attr_name('showno'));
						}

						if($el.attr(self.attr_name('margin-right'))){
							carouselOptions.margin = +$el.attr(self.attr_name('margin-right'));
						}

						if($el.attr(self.attr_name('slideno'))){
							carouselOptions.slideBy = +$el.attr(self.attr_name('slideno'));
						}

						if($el.attr(self.attr_name('autoplayspeed'))){
							carouselOptions.autoplayTimeout = +$el.attr(self.attr_name('autoplayspeed'));
						}

						// Add carousel to the sliderPagerPair object
						if($el.attr('rel')){
							rel = $el.attr('rel');
							if(rel){
								if(!opts.sliderPagerPair[rel])opts.sliderPagerPair[rel] = {};

								// If it is a pager, add it to the pager key, else it is the slider
								if(typeof($el.attr(self.attr_name('nslider-pager'))) !== 'undefined'){
									opts.sliderPagerPair[rel].pager = $el;
								}
								else{
									opts.sliderPagerPair[rel].slider = $el;
								}
							}
						}

						// owlCarWidth( $el );
						$el.off('refreshed.owl.carousel initialized.owl.carousel').on('refreshed.owl.carousel initialized.owl.carousel', function(event) {
							// owlCarWidth($el);
							self._setOwlCarouselWidth.call(self, $el);
							self.log('owl has been initialized.');
						});

						// $(window).off('resize.vc.nslider').on('resize.vc.nslider', function(e){
						// 	self._setOwlCarouselWidth.call(self, $el);
						// 	self.log('window resized.');
						//   // owlCarWidth($el);
						// }).resize();

						// Call reinitialize in case it has been initialized before
						self.reinitialize($el);
						$el.owlCarousel(carouselOptions);

						// Set the width after .5s.. to fix improper calculated width at initialization
						// TEMPORARY FIX
						setTimeout(function(){
							self._setOwlCarouselWidth.call(self, $el);
							self.log('carousel width set timed out.');
						}, 500);
						$el.find('img').on('load', function(){
							self._setOwlCarouselWidth.call(self, $el);
							self.log('carousel images loaded.');
						});
						// $(window).trigger('resize');
					});
				});
			}

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
		},
		_setOwlCarouselWidth:function($owl){
			var self 	= this,
					cf 		= this.config,
					opts  = cf.nslider;

			var totalWidth = 0;
			$owl.find('.owl-item').each(function() {
				totalWidth += ($(this).width()+1);
			});
			$owl.find('.owl-stage').width(totalWidth+1);

			self.log(totalWidth);
		},
		reinitialize:function($el){
			var carousel = $el.data('owlCarousel');
			if(!carousel)return false;
			// carousel._width = $('.target .owl-carousel').width();
			carousel.invalidate('width');
			carousel.refresh();
		}
	};
}(jQuery, window, document));

/* global wNumb */
/**
	Cart Calculator - Does all needed calcuations on the cart page. based on the number
	                  and quantity of items on the cart page

	Usage: 'How to use component'
	Options:
		Option_name - Option_description
			Values: Possible_option_values
	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.cartCalculator = {
		config: {
			$cartCalc   : $('[data-vc-cart-calculator]') ,
			$cartItem   : $('.js-cat-item'),
			$subTotal   : $('.js-cat-subtotal'),
			$delvTotal  : $('.js-cat-dilivery-total'),
			$discount   : $('.js-cat-discount'),
			$total      : $('.js-cat-total'),
			$qty        : $('.js-cat-item-qty'),
			moneyFormat : wNumb({mark: '.', thousand: ','})
		},

		calculateItem : function(e) {
			// e.preventDefault();
			// e.stopPropagation();

			var
				self       = e.data.self,
			 	cf         = self.config,
				$this      = $(this),
				val        = +$this.val(),
			  $item      = $this.closest('.js-cat-item'),
			  $itemPrice = $item.find('.js-item-price'),
			  $you_save   = $item.find('.js-you-save'),
			  _itemPrice = $itemPrice.data('vc-cat-item-price'),
			  result     = val * +_itemPrice
			;
      //save the total price for the item
			$itemPrice.data('item-total-price', result)
								.text(cf.moneyFormat.to(result));

			//if you-save, calculate the you-save
			if ($you_save.length) {
	      $you_save.text(
	      	cf.moneyFormat.to(
	      		+$you_save.data('you-save') * val
	      	)
	      );
			}

      self.calculateSubtotal();
      // return false;
		},

		//Handles subtotal and total-delivery calculations
		calculateSubtotal : function  () {
			var
				self     = this,
				cf       = self.config,
				subTotal = 0,
				totalDelivery = 0
			;

			$.each(cf.$cartItem, function (i) {
				var $this = $(this);
				subTotal += $this.find('.js-item-price')
				                 		.data('item-total-price');

				totalDelivery += $this.find('.js-deliv-price')
																.data('vc-item-delivery-price');
			});

			cf.$subTotal
				.data('vc-cat-subtotal', subTotal)
				.text(cf.moneyFormat.to(subTotal));
			cf.$delvTotal
				.data('vc-cat-delivery-total',totalDelivery)
				.text(cf.moneyFormat.to(totalDelivery));

			self.calculateTotal();
		},

    //calculate the grand total
		calculateTotal : function  () {
			var
				cf    = this.config,
			  total = cf.$subTotal.data('vc-cat-subtotal') +
			  				cf.$delvTotal.data('vc-cat-delivery-total') -
			  				cf.$discount .data('vc-cat-discount')
			;
			cf.$total.text(cf.moneyFormat.to(total));
		},

		init:function(){
			var self = this;
			if (self.config.$cartCalc.length) {
				self.events();
			}
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this, cf = self.config;
			cf.$qty.on('change', {self: self}, self.calculateItem);
		}
	};
}(jQuery, window, document));

/**
	ntabs - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.ntabs = {
		config:{
			ntabs:{
				activeTabClass: 'active',
				tabsContainerClass: 'tabs-content',
				tabsClass: 'content'
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					ct = this.config.ntabs;

			ct.$tabTriggers = $('[' + self.attr_name('tab') + ']');
			ct.tabContents = $('.' + ct.tabsContainerClass).find('.' + ct.tabsClass);

			ct.$tabTriggers.each(function(){
				var $el = $(this);
				if($el.attr(self.attr_name('tab')) == 'active'){
					self.showTab(this);
				}
			});
			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					ct = this.config.ntabs;

			ct.$tabTriggers.off('click.vc.tabs').on('click.vc.tabs', function(e){
				e.preventDefault();

				self.showTab(this);
				self.publish('vc:init', 'nslider');
			});
		},
		showTab:function(tabTrigger){
			var self = this,
					cf = this.config,
					ct = this.config.ntabs;
			var tabTarget = $(tabTrigger).attr('href');

			//
			// 1. Remove active class from all the tabs
			ct.tabContents.removeClass(ct.activeTabClass);

			// 2. Add active class to current tab
			ct.tabContents.filter(tabTarget).addClass(ct.activeTabClass);

			// 3. Remove active class from all tab triggers
			$(tabTrigger).closest('[' + self.attr_name('tabs') + ']').children('li').removeClass(ct.activeTabClass);
			// 4. Add the active class to the tab trigger
			$(tabTrigger).closest('[' + self.attr_name('tabs') + '] li').addClass(ct.activeTabClass);
		}
	};
}(jQuery, window, document));

/* global wNumb */
/**
	scrollto - Handles the scrollto component

	element => [data-vc-scrollto] include this in your html
	usage => <a href="#" data-vc-scrollto>Top</a> //put this at the bottom of the page in the footer before the closing </div> {wrapper} of your page

*/

;(function($, window, document, undefined){
	window.app.comps.scrollto = {
		config: {
		},
		init:function(){
			// Contains the initialization code
			var 	self = this,
						cf = this.config,
						opts = cf.scrollto;

			opts.offset  					= 300; // browser window scroll (in pixels) after which the "Scroll to top" link is shown
			opts.offsetOpacity  		= 1200; //browser window scroll (in pixels) after which the "Scroll to top" link opacity is reduced
			opts.scrollTopDuration = 700; //duration of the top scrolling animation (in ms)
			opts.scrollToElementOffset = 75;
			cf.$scrollto = $('[' + self.attr_name('scrollto') + ']');
			cf.$scrollToOffset = $('[' + self.attr_name('scrollto-offset') + ']');

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var 		self 						= this,
								cf 						= this.config,
								opts = cf.scrollto;

			//hide or show the "scroll to top" link
			$(window).scroll(function(){
				( $(this).scrollTop() > opts.offset ) ? cf.$scrollto.addClass('sc-vc-is-visible') : cf.$scrollto.removeClass('sc-vc-is-visible sc-vc-fade-out');
				if( $(this).scrollTop() > opts.offsetOpacity  ) {
					cf.$scrollto.addClass('sc-vc-fade-out');
				}
			});

			//smooth scroll to top
			cf.$scrollto.off('click.vc.scrollto').on('click.vc.scrollto', function(e){
				e.preventDefault();
				var $this = $(this);
				var scrollPositionStr = $this.attr(self.attr_name('scrollto'));
				var scrollPositionOffset = $this.attr(self.attr_name('scrollto-offset'));
				var scrollToOffset;
				if(scrollPositionOffset) {
					scrollToOffset = +scrollPositionOffset;
				}
				else {
					scrollToOffset = opts.scrollToElementOffset;
				}

				var scrollPosition = 0;
				self.log(scrollPositionStr);
				switch(scrollPositionStr){
					case null:
						/* falls through*/
					case '':
						scrollPosition = 0;
						break;
					case 'top':
						scrollPosition = 0;
						break;
					case 'bottom':
						scrollPosition = $('body').height();
						break;
					default:
						// self.log($('#' + scrollPositionStr));
						scrollPosition = $('#' + scrollPositionStr).offset().top - scrollToOffset;
				}

				self.scrollTo(scrollPosition);

			});

			self.subscribe('vc:scrollto/top', function(data){
				self.scrollTo(0);
			});
		},
		scrollTo:function(scrollPosition){
			var self = this,
					cf = this.config,
					opts = cf.scrollto;


			$('body,html').animate({
				scrollTop: scrollPosition,
			}, opts.scrollTopDuration);
		}
	};
}(jQuery, window, document));

/**
	lazyload - Handles image lazyload logic

	Usage: Add the .lazy class to any image you want to lazy load.
	Example:
		<img src="img/boy.jpg" class="lazy">
*/

;(function($, window, document, undefined){
	window.app.comps.lazyload = {
		name: 'lazyload',
		description: '',
		config:{
			lazyload: {
				blankURL: '/img/blank.gif',
				loadingBgURL: '/img/blue-square.png',
				lazyClass: 'lazy',
				threshold: 100
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = self.config,
					opts = cf.lazyload;

			// Set the src to point to the loader image first, also set the lazy class for styling.
			opts.$container = $('[' + self.attr_name('lazy') + ']');
			opts.$container.each(function(){
				var $el = $(this);

				if($el.attr(self.attr_name('background'))){
					// If it's a background lazy load required
					$el.css('backgroundImage', 'url('+ opts.loadingBgURL + ')');
				}
				else{
					// If it's an image lazy load required
					$el.attr('src', opts.blankURL).addClass(opts.lazyClass);
				}
			});

			opts.$unloadedSet = opts.$container;

			this.events();
			this.loadVisible();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = self.config,
					opts = cf.lazyload;
					self.log('got here too 1');

			$(window).off('scroll.vc.lazyload resize.vc.lazyload').on('scroll.vc.lazyload resize.vc.lazyload', self.throttle($.proxy(self.loadVisible, self) , 100));
		},
		loadVisible:function(){
			var self = this,
					cf = self.config,
					opts = cf.lazyload,
					$win = $(window);
			var $visibleImages = opts.$unloadedSet.filter(function(){
				var $el = $(this);
				// self.log('got here too 22');
				// Set a min-height style so it works properly in Opera
				if($el.is(':hidden'))return false;

				// METHOD 1: Checking element's offset position from the document and window's offset position from the document
				// var elementTop = $el.offset().top; //top of image element from the top of the document, not window
				// var elementBottom = elementTop + $el.height();
				// var windowTop = $win.scrollTop();
				// var windowBottom = windowTop + $win.height();
				// return (elementBottom > windowTop && elementTop <= windowBottom);
				// return (elementBottom > windowTop - opts.threshold && elementTop <= windowBottom + opts.threshold);

				// METHOD 2: Using getBoundingClientRect
				var wh = $(window).height();
				var ww = $(window).width();
				var coords = $el[0].getBoundingClientRect();
				return (coords.bottom >= 0) && (coords.top < wh) && (coords.left < ww) && (coords.right >= 0);
			});

			self.loadImages($visibleImages);
		},
		loadImages:function($imgs){
			var self = this,
					cf = self.config,
					opts = cf.lazyload;

			$imgs.each(function(index, elem){
				var $elem = $(elem);
				// self.log('got here too 4');
				var src = ($elem.attr(self.attr_name('background')))?$elem.attr(self.attr_name('background')):$elem.attr(self.attr_name('lazy'));
				self.log('got here');
				if(src){
					self.log('got here tooo');
					var $imgObj = $(new Image());
					$imgObj.one('load', function(){
						$elem.hide();
						($elem.attr(self.attr_name('background')))? $elem.css('backgroundImage', 'url('+ src + ')') : $elem.attr('src', src).removeClass(opts.lazyClass);
						$elem.fadeIn();
						self.log('Image lazy loaded: ', src);
					}).attr('src', src);
					self.log('Starting lazy loading: ', src);
					// Call the load event even on cached images
					// if($imgObj[0].complete){
					// 	$imgObj.load();
					// 	self.log('Image loading already complete.', src);
					// }

					// $imgObj;
				}
			});

			// Remove the loaded images from the set
			opts.$unloadedSet = opts.$unloadedSet.not($imgs);
		}
	};
}(jQuery, window, document));

/**
	Countdown Timer - component_description

	Usage: 'How to use component'

	Element => data-vc-endday

	Date 	- Days - Feb 29 2016 Days from current time
				- Hours & Minutes - Feb 29 2016 12:39 hours/Minutes from current time

	Example:
		data-vc-endday = Feb 29 2016, data-vc-endday = Feb 29 2016 12:39
*/

;(function($, window, document, undefined){
	window.app.comps.countDownTimer = {
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.countDownTimer,
					timesDay = {};

			opts.$container = $('[' + self.attr_name('countdowntimer') + ']');
			opts.days = '.js-days';
			opts.hours = '.js-hours';
			opts.minutes = '.js-minutes';
			opts.seconds = '.js-seconds';


			if(!opts.$container.length)return false;
			opts.$container.each(function(index, elem){
				var $el = $(elem), //the current element
						deadline,
						currentTime = Date.parse(new Date());

				// timesDay.nHours = $el.attr(self.attr_name('hours'));
				// timesDay.nMinutes = $el.attr(self.attr_name('minutes'));
				// timesDay.nDays = $el.attr(self.attr_name('days'));
				timesDay.endSec = $el.attr(self.attr_name('endsec'));
				timesDay.endDay = $el.attr(self.attr_name('endday'));
				// timesDay.endHour = $el.attr(self.attr_name('endhour'));

				var endTime = Date.parse(timesDay.endDay);
						// startTime = Date.parse(timesDay.startDay),
						// nEndHour = Date.parse(timesDay.endHour);

				// if(timesDay.nDays) {
				// 	deadline = new Date(currentTime + (+timesDay.nDays) * 24 * 60 * 60 * 1000);
				// }
				//
				// if(timesDay.nHours) {
				// 	deadline = new Date(currentTime + (+timesDay.nHours) * 60 * 60 * 1000);
				// }
				// if(timesDay.nMinutes) {
				// 	deadline = new Date(currentTime + (+timesDay.nMinutes) * 60 * 1000);
				// }

				if(timesDay.endSec) {
					deadline = new Date(currentTime + (+timesDay.endSec) * 1000);
				}

				if(endTime > currentTime) {
					deadline = timesDay.endDay;
				}

				self.initializeClock($el, deadline);
		});



			this.events();

		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.countDownTimer;



		},

		getTimeRemaining:function(endtime){
			var self = this,
					cf = this.config,
					opts = cf.countDownTimer;

					if(endtime){
						var t = Date.parse(endtime) - Date.parse(new Date());
					  var seconds = Math.floor( (t/1000) % 60 );
					  var minutes = Math.floor( (t/1000/60) % 60 );
					  var hours = Math.floor( (t/(1000*60*60)) % 24 );
					  var days = Math.floor( t/(1000*60*60*24) );
					  return {
					    'total': t,
					    'days': days,
					    'hours': hours,
					    'minutes': minutes,
					    'seconds': seconds
					  };
					}
					else{
						return {
							'total': 0, 'days': 0, 'hours': 0, 'minutes': 0, 'seconds': 0
						};
					}

		},

		initializeClock:function($el, endtime){
			var self = this,
					cf = this.config,
					opts = cf.countDownTimer;

					// Only display when this function is called
					$el.removeClass('js-countdown-timer-none').addClass('js-countdown-timer-display');
					function updateClock(){
					  var t = self.getTimeRemaining(endtime);
						$el.find(opts.days).html(('0' + t.days).slice(-2));
			      $el.find(opts.hours).html(('0' + t.hours).slice(-2));
			      $el.find(opts.minutes).html(('0' + t.minutes).slice(-2));
			     	$el.find(opts.seconds).html(('0' + t.seconds).slice(-2));
					  if(t.total <= 0){
					    clearInterval(timeinterval);
							// opts.$container.html('these deals has expired');
					  }
					}

					updateClock(); // run function once at first to avoid delay
					var timeinterval = setInterval(updateClock, 1000);

		},







	};
}(jQuery, window, document));

/**
	loader - Script for custom-built loader interactivity

	Usage: Call the loader using the pattern $(container).vcLoader();
*/

;(function($){
	window.app.comps.loader = {
		config:{
			$loader: $('.loading'),
			loaderClass: 'loading',
			$loaderParent: $('.loading-container')
		},
		utils:{
			loading:function(container, option, message){
				var cf = this.config;
				// this.log(cf.loaderClass);
				if(option == 'start')container.children('.loading').fadeIn();
				else container.children('.loading').hide();
			}
		},
		init:function(){
			//initialize loader
			$.fn.vcLoader = function(state,lContain){
				return this.initLoader(this,state,lContain);
			};
		},
		initLoader:function(container,state,lContain){
			var cf = this.config;
			if(typeof container !== 'undefined'){
				cf.$loaderParent = $(container);
				cf.$loaderParent.append('<div class="loading"></div>');
				if(typeof lContain !== 'undefined'){
					if(lContain){
						cf.$loaderParent.addClass('loading-container');
					}
				}
				cf.$loader = $(container).find('div.loading');
				if(typeof state === 'string'){
					this.runLoader(state);
				}
			}
		},
		runLoader:function(state){
			var cf = this.config;
			if(state === 'show'){
				cf.$loader.fadeIn();
			}
			else if(state === 'hide'){
				cf.$loader.fadeOut();
			}
		}
	};
}(jQuery));

/**
 * @file Reviewbox component
 * @author Samuel Imolorhe {@link imolorhe@vconnectng.com}
 * @version 1.0
 */
/**
	reviewbox - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/


;(function($, window, document, undefined){
	/**
	 * Handles the functionality for the reviewbox component
	 * @name reviewbox
	 */
	window.app.comps.reviewbox = {
		config: {
			reviewbox: {
				// rateReviewURL: rateBusinessReviewUR || rateProductReviewURL,
				rateReviewURL: '/home/rateandreview',
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.reviewbox;

			opts.$container = $('[' + self.attr_name('reviewbox') + ']');
			opts.$emptyReview = $('.no-review');

			if(!opts.$container.length)return false;

			// Code begins here...

			opts.bizid = opts.$container.attr(self.attr_name('bizid'));
			opts.skuid = opts.$container.attr(self.attr_name('skuid'));

			opts.$ratingInner = opts.$container.find('.reviewbox-rating-inner');
			opts.$ratingLabels = opts.$container.find('.reviewbox-rating-label');
			opts.$ratingInputs = opts.$ratingLabels.find('input');
			opts.$ratingText = opts.$container.find('.reviewbox-rating-text');
			opts.ratingTextString = '';

			// opts.reviewId = '';

			opts.minReviewTextCount = 60;
			opts.maxReviewTextCount = 2048;
			opts.$reviewBoxForm = opts.$container.find('.js-reviewbox-form');
			opts.$reviewSubmitBtn = opts.$container.find('.js-submit-review-button');
			opts.$reviewTextInput = opts.$container.find('.js-reviewbox-textarea');
			opts.$reviewTextCount = opts.$container.find('.js-review-text-count');
			opts.$ratingWrapper = opts.$container.find('.js-rating-wrapper');
			opts.$positiveRatingText = opts.$container.find('.js-positive-rating-text');
			opts.$negativeRatingText = opts.$container.find('.js-negative-rating-text');
			opts.$reviewHelpfulInfo = opts.$container.find('.js-helpful-info');
			opts.$reviewScoreBar = opts.$container.find('.js-score-bar');
			opts.$addPhotosBtn = opts.$container.find('.js-add-photos-button');
			opts.$reviewPhotosWrapper = opts.$container.find('.reviewbox-photos-wrapper');
			opts.$reviewActionsWrapper = opts.$container.find('.reviewbox-actions-wrapper');
			opts.$reviewWrapper = opts.$container.find('.reviewbox-review-wrapper');
			opts.$reviewCompleteWrapper = opts.$container.find('.reviewbox-complete-info-wrapper');



			// opts.isSaved = false;

			opts.helpfulTexts = [
				'Just start typing...',
				'How was the place?',
				'Out of words? Here\'s an example: The food was divine!',
				'{amtLeft} characters to go',
				'Almost there...',
				'Just a little more',
				'Shia LaBeouf: "JUST GO ON!"',
				'DJ Khaled: "You smart, you loyal."',
				'DJ Khaled: "Another one"'
			];

			// opts.$reviewTextCount.text(opts.minReviewTextCount);


			self.require('dropzone', function(){
				return (typeof Dropzone !== 'undefined');
			}, function(){
				opts.$container.each(function(){
					var $el = $(this);

					$el.dropzone({
						url: opts.rateReviewURL,
						autoProcessQueue:false,
						uploadMultiple:true,
						parallelUploads:10,
						maxFiles: 10,
						maxFilesize: 5,
						clickable: $el.find(opts.$addPhotosBtn)[0] ,
						acceptedFiles: 'image/*',
						previewsContainer: $el.find(opts.$reviewPhotosWrapper)[0],
						previewTemplate: $el.find(opts.$reviewPhotosWrapper).find('.preview-template').html(),
						thumbnail:function(file, dataUrl){
							// Do something with the dataUrl
							// self.log(dataUrl);
							// self.log(file.previewElement);
							$(file.previewElement).css('background-image', 'url(' + dataUrl + ')');
						},
						init:function(){
							$el.data('dropzone', this);
							this.on('addedfile', function(file){
								var $that = this;
								self.log('added file', file);
								if (this.files.length) {
									var _i, _len;
									for (_i = 0, _len = this.files.length; _i < _len - 1; _i++){ // -1 to exclude current file
										if(this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()){
											this.removeFile(file);
											self.notifyMe({message: 'You have already added that photo.', type: 'error'});
											return false;
										}
									}
								}
								// Max of 10 photos fix
								if (this.files.length > 10) {
									this.removeFile(file);
									self.notifyMe({message: 'You can only add a maximum of 10 photos.', type: 'error'});
								}

								$(file.previewElement).find('.reviewbox-photo-thumbnail-close').on('click', function(e){
									e.preventDefault();

									$that.removeFile(file);
								});

								// Show the photos wrapper if it's hidden
								opts.$reviewPhotosWrapper.fadeIn();
							});

							this.on('removedfile', function(file){
								var userReviewPhoto = $('.js-user-review-photo');

								// Hide the photos wrapper if there are no images
								//when edditing review, check for userReviewPhoto before hiding
								if(!userReviewPhoto.length && !this.files.length){
									opts.$reviewPhotosWrapper.hide();
								}
							});

							this.on('sending', function(file, xhr, formData){

								self.log('Appending data to dropzone form data..');
								self.appendData(formData);
								self.loading(opts.$container, 'start');
							});

							// this.on('maxfilesexceeded', function(file){
							// 	this.removeFile(file);
							// 	self.notifyMe({message: 'You can only add a maximum of 10 photos.', type: 'error'});
							// 	// self.log('max file.');
							// });



							this.on('complete', function(file, response){
								var anySuccess = false;
								self.log('reviewbox dropzone complete event w/ response.', file, response);
								if(file.xhr.statusText == 'OK'){
									anySuccess = true;
								}
								if(this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0){
									// Complete saving
									if(anySuccess){
										self.doneSaving();
									}
								}
							});
							// this.on('queuecomplete', function(file, a, b){
							// 	self.log('queuecomplete', file, a, b);
							// });
							this.on('completemultiple', function(file, a, b){
								self.log('completemultiple', file, a, b);
							});
							this.on('successmultiple', function(file, response){
								self.log('successmultiple', file, response);
								if(response.status == '0'){
									self.log({message: 'Something went wrong.', type: 'error'});
									self.cancelSaving();
								}
							});
							this.on('errormultiple', function(file, error, xhr){
								self.log('errormultiple', file, error, xhr);
								self.notifyMe({message: 'Something went wrong. ' + error, type: 'error'});
								self.cancelSaving();
							});
						}
					});
				});
			});
			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.reviewbox;

			opts.$ratingLabels.off('mouseover.vc.reviewbox').on('mouseover.vc.reviewbox', function(){
				var $this = $(this);
				// Set the over class on this label and all the preceding ones
				$this.addClass('over').prevAll(opts.$ratingLabels).addClass('over');

				// Set the rating text to the title on this label
				opts.$ratingText.text($this.attr('title'));
			});

			opts.$ratingLabels.off('mouseout.vc.reviewbox').on('mouseout.vc.reviewbox', function(){
				var $this = $(this);
				// Remove the over class from all the labels
				opts.$ratingLabels.removeClass('over');
				// $this.removeClass('over').prevAll(opts.$ratingLabels).removeClass('over');

				// Remove the content of the rating text
				opts.$ratingText.text(opts.ratingTextString);
			});

			// opts.$ratingLabels.off('click.vc.reviewbox').on('click.vc.reviewbox', function(e){
			// 	// e.preventDefault();
			// 	var $this = $(this);

			// 	self.log('Rating clicked.', e);
			// 	self.setRating($this.prevAll(opts.$ratingLabels).length + 1);
			// });

			opts.$ratingInputs.off('change.vc.reviewbox').on('change.vc.reviewbox', function(e){
				var $this = $(this);
				self.log('Rating changed.', e);
				self.log($(this).val());
				self.setRating($this.val());
			});

			opts.$reviewTextInput.off('keydown.vc.reviewbox textinput.vc.reviewbox').on('keydown.vc.reviewbox textinput.vc.reviewbox', function(e){
				self.log(e);
				var $this = $(this);

				// Use setTimeout so you can get the value after it has been set
				setTimeout(function(){
					// self.log($this.val(), 'review count');
					var curLength = $this.val().length;
					var reviewScore = Math.min(curLength / opts.minReviewTextCount, 1);
					var scoreGrade; // low, medium >= .6, high >= 1

					if(reviewScore < 0.4)scoreGrade = 'low';
					else if(reviewScore < 1)scoreGrade = 'medium';
					else if(reviewScore >= 1)scoreGrade = 'high';

					opts.$reviewTextCount.text(curLength);
					opts.$reviewScoreBar.width(self.easeout(reviewScore) * 100 + '%').removeClass('low medium high').addClass(scoreGrade);
					if(!curLength || curLength >= opts.minReviewTextCount){
						opts.$reviewTextCount.removeClass('error');
						opts.$reviewSubmitBtn.prop('disabled', false);
					}
					else{
						opts.$reviewTextCount.addClass('error');
						opts.$reviewSubmitBtn.prop('disabled', true);
					}
				}, 50);
			});

			opts.$reviewBoxForm.off('valid.fdtn.abide.vc').on('valid.fdtn.abide.vc', function(){
				// self.notifyMe('Oshey!');
				var $form = $(this);

				if(opts.$reviewTextInput.val() && opts.$reviewTextInput.val().length < opts.minReviewTextCount){
					self.notifyMe({message: 'Your review is too short. Just a little more...', type: 'error'});
					return false;
				}
				// else if(opts.$reviewTextInput.val() && opts.$reviewTextInput.val().length > opts.maxReviewTextCount) {
				// 	self.notifyMe({message: 'Your review is too long. Just a reduce a little...', type: 'error'});
				// 	return false;
				// }
				var authFormData = new FormData();
				authFormData = self.appendData(authFormData, 'json');

				self.log(authFormData, 'jsonned');
				var authData = {
					method: 'POST',
					url: opts.rateReviewURL,
					data: authFormData,
					successMessage: 'Thank you. Your review has been published.'
				};

				// self.checkAuth(function(){
					// If there are photos added to the review, let dropzone handle saving the data, append data in dropzone's `sending` event
					if($form.closest(opts.$container).data('dropzone').files.length){
						self.log('with dropzone..');
						// opts.photosDropzone.processQueue();
						$form.closest(opts.$container).data('dropzone').processQueue();
						self.log('processing.. dropzone!');
					}
					else{
						// If there are no photos, save the data via normal jQuery AJAX methods
						self.log('without dropzone..');
						if(cf.loggedIn){
							self.sendData(true);
						}
						else{						
							self.sendData(true);
							if(opts.reviewId){
								self.log(opts.reviewId, 'This is the review id that was sent from request');
							
								self.checkAuth(function(){	
									$.ajax({
									url: opts.updateReviewIdURL,
									data: opts.reviewId,
									processData: false,
									contentType: false,
									type: 'POST',
									success: function(data){
										self.doneSaving();
										self.log(data, ' The user was logged in review was attached to the user');		
									},

									error:function(){								
										self.log('The user was unable to log');
									}
								});

								}, opts.reviewData);

							}
						}

					}
				// }, authData);
			
				// self.loading(opts.$container, 'start');
				// Temporary delay to simulate uploading effect
				// setTimeout(function(){
				// 	opts.$reviewBoxForm.hide();
				// 	opts.$reviewCompleteWrapper.fadeIn();
				// 	self.loading(opts.$container, 'stop');
				// }, 3000);
			});

			opts.$addPhotosBtn.off('click.vc.reviewbox').on('click.vc.reviewbox', function(e){
				// Just disable the default action of the link
				e.preventDefault();
			});

			self.subscribe('vc:reviewbox/rate', function(data){
				self.setRating(data.rating);
			});
		},
		showHelpfulText:function(){
			var self = this,
					cf = this.config,
					opts = cf.reviewbox;

			var helpfulTextCount = opts.helpfulTexts.length;
			setInterval(function(){
				var curIndex = Math.floor(Math.random() * helpfulTextCount);
				opts.$reviewHelpfulInfo.fadeOut(function(){
					$(this).text(opts.helpfulTexts[curIndex]);
				}).fadeIn();
			}, 3000);
		},
		easeout:function(val){
			return val * (2 - val);
		},
		// setRating:function(rating){
		// 	var self = this,
		// 			cf = this.config,
		// 			opts = cf.reviewbox;

		// 	// Remove the set class from all the rating labels
		// 	opts.$ratingInner.each(function(){
		// 		var $curRatingInner = $(this);

		// 		var $curLabels = $curRatingInner.find(opts.$ratingLabels).removeClass('set');

		// 		var $curLabel = $curLabels.eq(rating - 1);

		// 		// opts.$ratingLabels.slice(0, rating - 1).addClass('set');
		// 		// Set the set class on this label and all the preceding ones
		// 		$curLabel.addClass('set').prevAll($curLabels).addClass('set');

		// 		opts.$ratingText.text($curLabel.attr('title'));
		// 		opts.ratingTextString = $curLabel.attr('title');
		// 	});


		// 	// opts.curRating = $this.prevAll(opts.$ratingLabels).length + 1;
		// 	opts.curRating = rating;
		// 	// self.log(opts.curRating);
		// 	// self.publish('vc:reviewbox/rate', {rating: opts.curRating});

		// 	if(opts.curRating > 2){
		// 		opts.$positiveRatingText.show();
		// 		opts.$negativeRatingText.hide();
		// 	}
		// 	else{
		// 		opts.$positiveRatingText.hide();
		// 		opts.$negativeRatingText.show();
		// 	}


		// 	opts.$reviewWrapper.fadeIn();
		// 	opts.$reviewActionsWrapper.fadeIn();
		// 	// self.showHelpfulText();

		// 	self.log('Rating set.');
		// 	self.sendData(false, true);
		// },
		setRating:function(rating){
			var self = this,
					cf = this.config,
					opts = cf.reviewbox;

			// var $this = opts.$ratingLabels.eq(rating - 1);
			// Remove the set class from all the rating labels
			// opts.$ratingLabels.removeClass('set');

			// Remove the set class from all the rating labels
			opts.$ratingInner.each(function(){
				var $curRatingInner = $(this);

				var $curLabels = $curRatingInner.find(opts.$ratingLabels).removeClass('set');

				var $curLabel = $curLabels.eq(rating - 1);

				// opts.$ratingLabels.slice(0, rating - 1).addClass('set');
				// Set the set class on this label and all the preceding ones
				$curLabel.addClass('set').prevAll($curLabels).addClass('set');

				opts.$ratingText.text($curLabel.attr('title'));
				opts.ratingTextString = $curLabel.attr('title');
			});


			// opts.$ratingLabels.slice(0, rating - 1).addClass('set');
			// Set the set class on this label and all the preceding ones
			// $this.addClass('set').prevAll(opts.$ratingLabels).addClass('set');

			// opts.curRating = $this.prevAll(opts.$ratingLabels).length + 1;
			opts.curRating = rating;
			// self.log(opts.curRating);
			// self.publish('vc:reviewbox/rate', {rating: opts.curRating});

			if(opts.curRating > 2){
				opts.$positiveRatingText.show();
				opts.$negativeRatingText.hide();
			}
			else{
				opts.$positiveRatingText.hide();
				opts.$negativeRatingText.show();
			}

			// opts.$ratingText.text($this.attr('title'));
			// opts.ratingTextString = $this.attr('title');

			opts.$reviewWrapper.fadeIn();
			opts.$reviewActionsWrapper.fadeIn();
			// self.showHelpfulText();

			self.log('Rating set.');
			if(rating) self.sendData(false, true);
		},
		appendData:function(formData, json, config){
			var self = this,
					cf = this.config,
					opts = cf.reviewbox;

			var result = {};
			config = config ||  {};
			if(json){
				if(opts.bizid)result.Bizid = opts.bizid;
				if(opts.skuid)result.Skuid = opts.skuid;
				result.RateCount = opts.curRating;
				if(!config.onlyRating)result.Review = opts.$reviewTextInput.val();
				formData = result;
			}
			else{
				if(opts.bizid)formData.append('Bizid', opts.bizid);
				if(opts.skuid)formData.append('Skuid', opts.skuid);
				formData.append('RateCount', opts.curRating);
				if(!config.onlyRating)formData.append('Review', opts.$reviewTextInput.val());
			}
			return formData;
		},
		sendData:function(isDone, onlyRating){
			var self = this,
					cf = this.config,
					opts = cf.reviewbox;

			var formData = new FormData();

			// If the user has saved the rating before,
			// and the user doesn't enter a review,
			// then don't send the request again
			// if(opts.isSaved && !opts.$reviewTextInput.val()){
			// 	self.doneSaving();
			// 	return;
			// }
			var config = {};
			if(onlyRating)config.onlyRating = true;
			self.appendData(formData, false, config);
			self.log('Sending without dropzone..');
			// if(!cf.loggedIn)return false;
			if(isDone)self.loading(opts.$container, 'start');
			self.log('About to send review now..');
			$.ajax({
				url: opts.rateReviewURL,
				data: formData,
				processData: false,
				contentType: false,
				type: 'POST',
				success: function(data){
					opts.reviewId = data.reviewid;
					if(cf.loggedIn){
						self.log(data);
						if(data.status != '0'){
							if(isDone)self.doneSaving();
							self.log(data.reviewid,'This is the review id');
							
						}
						else{
							self.cancelSaving();
							self.notifyMe({message: 'Something went wrong.', type: 'error'});
						}
					}
					
				},

				error:function(){
					self.cancelSaving();
					// self.notifyMe({message: 'Something went wrong.', type: 'error'});
				}
			});

			// If the user is logged in, after submitting anything (rating), set isSaved to true
			// if(cf.loggedIn)opts.isSaved = true;
		},
		doneSaving:function(){
			var self = this,
					cf = this.config,
					opts = cf.reviewbox;

			opts.$reviewBoxForm.hide();
			opts.$reviewCompleteWrapper.fadeIn();
			opts.$emptyReview.hide();
			self.loading(opts.$container, 'stop');
			// self.notifyMe('Your review has been saved.');
		},
		cancelSaving:function(){
			var self = this,
					cf = this.config,
					opts = cf.reviewbox;

			opts.$reviewBoxForm.show();
			// opts.$reviewCompleteWrapper.fadeIn();
			self.loading(opts.$container, 'stop');
		}
	};
}(jQuery, window, document));

/* global Bloodhound */
/* global Dropzone */

/**
	createlist - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.createlist = {
		config: {
			createlist: {
				businessSearchURL: '/HomeWeb/KeywordAutoComplete?otype=businesses&group=6&term=%QUERY',
				createListURL: '/lists/CreateCuratedList',
				postSaveURL: '/homepage.html',
				defaultListImage: '/img/testimg/list-back-1.jpg',
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.createlist;

			opts.$container = $('[' + self.attr_name('createlist') + ']');
			// opts.$uploadPhotoContainer 	= $('.js-upload-photo');

			if(!opts.$container.length)return false;
			// if(!opts.$uploadPhotoContainer.length)return false;

			opts.$createListFormWrapper = opts.$container.find('.js-create-list-form-wrapper');
			opts.$addBusinessWrapper 		= opts.$container.find('.js-create-list-add-business-wrapper');
			opts.$createListForm 				= opts.$container.find('.js-create-list-form');
			opts.$formTitleInput 				= opts.$createListForm.find('.create-list-input-title');
			opts.$formDescriptionInput 	= opts.$createListForm.find('.create-list-input-description');
			opts.$formPrivacyInput 			= opts.$createListForm.find('.create-list-input-privacy');

			opts.$uploadPhoto 				= opts.$container.find('.js-upload-photo');
			opts.$defaultMessage 				= opts.$container.find('.dz-default.dz-message');
			opts.$photoPlaceholder 		= opts.$container.find('.js-photo-placeholder');
			opts.$photoChangeWrapper 	= opts.$container.find('.js-photo-change-wrapper');
			opts.$photoChangeLink 		= opts.$container.find('.js-photo-change-link');

			opts.$metaPreviewWrapper = opts.$container.find('.js-meta-preview');
			opts.$metaTitle 				 = opts.$container.find('.js-meta-title');
			opts.$metaPrivacy 			 = opts.$container.find('.js-meta-privacy');
			opts.$metaDescription 	 = opts.$container.find('.js-meta-description');
			opts.$metaEditLink 			 = opts.$container.find('.js-meta-edit-link');

			opts.$businessSearchInput = opts.$container.find('.js-list-search-business-input');
			// opts.$businessCreateLink = opts.$container.find('.add-to-list-create-list-link');
			opts.$businessBucketList 	= opts.$container.find('.js-business-bucket-list');
			opts.$businessItemTpl 		= opts.$container.find('.js-list-business-item-template');
			opts.$createListBtn 			= opts.$container.find('.js-create-list-btn');

			opts._removeBusinessButtonClass = '.js-remove-business-btn';

			opts.businessList = [];
			opts.removedBusinessList = [];
			opts.newlyAddedBusinessList = [];
			var strList = opts.$container.attr(self.attr_name('businesslist'));
			if(strList)opts.businessList = strList.split(',');

			var curImageURL = opts.$container.attr(self.attr_name('imageurl'));
			var curImageSize = opts.$container.attr(self.attr_name('imagesize'));
			opts.isEdit = opts.$container.attr(self.attr_name('isedit'));

			// Typeahead autocomplete
			this.require('ntypeahead', function(){
				return (jQuery().typeahead);
			}, function(){
				opts.businessSearchSource = new Bloodhound({
					datumTokenizer: function(d){ return Bloodhound.tokenizers.whitespace(d.label); },
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					remote: {
						url: opts.businessSearchURL,
						wildcard: '%QUERY',
						transform: function(response){
							return response.main || [];
						}
					}
				});

				opts.$businessSearchInput.typeahead({}, {
					name: 'businessSearch',
					source: opts.businessSearchSource,
					display: 'content',
					limit: Infinity,
					templates: {
						// suggestion: function(data){ return '<div><div>' + data.content + '</div><div class="autocomplete-subtle-type">' + data.contenttypetext + '</div></div>'; }
						suggestion: function(data){ return '<div class="create-list-business-suggestion-item clearfix"><div class="left"><div class="create-list-business-suggestion-item-name">' + data.content + '</div> <div class="create-list-business-suggestion-item-address">' + data.fulladdress + '</div></div> <div class="create-list-business-suggestion-item-action right"><i class="icon-plus"></i>Add to list</div></div>'; }
					}
				});

				// Dropzone image uploader
				// opts.$defaultMessage.hide();
				self.require('dropzone', function(){
					return (typeof Dropzone !== 'undefined');
				}, function(){
					// $('.js-upload-photo .dz-default').removeClass('dz-message');
					Dropzone.autoDiscover = false;
					// Dropzone.options.myAwesomeDropzone = {
						opts.$uploadPhoto.dropzone({
							url: opts.createListURL,
							autoProcessQueue:false,
							uploadMultiple:false,
							acceptedFiles: 'image/*',
							maxFiles: 1,
							thumbnailWidth: 800,
							clickable: [opts.$photoPlaceholder[0], opts.$photoChangeLink[0]],
							// previewsContainer: opts.$uploadPhoto[0],
							previewTemplate: opts.$uploadPhoto.find('.photo-preview-template').html(),
							thumbnail:function(file, dataUrl){
								// Do something with the dataUrl
								// self.log(dataUrl);
								// self.log(file.previewElement);
								$(file.previewElement).css('background-image', 'url(' + dataUrl + ')');
								opts.$metaPreviewWrapper.css('background-image', 'url(' + dataUrl + ')');
								// $('div.dz-default.dz-message').css({'opacity':1, 'background-image': 'none'}); // or specify your own URL
								// $('.js-upload-photo .dz-default').removeClass('dz-message');
							},
							init:function(){
								opts.photosDropzone = this;
								// $(this.element).addClass("dropzone");
								this.on('addedfile', function(file){
									var $that = this;

									if (this.files.length > 1) {
										var i, len;
										for(i = 0, len = this.files.length; i < len - 1; i++){
											this.removeFile(this.files[i]);
										}
										// this.removeFile(file);
									}

									// if (this.files.length) {
									// 	var _i, _len;
									// 	for (_i = 0, _len = this.files.length; _i < _len - 1; _i++){ // -1 to exclude current file
									// 		if(this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()){
									// 			this.removeFile(file);
									// 			self.notifyMe({message: 'You have already added that photo.', type: 'error'});
									// 			return false;
									// 		}
									// 	}
									// }

									// Check to make sure image file size is less than 5MB
									if(file.size > (1024 * 1024 * 5)){
										this.removeFile(file);
										self.notifyMe({message: 'Your image should not be more than 5MB', type: 'error'});
										return false;
									}
									self.log('added file', file);
									$(file.previewElement).find('.photo-preview-remove-link').on('click', function(e){
										e.preventDefault();

										opts.$metaPreviewWrapper.css('background-image', 'url(' + opts.defaultListImage + ')');
										$that.removeFile(file);
									});


									// Show the photos wrapper if it's hidden
									// opts.$reviewPhotosWrapper.fadeIn();
									opts.$photoPlaceholder.hide();
									opts.$photoChangeWrapper.show();
								});

								this.on('removedfile', function(file){
									// self.log(this.files);

									// Hide the photos wrapper if there are no images
									if(!this.files.length){
										// opts.$reviewPhotosWrapper.hide();
										opts.$photoPlaceholder.show();
										opts.$photoChangeWrapper.hide();
									}
								});

								// this.on('maxfilesexceeded', function(file){
								// 	this.removeAllFiles();
								// 	this.addFile(file);
								// });

								this.on('sending', function(file, xhr, formData){
									self.appendData(formData);
									self.log('Lets append to dropzone.. :D');
								});

								this.on('complete', function(file){
									self.log('complete');
									var anySuccess = false;
									if(file.xhr && file.xhr.statusText == 'OK'){
										anySuccess = true;
									}
									if(this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0){
										// Complete saving
										if(anySuccess){
											self.doneSaving();
										}
									}
								});

								if(curImageURL){
									// var mockFile = {name: 'existing', size: 12345};
									// var image = fileInfo.find('.image:eq(0)');
									var mockFile = {
										name: curImageURL.split('/').pop(),
										size: curImageSize,
										accepted: false,
										fullPath: curImageURL
									};
									this.files.push(mockFile);
									this.emit('addedfile', mockFile);
									this.emit('thumbnail', mockFile, curImageURL);
									this.emit('complete', mockFile);

									// var existingFileCount = 1; // The number of files already uploaded
									// this.options.maxFiles = this.options.maxFiles - existingFileCount;
								}
							},
							resize: function(file) {
								var info;

								// drawImage(image, srcX, srcY, srcWidth, srcHeight, trgX, trgY, trgWidth, trgHeight) takes an image, clips it to
								// the rectangle (srcX, srcY, srcWidth, srcHeight), scales it to dimensions (trgWidth, trgHeight), and draws it
								// on the canvas at coordinates (trgX, trgY).
								info = {
									srcX:0,
									srcY:0,
									srcWidth: file.width,
									srcHeight: file.height,
									trgX:0,
									trgY:0,
									trgWidth: this.options.thumbnailWidth,
									trgHeight: parseInt(this.options.thumbnailWidth * file.height / file.width)
								};

								return info;
							}
						});
					// };
				});

				self.events();
			});
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.createlist;

			opts.$createListForm.off('valid.vc.createlist').on('valid.vc.createlist', function(){

				if(!opts.$formTitleInput.val().replace(/[^a-zA-Z0-9]/g, '')){
					self.notifyMe({message: 'You need to provide a proper title for your list.', type: 'error'});
					opts.$formTitleInput.focus();
					return false;
				}
				opts.$metaTitle.text(opts.$formTitleInput.val());
				opts.$metaDescription.text(opts.$formDescriptionInput.val());
				(opts.$formPrivacyInput.is(':checked'))?opts.$metaPrivacy.show():opts.$metaPrivacy.hide();
				// var toDoOnValid = [opts.$createListFormWrapper.hide(),opts.$addBusinessWrapper.fadeIn()];
				//self.checkAuth(opts.$createListFormWrapper.hide());
				//	self.checkAuth(opts.$createListFormWrapper.hide());
				opts.$createListFormWrapper.hide();
				opts.$addBusinessWrapper.fadeIn();
			});
			// opts.$businessCreateLink.off('click.vc.createlist').on('click.vc.createlist', function(e){
			// 	e.preventDefault();
			// 		//var toDoOnClick = [alert('Kindly log in'),opts.$addBusinessWrapper.hide(),opts.$createListFormWrapper.fadeIn()];
			// 	// self.checkAuth().apply(this, toDoOnClick);

			// 	$(opts.$createListForm)[0].reset();
			// });

			opts.$metaEditLink.off('click.vc.createlist').on('click.vc.createlist', function(e){
				e.preventDefault();
					//var toDoOnClick = [alert('Kindly log in'),opts.$addBusinessWrapper.hide(),opts.$createListFormWrapper.fadeIn()];
				// self.checkAuth().apply(this, toDoOnClick);

				opts.$addBusinessWrapper.hide();
				opts.$createListFormWrapper.fadeIn();
			});
			opts.$businessSearchInput.off('typeahead:select').on('typeahead:select', function(e, data){
				opts.$businessSearchInput.typeahead('val', '');

				if($.inArray(data.contenttypeid, opts.businessList) > -1){
					self.notifyMe({message: 'You already added that business.', type: 'error'});
					return false;
				}

				// TODO: Change the template content instead for that autocomplete option
				var $curBusinessItem = $('<li>' + opts.$businessItemTpl.html() + '</li>').hide();
				$curBusinessItem.find('.business-item-name').text(data.content);
				$curBusinessItem.find('.business-item-image').css('background-image', 'url(' + data.image + ')');
				$curBusinessItem.find('.business-no-reviews').text(data.reviewcount);
				$curBusinessItem.find('.business-no-likes').text(data.likes);
				$curBusinessItem.find('.business-id').text(data.contenttypeid);
				var starContent = '';
				for(var i = 0; i < 5; i++){
					if(Math.round(data.avgrating) > i){
						starContent += '<i class="icon-star"></i>';
					}
					else{
						starContent += '<i class="icon-star-empty"></i>';
					}
				}
				$curBusinessItem.find('.business-star-ratings').empty().html(starContent);
				opts.$businessBucketList.prepend($curBusinessItem);
				// $curBusinessItem.height();
				$curBusinessItem.fadeIn();

				if(opts.isEdit){
					opts.newlyAddedBusinessList.push(data.contenttypeid);
				}else{
					opts.businessList.push(data.contenttypeid);
				}
			});

			opts.$businessBucketList.off('click.vc.createlist', opts._removeBusinessButtonClass).on('click.vc.createlist', opts._removeBusinessButtonClass, function(e){
				e.preventDefault();
				$(this).closest('li').fadeOut(function(){
					for (var i = opts.businessList.length - 1; i >= 0; i--) {
						if(opts.businessList[i] == $(this).find('.business-id').text())opts.businessList.splice(i, 1);

						// opts.removedBusinessList
					}

					if(opts.isEdit){
						// self.log(opts.removedBusinessList, "all removed businesses");
						opts.removedBusinessList.push($(this).find('.business-id').text());
					}

					$(this).remove();
				});
			});


			opts.$createListBtn.off('click.vc.createlist').on('click.vc.createlist', function(e){
				e.preventDefault();

				if(opts.businessList.length < 1){
					self.notifyMe({message: 'You need to add at least one businesses to your list', type: 'error'});
					return false;
				}

				self.checkAuth(function(){
					self.loading(opts.$container, 'start');
					if(opts.photosDropzone.getQueuedFiles().length){
						self.log(opts.photosDropzone);
						opts.photosDropzone.processQueue();
					}
					else{
						var formData = new FormData();
						self.appendData(formData);

						$.ajax({
							url: opts.createListURL ,
							data: formData,
							processData: false,
							contentType: false,
							type: 'POST'
						}).fail(function (err) {
								self.notifyMe({message:'Oops! Something went wrong. Please try again later.', type:'error'});
						})
						.done(function (data) {
							self.log(data);
							self.doneSaving();
						})
						.always(function () {
							self.log('always was called');
							self.loading(opts.$container, 'stop');
						});
					}
				});
			});
		},
		appendData:function(formData){
			var self = this,
					cf = this.config,
					opts = cf.createlist;


			formData.append('listName', opts.$formTitleInput.val());
			formData.append('listDescription', opts.$formDescriptionInput.val());
			formData.append('listPrivacy', +opts.$formPrivacyInput.is(':checked'));
			if(opts.isEdit){
				// formData.append('businessList', opts.removedBusinessList);
				if(opts.removedBusinessList.length){
					formData.append('removedBusinessList', opts.removedBusinessList);
				}
				if(opts.newlyAddedBusinessList.length){
					formData.append('newlyAddedBusinessList', opts.newlyAddedBusinessList);
				}
			}else{
				formData.append('businessList', opts.businessList);
			}
			formData.append('userId', cf.user.id);
			formData.append('hasImage', !!opts.photosDropzone.files.length);
		},
		doneSaving:function(){
			var self = this,
					cf = this.config,
					opts = cf.createlist;

			var action = (opts.isEdit)? 'updated':'created';
			self.publish('vc:track/listsaved', {status: action});
			self.notifyMe('Your list has been ' + action + '.');
			location.replace(opts.postSaveURL);
		}
	};
}(jQuery, window, document));

/**
	reviewitem - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.reviewitem = {
		config: {
			reviewitem: {
				helpfulURL: '/store/IsHelpful',
				reportAbuseURL: '/store/IsReviewAbusive',
				reviewSnippetCount: 300,
				reviewMobileSnippetCount: 100,
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.reviewitem;

			opts.$container = $('[' + self.attr_name('reviewitem') + ']');
			opts.$reportContainer = $('.js-report-popover');


			if(!opts.$container.length)return false;

			// Code begins here...
			opts.$reportConfirm = opts.$reportContainer.find('.js-report-yes');
			opts.$reportNotConfirm = opts.$reportContainer.find('.js-report-no');
			opts.$reviewitemText = opts.$container.find('.js-review-item-text');
			opts.$reviewboxPhotosWrapper = $('.js-reviewbox-photos-wrapper');

			opts.$editBtn = opts.$container.find('.js-edit');
			opts.$deleteBtn = opts.$container.find('.js-delete');
			opts.$helpfulBtn = opts.$container.find('.js-helpful');
			opts.$report = opts.$container.find('.js-helpful');
			opts.$unhelpfulBtn = opts.$container.find('.js-unhelpful');
			opts.$shareBtn = opts.$container.find('.js-share');
			opts.$showRepliesBtn = opts.$container.find('.js-show-replies');
			opts.$reportBtn = opts.$container.find('.js-report');
			opts.$comments = opts.$container.find('.js-comments');
			opts.$reviewFeedBack = opts.$container.find('.js-review-footer-feedback');
			opts.$editReviewModal = $('#edit-review-item-modal');
			opts.$editReviewModalRatingLabel = opts.$editReviewModal.find('.reviewbox-rating-label');
			opts.$editModalReviewText = opts.$editReviewModal.find('.js-reviewbox-textarea');
			opts.$submitEditModalBtn = opts.$editReviewModal.find('.edit-btn');


			opts.$eachComments = opts.$container.find('.review-item-comment');
			opts.$viewMoreComments = opts.$container.find('.js-view-more-reviews');
			opts.$viewMore = opts.$container.find('.view-more-reviews');
			opts.$eachComments.addClass('hide');

			opts.$reviewSnippetWrapper = opts.$container.find('.js-review-snippet-wrapper');
			opts.$reviewSnippet = opts.$container.find('.js-review-snippet');
			opts.$reviewSnippetViewMore = opts.$container.find('.js-snippet-viewmore');
			opts.$itemSellAll = '.js-see-all';
			opts.$reviewMoreLink = '.js-more-link';


			// opts.$container.each(function(){
			// 	var $el = $(this);

			// 	if(!cf.isMobile) {
			// 		$el.find(opts.$reviewSnippet).text($el.find(opts.$reviewitemText).text().substr(0, opts.reviewSnippetCount) + '...');
			// 	}
			// 	else {
			// 		$el.find(opts.$reviewSnippet).text($el.find(opts.$reviewitemText).text().substr(0, opts.reviewMobileSnippetCount) + '...');
			// 	}
			// 	// $el.find(opts.$reviewSnippet).text($el.find(opts.$reviewitemText).text().substr(0, opts.reviewSnippetCount) + '...');
			// 	$el.find(opts.$reviewSnippetWrapper).show();
			// 	$el.find(opts.$reviewitemText).hide();
			// });


			opts.$reviewitemText.each(function(){
				var $el = $(this);
				var myStr = $el.text();

				if(!cf.isMobile) {
					opts.reviewCharCount = opts.reviewSnippetCount;
				}
				else {
					opts.reviewCharCount = opts.reviewMobileSnippetCount;
				}

				if(myStr.length > opts.reviewCharCount){
					var newStr = myStr.substring(0, opts.reviewCharCount);
					var removedStr = myStr.substring(opts.reviewCharCount, myStr.length);
					$(this).empty().text(newStr);
					$(this).append('<a href="#" class="js-see-all">... See all</a>');
					$(this).append('<span class="more-text hide">' + removedStr + '</span>');
				}
			});


			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.reviewitem;


			opts.$container.off('click.vc.reviewitem', opts.$itemSellAll).on('click.vc.reviewitem', opts.$itemSellAll, function(e){
				e.preventDefault();
				self.log('clicked see all');

				var $el = $(this);
				$el.siblings('.more-text').fadeIn();
				$el.remove();
			});

			opts.$container.off('click.vc.reviewitem', opts.$reviewMoreLink).on('click.vc.reviewitem', opts.$reviewMoreLink, function(e){
				e.preventDefault();
				self.log('clicked more link');

				var $el = $(this);
				$el.hide();
				$el.closest('.review-item-footer-inner-left').find('.js-hide-share').hide();
				$el.closest('.review-item-footer-inner-left').find('.js-show-more').removeClass('hide').addClass('inline');
				$el.closest('.review-item-footer-inner-left').find('.js-show-more-two').removeClass('hide').addClass('inline');
			});

			opts.$editBtn.off('click.vc.reviewitem').on('click.vc.reviewitem', function () {
				var $this = $(this);
				opts.$editModalReviewText.val(opts.$reviewitemText.text()).focus();

				var prevRating = $this.closest('.nreview-item').find('.c-rating .icon-star').length;
				$(opts.$editReviewModalRatingLabel[prevRating - 1]).mouseover();
			});

			$('.reviewbox-photo-thumbnail-close').off('click').on('click',function (e) {
				$(this).parent().remove();
				if (!opts.$reviewboxPhotosWrapper.find('.reviewbox-photo-thumbnail').not('.hide').length) {
					opts.$reviewboxPhotosWrapper.hide();
				}
			});


			opts.$helpfulBtn.off('click.vc.reviewitem').on('click.vc.reviewitem', function(e){
				e.preventDefault();
				var $thisHelpful = $(this);
				var $thisUnhelpful = $thisHelpful.closest(opts.$container).find(opts.$unhelpfulBtn);
				var helpfulItemCount = +$thisHelpful.find('.item-count').text();
				var unHelpfulItemCount = +$thisUnhelpful.find('.item-count').text();
				var helpful;

				if($thisHelpful.hasClass('active')){
					// Currently set,  so unset it and reduce the item count
					helpful = 2;
				}
				else{
					// Not set, so set it and increase the item count
					helpful = 1;
				}


				var data = {
					reviewid: $(this).closest(opts.$container).attr(self.attr_name('reviewitem')),
					bizid: $(this).closest(opts.$container).attr(self.attr_name('bizid')),
					// userid: cf.user.id,
					helpful: helpful
				};

				self.log(data, 'click data');

				var checkAuthData = {
					method: 'GET',
					url: opts.helpfulURL,
					data: data
				};

				self.checkAuth(function(){
					if($thisHelpful.hasClass('active')){
						// Currently set, so unset it and reduce the item count
						$thisHelpful.find('.item-count').text(helpfulItemCount - 1);
						$thisHelpful.toggleClass('active');
					}
					else{
						// Not set, so set it and increase the item count
						$thisHelpful.find('.item-count').text(helpfulItemCount + 1);
						$thisHelpful.toggleClass('active');
						if($thisUnhelpful.hasClass('active')){
							$thisUnhelpful.toggleClass('active');
							$thisUnhelpful.find('.item-count').text(unHelpfulItemCount - 1);
						}
					}


					$.getJSON(opts.helpfulURL, data, function(response){
						if(response.status == 1){
								// self.notifyMe("Thanks for the feedback!!");
								self.log('Feedback sent successfully.');
						}
						else{
							self.notifyMe({message:'Something went wrong with that action. Please try again.', type:'error'});
								if($thisHelpful.hasClass('active')){
									// Currently set, so unset it and reduce the item count
									$thisHelpful.find('.item-count').text(helpfulItemCount);
									$thisHelpful.toggleClass('active');
								}
								else{
									// Not set, so set it and increase the item count

									$thisHelpful.find('.item-count').text(helpfulItemCount);
									$thisHelpful.toggleClass('active');
									self.log('it was not active before failure');
									if($thisUnhelpful.hasClass('active')){
										self.log('I  have active on unhelpful after failing');
									}
									else{
										$thisUnhelpful.toggleClass('active');
										self.log('I dont have active on unhelpful after failing');
										$thisUnhelpful.find('.item-count').text(unHelpfulItemCount);
									}
								}

							// $thisHelpful.addClass('active');
						}
					});
					// opts.$reviewFeedBack.removeClass('hide').fadeIn(300).fadeOut(2000);
				}, checkAuthData);
			});

			opts.$unhelpfulBtn.off('click.vc.reviewitem').on('click.vc.reviewitem', function(e){
				e.preventDefault();
				var $thisUnhelpful = $(this);
				var $thisHelpful = $thisUnhelpful.closest(opts.$container).find(opts.$helpfulBtn);
				var unhelpfulItemCount = +$thisUnhelpful.find('.item-count').text();
				var helpfulItemCount = +$thisHelpful.find('.item-count').text();
				var helpful;

				if($thisUnhelpful.hasClass('active')){
						// Currently set, so unset it and reduce the item count
					helpful = 3;
				}
				else{
					// Not set, so set it and increase the item count
					helpful = 0;
				}


				var data = {
					reviewid: $(this).closest(opts.$container).attr(self.attr_name('reviewitem')),
					bizid: $(this).closest(opts.$container).attr(self.attr_name('bizid')),
					// userid: cf.user.id,
					helpful: helpful
				};

				var checkAuthData = {
					method: 'GET',
					url: opts.helpfulURL,
					data: data
				};

				self.checkAuth(function(){

					if($thisUnhelpful.hasClass('active')){
						// Currently set, so unset it and reduce the item count
						$thisUnhelpful.find('.item-count').text(unhelpfulItemCount - 1);
						$thisUnhelpful.removeClass('active');
					}
					else{
						// Not set, so set it and increase the item count
						$thisUnhelpful.find('.item-count').text(unhelpfulItemCount + 1);
						$thisUnhelpful.addClass('active');
					}

					if($thisHelpful.hasClass('active')){
						$thisHelpful.removeClass('active');
						$thisHelpful.find('.item-count').text(helpfulItemCount - 1);
					}


					$.getJSON(opts.helpfulURL, data, function(response){
						if(response.status == 1){
							// self.notifyMe('Thanks for the feedback!!');
							self.log('Feedback sent successfully.');
						}
						else{
							self.notifyMe({message:'Something went wrong with that action. Please try again.', type:'error'});
							self.log('After error message');
								if($thisUnhelpful.hasClass('active')){
									// Currently set, so unset it and reduce the item count
									self.log('it was active before failure');
									$thisUnhelpful.find('.item-count').text(unhelpfulItemCount);
									$thisUnhelpful.toggleClass('active');
								}
								else{
									// Not set, so set it and increase the item count

									$thisUnhelpful.find('.item-count').text(unhelpfulItemCount);
									$thisUnhelpful.toggleClass('active');
									self.log('it was not active before failure');
									if($thisHelpful.hasClass('active')){
										self.log('I  have active on unhelpful after failing');
									}
									else{
										$thisHelpful.toggleClass('active');
										self.log('I dont have active on unhelpful after failing');
										$thisHelpful.find('.item-count').text(helpfulItemCount);
									}
								}
						}
					});
				}, checkAuthData);
			});

			opts.$reportBtn.off('click.vc.reviewitem').on('click.vc.reviewitem', function(e){
				e.preventDefault();
				opts.$currentReviewitemId = $(this).closest(opts.$container).attr(self.attr_name('reviewitem'));
			});
			opts.$reportNotConfirm.off('click.vc.reviewitem').on('click.vc.reviewitem', function(e){
				e.preventDefault();
				self.publish('vc:popover/close', {popoverTarget: $('.js-report')});
			});

			opts.$reportConfirm.off('click.vc.reviewitem').on('click.vc.reviewitem', function(e){
				e.preventDefault();


				var $thisAbusive = $(this);
				var isabusive = 1;

				// if($thisAbusive.hasClass('active')){
				// 	// Currently set, so unset it and reduce the item count
				// 	isabusive = 0;
				// 	// $thisAbusive.removeClass('active');
				// }
				// else{
				// 	// Not set, so set it and increase the item count
				// 	isabusive = 1;
				// 	// $thisAbusive.addClass('active');
				// }

        self.log(opts.$currentReviewitemId,'log review id');
				var data = {
					reviewId: opts.$currentReviewitemId,
					bizId: opts.$container.attr(self.attr_name('bizid')),
					isabusive: isabusive
				};

				var checkAuthData = {
					method: 'GET',
					url: opts.reportAbuseURL,
					data: data
				};

				self.checkAuth(function(){
					$.getJSON(opts.reportAbuseURL, data, function(response){
						if(response.status == 1){
							self.publish('vc:popover/close', {popoverTarget: $('.js-report')});
							self.notifyMe('Thanks for the feedback!!');
						}
						else{
							self.publish('vc:popover/close', {popoverTarget: $('.js-report')});
							self.notifyMe({message:'Unable to complete your feedback!!', type:'error'});
							// $thisAbusive.removeClass('active');
						}
					});

				}, checkAuthData);
			});
			// opts.$reviewSnippetViewMore.off('click.vc.reviewitem').on('click.vc.reviewitem', function(e){
			// 	e.preventDefault();

			// 	$(this).closest(opts.$container).find(opts.$reviewSnippetWrapper).hide();
			// 	$(this).closest(opts.$container).find(opts.$reviewitemText).show();
			// });

		}
	};
}(jQuery, window, document));

/* global doT */
/**
	component_name - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.listItem = {
		config: {
			listItem: {
				curatedURL: '/home/LikeCuratedList',
				homePageList: '/home/GetList',
				deleteListUrl: '/lists/DeleteList',
				redirectAfterDelete : '/curated-lists.html',
				mobileRedirectAfterDelete : '/mobile/curated-list.html',
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.listItem;

			opts.$container = $('[' + self.attr_name('curatedlist') + ']');
			opts.$deleteModal = $('.js-delete-list');
			opts.$hpFeaturedList = $('.js-hp-featured-list');
			// opts.$deleteListPageModal = $('.js-delete-listpage');

			// opts.$deleteListPage = opts.$container.find('.js-listpage-delete');
			// opts.$deleteListPageNo = opts.$deleteListPageModal.find('.js-delete-listpage-no');
			// opts.$deleteListPageYes = opts.$deleteListPageModal.find('.js-delete-listpage-yes');

			opts.$deleteListItem = opts.$container.find('.js-delete-list-item');
			opts.$deleteListConfirm = opts.$deleteModal.find('.js-delete-list-yes');
			opts.$deleteListNotConfirm = opts.$deleteModal.find('.js-delete-list-no');

			// opts.$deleteMobileListItem = opts.$container.find('.js-delete-list-item');
			// opts.$deleteMobileListConfirm = opts.$deleteModal.find('.js-delete-list-yes');
			// opts.$deleteMobileListNotConfirm = opts.$deleteModal.find('.js-delete-list-no');
			// self.log(opts.$deleteList,'deletebutton');
			// opts.url = '/home/LikeCuratedList';

			opts.likeBtn = '.js-like-click';
			opts.likeTag = '.js-likes-tag';
			opts.likeIcon = '.js-like-icon';
			opts.likeCount = '.js-like-count';
			opts.listActive = 'active';

			opts.$likeCountContainer = opts.$container.find(opts.likeCount);
			opts.$likeTagContainer = opts.$container.find(opts.likeTag);
			opts.$listLikeTextContainer = opts.$container.find('.js-list-like-text');
			opts.countText = +opts.$likeCountContainer.text();
			// opts.$listLikeText = opts.$listLikeTextContainer.text();




			if(!opts.$container.length)return false;

			opts.countText == 1 ? opts.$likeTagContainer.text('like') : opts.$likeTagContainer.text('likes');

			self.reRootSiteURLs(opts, cf.siteRoot);

			// Code begins here...
			self.require('doT', function(){
				return (typeof doT !== 'undefined');
			},function(){
				self.events();
			});
			// this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.listItem;

					// opts.$deleteListPage.off('click.vc.listItem').on('click.vc.listItem', function(e){
					// 	e.preventDefault();

					// 	opts.$listItemPageToDelete = $(this).closest(opts.$container).attr(self.attr_name('curatedlist'));

					// 	self.log(opts.$listItemPageToDelete, 'Current list to delete');

					// });

					// opts.$deleteListPageNo.off('click.vc.listItem').on('click.vc.listItem', function(e){
					// 	e.preventDefault();

					// 	self.publish('vc:modal/close', {modal: opts.$deleteListPageModal});


					// 	self.log('NO button is clicked');

					// });

					// opts.$deleteListPageYes.off('click.vc.listItem').on('click.vc.listItem', function(e){
					// 	e.preventDefault();
					// 	var data = {
					// 		ListId: opts.$listItemPageToDelete
					// 	};

					// 	// opts.$itemToDelete = $(this).closest(opts.$container).attr(self.attr_name('curatedlist'));
					// 	// self.log(itemToDelete, 'current business id');
					// 	var checkAuthData = {
					// 		method: 'GET',
					// 		url: opts.deleteListUrl,
					// 		data: data
					// 	};
					// 	self.checkAuth(function(){
					// 		$.getJSON(opts.deleteListUrl, data, function(response){
					// 			if(response.StatusCode == 1){
					// 				self.publish('vc:modal/close', {modal: opts.$deleteListPageModal});

					// 				self.notifyMe('The list was successfully deleted');
					// 					if(!cf.isMobile){
					// 						setTimeout(function(){ window.location = opts.redirectAfterDelete; }, 2000);
					// 					}
					// 					else {
					// 						setTimeout(function(){ window.location = opts.mobileRedirectAfterDelete; }, 2000);
					// 					}
					// 			}
					// 			else{
					// 				self.publish('vc:modal/close', {modal: opts.$deleteListPageModal});

					// 				self.notifyMe({message:'Something went wrong with that action. Please try again.', type:'error'});
					// 			}

					// 		});
					// 	}, checkAuthData);

					// });


					opts.$deleteListItem.off('click.vc.listItem').on('click.vc.listItem', function(e){
						e.preventDefault();
						// opts.$listToDelete = $(this).closest('li').find('[' + self.attr_name('curatedlist') + ']');
						opts.$listToDelete = $(this).closest('li');
						opts.$listToDeleteId = $(this).closest(opts.$container).attr(self.attr_name('curatedlist'));
						// opts.$listToDelete = $(this).closest(self.attr_name('curatedlist'));
						self.log(opts.$listToDeleteId, 'Current list');
						self.log(opts.$listToDelete, 'Current list selected');

					});


					opts.$deleteListConfirm.off('click.vc.listItem').on('click.vc.listItem', function(e){

						e.preventDefault();
						self.loading(opts.$deleteModal, 'start');

						if(opts.$listToDelete.closest(opts.$hpFeaturedList)){
							var addOneListTemplate = $('#addOneListTemplate').html();
							self.log(addOneListTemplate);
						}

						// $(this).prop('disabled', true);

						// $(this).attr('disabled', 'disabled');

						var data = {
							ListId: opts.$listToDeleteId
						};

						// opts.$itemToDelete = $(this).closest(opts.$container).attr(self.attr_name('curatedlist'));
						// self.log(itemToDelete, "current business id");
						var checkAuthData = {
							method: 'GET',
							url: opts.deleteListUrl,
							data: data
						};

						self.checkAuth(function(){
							$.getJSON(opts.deleteListUrl, data, function(response){
								if(response.StatusCode == 1){
								// opts.$deleteListConfirm.removeAttr("disabled");
								self.publish('vc:modal/close', {modal: opts.$deleteModal});


									if((opts.$container).hasClass('js-list-item')){
										if(!cf.isMobile){

											setTimeout(function(){ window.location = opts.redirectAfterDelete; }, 2000);
										}
										else {
											self.notifyMe('You have deleted your list!!');
											setTimeout(function(){ window.location = opts.mobileRedirectAfterDelete; }, 2000);
										}
									}
									else{
										opts.$listToDelete.fadeOut().remove().delay(1000);
										if(opts.$listToDelete.closest(opts.$hpFeaturedList)){
											// var addOneListTemplate = $('#addOneListTemplate').html();
											self.loading(opts.$hpFeaturedList,'start');
											$.getJSON(opts.homePageList, function(data){
													self.log(data, 'List retrieved');
													var templateData = {};
													templateData.docs = data.DynamicHomePageContent.FeaturedBusinessContent;
													templateData.user = cf.user;
													var oneListItem = doT.template(addOneListTemplate)(templateData);
													var $oneListItem = $(oneListItem);
													self.log(templateData.docs, 'length');


													opts.$hpFeaturedList.append($oneListItem);

													self.publish('vc:init', 'listItem');
													self.publish('vc:init', 'lazyload');
													self.publish('vc:init', 'modal');
													// opts.$hpFeaturedList.append("<li>One list pulled</li>");

											})
											.always(function(data){
												self.loading(opts.$hpFeaturedList,'stop');
											});
											self.log(opts.$hpFeaturedList,'deleted list on homepage');
										}
										self.notifyMe('You have deleted your list!!');

									}
								}
								else{
									self.publish('vc:modal/close', {modal: opts.$deleteModal});

									self.notifyMe({message:'Oops something went the wrong. Try that again!!', type:'error'});

								}

							})
							.always(function(data){
								self.loading(opts.$deleteModal,'stop');
							});
						}, checkAuthData);
						self.loading(opts.$deleteModal.find('.delete-decision'), 'stop');
						self.log(this, 'current clicked!!!!!!!!!');
						// opts.$deleteListConfirm.removeClass(opts.$deleteListConfirm);
						// self.publish('vc:init', 'modal');
						// $(this).off(e);
						// self.publish('vc:init', 'modal');
						// $(this).removeAttr('disabled');
						// opts.$deleteModal.load(location+' #js-delete-list-modal');


					});


					opts.$deleteListNotConfirm.off('click.vc.listItem').on('click.vc.listItem', function(e){
						e.preventDefault();

						self.publish('vc:modal/close', {modal: opts.$deleteModal});

						self.log('NO button is clicked');


					});


					// opts.$deleteMobileListItem.off('click.vc.listItem').on('click.vc.listItem', function(e){
					// 	e.preventDefault();
					// 	opts.$listToDelete = $(this).closest('li').find('[' + self.attr_name('curatedlist') + ']');
					// 	opts.$listToDeleteId = $(this).closest(opts.$container).attr(self.attr_name('curatedlist'));
					// 	// opts.$listToDelete = $(this).closest(self.attr_name('curatedlist'));
					// 	self.log(opts.$listToDeleteId, 'Current list');

					// });


					// opts.$deleteMobileListConfirm.off('click.vc.listItem').on('click.vc.listItem', function(e){
					// 	var data = {
					// 		ListId: opts.$listToDeleteId
					// 	};

					// 	// opts.$itemToDelete = $(this).closest(opts.$container).attr(self.attr_name('curatedlist'));
					// 	// self.log(itemToDelete, 'current business id');
					// 	var checkAuthData = {
					// 		method: 'GET',
					// 		url: opts.deleteListUrl,
					// 		data: data
					// 	};
					// 	self.checkAuth(function(){
					// 		$.getJSON(opts.deleteListUrl, data, function(response){
					// 			if(response.status == 1){
					// 				self.publish('vc:modal/close', 'delete-list-modal');
					// 				// $(this).closest(self.attr_name('curatedlist')){

					// 					opts.$listToDelete.fadeOut().remove().delay(2500);

					// 				// };
					// 				self.notifyMe('Thanks for the feedback!!');
					// 			}
					// 			else{
					// 				self.notifyMe('Oops something wen the wrong!!');
					// 			}

					// 		});
					// 	}, checkAuthData);

					// });


					// opts.$deleteMobileListNotConfirm.off('click.vc.listItem').on('click.vc.listItem', function(e){
					// 	// e.preventDefault();

					// 	self.log('NO button is clicked');
					// 	self.publish('vc:modal/close', 'delete-list-modal');

					// });


					opts.$container.off('click.vc.listItem', opts.likeBtn).on('click.vc.listItem', opts.likeBtn, function (e) {
						e.preventDefault();

						var $el = $(this);
						var listContainer = $el.closest(opts.$container);
						var listID = +listContainer.attr(self.attr_name('curatedlist'));
						var likeCount = listContainer.find(opts.likeCount);
						var likeTag = listContainer.find(opts.likeTag);
						var count = +likeCount.text();
						var likeTagText = likeTag.text();
						var nCount = count + 1;
						var rCount = count - 1;
						var likeRel, errorMessage;

						self.log(opts.$listLikeTextContainer.text(), 'text');

						nCount == 1 ? likeTag.text('like') : likeTag.text('likes');

						if($el.hasClass(opts.listActive))
						{
							likeRel = 0;
						} else {
							likeRel = 1;
						}

						var formData = {
							'listid': listID,
							'islike': likeRel
						};

						var checkAuthData = {
							method: 'GET',
							url: opts.curatedURL,
							data: formData
						};

						self.log(formData, checkAuthData);

						self.checkAuth(function(){

							if($el.hasClass(opts.listActive))
							{
								likeRel = 0;
								$el.removeClass(opts.listActive);
								likeCount.html(rCount);
								opts.$listLikeTextContainer.text('like');
							} else {
								likeRel = 1;
								$el.addClass(opts.listActive);
								likeCount.html(nCount);
								opts.$listLikeTextContainer.text('liked');
							}

							$.ajax({
								type        : 'GET', // define the type of HTTP verb we want to use (GET for our form)
								url         : opts.curatedURL, // the url where we want to GET
								data        : formData, // our data object
								dataType    : 'json', // what type of data do we expect back from the server
								encode      : true
							})
							// using the done promise callback
							.done(function(data) {

								// log data to the console so we can see
								self.log(data);
								if(data.status == 1) {
									// self.notifyMe('Thanks for the feedback!!');
									self.log('Feedback sent successfully.');
								}
								else {
									// if($el.hasClass(opts.listActive))
									// {
									// 	$el.toggleClass(opts.listActive);
									// 	likeCount.html(rCount);
									// } else {
									// 	$el.toggleClass(opts.listActive);
									// 	likeCount.html(nCount);
									// }
									$el.toggleClass(opts.listActive);
									likeCount.html(count);
									opts.$listLikeTextContainer.text('like');

									// $el.hasClass(opts.listActive) ? opts.$listLikeTextContainer.text('liked') : opts.$listLikeTextContainer.text('like');
									errorMessage = 'Oops! Something went wrong. Please try again later.';
									self.notifyMe({message:errorMessage, type:'error'});
								}
							});
						}, checkAuthData);

					});
		}
	};
}(jQuery, window, document));

/**
	component_name - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.social = {
		config: {
			social: {}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.social;

			opts.$container = $('[' + self.attr_name('social') + ']');
			if(!opts.$container.length)return false;

			// Code begins here...

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.social;

					opts.$container.off('click.vc.social').on('click.vc.social',function(e){
						e.preventDefault();

						self.share(this);

					});


		},
		share:function (el) {
			var self = this,
					cf = this.config,
					opts = cf.social;

					var $el = $(el),
							urlLink = $el.attr(self.attr_name('social')),
							siteUrl = $el.attr(self.attr_name('socialUrl')),
							siteRedirectUrl = $el.attr(self.attr_name('socialRedirectUrl')),
							titleName = $el.attr(self.attr_name('socialTitle')),
							number = $el.attr(self.attr_name('socialNumber')),
							hashtags = $el.attr(self.attr_name('socialHashtags')),
							handle = $el.attr(self.attr_name('socialHandle')),
							summary = $el.attr(self.attr_name('socialSummary')),
							image = $el.attr(self.attr_name('socialImage')),
							domain = $el.attr(self.attr_name('socialDomain')),
							mini = !!$el.attr(self.attr_name('socialMini')),
							name = $el.attr(self.attr_name('socialName')),
							href = $el.attr('href'),
							link, nameQuery, titleQuery, siteRedirectUrlQuery, summaryQuery, imageQuery, hashtagsQuery, handleQuery, miniQuery, domainQuery, siteUrlQuery;
							// window.location = image;
// 							https://www.facebook.com/dialog/feed?app_id=1389892087910588
// &redirect_uri=https://scotch.io
// &link=https://scotch.io
// &picture=http://placekitten.com/500/500
// &caption=This%20is%20the%20caption
// &description=This%20is%20the%20description


					if(urlLink == 'facebook') {
						// link = 'https://www.facebook.com/sharer.php?u=' + siteUrl 1389892087910588;
						link = 'https://www.facebook.com/dialog/feed?app_id=699173753481084';

						if(typeof siteUrl !== 'undefined'){
							siteUrlQuery = '&link=' + siteUrl;
							link += siteUrlQuery;
						}

						if(typeof name !== 'undefined'){
							nameQuery = '&name=' + name;
							link += nameQuery;
						}

						if(typeof siteRedirectUrl !== 'undefined'){
							siteRedirectUrlQuery = '&redirect_uri=' + siteUrl;
							link += siteRedirectUrlQuery;
						}

						if(typeof titleName !== 'undefined'){
							// titleQuery = '&p[title]=' + titleName;
							titleQuery = '&caption=' + titleName;
							link += titleQuery;
						}

						if(typeof summary !== 'undefined'){
							// summaryQuery = '&p[summary]=' + summary;
							summaryQuery = '&description=' + summary;
							link += summaryQuery;
						}

						if(typeof image !== 'undefined'){
							// imageQuery = '&p[images][0]=' + image;
							imageQuery = '&picture=' + image;
							link += imageQuery;
						}

						window.open(link, urlLink + '-share-dialog', 'width=626,height=436');
					}

					else if(urlLink == 'twitter') {
						link = 'http://twitter.com/intent/tweet?url=' + siteUrl;

						if(typeof titleName !== 'undefined'){
							titleQuery = '&text=' + titleName;
							link += titleQuery;
						}

						if(typeof hashtags !== 'undefined'){
							hashtagsQuery = '&hashtags=' + hashtags;
							link += hashtagsQuery;
						}

						if(typeof handle !== 'undefined'){
							handleQuery = '&via=' + handle;
							link += handleQuery;
						}

						window.open(link, urlLink + '-share-dialog', 'width=626,height=436');
						// link = 'http://twitter.com/intent/tweet?text=' + title + '&url=' + url + '&hashtags=' + hashtags + '&via=' + handle;
					}

					else if(urlLink == 'phone-number') {
						link = 'tel://' + number;
						$el.attr('href', link);
						location.href = link;
					}

					else if(urlLink == 'email') {
						link = 'mailto:?subject=' + titleName;

						if(typeof summary !== 'undefined'){
							summaryQuery = '&body=' + summary;
							link += summaryQuery;
						}
						window.location.href = link;
						// $el.attr('href', link);
						// window.open(link, urlLink);
					}

					else if(urlLink == 'whatsapp') {
						link = 'whatsapp://send?text=' + titleName;

						window.location.href = link;
					}

					else if(urlLink == 'goopleplus') {
						link = 'https://plus.google.com/share?url=' + siteUrl;

						if(typeof titleName !== 'undefined'){
							titleQuery = '&t=' + titleName;
							link += titleQuery;
						}

						window.open(link, urlLink + '-share-dialog', 'width=626,height=436');
					}

					else if(urlLink == 'linkedin') {
						// link = 'https://www.linkedin.com/cws/share?url=' + url + '&t=' + title;
						link = 'https://www.linkedin.com/shareArticle?url=' + siteUrl;

						if(typeof titleName !== 'undefined'){
							titleQuery = '&title=' + titleName;
							link += titleQuery;
						}

						if(typeof summary !== 'undefined'){
							summaryQuery = '&summary=' + summary;
							link += summaryQuery;
						}

						if(typeof mini !== 'undefined'){
							miniQuery = '&mini=' + mini;
							link += miniQuery;
						}

						if(typeof domain !== 'undefined'){
							domainQuery = '&source=' + domain;
							link += domainQuery;
						}

						window.open(link, urlLink + '-share-dialog', 'width=626,height=436');

					}

					// var newHref = $el.attr('href', link);
					// self.log('clicked', href);


					// window.open(link, urlLink + '-share-dialog', 'width=626,height=436');


		}
	};
}(jQuery, window, document));

/**
	popover - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example

	On hover
	position: left, top, bottom, right
*/

;(function($, window, document, undefined){
	window.app.comps.popover = {
		config: {
			popover: {
				margin: 5,
				position: 'bottom',
				animationClass: 'fade slide'
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.popover;


			opts.$container = $('[' + self.attr_name('popover') + ']');
			opts.$popoverContents = $('[' + self.attr_name('popover-content') + ']').addClass(opts.animationClass);
			// opts.OriginalCurContentCSS = undefined;
			// opts.activePopover = undefined;
			opts.localUserCache = {};

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.popover;

			opts.$container.off('mouseenter.vc.popover').on('mouseenter.vc.popover', function(e){
				// Handle on hover scenarios
				var $this = $(this);
				e.preventDefault();

				if($this[0].hasAttribute(self.attr_name('hover'))){
					self.openPopover($this);
				}

			});
			opts.$container.off('mouseleave.vc.popover').on('mouseleave.vc.popover', function(e){
				var $this = $(this);
				e.preventDefault();

				if($this[0].hasAttribute(self.attr_name('hover'))){
					self.closePopover($this);
				}
			});

			opts.$container.off('click.vc.popover').on('click.vc.popover', function(e){
				var $this = $(this);
				e.preventDefault();
				// Stop propagation so the document event isn't triggered
				e.stopPropagation();

				self.openPopover($this);
			});

			$(document).bind('touchstart',function(event){// for iphone/ipad
    		opts.$popoverContents.removeClass('is-open');
      });

			$(document).off('click.vc.popover').on('click.vc.popover', function(e){
				// Close popovers when the document is clicked
				opts.$popoverContents.removeClass('is-open');
			});

			opts.$popoverContents.off('click.vc.popover').on('click.vc.popover', function(e){
				// Prevent popover from closing when you click the content
				e.stopPropagation();
			});

			$(opts.$popoverContents).bind('touchstart',function(e){// for iphone/ipad
				e.stopPropagation();
      });

			self.subscribe('vc:popover/close', function(data){
				self.log('closing popover..', data);
				self.closePopover(data.popoverTarget);
			});
		},

		popoverCss : (function cacheOriginalPopoverCss(self) {
			var originalCss={}, $activePopover, $curTarget, key;

			function cacheOriginalCss(_$curTarget, _$activePopover, _key, css) {
				var isCurTaget = $curTarget ? $curTarget.is(_$curTarget) : false,
						pageScrolled = $curTarget ? (_$curTarget.offset().top !== $curTarget.offset().top || _$curTarget.offset().left !== $curTarget.offset().left) : false;

				if (!key) {
					key = _key;
				}
				if(!isCurTaget){
					$activePopover = _$activePopover;
					$curTarget = _$curTarget;
				}

				if (!isCurTaget && key === _key) {
					originalCss = $.extend(css, {left : originalCss.left});
					_$activePopover.css(originalCss);
					return;
				}

				if (!isCurTaget || pageScrolled) {
					originalCss = css;
					_$activePopover.css(css);
					key = _key;
					return;
				}
				if (isCurTaget && pageScrolled) {
					_$activePopover.css(originalCss);
					return;
				}
			}

			return {
				cache : cacheOriginalCss
			};
		}(this)),
		openPopover:function($curTarget, forcedPosition){
			var self = this,
					cf = this.config,
					opts = cf.popover;

			var key = $curTarget.attr(self.attr_name('popover'));

			var $curContent = $('[' + self.attr_name('popover-content') + '="' + key + '"]').toggleClass('is-open');
			opts.$popoverContents.not($curContent).removeClass('is-open');

			self.log($curTarget, forcedPosition, 'openPopover');

			if(forcedPosition){
				// Open the content, which was closed by `toggleClass()` above
				// REASON: For proper calculation of position
				$curContent.addClass('is-open');
				self.log('forced');
			}

			var targetPos = $curTarget.offset();

			var positionedParent = $curContent.offsetParent();
			var parentOffset = positionedParent.offset(); //top, left

			// If it's a user popover, set the position to 'top'
			if(key == 'user-popover')forcedPosition = 'top';

			var curPosStr = forcedPosition || $curTarget.attr(self.attr_name('position')) || opts.position;
			// TODzO: Figure out how to get the resultant height for positioning
			self.log($curContent.outerHeight());

			var posOffset = {top: 0, left: 0};
			switch(curPosStr){
				case 'left':
					posOffset = {top: 0, left: (-$curContent.outerWidth() - opts.margin)};
					break;
				case 'right':
					posOffset = {top: 0, left: ($curTarget.outerWidth() + opts.margin)};
					break;
				case 'top':
					posOffset = {top: (-$curContent.outerHeight() - opts.margin), left: 0};
					// If there's not enough space to the left to contain the popover, change the 'left' position
					if($curTarget.outerWidth() > $(window).width() - targetPos.left){
						posOffset.left = -$curContent.outerWidth() + $curTarget.outerWidth();
					}
					break;
				case 'bottom':
					posOffset = {top: ($curTarget.outerHeight() + opts.margin), left: 0};
					if(targetPos.left > $(window).width() - targetPos.left + $curTarget.outerWidth()){
						posOffset.left = -$curContent.outerWidth() + $curTarget.outerWidth();
					}
					break;
			}

			// self.log(curPosStr, 'current pop position');
			var finalCss = {top: targetPos.top - parentOffset.top + posOffset.top, left: targetPos.left - parentOffset.left + posOffset.left};
			// $curContent.css(finalCss);
			self.popoverCss.cache($curTarget, $curContent, key, finalCss);
			// Check position top
			if(curPosStr == 'top' && $curContent.offset().top < 0)self.openPopover($curTarget, 'bottom');
			// Check position bottom
			else if(curPosStr == 'bottom' && $curContent.offset().top + $curContent.height() > $(window).height())self.openPopover($curTarget, 'top');
			// Check position left
			else if(curPosStr == 'left' && $curContent.offset().left < 0)self.openPopover($curTarget, 'bottom');
			// Check position right
			else if(curPosStr == 'right' && $curContent.offset().left + $curContent.width() > $(window).width())self.openPopover($curTarget, 'bottom');

			if(key == 'user-popover'){
				var uid = $curTarget.attr(self.attr_name('uid'));
				if(!opts.localUserCache[uid]){
					var $contentLoader = $curContent.find('.loading').show();
					var $contentInner = $curContent.find('.js-user-hover-card-content').hide();
					$.getJSON('http://api.randomuser.me', {seed: uid}, function(result){
						self.log(result, 'user data gotten.. and so we pop!');
						self.renderUserPopover.call(self, result);
						opts.localUserCache[uid] = result;
					});
				}
				else{
					self.log(opts.localUserCache[uid], 'we already have user data.. and so we pop!');
					self.renderUserPopover(opts.localUserCache[uid]);
				}
			}
		},
		closePopover:function($curTarget){
			var self = this,
					cf = this.config,
					opts = cf.popover;

			var key = $curTarget.attr(self.attr_name('popover'));

			var $curContent = $('[' + self.attr_name('popover-content') + '="' + key + '"]');
			$curContent.removeClass('is-open');
		},
		renderUserPopover:function(data){
			var self = this,
					cf = this.config,
					opts = cf.popover;

			var $curContent = $('[' + self.attr_name('popover-content') + '="user-popover"]');
			var $contentLoader = $curContent.find('.loading').hide();
			var $contentInner = $curContent.find('.js-user-hover-card-content').fadeIn();

			$contentInner.find('.user-hover-card-name').html(data.results[0].user.name.first + ' ' + data.results[0].user.name.last);
		}
	};
}(jQuery, window, document));

/**
	addtolist - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.addtolist = {
		config: {
			addtolist: {
				usersListURL: '/SearchListWEB/GetCuratedListForUser',
				createListURL: '/lists/CreateCuratedList',
				addtolistURL : '/SearchListWEB/AddToCuratedList'
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf 	 = this.config,
					opts = cf.addtolist;

			opts.$container = $('[' + self.attr_name('addtolist') + ']');
			self.log('$container should be', opts.$constainer);

			if(!opts.$container.length)return false;

			// Code begins here...
			opts.$addtolistModal = $('.js-addtolist-modal');
			opts.$businessCreateLink = $('.add-to-list-create-list-link');
			opts.$addtolistForm  = opts.$addtolistModal.find('.js-addtolist-form');
			opts.$listTitleInput = opts.$addtolistModal.find('.js-list-title-input');
			opts.$listDescriptionInput = opts.$addtolistModal.find('.js-list-description-input');
			opts.$savedBusinesses = $('.js-saved-businesses');

			opts.$listPopoverList = $('.js-list-popover-list');
			opts.curBusiness = {};
			opts.usersListURL = cf.env === 'development' ? '/_staticapi/users-list.json' : opts.usersListURL;
			opts.addtolistURL = cf.env === 'development' ? '/_staticapi/addtolist-create.json' : opts.addtolistURL;
			this.events();
		},
		events:function(){
			// This contains the event bindings and subscriptions
			var self = this,
					cf 	 = this.config,
					opts = cf.addtolist;

			opts.$container.off('click.vc.addtolist').on('click.vc.addtolist', function(e){
				var $el = $(this);

				opts.curBusiness.id   = $el.attr(self.attr_name('addtolist'));
				opts.curBusiness.name = $el.attr(self.attr_name('addtolist-name'));
				self.log('curBusiness.name is', opts.curBusiness.name);
				var formData = {businessId:opts.curBusiness.id};

				// self.checkAuth(function(){

					self.loading(opts.$listPopoverList, 'start');
					$.getJSON(opts.usersListURL, formData, function refreshUserList(data){
						opts.$listPopoverList.find('.js-user-curated-list').remove();
						if(data.StatusCode == 1) {
							if (data.Result.IsSaved === '1') {
								opts.$savedBusinesses.addClass('active');
							}
							else {
								$(opts.$savedBusinesses).removeClass('active');
							}

							data.Result.CuratedLists.forEach( function (list) {
								var listHasCurBusiness = list.IsExist,
								flagExistClass = listHasCurBusiness === 1 ? 'active' : '',
								$list = $('<li class="js-user-curated-list '+flagExistClass+'"><a href="#" class="js-list-link" data-vc-listid="'+list.ListId+'">'+list.ListName+'</a></li>');
								opts.$listPopoverList.prepend($list);
							});
						}
						else {
							self.notifyMe({message: 'Oops! Something went wrong. You can try again later.', type: 'error'});
						}
					})
					.always(function functionName() {
						self.loading(opts.$listPopoverList, 'stop');
					});
				// }, {method: 'GET', url: opts.usersListURL, data: formData });
			});

			opts.$businessCreateLink.off('click.vc.createlist').on('click.vc.createlist', function(e){
				self.log('create list');
				self.checkAuth(function(){
					e.preventDefault();

					$(opts.$addtolistForm)[0].reset();
				});
			});

			opts.$addtolistForm.off('valid.fdtn.abide.vc.addtolist').on('valid.fdtn.abide.vc.addtolist', function(){
				if(!opts.$listTitleInput.val().replace(/[^a-zA-Z0-9]/g, '')){
					self.notifyMe({message: 'You need to provide a proper title for your list.', type: 'error'});
					opts.$listTitleInput.focus();
					return false;
				}
				var $form = $(this);

				var listTitle = opts.$listTitleInput.val();
				var listDescription = opts.$listDescriptionInput.val();

				var formData = {
					Listname: listTitle,
					Description: listDescription,
					businessids: opts.curBusiness.id,
					userid: cf.user.id,
					AccessType: 1
				};

				self.checkAuth(function(){
					self.loading(opts.$addtolistModal, 'start');
					$.ajax({
						url: opts.createListURL,
						type: 'POST',
						dataType: 'json',
						data: formData,
						success: function(data){
							self.log('Add to list - create: ', data);
							if(data.StatusCode == 1){
								// success
								self.notifyMe('Your list  <i>' + listTitle +'</i>  has been created.');
								var $newLi = $('<li class="js-user-curated-list ><a class="js-list-link" data-vc-listid="' + data.listid + '">' + listTitle + '</a></li>');
								opts.$listPopoverList.prepend($newLi);

								self.publish('vc:modal/close', {modal: opts.$addtolistModal});
							}
							else{
								self.notifyMe({message: 'Oops! Something went wrong. You can try again later.', type: 'error'});
							}
						},
						error:function(data){
							self.notifyMe({message: 'Oops! Something went wrong. You can try again later.', type: 'error'});
						},
						complete:function(){
							self.loading(opts.$addtolistModal, 'stop');
						}
					});
				}, {method: 'POST', url: opts.createListURL, data: formData});
			});

			opts.$listPopoverList.off('click.vc.addtolist', '.js-list-link').on('click.vc.addtolist', '.js-list-link', function(e){
				e.preventDefault();

				var $el = $(this),
					hasCurBusiness = $el.closest('li').hasClass('active'),
					ListName = $el.text();
				var formData = {
					bizid  : opts.curBusiness.id,
					listid : $el.attr(self.attr_name('listid')),
					flag   : hasCurBusiness ? 2 : 1
				};

				self.checkAuth(function(){
					var strAction = formData.flag === 1 ? 'added to': 'removed from';

					$.getJSON(opts.addtolistURL, formData, function(data){
							$el.closest('li').toggleClass('active');
							self.notifyMe('<i>' + opts.curBusiness.name + '</i> has been ' + strAction + ' <i>' + ListName +'</i> list.');
							if (data.Result === 4) {
								self.notifyMe('Your list <i>' + ListName + '</i> is now empty and has been deleted!');
							}
					}).fail(function(){
						self.notifyMe({message: 'Oops! Something went wrong. You can try again later.', type: 'error'});
						// $el.closest('li').toggleClass('active');
					});

					self.log('formData', formData);
				}, {method: 'GET', url: opts.addtolistURL, data: formData});
			});
		},
		// curBusinessBelongsTo:function(listId, listsContainingCurBusiness){
		// 	var self = this,
		// 			cf 	 = this.config,
		// 			opts = cf.addtolist;
		//
		// 	for (var i = listsContainingCurBusiness.length - 1; i >= 0; i--) {
		// 		if(listsContainingCurBusiness[i] == listId)return true;
		// 	}
		// 	return false;
		// }
	};
}(jQuery, window, document));

/**
	jumbotron - controls the behavior of the jumbotron component

	Usage: 'How to use component'
	Options:
		Option_name - Option_description
			Values: Possible_option_values
	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.jumbotron = {
		config:{
			imgBgClass: 'image-bg'
		},
		init:function(){
			// Contains the initialization code
			// ...
			var self = this,
					cf = this.config;
			// data-vc-src
			// data-vc-jumbotron
			var $jumbotrons = $('[' + self.attr_name('jumbotron') + ']');
			$jumbotrons.each(function(){
				self.log('Jumbo');
				var imgSrc = $(this).attr(self.attr_name('src'));
				if(imgSrc){
					$(this).css({
						backgroundImage: 'url('+ imgSrc + ')',
						backgroundSize: 'cover'
					}).addClass(cf.imgBgClass);
				}
			});


			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
		}
	};
}(jQuery, window, document));

/* global Dropzone */
/**
	component_name - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/


;(function($, window, document, undefined){
	window.app.comps.userSettings = {
		config: {
			userSettings: {
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.userSettings;

			opts.$container = $('[' + self.attr_name('user-settings') + ']');

			if(!opts.$container.length)return false;

			opts.$otpModal = $('.js-otp-modal');
			opts.$phoneNumber 		= opts.$container.find('.js-phone-number');
			opts.$phoneNumberValue 		= opts.$container.find('.js-phone-number').val();
			opts.$verifyNumber 		= opts.$container.find('.js-verify-number');
			self.log(opts.$phoneNumber, " Initial phone number");
			opts.$saveProfile 		= opts.$container.find('.js-save-profile');


			opts.$userSettingsPlaceholder 		= opts.$container.find('.js-settings-photo-placeholder');
			opts.$userPhotoChangeLink 		= opts.$container.find('.js-settings-photo-change-link');
			opts.$uploadUserPhoto 				= opts.$container.find('.js-settings-upload-photo');
			// opts.$metaPreviewWrapper = opts.$container.find('.js-meta-preview');
			opts.$userPhotoChangeWrapper 	= opts.$container.find('.js-settings-photo-change-wrapper');

			var curImageURL = opts.$container.attr(self.attr_name('imageurl'));
			var curImageSize = opts.$container.attr(self.attr_name('imagesize'));


			self.require('dropzone', function(){
					return (typeof Dropzone !== 'undefined');
				}, function(){
					// $('.js-upload-photo .dz-default').removeClass('dz-message');
					Dropzone.autoDiscover = false;
					// Dropzone.options.myAwesomeDropzone = {
						opts.$uploadUserPhoto.dropzone({
							url: opts.createListURL,
							autoProcessQueue:false,
							uploadMultiple:false,
							acceptedFiles: 'image/*',
							maxFiles: 1,
							thumbnailWidth: 800,
							clickable: [opts.$userSettingsPlaceholder[0], opts.$userPhotoChangeLink[0]],
							// previewsContainer: opts.$uploadUserPhoto[0],
							previewTemplate: opts.$uploadUserPhoto.find('.settings-photo-preview-template').html(),
							thumbnail:function(file, dataUrl){
								// Do something with the dataUrl
								// self.log(dataUrl);
								// self.log(file.previewElement);
								$(file.previewElement).css('background-image', 'url(' + dataUrl + ')');
								// opts.$metaPreviewWrapper.css('background-image', 'url(' + dataUrl + ')');
								// $('div.dz-default.dz-message').css({'opacity':1, 'background-image': 'none'}); // or specify your own URL
								// $('.js-upload-photo .dz-default').removeClass('dz-message');
							},
							init:function(){
								opts.photosDropzone = this;
								// $(this.element).addClass("dropzone");
								this.on('addedfile', function(file){
									var $that = this;

									if (this.files.length > 1) {
										var i, len;
										for(i = 0, len = this.files.length; i < len - 1; i++){
											this.removeFile(this.files[i]);
										}
										// this.removeFile(file);
									}

									// if (this.files.length) {
									// 	var _i, _len;
									// 	for (_i = 0, _len = this.files.length; _i < _len - 1; _i++){ // -1 to exclude current file
									// 		if(this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()){
									// 			this.removeFile(file);
									// 			self.notifyMe({message: 'You have already added that photo.', type: 'error'});
									// 			return false;
									// 		}
									// 	}
									// }

									// Check to make sure image file size is less than 5MB
									if(file.size > (1024 * 1024 * 5)){
										this.removeFile(file);
										self.notifyMe({message: 'Your image should not be more than 5MB', type: 'error'});
										return false;
									}
									self.log('added file', file);
									$(file.previewElement).find('.photo-preview-remove-link').on('click', function(e){
										e.preventDefault();

										// opts.$metaPreviewWrapper.css('background-image', 'url(' + opts.defaultListImage + ')');
										$that.removeFile(file);
									});


									// Show the photos wrapper if it's hidden
									opts.$userSettingsPlaceholder.hide();
									opts.$userPhotoChangeWrapper.show();
								});

								this.on('removedfile', function(file){
									// self.log(this.files);

									// Hide the photos wrapper if there are no images
									if(!this.files.length){
										// opts.$reviewPhotosWrapper.hide();
										opts.$userSettingsPlaceholder.show();
										opts.$userPhotoChangeWrapper.hide();
									}
								});

								// this.on('maxfilesexceeded', function(file){
								// 	this.removeAllFiles();
								// 	this.addFile(file);
								// });

								this.on('sending', function(file, xhr, formData){
									self.appendData(formData);
									self.log('Lets append to dropzone.. :D');
								});

								this.on('complete', function(file){
									self.log('complete');
									var anySuccess = false;
									if(file.xhr && file.xhr.statusText == 'OK'){
										anySuccess = true;
									}
									if(this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0){
										self.log("complete saving");
										// Complete saving
										if(anySuccess){
											self.doneSaving();
										}
									}
								});

								// if(curImageURL){
								// 	// var mockFile = {name: 'existing', size: 12345};
								// 	// var image = fileInfo.find('.image:eq(0)');
								// 	var mockFile = {
								// 		name: curImageURL.split('/').pop(),
								// 		size: curImageSize,
								// 		accepted: false,
								// 		fullPath: curImageURL
								// 	};
								// 	this.files.push(mockFile);
								// 	this.emit('addedfile', mockFile);
								// 	this.emit('thumbnail', mockFile, curImageURL);
								// 	this.emit('complete', mockFile);

								// 	// var existingFileCount = 1; // The number of files already uploaded
								// 	// this.options.maxFiles = this.options.maxFiles - existingFileCount;
								// }
							},
							resize: function(file) {
								var info;

								// drawImage(image, srcX, srcY, srcWidth, srcHeight, trgX, trgY, trgWidth, trgHeight) takes an image, clips it to
								// the rectangle (srcX, srcY, srcWidth, srcHeight), scales it to dimensions (trgWidth, trgHeight), and draws it
								// on the canvas at coordinates (trgX, trgY).
								info = {
									srcX:0,
									srcY:0,
									srcWidth: file.width,
									srcHeight: file.height,
									trgX:0,
									trgY:0,
									trgWidth: this.options.thumbnailWidth,
									trgHeight: parseInt(this.options.thumbnailWidth * file.height / file.width)
								};

								return info;
							}
						});
					// };
				});




				this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.userSettings;

			opts.$phoneNumber.off('keyup.vc.userSettings').on('keyup.vc.userSettings', function(e){
				var currentPhone = $('.js-phone-number').val();
				self.log(currentPhone, " Current phone number");
				if(opts.$phoneNumberValue !== currentPhone){
					self.log("Phone number has changed!!!");
					opts.$verifyNumber.removeClass('hide');
					$(this).addClass('new-number-textbox');

				}
			});


		}
	};
}(jQuery, window, document));

/**
	slideInTabs - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.slideInTabs = {
		config: {
			slideInTabs: {}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.slideInTabs;

			opts.$container = $('[' + self.attr_name('slideInTabs') + ']');


			if(!opts.$container.length)return false;

			// Code begins here...

			// opts.$slideInContainer = $('[' + self.attr_name('slideInContainer') + ']');
			opts.$slideTabItem = '[' + self.attr_name('slidetabUrl') + ']';
			opts.$slideTabContent = $('[' + self.attr_name('slidetabContent') + ']');
			opts.$slideTabBack = '[' + self.attr_name('slideback') + ']';

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.slideInTabs;




			// opts.$slideTabItem.off('click.vc.slideInTabs').on('click.vc.slideInTabs', function(e){
			opts.$container.off('click', opts.$slideTabItem).on('click', opts.$slideTabItem, function(e){
				self.log('Tab item clicked');

				//Save the location of this click
				opts.scroll = $(window).scrollTop();
				self.log(opts.scroll, 'position');


				$(this).closest(opts.$container).addClass('slide-tabs-inactive').removeClass('slide-tabs-active');

				// Scroll to view
				$('html, body').animate({
          scrollTop: 500
        }, 600);


				opts.$tabToshow = $(this).attr('data-vc-slidetabUrl');
				$('[data-vc-slidetabContent =' + opts.$tabToshow + ']').addClass('slide-in-active').removeClass('slide-tabs-inactive');
				// opts.$slideTabBack.addClass("slide-in-active");
				// opts.$tabToDisplay = $('[' + self.attr_name('slidetabContent') + ']');
				// if(opts.$tabToDisplay.attr)

			});

			// opts.$slideTabBack.off('click.vc.slideInTabs').on('click.vc.slideInTabs', function(e){
			opts.$slideTabContent.off('click', opts.$slideTabBack).on('click', opts.$slideTabBack , function(e){
				// e.preventDefault();

				$(this).closest(opts.$slideTabContent).removeClass('slide-in-active');

				// $(this).closest(opts.$slideInContainer).find(opts.$container).removeClass("slide-tabs-inactive").addClass("slide-tabs-active").delay(1000);

				// self.log($(this).closest(opts.$slideTabContent).parent().find(opts.$container), 'found');
				$(this).closest(opts.$slideTabContent).parent().find(opts.$container).removeClass('slide-tabs-inactive').addClass('slide-tabs-active').delay(1000);

				//Go to the location it was initially before click
				$(window).scrollTop(opts.scroll);

				// opts.$container.addClass("slide-tabs-active");
				// $(this).hide();
				// self.log('Tab item clicked '+opts.$slideTabItem);
				// opts.$tabToshow = $(this).attr("data-vc-slidetabUrl");
				// $("[data-vc-slidetabContent ="+opts.$tabToshow+"]").addClass("slide-in-active");
				// opts.$tabToDisplay = $('[' + self.attr_name('slidetabContent') + ']');
				// if(opts.$tabToDisplay.attr)

				// self.log('Slide to show '+ opts.$tabToshow);

			});
		}
	};
}(jQuery, window, document));

/**
	Follow Button - component_description

	Usage: 'How to use component'

	Element => 'data-vc-follow-button'

	Example:

*/

;(function($, window, document, undefined){
	window.app.comps.followButton = {
		config: {
			followButton: {
				followURL: '/userdashboardweb/follow'
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.followButton;


					opts.$container = $('[' + self.attr_name('follow-button') + ']');
					if(!opts.$container)return false;


			this.events();
			//this.followUser();
   
		},

		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.followButton;

			$('body, .js-follow-button-fix').off('click.vc.followButton').on('click.vc.followButton', opts.$container.selector, function(e){
				e.preventDefault();
				var $el = $(this);
				var $user = $el.closest('.suggestion-item');
				var userID = $user.attr(self.attr_name('uid'));
				self.log('$user from follow btn',$user);


				var formData = {
					'customerid' :  userID,
					'status'     : $el.hasClass('btn-following') ? 1 : 0
				};
				var checkAuthData = {
					method: 'GET',
					url: opts.followURL,
					data: formData
				};

				self.checkAuth(function(){
					self.followUser($el);
				}, checkAuthData);
			});
		},

		followUser:function(elem){
			var self = this,
					cf   = this.config,
					opts = cf.followButton;

			var $el = $(elem);
			var $user  = $el.closest('.suggestion-item');
			var userID = $user.attr(self.attr_name('uid'));


			var formData = {
				'customerid' :  userID,
				'status'     : $el.hasClass('btn-following') ? 1 : 0
			};

			self.log(formData, opts.followURL);
			if($el.hasClass('btn-following')){
	        $el.removeClass('btn-following');
	        $el.html('<i class="icon-user-add"></i> Follow');

	     } else {
	        $el.addClass('btn-following');
	        $el.text('Following');
	    }

			$.ajax({
				type        : 'GET', // define the type of HTTP verb we want to use (GET for our form)
				url         : opts.followURL, // the url where we want to GET
				data        : formData, // our data object
				dataType    : 'json', // what type of data do we expect back from the server
				encode      : true
			});
		}
	};
}(jQuery, window, document));

;(function($, window, document, undefined){
	window.app.comps.fancyPassword = {
		name: 'fancyPassword',
		description: 'description',
		config: {
			fancyPassword: {
				maskToggle     : null, 
				passwordElement: null, 
				toggeled       : null 
			}
		},
		init:function(){
			// Contains the initialization code
			var self  = this;
			self.config.fancyPassword.maskToggle      = $('#toggle-mask'),
			self.config.fancyPassword.passwordElement = $("input[type='password']"),
			self.config.fancyPassword.toggeled        =  ($('#toggle-mask:checked').length === 1)? true : false,

			this.events();
		},
		toggle: function (toggle, passwordEle) {
			var self = this;

			passwordEle.attr('type', (toggle) ? 'text' : 'password');
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this;
			self.config.fancyPassword.maskToggle.click(function (e) {
				self.config.fancyPassword.toggeled = ($('#toggle-mask:checked').length === 1)? true : false;
				self.toggle(self.config.fancyPassword.toggeled, self.config.fancyPassword.passwordElement );
			});
		}
	};
}(jQuery, window, document));
;(function($, window, document, undefined){
	window.app.comps.photoSlider = {
		name: 'photoSlider',
		description: 'description',
		config: {
			photoSlider: {
				sildeStarted: false,
				gallerySlider: null /*$('.gallery-slider')*/,
				mainSection: $('.main-section'),
				gallery : $('.gallery-photos'),
				galleryImgs : [],
				closeButton : $('.back-nav'),
				currentImgPos: null,
				silderCaption :{
					reviewer: null /*$('.slider-caption').children('.reviewer')*/,
					comment : null /*$('.slider-caption').children('.comment')*/,
				},
				slidePositionHolder: null /*$('.slider-position-counter')*/,
				currentImgHolder:  null /*$('.silder-img').children('img')*/,
				prevButton: null /*$('.silder-nav.left')*/,
				nextButton: null /*$('.silder-nav.right')*/,
				startPos: (window.location.hash) ?
							(
								(window.location.hash.indexOf("slide-") > -1) ? window.location.hash.charAt(window.location.hash.indexOf("slide-")+6 ) : null
							) : null,
				galleryContainer: $('.photo-gallery-container'),
				loderImg: null,
				slideHTML: "<div class=\"gallery-slider hide\"><div class=\"slider-pagination\"><div class=\"small-4 columns collapse\"><a href=\"#\" class=\"silder-nav left\"><i class=\"icon-angle-left\"></i></a></div><div class=\"small-4 columns collapse\"><p class=\"text-center slider-position-counter\">0/0</p></div><div class=\"small-4 columns collapse\"><a href=\"#\" class=\"silder-nav right\"><i class=\"icon-angle-right\"></i></a></div></div><div class=\"silder-img\"><div class=\"mobile-container\"><div class=\"loader\"></div><img src=\"#\" alt=\"picture\"></div></div><div class=\"slider-caption\"><div class=\"mobile-container\"><h5 class=\"reviewer\"></h5><p class=\"comment\"></p></div></div></div>"
			}
		},
		init:function(){
			// Contains the initialization code
			var self = this;
			if (self.config.photoSlider.gallery.length >= 1) {
				$('.mobile.body').append(self.config.photoSlider.slideHTML);
				self.config.photoSlider.gallerySlider = $('.gallery-slider');
				self.config.photoSlider.silderCaption.reviewer = $('.slider-caption .mobile-container').children('.reviewer');
				self.config.photoSlider.silderCaption.comment = $('.slider-caption .mobile-container').children('.comment');
				self.config.photoSlider.slidePositionHolder = $('.slider-position-counter');
				self.config.photoSlider.currentImgHolder = $('.silder-img .mobile-container').children('img');
				self.config.photoSlider.prevButton = $('.silder-nav.left');
				self.config.photoSlider.nextButton = $('.silder-nav.right');
				self.config.photoSlider.loderImg = $('.silder-img .loader');

				self.prepareImgs(self.config.photoSlider.gallery);
				self.handelClose();
				self.handelPrev();
				self.handelNext();
				self.config.photoSlider.gallerySlider.hide();
				self.config.photoSlider.gallerySlider.addClass('hide');
				self.config.photoSlider.loderImg.hide();

				// if(startPos){
				// 	self.config.photoSlider.startPos = startPos;
				// }
				if(self.config.photoSlider.startPos){
					self.startSlide(parseInt(self.config.photoSlider.startPos));
				}
				//console.log('jjj');

			}

			this.events();
		},
		prepareImgs: function (gallery) {
			var self = this;

			$(gallery).children('li').each(function(i){
				var details = {
					'img' : $(this).children('a').attr('href'),
					'uploader' : $(this).children('a').attr('data-uploder'),
					'comment' : $(this).children('a').attr('data-comment'),
					'business': $(this).children('a').children('img').attr('alt')
				};
				self.config.photoSlider.galleryImgs.push(details);
				$(this).children('a').click(function (e) {
					e.preventDefault();
					self.startSlide(i);
				});

			});
		},

		startSlide : function (imgPos) {
			var self = this,
				windowHeight = window.innerHeight+(window.innerHeight/100 * 6);

			self.config.photoSlider.gallerySlider.css({'height': windowHeight, 'overflow-y': 'scroll'});
			self.config.photoSlider.mainSection.css({'height' : windowHeight, 'overflow-y': 'hidden'});
			self.config.photoSlider.sildeStarted = true;
			self.config.photoSlider.galleryContainer.hide();
			self.config.photoSlider.gallerySlider.show();
			self.config.photoSlider.gallerySlider.removeClass('hide');

			if (imgPos != self.config.photoSlider.currentImgPos) {
				self.config.photoSlider.loderImg.show();
				window.setTimeout(function () {
					self.config.photoSlider.currentImgHolder[0].src = self.config.photoSlider.galleryImgs[imgPos].img;
					//console.log(self.config.photoSlider.galleryImgs[imgPos]);
					self.config.photoSlider.currentImgHolder[0].alt =  self.config.photoSlider.galleryImgs[imgPos].business;
				}, 800);
				self.config.photoSlider.currentImgHolder.load(function () {
					//self.config.photoSlider.loderImg.show();
			        if(!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0){
			        	self.config.photoSlider.loderImg.show();
			        	console.log(this.complete);
			        }

			        self.config.photoSlider.loderImg.hide();
			        self.updateCounter(imgPos);
					self.config.photoSlider.silderCaption.reviewer[0].innerHTML = self.config.photoSlider.galleryImgs[imgPos].uploader;
					self.config.photoSlider.silderCaption.comment[0].innerHTML = self.config.photoSlider.galleryImgs[imgPos].comment;
				});

			}

		},

		prev: function () {
			console.log('prev');
			var self = this,
				imgPos = self.config.photoSlider.currentImgPos;

			if (imgPos < 1) {
				$(self.config.photoSlider.prevButton).addClass('disabled');
			} else{
				imgPos = imgPos - 1;
				self.startSlide(imgPos);
			}

		},

		next: function () {
			console.log('nexr');
			var self = this,
				imgPos = self.config.photoSlider.currentImgPos;

			if (imgPos + 2 > self.config.photoSlider.galleryImgs.length) {
				$(self.config.photoSlider.nextButton).addClass('disabled');
			} else{
				imgPos = imgPos + 1;
				self.startSlide(imgPos);
			}

		},

		handelClose: function () {
			var self = this;

			self.config.photoSlider.closeButton.click(function (e) {
				if (self.config.photoSlider.sildeStarted) {
					e.preventDefault();
					self.config.photoSlider.gallerySlider.hide();
					self.config.photoSlider.gallerySlider.addClass('hide');
					self.config.photoSlider.galleryContainer.show();
					self.config.photoSlider.sildeStarted = false;
					self.config.photoSlider.gallerySlider.css({'height': '', 'overflow-y': ''});
					self.config.photoSlider.mainSection.css({'height' : '', 'overflow-y': ''});
				}
			});
		},


		handelPrev: function () {
			var self =  this;

			$(self.config.photoSlider.prevButton[0]).click(function (e) {
				e.preventDefault();
				self.prev();
			});
		},

		handelNext: function () {
			var self =  this;

			$(self.config.photoSlider.nextButton[0]).click(function (e) {
				e.preventDefault();
				self.next();
			});
		},
		handleHash: function() {
			var self = this;
			//console.log(window.location.hash);

			self.config.photoSlider.startPos = (window.location.hash.indexOf("slide-") > -1) ?
									 window.location.hash.charAt(window.location.hash.indexOf("slide-")+6 ) :
									 null;
			if(self.config.photoSlider.startPos){
				//alert('hey');
				self.startSlide(parseInt(self.config.photoSlider.startPos));
			}
		},

		updateCounter: function (imgPos) {
			var self = this;

			self.config.photoSlider.currentImgPos = imgPos;
			self.config.photoSlider.slidePositionHolder[0].innerHTML = (imgPos +1)+'/'+self.config.photoSlider.galleryImgs.length;
		},

		events:function(){
			// Contains the event bindings and subscriptions
			var self = this;
			$(window).on('hashchange', function () {
				self.handleHash();
			});
			$(window).trigger('hashchange');
		}
	};
}(jQuery, window, document));

;(function($, window, document, undefined){
	window.app.comps.changeProductView = {
		name: 'changeProductView',
		description: 'description',
		init:function(){
			// Contains the initialization code
			$('[data-list-switch]').click(function (e) {
				console.log(e);
				e.preventDefault();
				var currentDisplay = $('.item-list').hasClass('grid') ? 'grid' : 'list-view';
				if (currentDisplay == 'grid') {
					$('.item-list').addClass('list-view').removeClass('grid');
					$('.cart-items').addClass('list-view large-block-grid-2 small-block-grid-1').removeClass('grid large-block-grid-4 small-block-grid-2');
					$('.nproduct-items-list').addClass('list-view large-block-grid-2 small-block-grid-1').removeClass('grid large-block-grid-4 small-block-grid-2');
					$('[data-list-switch] > i').addClass('icon-th').removeClass('icon-list');
				} else{
					$('.item-list').addClass('grid').removeClass('list-view');
					$('.cart-items').addClass('grid large-block-grid-4 small-block-grid-2').removeClass('list-view large-block-grid-2 small-block-grid-1');
					$('.nproduct-items-list').addClass('grid large-block-grid-4 small-block-grid-2').removeClass('list-view large-block-grid-2 small-block-grid-1');
						$('[data-list-switch] > i').removeClass('icon-th').addClass('icon-list');
				}
			});
			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
		}
	};
}(jQuery, window, document));



/**
	buttontoggle - Handles the toggle states and behavior of action buttons

	Usage: 'How to use component'
	Options:
		Option_name - Option_description
			Values: Possible_option_values
	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.rateReview = {
		init:function(){
			// Contains the initialization code
			// ...
			var self = this,
				config = this.config;
			config.rateReview.button = $('[' + self.attr_name('review-toggle') + ']');
			this.events();
		},
		events:function(){
			var self = this,
				config = this.config;
			// Contains the event bindings and subscriptions
			$(document).on('click', '[' + self.attr_name('review-toggle') + ']', function(e){
				e.preventDefault();
				var el = this;
				var src = $(el).attr('href');
				var data = $(el).attr(self.attr_name('options'));
				var elId = $(el).attr(self.attr_name('review-id'));
				var cls = $(el).attr(self.attr_name('review-toggle'));
				var isActv = $(el).attr(self.attr_name('active'));
				var sibling = $('[' + self.attr_name('review-id') +'='+elId+ ']').not(el);
				var slbIsActv = $(sibling).attr(self.attr_name('active'));
				data = self.data_options(data);
				// console.log(src);
				// console.log(data);
				// console.log(cls);
				// console.log(isActv);
				// console.log(sibling);
				// console.log(elId);
				// console.log(slbIsActv);
				if (isActv == 1) {
					$.getJSON(src, data).done(function(result){
							//console.log(result);
							if ('status' in result && result.status === 1){
								if (slbIsActv) {
									// removing active from sibling
									self.updateSate(sibling, cls, 0);
									$(sibling).attr(self.attr_name('active'), 0);

									//setting active to current element
									self.updateSate(el, cls, 1);
									$(el).attr(self.attr_name('active'), 1);
								} else{
									//setting active to current element
									self.updateSate(el, cls, 1);
									$(el).attr(self.attr_name('active'), 1);
								}
							}
					}).fail(function(){
						console.warn('AJAX endpoint: ' + src);
						self.notifyMe({type: "error", message:"sorry could not rate review"});
						// $(el).toggleClass(cls);
					});
					// When done, publish toggle state change or handle within this component

				}
				// else{
				// 	//do nothing write some code to give feedback to the user

				// }
			});
		},

		updateSate: function (el, cls, status) {
			// body...
			if (status == 1) {$(el).addClass(cls);} else{$(el).removeClass(cls);}
			//console.log(el);
			// console.log(cls);
			// console.log(status);
		},

		data_options:function(options){
			var opts = {};
			// Idea from Foundation.js by Zurb
      if (typeof options === 'object') {
        return options;
      }

      var opts_arr = (options || '=').split(';'),
      ii = opts_arr.length;

      function isNumber (o) {
        return ! isNaN (o-0) && o !== null && o !== "" && o !== false && o !== true;
      }

      // Polyfill for trim function in IE8 down

			  // var trim = function () {
			  //   return this.replace(/^\s+|\s+$/g, '');
			  // }

      function trim(str) {
        if (typeof str === 'string') return str.replace(/^\s+|\s+$/g, '');
        // return str;
      }

      while (ii--) {
        var p = opts_arr[ii].split('=');

        if (/true/i.test(p[1])) p[1] = true;
        if (/false/i.test(p[1])) p[1] = false;
        if (isNumber(p[1])) p[1] = parseInt(p[1], 10);

        if (p.length === 2 && p[0].length > 0) {
          opts[trim(p[0])] = trim(p[1]);
        }
      }

      return opts;
		}
	};
}(jQuery, window, document));

/**
	mobilefilter - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.mobilefilter = {
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.mobilefilter;

			opts.$container = $('[' + self.attr_name('mobilefilter') + ']');

			if(!opts.$container.length)return false;
			opts.$filterForm = $('[' + self.attr_name('filterform') + ']');
			opts.$sortEl = opts.$container.filter('[' + self.attr_name('sort') + ']');
			opts.$paginateEl = opts.$container.filter('[' + self.attr_name('page') + ']');
			opts.$applyButton = opts.$container.filter('[' + self.attr_name('apply') + ']');

			opts.$minPrice = $({});
			opts.$maxPrice = $({});

			opts.$container.find('[' + self.attr_name('pricefilter') + ']').each(function(){
				var $this = $(this);
				if($this.attr(self.attr_name('pricefilter')) == 'min'){
					opts.$minPrice = $this;
				}
				else{
					opts.$maxPrice = $this;
				}
			});

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.mobilefilter;

			opts.$minPrice.off('blur.vc.mobilefilter').on('blur.vc.mobilefilter', function(){
				var $this = $(this);
				if($this.val()){
					if(+$this.val() < +$this.attr('min')){
						$this.val($this.attr('min'));
					}
					if(!opts.$maxPrice.val()){
						// minimum price is set, but no maximum price is set
						opts.$maxPrice.val(opts.$maxPrice.attr('max'));
					}
				}
				else{
					opts.$maxPrice.val('');
				}
			});
			opts.$maxPrice.off('blur.vc.mobilefilter').on('blur.vc.mobilefilter', function(){
				var $this = $(this);
				if($this.val()){
					if(+$this.val() > +$this.attr('max')){
						$this.val($this.attr('max'));
					}
					if(!opts.$minPrice.val()){
						// maximum price is set, but no minimum price is set
						opts.$minPrice.val(opts.$minPrice.attr('min'));
					}
				}
				else{
					opts.$minPrice.val('');
				}
			});

			opts.$sortEl.off('change.vc.filter').on('change.vc.filter', function(){
				self.log('Sorting things...');
				self.publish('vc:store/filter', {filters:[{
					checked: true,
					type: 'sort',
					val: $(this).val()
				}]});
			});


			opts.$paginateEl.off('click.vc.filter').on('click.vc.filter', function(e){
				e.preventDefault();

				self.publish('vc:store/filter', {filters:[{
					checked: true,
					type: 'page',
					val: $(this).attr(self.attr_name('page'))
				}]});
			});

			opts.$filterForm.off('submit.vc.mobilefilter').on('submit.vc.mobilefilter', function(e){
				self.runFilter();
				return false;
			});
			opts.$applyButton.off('click.vc.mobilefilter').on('click.vc.mobilefilter', function(e){
				// self.runFilter();
			});
		},
		/**
		 * runs the filter operation and publishes the result
		 * @param  {Boolean} isClear Determines if the operation is to clear the filters
		 * @return {Boolean}          true
		 */
		runFilter:function(isClear){
			var self = this,
					cf = this.config,
					opts = cf.mobilefilter;

			var filterSet = [];
			opts.$container.find('input[type="checkbox"]').each(function(){
				// Get all the filter values of each of the inputs in the filters
				var $parentFilter = $(this).closest(opts.$container);
				var checked = (isClear) ? false : $(this).prop('checked');
				var parentId = $parentFilter.data('id');
				var val = $(this).val();

				var flt = $parentFilter.attr(self.attr_name('flt'));

				// Add flt only if available
				if(flt && checked)filterSet.push({checked: true, type: 'flt', val: flt});

				filterSet.push({
					checked: checked,
					type: parentId,
					val: val
				});
			});

			opts.$container.find('[' + self.attr_name('pricefilter') + ']').each(function(){
				var curVal = $(this).val();
				var curType = ($(this).attr(self.attr_name('pricefilter')) == 'min') ? 'minprice' : 'maxprice';
				var isChecked = (isClear) ? false : !!curVal;

				filterSet.push({
					checked: isChecked,
					type: curType,
					val: curVal
				});
			});

			self.publish('vc:store/filter', {filters:filterSet});
		}
	};
}(jQuery, window, document));

/**
	mobilestore - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.mobilestore = {
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.mobilestore;

			opts.$container = $('[' + self.attr_name('mobilestore') + ']');

			if(!opts.$container.length)return false;

			// Code begins here...

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.mobilestore;

			// Subscribe to the filter operation
			self.subscribe('vc:store/filter', function(data){
				self.log('nstore component filtered.');
				self.log(data);
				if(data.href){
					self.loading(opts.$container, 'start');
					location.href = data.href;
					return true;
				}

				var filterOptions = self.getURLParameters(); // contains all the URL filter parameters


				// if(opts.nlistingBaseURL){
				// 	// get brand parameters from URL
				// 	// Clear the baseURL and the query strings to get only the parts that should make up the brand params
				// 	// Also clear out trailing slashes in front and at the back of the string
				// 	var brandParam = location.pathname.replace(opts.nlistingBaseURL, '').replace(/\?.*$|#.*$|^\/+|\/+$/g, '');
				// 	self.log(opts.nlistingBaseURL);
				// 	filterOptions.brands = brandParam;
				// 	self.log(filterOptions.brands);
				// }
				// self.log(filterOptions);

				if(data.filters){
					for(var i = 0, len = data.filters.length; i < len; i++){
						var curFilter = data.filters[i];
						var tmpOptsArr = [];
						var arrayIndex = 0;
						self.log('Iterate filters...');

						// Patch various filters
						switch(curFilter.type){
							case 'sort':
								filterOptions[curFilter.type] = '';
								break;
							case 'page':
								filterOptions[curFilter.type] = '';
								break;
							case 'minprice':
								self.log('in minprice...');
								filterOptions[curFilter.type] = '';
								break;
							case 'maxprice':
								filterOptions[curFilter.type] = '';
								break;
							case 'loc':
								filterOptions.flt = 'city';
								break;
						}

						// Remove the page filter option when any filter is clicked
						delete filterOptions.page;
						// self.log(curFilter);
						// self.log(filterOptions);
						// Split the current filter option string into an array containing each of the set options
						// Prevent it from adding empty array element at the beginning of the array
						if(filterOptions[curFilter.type])tmpOptsArr = filterOptions[curFilter.type].split('_');

						if(curFilter.checked){
							// Filter value to be added
							// if filter value is not in array

							arrayIndex = $.inArray(curFilter.val, tmpOptsArr);
							if(arrayIndex < 0){
								tmpOptsArr.push(curFilter.val);
							}
						}
						else{
							// Filter value to be removed
							// if filter value is in the array
							arrayIndex = $.inArray(curFilter.val, tmpOptsArr);
							if(arrayIndex > -1){
								tmpOptsArr.splice(arrayIndex, 1);
							}
						}

						// After updating the current filter options, join the array back to string (for use in query string)
						filterOptions[curFilter.type] = tmpOptsArr.join('_');

						// Remove empty filter types from the filterOptions object (to prevent empty query string in URL)
						if(!filterOptions[curFilter.type])delete filterOptions[curFilter.type];

						// Remove parameter indicating server to display sorry message for showing businesses instead of products
						delete filterOptions.om;

						self.log($.param(filterOptions));
					}

					self.loading(opts.$container, 'start');
					// return false;
					var newURL = location.href;

					// Remove the query string part from the URL
					newURL = location.href.replace(/\?.*$|#.*$/, '');

					// Append query string parameters to URL
					if(!$.isEmptyObject(filterOptions)){
						newURL += '?' + $.param(filterOptions);
					}
					// Go to the new URL
					location.href = newURL;
				}
			});
		},
		getURLParameters:function(){
			var urlParams = {},
					match,
					pl = /\+/g,  // Regex for replacing addition symbol with a space
					search = /([^&=]+)=?([^&]*)/g,
					decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
					query = window.location.search.substring(1);

			while((match = search.exec(query))){
				urlParams[decode(match[1])] = decode(match[2]);
			}
			return urlParams;
		}
	};
}(jQuery, window, document));

/**
	mobile reviewbox - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.mreviewbox = {
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.mreviewbox;

			opts.$container = $('[' + self.attr_name('mreviewbox') + ']');

			if(!opts.$container.length)return false;

			// this.visible();
			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.mreviewbox;
					var $win = $(window);

					// opts.$container.each(function() {
					// 	var $el = $(this);
					// 	if ($el.visible(true)) {
					// 		$el.addClass("already-visible");
					// 	}
					// });

					// $win.scroll(function(e) {
					// 	opts.$container.each(function() {
					// 		var $el = $(this);
					// 		if ($el.visible(true)) {
					// 			$el.addClass("come-in, sticky");
					// 		}
					// 	});
					// });


		},
		// visible:function(partial) {
		// 	var self = this,
		// 			cf = this.config,
		// 			opts = cf.mreviewbox;

		// 		var $el            = $(this),
		// 				$win            = $(window),
		// 				viewTop       = $win.scrollTop(),
		// 				viewBottom    = viewTop + $win.height(),
		// 				_top          = $el.offset().top,
		// 				_bottom       = _top + $el.height(),
		// 				compareTop    = partial === true ? _bottom : _top,
		// 				compareBottom = partial === true ? _top : _bottom;

		// 		return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

  	// },

	};
}(jQuery, window, document));

/**
	placeholder - fixes placeholder issue in opera mini browsers

	element => include [data-vc-placehold] in your input element
	options => [

	]

*/

;(function($, window, document, undefined){
	window.app.comps.placeholder = {
		config: {
		},
		init:function(){
			// Contains the initialization code
			var self 	= this,
					cf 		= this.config;
			cf.$els 	=  $('[' + self.attr_name('placehold') + ']');

			if(cf.$els.length) {
				this.require('placeholder', function(){
						return (jQuery().placeholder());
					}, function() {

						$('input, textarea').placeholder();

						// cf.$els.each(function(index, elem){
						// 	var $el = $(elem); //the current element

						//  	var Options = {
						//   	customClass: 'my-placeholder'
						//   };

					 // 		$el.placeholder();
					 // 	});
					});
			}

			this.events();
		},

			events:function(){
			// Contains the event bindings and subscriptions
		}
	};
}(jQuery, window, document));

/**
	photogallery - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.photogallery = {
		config: {
			photogallery: {
				bodyClass: 'pg-body-open',
				swipeThreshold: 100
			}
		},
		init:function(){
			// Contains the initialization code...
			var self = this,
					cf = this.config,
					opts = cf.photogallery;

			opts.$container = $('[' + self.attr_name('photothumb') + ']');

			if(!opts.$container.length)return false;

			// Code begins here...
			var $pg  = opts.$photoGallery = $('[' + self.attr_name('photogallery') + ']'),
					$rpm = opts.$reportPhotoModal = $('#report-photo-modal');
			$.extend(opts, {
				$dateTime       : $pg.find('.js-date-time'),
				$followersCount : $pg.find('.js-followers-count'),
				$reviewsCount   : $pg.find('.js-reviews-count'),
				$businessName   : $pg.find('.js-business-name'),
				$albumName      : $pg.find('.js-pg-album-name'),
				$posterName     : $pg.find('.js-poster-name'),
				$description    : $pg.find('.js-pg-description'),
				$photoCount     : $pg.find('.js-pg-count'),
				$closeBtn       : $pg.find('.js-pg-close'),
				$fullscreenBtn  : $pg.find('.js-pg-fullscreen'),
				$nextBtn        : $pg.find('.js-next-btn'),
				$prevBtn        : $pg.find('.js-prev-btn'),
				$photo          : $pg.find('.js-pg-photo'),
				$likeCount      : $pg.find('.js-like-count'),
				$photoErrorMsg  : $pg.find('.js-photo-error'),

				$loadingWrapper : $pg.find('.pg-photo-wrapper'),

				photoDetailsUrls   : [],
				$galleryDetails    : $pg.find('.js-gallery-details'),
				$photoSectionInner : $pg.find('.js-pg-photo-section-inner'),
				curPhotoPosition   : undefined,
				$option    : $rpm.find('.option'),
				$detail    : $rpm.find('textarea#details'),
				$reportBtn : $rpm.find('.js-submit-report'),
				$avatar 				: $('[' + self.attr_name('avatar-size') + ']'),
				$fullscreenEl   : $('.js-fullscreenEl'),
				$navBtn         : $('.js-pg-nav-btn'),
				// $reportBtn 	    : $pg.find('.js-pg-report-btn'),
				// opts.$avaterUrl = $pg.find('');
			});
			opts.$avatarImage = opts.$avatar.find('img');

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions.
			var self = this,
					cf = this.config,
					opts = cf.photogallery;

			var $nextBtn = cf.isMobile ? opts.$nextBtn : opts.$photoSectionInner;

			opts.$galleryDetails.off('click.vc.photogallery').on('click.vc.photogallery', function(e){
				e.stopPropagation();
			});

			opts.$container.off('click.vc.photogallery').on('click.vc.photogallery', function(e){
				e.preventDefault();
				self.openGallery($(this));

			});

			$nextBtn.off('click.vc.photogallery').on('click.vc.photogallery', function(e){
				opts.isShowDetails && self.goToNextPhoto();

				return false;
			});

			opts.$prevBtn.off('click.vc.photogallery').on('click.vc.photogallery', function(e){
				self.goToPreviousPhoto();
				return false;
			});

			$(document).off('keyup.vc.photogallery', opts.$photogallery).on('keyup.vc.photogallery',opts.$photoGallery, function(e){
					switch(e.keyCode){
						case 27: //ESCAPE
							if (opts.isFullscreen) {
								self.exitFullscreen();
							}
							else {
								self.closeGallery();
							}
							// self.closeGallery(galleryID);
							break;
						case 37: //LEFT
							self.goToPreviousPhoto();
							break;
						case 39: //RIGHT
							self.goToNextPhoto();
							break;
					}
				});

			opts.$closeBtn.off('click.vc.photogallery').on('click.vc.photogallery', function(e){
				self.closeGallery();
				return false;
			});

			opts.$fullscreenBtn.off('click.vc.photogallery').on('click.vc.photogallery', function(e){
				self.showFullscreen(document.documentElement);
				return false;
			});

			opts.$reportBtn.off('click.vc.photogallery').on('click.vc.photogallery', function () {
				var $issues = opts.$reportPhotoModal.find('input:checked'),
				issues = [];

				if (!$issues.length) {
					self.notifyMe({message: 'Please you need to specify what is wrong with the photo.', type: 'error'});
					return;
				}

				$.each($issues,function(){
					issues.push( $(this).attr(self.attr_name('incorrect-option')));
				});

				self.log('$issues', $issues);

				self.log('submitting issues', issues);

				self.loading(opts.$reportPhotoModal, 'start');
				$.ajax({
					url: opts.reportBusinessURL,
					type: 'POST',
					dataType : 'json',
					data: {
						photoID : opts.photoID,
						issue  : issues,
						detail : opts.$detail.val(),
						// reporter   : cf.loggedIn ? cf.user.id : opts.$email.val(),
					},
					success: function(data){
						if(data.status === 1){
							// success
							self.publish('vc:modal/close');
							self.notifyMe({message: 'Thanks for letting us know! We would take action once we confirm your report.', type: 'success'});
						}
						else{
							self.notifyMe({message: 'Oops! Something went wrong. You can try again later.', type: 'error'});
						}
					},
					error:function(data){
						self.notifyMe({message: 'Oops! Something went wrong. You can try again later.', type: 'error'});
					},
					complete:function(){
						self.loading(opts.$reportPhotoModal, 'stop');
					}
				});
			});
		},
		showLoadingScreen : function () {
			var self = this,
					cf = this.config,
					opts = cf.photogallery;

			opts.$photo.addClass('hide');
			opts.$photoErrorMsg.addClass('hide');
			self.loading(opts.$loadingWrapper, 'start');
			cf.isMobile && opts.$loadingWrapper.addClass('mpg-default-screen');
		},
		goToNextPhoto : function goToNextPhoto() {
			var self = this,
					cf = this.config,
					opts = cf.photogallery;

			self.showLoadingScreen();

			if (opts.curPhotoPosition === opts.photoDetailsUrls.length-1) {
				opts.curPhotoPosition = 0;
			}
			else {
				opts.curPhotoPosition += 1;
			}

			self.fetchPhotoDetails(opts.photoDetailsUrls[opts.curPhotoPosition]);
			return false;
		},
		goToPreviousPhoto : function goToPreviousPhoto() {
			var self = this,
					cf = this.config,
					opts = cf.photogallery;

			self.showLoadingScreen();

			if (opts.curPhotoPosition === 0) {
				opts.curPhotoPosition = opts.photoDetailsUrls.length-1;
			}
			else{
				opts.curPhotoPosition -= 1;
			}

			self.fetchPhotoDetails(opts.photoDetailsUrls[opts.curPhotoPosition]);
			return false;
		},
		openGallery:function($curPhotoThumb){
			var self = this,
					cf = this.config,
					opts = cf.photogallery;

			var curPhotoDetailsUrl = $curPhotoThumb.attr(self.attr_name('photo-details-url')),
					$thumbs         = $curPhotoThumb.closest('[' + self.attr_name('photo-thumbs') + ']')
																	.find('[' + self.attr_name('photothumb') + ']');

			$.each($thumbs, function getAllPhotoDetailUrls() {
				opts.photoDetailsUrls.push($(this).attr(self.attr_name('photo-details-url')));
			});

			opts.photoDetailsUrls.forEach(function setCurPhotoPosition(val, i) {
				if (val === curPhotoDetailsUrl) {
					opts.curPhotoPosition = i;
				}
			});

			opts.$photo.attr('src', $curPhotoThumb.find('img').attr('src'));
			opts.$photoGallery.removeClass('hide').addClass('open');
			$('body').addClass(opts.bodyClass);

			self.fetchPhotoDetails(curPhotoDetailsUrl);
		},
		fetchPhotoDetails : function functionName(photoDetailsUrl) {
			var self = this,
					cf = this.config,
					opts = cf.photogallery;

			$.get(photoDetailsUrl).done(function (data) {
				// self.loading(opts.$loadingWrapper, 'stop');
				self.updateGalleryDetails(data);
				if (!opts.isShowDetails) {
					self.log('calling showGalleryDetails');
					self.showGalleryDetails();
				}
			});
		},
		updateGalleryDetails : function updatePhotoDetails(data) {
			var self = this,
					cf = this.config,
					opts = cf.photogallery;

			opts.photoID = data.photoID;
			opts.$dateTime.text(data.dateTime);
			opts.$likeCount.text(data.likeCount);
			opts.$followersCount.text(data.poster.followersCount);
			opts.$reviewsCount.text(data.poster.reviewsCount);
			opts.$businessName.text(data.businessName);
			opts.$albumName.text(data.albumName);
			opts.$posterName.text(data.poster.name);
			opts.$description.text(data.description);
			opts.$photo.attr('src', data.photoURL).on('load', function () {
				opts.$loadingWrapper.removeClass('mpg-default-screen');
				opts.$photo.removeClass('hide');
				self.loading(opts.$loadingWrapper, 'stop');
			}).on('error',function () {
				self.loading(opts.$loadingWrapper, 'stop');
				opts.$photoErrorMsg.removeClass('hide');
				cf.isMobile && opts.$loadingWrapper.addClass('mpg-default-screen');
			});
			// opts.$reportBtn.attr(self.attr_name('photo-id'), data.photoID);
			opts.$photoCount.text(opts.curPhotoPosition + 1 + ' / ' + opts.photoDetailsUrls.length);
			if (data.poster.avatarUrl) {
				opts.$avatar.removeAttr(self.attr_name('placeholder-avatar'));
				opts.$avatarImage.removeClass('hide').attr('src', data.poster.avatarUrl);
			}
			else {
				opts.$avatarImage.addClass('hide');
				opts.$avatar.attr(self.attr_name('placeholder-avatar'), data.poster.name);
			}
			window.app.comps.placeholderAvatar.init();
		},
		showGalleryDetails : function showGalleryDetails() {
			var self = this,
					cf = this.config,
					opts = cf.photogallery;
			if (opts.photoDetailsUrls.length > 1) {
				opts.$navBtn.removeClass('hide');
			}
			opts.$galleryDetails.removeClass('hide');
			opts.isShowDetails = true;
		},
		closeGallery : function closeGallery() {
			var self = this,
					cf = this.config,
					opts = cf.photogallery;

			opts.$photoGallery.addClass('hide').removeClass('open');
			opts.isShowDetails = false;
			opts.photoDetailsUrls = [];
			opts.$galleryDetails.addClass('hide');
			opts.$navBtn.addClass('hide');
			$('body').removeClass(opts.bodyClass);
			return false;
		},
		showFullscreen:function(element){
			var self = this,
			cf = this.config,
			opts = cf.photogallery;

			opts.$fullscreenEl.addClass('is-fullscreen');
			opts.$fullscreenBtn.addClass('hide');
			opts.isFullscreen = true;

			if(element.requestFullscreen){
				element.requestFullscreen();
			}
			else if(element.mozRequestFullscreen){
				element.mozRequestFullscreen();
			}
			else if(element.webkitRequestFullscreen){
				element.webkitRequestFullscreen();
			}
			else if(element.msRequestFullscreen){
				element.msRequestFullscreen();
			}
		},
		exitFullscreen:function(){
			var self = this,
					cf = this.config,
					opts = cf.photogallery;

			self.log('exiting  ..');
			opts.$fullscreenEl.removeClass('is-fullscreen');
			opts.$fullscreenBtn.removeClass('hide');
			opts.isFullscreen = false;
			opts.$fullscreenEl.removeClass('is-fullscreen');
			if(document.exitFullscreen){
				document.exitFullscreen();
			}
			else if(document.mozCancelFullscreen){
				document.mozCancelFullscreen();
			}
			else if(document.webkitExitFullscreen){
				document.webkitExitFullscreen();
			}
		}
	};
}(jQuery, window, document));

/**
	component_name - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.addPhotos = {
		config: {
			addPhotos: {}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.addPhotos;

			opts.$container = $('[' + self.attr_name('add-photos') + ']');
			opts.$containerCommentItem = opts.$container.find('.js-mobile-container-item');
			opts.$containerFileInput = opts.$container.find('.js-file-input');

			if(!opts.$container.length)return false;

			// Code begins here...

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.addPhotos;

					// assuming there is a file input with the ID `my-input`...
					// var files = $("#my-input")[0].files;
					// for (var i = 0; i < files.length; i++)
					// 		alert(files[i].name);
					opts.photosImage = '/img/category-images/n-homebanner-2.png';
					var imageComment = '<div class="row">';
					imageComment += '<div class="mobile-container"><div class="mobile-container-image" style="background-image:url(' + opts.photosImage + ');"></div>';
					imageComment += '</div></div><div class="row"><div class="mobile-container">';
					imageComment += '<label for="" class="input-optional-label">Comments</label><textarea name="" id="" cols="30" rows="10" placeholder="">Tell us about the photo...</textarea>';
					imageComment += '</div></div><div class="row"><div class="mobile-container">';
					imageComment += '<button class="btn dark tiny radius" type="submit">Save Photo</button></div></div>';

					if (window.File && window.FileReader && window.FormData) {
						// var $inputField = $('#file');
						// "multiple" in document.createElement("input")
						opts.$containerFileInput.on('change', function (e) {
							// $(this).reset();
							opts.$containerCommentItem.empty();
							var file = $(this)[0].files;
							// var eachFile;
							// for (var i = 0; i < file.length; i++)
							// eachFile = file[i];

							if(!file.length){
								self.log(file, 'files');
							}
							else {
								for (var i = 0; i < file.length; i++) {
									opts.photosImage = file[i].name;
									file[i] + opts.$containerCommentItem.append(imageComment);
									self.log(file[i], opts.photosImage, 'files');
								}

							}

							// var file = e.target.files[0];
							// self.log(eachFile, 'files');
							// if (eachFile) {
							// 	if (/^image\//i.test(eachFile.type)) {
							// 		self.readFile(eachFile);
							// 	} else {
							// 		self.log('Not a valid image!');
							// 	}
							// }
						});
					} else {
						self.log("File upload is not supported!");
					}
		},

		// readFile:function(file) {
		// 	var self = this,
		// 			cf = this.config,
		// 			opts = cf.addPhotos;

		// 	var reader = new FileReader();

		// 	reader.onloadend = function () {
		// 		self.processFile(reader.result, file.type);
		// 	};

		// 	reader.onerror = function () {
		// 		self.log('There was an error reading the file!');
		// 	};

		// 	reader.readAsDataURL(file);
		// },

		// processFile:function(dataURL, fileType) {
		// 	var self = this,
		// 			cf = this.config,
		// 			opts = cf.addPhotos;

		// 	var maxWidth = 800;
		// 	var maxHeight = 800;

		// 	var image = new Image();
		// 	image.src = dataURL;

		// 	image.onload = function () {
		// 		var width = image.width;
		// 		var height = image.height;
		// 		var shouldResize = (width > maxWidth) || (height > maxHeight);

		// 		// if (!shouldResize) {
		// 		// 	sendFile(dataURL);
		// 		// 	return;
		// 		// }

		// 		var newWidth;
		// 		var newHeight;

		// 		if (width > height) {
		// 			newHeight = height * (maxWidth / width);
		// 			newWidth = maxWidth;
		// 		} else {
		// 			newWidth = width * (maxHeight / height);
		// 			newHeight = maxHeight;
		// 		}

		// 		var canvas = document.createElement('canvas');

		// 		canvas.width = newWidth;
		// 		canvas.height = newHeight;

		// 		var context = canvas.getContext('2d');

		// 		context.drawImage(this, 0, 0, newWidth, newHeight);

		// 		dataURL = canvas.toDataURL(fileType);

		// 		// sendFile(dataURL);
		// 	};

		// 	image.onerror = function () {
		// 		self.log('There was an error processing your file!');
		// 	};
		// },

		// sendFile:function(fileData) {
		// 	var formData = new FormData();

		// 	formData.append('imageData', fileData);

		// 	$.ajax({
		// 		type: 'POST',
		// 		url: '/your/upload/url',
		// 		data: formData,
		// 		contentType: false,
		// 		processData: false,
		// 		success: function (data) {
		// 			if (data.success) {
		// 				alert('Your file was successfully uploaded!');
		// 			} else {
		// 				alert('There was an error uploading your file!');
		// 			}
		// 		},
		// 		error: function (data) {
		// 			alert('There was an error uploading your file!');
		// 		}
		// 	});
		// }

	};
}(jQuery, window, document));

/**
	menu - Script for the behaviour and interactivity of the topbar menu

*/

;(function($){
	window.app.comps.reportBusiness = {
		config: {
			reportBusiness: {
				issue : ''
			}
		},
		init:function(){
			var self = this,
			    cf   = this.config,
					opts = cf.reportBusiness,
					rbm;

			rbm = opts.$reportBusinessModal = $('#report-business-modal');

			$.extend(opts, {
				issue   : '',
				$option : rbm.find('.option'),
				businessID : rbm.attr(self.attr_name('business-id')),
				AjaxType   : cf.env === 'development' ? 'GET' : 'POST',
				$reportBtnWrapper : rbm.find('.js-submit-report-wrapper'),
				$reportBackLink : rbm.find('.js-report-header-link'),
				$reportBtn : rbm.find('.submit-report-btn'),
				$email     : rbm.find('input.email'),
				$detail    : rbm.find('textarea#details'),
				$reportPhase  : rbm.find('.report-phase'),
				$detailsPhase : rbm.find('.details-phase'),
				$detailsUrl  : rbm.find('.js-detail-url'),
				$incorrectSection : rbm.find('.incorrect-section'),
				reportBusinessURL : opts.reportBusinessURL || '/_staticapi/report-business.json'
			});

			this.events();
		},
		events:function(){
			var self = this,
				cf = this.config,
				opts = cf.reportBusiness;

			opts.$option.off('click').on('click', function (e) {
				var $this = $(this);
				$this.addClass('active').closest('li').siblings().find('.option.active').removeClass('active');
				opts.issue = $this.attr(self.attr_name('issue'));
				self.loading(opts.$reportBusinessModal, 'start');
				// opts.$reportBtn.removeAttr('disabled');

					opts.$reportPhase.fadeOut(function () {
						opts.$reportBackLink.removeClass('hide');
						opts.$detailsPhase.fadeIn(function () {
							// if(opts.$incorrectSection.hasClass('open'))
							if (opts.issue === 'incorrect') {
								opts.$incorrectSection.removeClass('hide');
							}

							if (opts.issue === 'Moved' || opts.issue === 'duplicate') {
								opts.$detailsUrl.removeClass('hide');
							}
						});

						opts.$reportBtnWrapper.removeClass('hide');
					});
			});

			opts.$reportBackLink.off('click').on('click', function (e) {
				e.preventDefault();
				var $this = $(this);

				opts.$detailsPhase.fadeOut(function () {
					opts.$reportBackLink.addClass('hide');
					opts.$incorrectSection.addClass('hide');
					opts.$detailsUrl.addClass('hide');
					opts.$reportPhase.fadeIn();
					opts.$reportBtnWrapper.addClass('hide');
				});
			});

			self.loading(opts.$reportBusinessModal, 'start');
			opts.$reportBtn.off('click').on('click', function () {

				var $checkedIncorrectInfos = opts.$reportBusinessModal.find('input:checked'),
				incorrectInfos = [];
				$.each($checkedIncorrectInfos,function(){
					incorrectInfos.push( $(this).attr(self.attr_name('incorrect-option')));
				});

				$.ajax({
					url: opts.reportBusinessURL,
					type: opts.AjaxType,
					dataType : 'json',
					data: {
						issue : opts.issue,
						detail : opts.$detail.val(),
						reporter : cf.loggedIn ? cf.user.id : opts.$email.val(),
						businessId : opts.businessID,
						incorrectInfos : incorrectInfos
					},
					success: function(data){
						if(data.status === 1){
							// success
							self.publish('vc:modal/close');
							self.notifyMe({message: 'Thanks for letting us know! We would take action once we confirm your report.', type: 'success'});
						}
						else{
							self.notifyMe({message: 'Oops! Something went wrong. You can try again later.', type: 'error'});
						}
					},
					error:function(data){
						self.notifyMe({message: 'no get Oops! Something went wrong. You can try again later.', type: 'error'});
					},
					complete:function(){
						self.loading(opts.$reportBusinessModal, 'stop');
					}
				});
			});
		}
	};
}(jQuery));

/**
	businessowner_page - component_description

	Usage: 'How to use component'

	Element => element_data_selector
	Options=>
		Option_name => Option_values //option_description
			- return_description_and_other_descriptions

	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.businessowner_page = {
		config: {
			businessowner_page: {}
		},
		init:function(){
			// Contains the initialization code
			var self = this,
					cf = this.config,
					opts = cf.businessowner_page;

			opts.$container = $('.business-owners-page');

			if(!opts.$container.length)return false;

			opts.$claimBtn = opts.$container.find('.js-claim-btn');
			// Code begins here...

			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config,
					opts = cf.businessowner_page;

			opts.$claimBtn.off('click.vc.businessowner_page').on('click.vc.businessowner_page', function(e){
				e.preventDefault();
				$('.searchterm').focus();
			});
		}
	};
}(jQuery, window, document));

		;(function($, window, document, undefined){
		window.app.comps.careers = {
			config:{

			},
			init:function(){
				// Contains the initialization code
				// ...
				var self 			= this,
						cf 				= this.config,
						opts = cf.careers;


				opts.$careerPageWrapper 		= $('.careers-content');
				if(!opts.$careerPageWrapper.length)return false;

				opts.$toggleHeading 				= opts.$careerPageWrapper.find('.js-career-heading-strip');
				

				this.events();
			},
			events:function(){
				// Contains the event bindings and subscriptions
				var self = this,
						cf = this.config,
						opts = cf.careers;

				opts.$toggleHeading.off('click.vc.careers').on('click.vc.careers', function(e){
					e.preventDefault();
					
					$(this).closest('.accordion-navigation').find('.content').slideToggle();
				});

				

			}
		};
	}(jQuery, window, document));



	;(function($, window, document, undefined) {
	    window.app.comps.checkout = {
	        config: {

	        },
	        init: function() {
	            // Contains the initialization code
	            // ...
	            var self = this,
	                cf = this.config,
	                activate = false;


	            cf.$checkoutWrapper = $('.checkout-page');
	            cf.$notifyPopup = cf.$checkoutWrapper.find('.js-notify-popup');
	            cf.$closePopup = cf.$checkoutWrapper.find('.js-close-popup');
	            cf.$notifyItemPopup = cf.$checkoutWrapper.find('.js-notify-item-popup');
	            cf.$closeItemPopup = cf.$checkoutWrapper.find('.js-close-item-popup');
	            cf.$homeDeliver = cf.$checkoutWrapper.find('#home');
	            cf.$selfPick = cf.$checkoutWrapper.find('#pickup');
	            cf.$pickUpLocation = cf.$checkoutWrapper.find('#pickup-location');
	            cf.$addAddress = cf.$checkoutWrapper.find('.edit-address');
	            cf.$saveButton = cf.$checkoutWrapper.find('.js-save-button');
	            cf.$summaryButton = cf.$checkoutWrapper.find('.js-summary-button');
	            cf.$summaryRight = cf.$checkoutWrapper.find('.js-summary-right');
	            cf.$showAddress = cf.$checkoutWrapper.find('.show-address');
	            cf.$selectLocation = cf.$checkoutWrapper.find('.select-location');
	            cf.$saveAddress = cf.$checkoutWrapper.find('.js-save-address');
	            cf.$addressLink = cf.$checkoutWrapper.find('.addressLink');
	            cf.$CancelLink = cf.$checkoutWrapper.find('.js-cancel-address');
	            cf.$DeleteAddress = cf.$checkoutWrapper.find('.js-del-address');
	            cf.$CancelButton = cf.$checkoutWrapper.find('.js-cancel-button');
	            cf.$selectAddress = cf.$checkoutWrapper.find('.js-select-address');
	            // cf.$unavailable = cf.$checkoutWrapper.find('.js-unavailable');
							cf.$jsselectAddress = cf.$checkoutWrapper.find('.js-selectAddress');
	            cf.$btnSelectAddress = cf.$checkoutWrapper.find('.js-btn-address');
	            cf.$location = cf.$checkoutWrapper.find('#location');
	            cf.$labelLocation = cf.$checkoutWrapper.find('.label-location');
	            cf.$loginTab = cf.$checkoutWrapper.find('.js-login-tab');
	            cf.$addressForm = cf.$checkoutWrapper.find('.js-address-form');
	            cf.$deliveryTab = cf.$checkoutWrapper.find('.js-delivery-tab');
	            cf.$reviewTab = cf.$checkoutWrapper.find('.js-review-tab');
	            cf.$paymentTab = cf.$checkoutWrapper.find('.js-payment-tab');
	            cf.$loginToggle = cf.$checkoutWrapper.find('.js-toggle-login');
	            cf.$deliveryToggle = cf.$checkoutWrapper.find('.js-toggle-delivery');
	            cf.$reviewToggle = cf.$checkoutWrapper.find('.js-toggle-review');
	            cf.$reviewToggle1 = cf.$checkoutWrapper.find('.js-toggle-review1');
	            cf.$paymentToggle = cf.$checkoutWrapper.find('.js-toggle-payment');
	            cf.$activeTab = cf.$checkoutWrapper.find('.active');
	            cf.$Tablink = cf.$checkoutWrapper.find('.checkout-nav li a');
	            this.events();
	        },
	        events: function() {
	            // Contains the event bindings and subscriptions
	            var self = this,
	                cf = this.config;

	             //Hides the popup notification
	             cf.$closePopup.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	                cf.$notifyPopup.hide();
	            });

	            cf.$closeItemPopup.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	                cf.$notifyItemPopup.hide();
	            });

	            //Controlls Click Events On the Radio Buttons
	            cf.$homeDeliver.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	                if ($(this).is(':checked')) {
	                		cf.$selfPick.prop('checked', false);
	                    cf.$pickUpLocation.prop('checked', false);
	                		cf.selectLocation.hide();
	                    cf.$showAddress.fadeIn();
	                }
	            });

	          //   cf.$unavailable.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	          //   	e.stopPropagation();
	          // });

	            cf.$selfPick.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	                if ($(this).is(':checked')) {
	                    cf.$selectLocation.fadeIn();
	                    cf.$showAddress.hide();
	                    cf.$addAddress.hide();
	                    cf.$addAddress.hide();
	                    cf.$homeDeliver.prop('checked', false);
	                }
	            });

	            cf.$addressLink.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	                cf.$showAddress.hide();
	                cf.$addAddress.fadeIn();
	                cf.$CancelButton.fadeIn();
	                cf.$saveButton.hide();
	                cf.$summaryButton.fadeIn();
	                cf.$summaryRight.hide();

	            });
	             cf.$CancelLink.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	                cf.$showAddress.fadeIn();
	                cf.$addAddress.hide();
	                cf.$CancelButton.hide();
									cf.$selectAddress.fadeIn();
	            });

	            cf.$btnSelectAddress.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	                cf.$selectAddress.hide();
	                cf.$saveAddress.hide();
	                cf.$addAddress.fadeIn();
	                cf.$saveButton.fadeIn();
	                cf.$CancelButton.fadeIn();
	                cf.$summaryButton.fadeIn();
	                cf.$summaryRight.hide();
	            });



	            cf.$loginToggle.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	                cf.$loginTab.fadeIn();
	                cf.$deliveryTab.hide();
	                cf.$reviewTab.hide();
	                cf.$paymentTab.hide();
	                var target = this.hash,
									el = $(this);
	                el.closest('li').addClass('active').siblings().removeClass('active');
	            });

	            cf.$reviewToggle1.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	            	cf.$reviewToggle1.hide();
	            	cf.$selectAddress.hide();
	            	cf.$reviewTab.fadeIn();
							});

	            cf.$deliveryToggle.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	                cf.$loginTab.hide();
	                cf.$deliveryTab.fadeIn();
	                cf.$reviewTab.hide();
	                cf.$paymentTab.hide();
	                var target = this.hash,
									el = $(this);
	                el.closest('li').addClass('active').siblings().removeClass('active');
	            });

	            cf.$addressForm.on('valid.fndtn.abide', function () {
	            		cf.$reviewToggle.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	                cf.$loginTab.hide();
	                cf.$deliveryTab.hide();
	                cf.$reviewTab.fadeIn();
	                cf.$paymentTab.hide();
	                var target = this.hash,
									el = $(this);
	                el.closest('li').addClass('active').siblings().removeClass('active');
	            });
	            	 });



	            cf.$paymentToggle.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	                cf.$loginTab.hide();
	                cf.$deliveryTab.hide();
	                cf.$reviewTab.hide();
	                cf.$paymentTab.fadeIn();
	                var target = this.hash,
									el = $(this);
	                el.closest('li').addClass('active').siblings().removeClass('active');
	            });

	            cf.$DeleteAddress.off('click.vc.checkout').on('click.vc.checkout', function(e) {
	            	$(this).closest(cf.$selectAddress).hide();
							});


	      //       cf.$Tablink.off('click.vc.checkout').on('click.vc.checkout', function(e) {
							// 	e.preventDefault();

							// 	var target = this.hash,
							// 	 		el = $(this);

							//  	cf.$Tablink.closest('li').addClass('active').siblings().removeClass('active');
							// });

	        }
	    };
	}(jQuery, window, document));

	;(function($, window, document, undefined){
		window.app.comps.couponSteps = {
			config:{

			},
			init:function(){
				// Contains the initialization code
				// ...
				var self 			= this,
						cf 				= this.config;


				cf.$couponWrapper		= $('.coupon-steps');
				cf.$hideSection 		= cf.$couponWrapper.find('.js-image-toggle');
				cf.$hideHead 				= cf.$couponWrapper.find('.js-toggle-head');
				cf.$hideLink 			= cf.$couponWrapper.find('.js-hide-section');

				this.events();
			},
			events:function(){
				// Contains the event bindings and subscriptions
				var self = this,
						cf = this.config;


				cf.$hideLink.on('click', function(e){
						e.preventDefault();
						$(this).closest(cf.$hideHead).find('.js-image-toggle').slideToggle();
						$(this).closest(cf.$hideHead).find('.js-icon').toggleClass("icon-toggled");
				});



			}
		};
	}(jQuery, window, document));

	;(function($, window, document, undefined){
		window.app.comps.gettingStarted = {
			config:{

			},
			init:function(){
				// Contains the initialization code
				// ...
				var self 			= this,
						cf 				= this.config;


				cf.$pageWrapper		= $('.getting-started');
				cf.$hideSection 		= cf.$pageWrapper.find('.js-image-toggle');
				cf.$hideHead 				= cf.$pageWrapper.find('.js-toggle-head');
				cf.$hideLink 			= cf.$pageWrapper.find('.js-hide-section');

				this.events();
			},
			events:function(){
				// Contains the event bindings and subscriptions
				var self = this,
						cf = this.config;


				cf.$hideLink.on('click', function(e){
						e.preventDefault();
						$(this).closest(cf.$hideHead).find('.js-image-toggle').slideToggle();
						$(this).closest(cf.$hideHead).find('.js-icon').toggleClass("icon-toggled");
				});



			}
		};
	}(jQuery, window, document));

	;(function($, window, document, undefined){
		window.app.comps.history_page = {
			config:{

			},
			init:function(){
				// Contains the initialization code
				// ...
				var self 			= this,
						cf 				= this.config,
						opts  =		cf.history_page;



				opts.$mcontainer			= $('.order-history-page');
				// cf.$historyWrapper 		= $('.order-history-page');
				// cf.$orderTitle			= cf.$historyWrapper.find('.order-title');
				// cf.$cancelItem 			= cf.$historyWrapper.find('.item-list .cancel');
				// cf.$itemList				= cf.$historyWrapper.find('.item-list');
				// cf.$cancelForm			= cf.$historyWrapper.find('.cancel-form');
				// cf.$undoCancel			= cf.$cancelForm.find('small a');
				// cf.$orderCancel				= cf.$historyWrapper.find('.order-cancel');
				// cf.$cancelFormOrder			= cf.$orderCancel.find('.cancel-form');
				// cf.$cancelOrder 			= cf.$orderCancel.find('.cancel');
				// cf.$undoCancelOrder			= cf.$cancelFormOrder.find('small a');

				opts.orderTitle			= '.order-title';
				opts.cancelItem 			= '.item-list .cancel';
				opts.itemList				= '.item-list';
				opts.cancelForm			= '.cancel-form';
				opts.undoCancel			= 'small a';
				opts.orderCancel				= '.order-cancel';
				opts.cancelFormOrder			= '.cancel-form';
				opts.cancelOrder 			= '.cancel';
				opts.undoCancelOrder			= 'small a';



				this.events();
			},
			events:function(){
				// Contains the event bindings and subscriptions
				var self = this,
						cf = this.config,
						opts =		cf.history_page;

				opts.$mcontainer.off('click.vc.history_page', opts.cancelItem).on('click.vc.history_page', opts.cancelItem, function(e) {
						e.preventDefault();
						$(this).hide();
						$(this).closest(opts.itemList).find('.cancel-form').show();
						self.log($(this).closest(opts.itemList).find('.cancel-form'));
				});

				opts.$mcontainer.off('click.vc.history_page', opts.undoCancel).on('click.vc.history_page', opts.undoCancel, function(e) {
						e.preventDefault();
						$(this).closest(opts.itemList).find('.cancel-form').hide();
						$(this).closest(opts.itemList).find('.cancel').show();
						self.log($(this).closest(opts.itemList).find('.cancel-form'));
						self.log($(this).closest(opts.itemList).find('.cancel'));
				});

				opts.$mcontainer.off('click.vc.history_page', opts.cancelOrder).on('click.vc.history_page', opts.cancelOrder, function(e) {
						e.preventDefault();
						$(this).hide();
						$(this).closest(opts.orderCancel).find('.cancel-form').show();
						self.log($(this).closest(opts.orderCancel).find('.cancel-form'));

				});

				opts.$mcontainer.off('click.vc.history_page', opts.undoCancelOrder).on('click.vc.history_page', opts.undoCancelOrder, function(e) {
						e.preventDefault();
						$(this).closest(opts.orderCancel).find('.cancel-form').hide();
						$(this).closest(opts.orderCancel).find('.cancel').show();
						self.log($(this).closest(opts.orderCancel).find('.cancel-form'));
						self.log($(this).closest(opts.orderCancel).find('.cancel'));
				});
			}
		};
	}(jQuery, window, document));

	;(function($, window, document, undefined){
		window.app.comps.skuDetails = {
			config:{

			},
			init:function(){
				// Contains the initialization code
				// ...
				var self 			= this,
						cf 				= this.config,
						opts = cf.skuDetails;


				opts.$skuDetailsWrapper 		= $('.sku-details');
				if(!opts.$skuDetailsWrapper.length)return false;

				opts.$toggleHeading 					= opts.$skuDetailsWrapper.find('.js-sku-heading-strip');
				opts.$toggleStrip 					= opts.$skuDetailsWrapper.find('.js-strip-toggle');
				opts.$stripToggle 					= opts.$skuDetailsWrapper.find('.strip-toggle');
				opts.$stripToggled 					= opts.$skuDetailsWrapper.find('.strip-toggled');

				opts.$fixedInfoHook = opts.$skuDetailsWrapper.find('.js-fixed-info-hook');
				opts.$fixedInfoWrapper = opts.$skuDetailsWrapper.find('.js-fixed-actions');

				this.events();
			},
			events:function(){
				// Contains the event bindings and subscriptions
				var self = this,
						cf = this.config,
						opts = cf.skuDetails;

				opts.$toggleHeading.off('click.vc.skuDetails').on('click.vc.skuDetails', function(e){
					e.preventDefault();
					$(this).closest('.accordion-navigation').find('.strip-toggle').toggleClass("strip-toggled");
					$(this).closest('.accordion-navigation').find('.content').slideToggle();
				});

				$(window).off('scroll.vc.itemdetails').on('scroll.vc.itemdetails', function(e){
        	if($(this).scrollTop() > opts.$fixedInfoHook.offset().top + opts.$fixedInfoHook.height()){
        		opts.$fixedInfoWrapper.fadeOut();
        	}
        	else{
        		opts.$fixedInfoWrapper.fadeIn();
        	}
        });

			}
		};
	}(jQuery, window, document));


	;(function($, window, document, undefined) {
	    window.app.comps.orderTrack = {
	        config: {

	        },
	        init: function() {
	            // Contains the initialization code
	            // ...
	            var self = this,
	                cf = this.config,
	                activate = false;


	            cf.$orderTrackWrapper = $('.tracking-page');
	            cf.$orderContainer = cf.$orderTrackWrapper.find('.js-order-container');
	            cf.$orderStatus = cf.$orderTrackWrapper.find('.js-order-status');
	            cf.$viewStatus = cf.$orderTrackWrapper.find('.js-view-status');
	            cf.$orderHeading = cf.$orderTrackWrapper.find('.js-order-heading');


	            this.events();
	        },
	        events: function() {
	            // Contains the event bindings and subscriptions
	            var self = this,
	                cf = this.config;

	            cf.$viewStatus.off('click.vc.orderTrack').on('click.vc.orderTrack', function(e) {
	            	$(this).closest(cf.$orderContainer).find('.js-order-status').slideToggle();
	                self.log(cf.$orderContainer.find('.js-order-status'));

	            });


	        }
	    };
	}(jQuery, window, document));

	;(function($, window, document, undefined){
		window.app.comps.changeLocation = {
			config:{

			},
			init:function(){
				// Contains the initialization code
				// ...
				var self 			= this,
						cf 				= this.config;


				cf.$resultsPage 		= $('.results-listing');
				cf.$editLocation 			= cf.$resultsPage.find('.js-edit-location');
				cf.$currentLocation 			= cf.$resultsPage.find('.js-current-location');
				cf.$enterLocation 			= cf.$resultsPage.find('.enter-location');
				cf.$addLocation 			= cf.$resultsPage.find('.js-add-location');
				cf.$oldLocation = cf.$resultsPage.find('.js-old-location');
				cf.$newLocation = cf.$resultsPage.find('.js-input');


				this.events();
			},
			events:function(){
				// Contains the event bindings and subscriptions
				var self = this,
						cf = this.config;


				cf.$editLocation.off('click.vc.changeLocation').on('click.vc.changeLocation', function(e) {
						cf.$currentLocation.hide();
						cf.$enterLocation.fadeIn();
				});

				cf.$addLocation.off('click.vc.changeLocation').on('click.vc.changeLocation', function(e) {
						cf.$enterLocation.hide();
						cf.$currentLocation.fadeIn();
				});



			}
		};
	}(jQuery, window, document));

	;(function($, window, document, undefined){
		window.app.comps.eventSchedule = {
			config:{

			},
			init:function(){
				// Contains the initialization code
				// ...
				var self 			= this,
						cf 				= this.config;


				cf.$eventWrapper				= $('.seller-summit');
				cf.$singleSchedule 			= cf.$eventWrapper.find('.js-temp-hide');
				cf.$showEvent			 			= cf.$eventWrapper.find('.js-show-schedule');
				cf.$speakerGrid					= cf.$eventWrapper.find('.js-speaker-grid');
				cf.$toggleSpeakers			= cf.$eventWrapper.find('.js-toggle-speakers');
				cf.$scheduleSection			= cf.$eventWrapper.find('.js-schedule-section');
				cf.$scheduleLink				= cf.$eventWrapper.find('.js-schedule-link');
				cf.$aboutEvent					= cf.$eventWrapper.find('.js-about-event');
				cf.$hideAbout				= cf.$eventWrapper.find('.js-hide-about');




				this.events();
			},
			events:function(){
				// Contains the event bindings and subscriptions
				var self = this,
						cf = this.config;


				cf.$showEvent.on('click', function(e){
						e.preventDefault();
						cf.$singleSchedule.slideToggle();
						cf.$showEvent.toggle();
				});

				cf.$toggleSpeakers.on('click', function(e){
					e.preventDefault();
					cf.$speakerGrid.slideToggle();
					cf.$toggleSpeakers.toggle();
				});

				cf.$scheduleLink.on('click', function(e){
					e.preventDefault();
					cf.$scheduleSection.slideToggle();
					cf.$scheduleLink.toggle();
				});

				cf.$hideAbout.on('click', function(e){
					e.preventDefault();
					cf.$aboutEvent.slideToggle();
					cf.$hideAbout.toggle();
				});


			}
		};
	}(jQuery, window, document));

	;(function($, window, document, undefined){
		window.app.comps.faqSection = {
			config:{

			},
			init:function(){
				// Contains the initialization code
				// ...
				var self 			= this,
						cf 				= this.config;

				cf.$faqWrapper			= $('.faq-sections');
				cf.$sectionHead 		= cf.$faqWrapper.find('.js-content');
				cf.$sectionBody 		= cf.$faqWrapper.find('.js-section');
				cf.$toggleIcon 			= cf.$faqWrapper.find('.js-toggle');
				cf.$HideSections 			= cf.$faqWrapper.find('.js-hide-sections');

				this.events();
			},
			events:function(){
				// Contains the event bindings and subscriptions
				var self = this,
						cf = this.config;
				cf.$toggleIcon.on('click', function(e){
						e.preventDefault();
						$(this).closest(cf.$sectionHead).find('.toggle-icon').toggleClass('toggle-icons');
						$(this).closest(cf.$sectionHead).find('.js-section').slideToggle();
						// $(this).closest(cf.$sectionHead).find('.js-section')
						// if ($(this).closest(cf.$sectionHead).find('.js-section').is(":hidden")){
						// 	cf.$HideSections.show();
						// }
						// else{
						// 	cf.$HideSections.hide();
						// }

				});

				// if (cf.$sectionBody.length){
				// 	cf.$HideSections.hide();
				// }
				// else{
				// 	cf.$HideSections.show();
				// }

			}
		};
	}(jQuery, window, document));

	;(function($, window, document, undefined){
		window.app.comps.brandGuide = {
			config:{

			},
			init:function(){
				// Contains the initialization code
				// ...
				var self 			= this,
						cf 				= this.config;


				cf.$brandWrapper		= $('.brand-guide');
				cf.$hideSection 		= cf.$brandWrapper.find('.js-hide-section');
				cf.$hideLogo 				= cf.$brandWrapper.find('.js-hide-logo');
				cf.$brandLogo 			= cf.$brandWrapper.find('.js-brand-logo');
				cf.$hideColor 			= cf.$brandWrapper.find('.js-hide-color');
				cf.$brandColor 			= cf.$brandWrapper.find('.js-color-grid');
				cf.$brandColorSpecs = cf.$brandWrapper.find('.js-brand-color-specs');
				cf.$brandPhilosophy	= cf.$brandWrapper.find('.js-brand-philosophy');
				cf.$sectionBody			= cf.$brandWrapper.find('.js-section-body');

				this.events();
			},
			events:function(){
				// Contains the event bindings and subscriptions
				var self = this,
						cf = this.config;


				cf.$hideLogo.on('click', function(e){
						e.preventDefault();
						cf.$brandLogo.slideToggle();
						cf.$hideLogo.toggle();
				});

				cf.$hideColor.on('click', function(e){
						e.preventDefault();
						$(this).closest(cf.$brandColorSpecs).find('.js-hide-color').toggle();
						$(this).closest(cf.$brandColorSpecs).find('.js-color-grid').slideToggle();
				});

				cf.$hideSection.on('click', function(e){
					e.preventDefault();
					$(this).closest(cf.$brandPhilosophy).find('.js-hide-section').toggle();
					$(this).closest(cf.$brandPhilosophy).find('.js-section-body').slideToggle();
				});

			}
		};
	}(jQuery, window, document));

	;(function($, window, document, undefined){
		window.app.comps.brandGuide = {
			config:{

			},
			init:function(){
				// Contains the initialization code
				// ...
				var self 			= this,
						cf 				= this.config;


				cf.$brandWrapper		= $('.brand-guide');
				cf.$hideSection 		= cf.$brandWrapper.find('.js-hide-section');
				cf.$hideLogo 				= cf.$brandWrapper.find('.js-hide-logo');
				cf.$brandLogo 			= cf.$brandWrapper.find('.js-brand-logo');
				cf.$hideColor 			= cf.$brandWrapper.find('.js-hide-color');
				cf.$brandColor 			= cf.$brandWrapper.find('.js-color-grid');
				cf.$brandColorSpecs = cf.$brandWrapper.find('.js-brand-color-specs');
				cf.$brandPhilosophy	= cf.$brandWrapper.find('.js-brand-philosophy');
				cf.$sectionBody			= cf.$brandWrapper.find('.js-section-body');

				this.events();
			},
			events:function(){
				// Contains the event bindings and subscriptions
				var self = this,
						cf = this.config;


				cf.$hideLogo.on('click', function(e){
						e.preventDefault();
						cf.$brandLogo.slideToggle();
						cf.$hideLogo.toggle();
				});

				cf.$hideColor.on('click', function(e){
						e.preventDefault();
						$(this).closest(cf.$brandColorSpecs).find('.js-hide-color').toggle();
						$(this).closest(cf.$brandColorSpecs).find('.js-color-grid').slideToggle();
				});

				cf.$hideSection.on('click', function(e){
					e.preventDefault();
					$(this).closest(cf.$brandPhilosophy).find('.js-hide-section').toggle();
					$(this).closest(cf.$brandPhilosophy).find('.js-section-body').slideToggle();
				});

			}
		};
	}(jQuery, window, document));

	;(function($, window, document, undefined){
		window.app.comps.findSuppliers = {
			config:{

			},
			init:function(){
				// Contains the initialization code
				// ...
				var self 			= this,
						cf 				= this.config;


				cf.$suppliersWrapper		= $('.find-suppliers');
				cf.$hideSection 		= cf.$suppliersWrapper.find('.js-image-toggle');
				cf.$hideHead 				= cf.$suppliersWrapper.find('.js-toggle-head');
				cf.$hideLink 			= cf.$suppliersWrapper.find('.js-hide-section');

				this.events();
			},
			events:function(){
				// Contains the event bindings and subscriptions
				var self = this,
						cf = this.config;


				cf.$hideLink.on('click', function(e){
						e.preventDefault();
						$(this).closest(cf.$hideHead).find('.js-image-toggle').slideToggle();
						$(this).closest(cf.$hideHead).find('.js-icon').toggleClass("icon-toggled");
				});



			}
		};
	}(jQuery, window, document));

/**
	component_name - component_description

	Usage: 'How to use component'
	Options:
		Option_name - Option_description
			Values: Possible_option_values
	Example:
		Option_example
*/

;(function($, window, document, undefined){
	window.app.comps.hashChange = {
		init:function(){
			// Contains the initialization code
			// ...
			this.events();
		},
		events:function(){
			// Contains the event bindings and subscriptions
			var self = this,
					cf = this.config;
			var hashData = {changeEnabled: false};

			if ("onhashchange" in window) {
				window.onhashchange = function(){
					hashData.changeEnabled = true;
					hashData.hash = window.location.hash.replace('#', '');
					self.publish('vc:hashChange', hashData);
				};
			}

			// Publish hash change initially
			hashData.hash = window.location.hash.replace('#', '');
			self.publish('vc:hashChange', hashData);

			self.reply('vc:currentHash', function(){
				return hashData;
			});
		}
	};
}(jQuery, window, document));

/**
* @depend ../vendor/consolefix.js
* @depend ../vendor/operacheck.js

* Foundation components
* @depend ../vendor/foundation/foundation.js
* @depend ../vendor/foundation/foundation.alert.js
* @depend ../vendor/foundation/foundation.abide.js
* @depend ../vendor/foundation/foundation.reveal.js
* @depend ../vendor/foundation/foundation.accordion.js
*
* @depend ../vendor/jquery.nouislider/jquery.nouislider.all.js
* @depend ../vendor/jquery-placeholder/jquery.placeholder.min.js
* @depend ../vendor/doT.js

* @depend ../global/app.init.js
* @depend ../global/components/app.cookies.js
* @depend ../global/components/app.checkuserauth.js
* @depend ../global/components/app.tabs.js
* @depend ../global/components/app.modal.js
* @depend ../global/components/app.geolocation.js
* @depend ../global/components/app.productlist.js
* @depend ../global/components/app.datepicker.js
* @depend ../global/components/app.owlcarousel.js
* @depend ../global/components/app.select.js
* @depend ../global/components/app.sitesearch.js
* @depend ../global/components/app.nslider.js
* @depend ../global/components/app.cartcalculator.js
// * @depend ../global/components/app.ntabs.js
* @depend ../global/components/app.scrollto.js
* @depend ../global/components/app.lazyload.js
* @depend ../global/components/app.countdowntimer.js
* @depend ../global/components/app.loader.js
* @depend ../global/components/app.reviewbox.js
* @depend ../global/components/app.createlist.js
* @depend ../global/components/app.reviewitem.js
* @depend ../global/components/app.listitem.js
* @depend ../global/components/app.social.js
* @depend ../global/components/app.popover.js
* @depend ../global/components/app.addtolist.js


* @depend ../global/components/app.jumbotron.js
* @depend ../global/pages/app.usersettings.js
* @depend ../global/components/app.slideInTabs.js
* @depend ../global/components/app.follow-btn.js



* @depend ../mobile/components/app.fancyPassword.js
* @depend ../mobile/components/app.photoslider.js
* @depend ../mobile/components/app.changeProductView.js
* @depend ../mobile/components/app.rateReview.js
* @depend ../mobile/components/app.mobilefilter.js
* @depend ../mobile/components/app.mobilestore.js
* @depend ../mobile/components/app.nreviewbox.js
* @depend ../mobile/components/app.placeholder.js
* @depend ../global/components/app.photogallery.js
* @depend ../mobile/components/app.addphoto.js
* @depend ../global/components/app.report-business.js

*
* @depend ../global/pages/app.businessowners_page.js
*
*
* @depend ../mobile/pages/app.careers.js
* @depend ../mobile/pages/app.checkout.js
* @depend ../mobile/pages/app.couponSteps.js
* @depend ../mobile/pages/app.gettingStarted.js
* @depend ../mobile/pages/app.history_page.js
* @depend ../mobile/pages/app.skuDetails.js
* @depend ../mobile/pages/app.order-tracking.js
* @depend ../mobile/pages/app.changeLocation.js
* @depend ../mobile/pages/app.eventSchedule.js
* @depend ../mobile/pages/app.faqSection.js
* @depend ../mobile/pages/app.brandGuide.js
* @depend ../mobile/pages/app.bestPractices.js
* @depend ../mobile/pages/app.findSuppliers.js



* @depend ../global/components/app.hashChange.js





Deprecated

*/
