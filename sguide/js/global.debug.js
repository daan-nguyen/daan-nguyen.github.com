/* exported tcom */
/**
 * Tcom global object
 * @type {Object}
 */

var tcom = tcom || {};

/**
 * Tcom global settings
 * @type {mixed}
 * Globally accesible common configs
 */
tcom.version = '12.1'; // version string

/**
 * Utility functions
 */

(function($, NAMESPACE) {
  'use strict';

  var isDevice,
      isIE;

  NAMESPACE.isMobile = function() {
    return Modernizr.mq('only screen and (max-width: 767px)');
  };

  isDevice = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    AndroidChrome: function() {
      return window.chrome && navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
    },
    iPhone: function() {
      return navigator.userAgent.match(/iPhone/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    anyPhone: function() {
      var isany = (isDevice.Android() || isDevice.BlackBerry() || isDevice.iPhone() || isDevice.Opera() || isDevice.Windows());
      return (isany !== null);
    },
    any: function() {
      var isany = (isDevice.Android() || isDevice.BlackBerry() || isDevice.iOS() || isDevice.Opera() || isDevice.Windows());
      return (isany !== null);
    },
    touch: function() {
      return 'ontouchstart' in window || 'onmsgesturechange' in window;
    }
  };

  NAMESPACE.isDevice = isDevice;

  NAMESPACE.isIOS = function(){
    return NAMESPACE.isDevice.iOS();
  };

  // Internet Explorer browser testing, for 'less than' matches on IE10 and below, and 'is' matches on IE10 and 11
  isIE = {
    // Check HTML classes already applied up to IE9
    ltIE7: function() {
      return $('.lt-ie7').length > 0;
    },
    ltIE8: function() {
      return $('.lt-ie8').length > 0;
    },
    ltIE9: function() {
      return $('.lt-ie9').length > 0;
    },
    ltIE10: function() {
      return $('.lt-ie10').length > 0;
    },

    isIE10: function() {
      return /MSIE 10/i.test(navigator.userAgent);
    },
    isIE11: function() {
      return /rv:11.0/i.test(navigator.userAgent);
    },

    // Any version of IE
    any: function() {
      // If any of the above functions return true
      return (isIE.ltIE7() || isIE.ltIE8() || isIE.ltIE9() || isIE.ltIE10() || isIE.isIE10() || isIE.isIE11());
    }
  };

  NAMESPACE.isIE = isIE;

  // Found by user 'Campbeln' at http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  // Retrieve queries passed through the page URL
  NAMESPACE.getUrlQueryStringKey = function(key) {
    return NAMESPACE.getUrlQueryStringAsObject()[key];
  };
  NAMESPACE.getUrlQueryStringAsObject = function() {
    var b, cv, e, k, ma, sk, v, r = {},
        d = function (v) { return decodeURIComponent(v).replace(/\+/g, ' '); }, //# d(ecode) the v(alue)
        q = window.location.search.substring(1),
        s = /([^&;=]+)=?([^&;]*)/g //# original regex that does not allow for ; as a delimiter:   /([^&=]+)=?([^&]*)/g
    ;

    //# ma(make array) out of the v(alue)
    ma = function(v) {
        //# If the passed v(alue) hasn't been setup as an object
        if (typeof v !== 'object') {
            //# Grab the cv(current value) then setup the v(alue) as an object
            cv = v;
            v = {};
            v.length = 0;

            //# If there was a cv(current value), .push it into the new v(alue)'s array
            //#     NOTE: This may or may not be 100% logical to do... but it's better than loosing the original value
            if (cv) { Array.prototype.push.call(v, cv); }
        }
        return v;
    };

    //# While we still have key-value e(ntries) from the q(uerystring) via the s(earch regex)...
     while((e = s.exec(q)) !== null) {
        //# Collect the open b(racket) location (if any) then set the d(ecoded) v(alue) from the above split key-value e(ntry)
        b = e[1].indexOf('[');
        v = d(e[2]);

        //# As long as this is NOT a hash[]-style key-value e(ntry)
        if (b < 0) { //# b == '-1'
            //# d(ecode) the simple k(ey)
            k = d(e[1]);

            //# If the k(ey) already exists
            if (r[k]) {
                //# ma(make array) out of the k(ey) then .push the v(alue) into the k(ey)'s array in the r(eturn value)
                r[k] = ma(r[k]);
                Array.prototype.push.call(r[k], v);
            }
            //# Else this is a new k(ey), so just add the k(ey)/v(alue) into the r(eturn value)
            else {
                r[k] = v;
            }
        }
        //# Else we've got ourselves a hash[]-style key-value e(ntry)
        else {
            //# Collect the d(ecoded) k(ey) and the d(ecoded) sk(sub-key) based on the b(racket) locations
            k = d(e[1].slice(0, b));
            sk = d(e[1].slice(b + 1, e[1].indexOf(']', b)));

            //# ma(make array) out of the k(ey)
            r[k] = ma(r[k]);

            //# If we have a sk(sub-key), plug the v(alue) into it
            if (sk) { r[k][sk] = v; }
            //# Else .push the v(alue) into the k(ey)'s array
            else { Array.prototype.push.call(r[k], v); }
        }
    }

    //# Return the r(eturn value)
    return r;
  };

  NAMESPACE.effects = function(el, effect, fn) { /* fn - function to run after the effect */
    var speed = 'fast';

    // setup the callback
    fn = ('function' === typeof(fn) ? fn : function() {
      1;
    });

    if ($(el).length < 1) {
      return;
    }

    $.each(el, function( /*index, val*/ ) {
      switch (effect) {
        // jQ effects
        case 'show':
          $(this).show(0, fn);
          break;
        case 'hide':
          $(this).hide(0, fn);
          break;
        case 'toggle':
          $(this).toggle(0, fn);
          break;
        case 'fadeIn':
          $(this).fadeIn(speed, fn);
          break;
        case 'fadeOut':
          $(this).fadeOut(speed, fn);
          break;
        case 'fadeToggle':
          $(this).fadeToggle(speed, fn);
          break;
        case 'slideDown':
          $(this).slideDown(speed, fn);
          break;
        case 'slideUp':
          $(this).slideUp(speed, fn);
          break;
        case 'slideToggle':
          $(this).slideToggle(speed, fn);
          break;

          // jQ actions
        case 'blur':
          $(this).blur();
          break;
        case 'focus':
          $(this).focus();
          break;
        case 'select':
          $(this).select();
          break;
        case 'submit':
          $(this).submit(fn);
          break;
        case 'check':
          $(this).prop('checked', true);
          break;
        case 'uncheck':
          $(this).prop('checked', false);
          break;
        case 'enable':
          $(this).prop('disabled', false);
          break;
        case 'disable':
          $(this).prop('disabled', true);
          break;

          // default
        default:
          break;
      }
    });
  };

  NAMESPACE.storeItem = function(key, itm, lifeDays){

    if (Modernizr.localstorage) {
      localStorage.setItem(key, JSON.stringify(itm));

    } else {
      $.cookie(key, JSON.stringify(itm), {
        expires: lifeDays || 365,
        path: '/',
        domain: tcom.isEnvLocal ? null : 'telstra.com.au'
      });
    }

  };

  NAMESPACE.retrieveItem = function(key) {

    if (Modernizr.localstorage) {
      return JSON.parse(localStorage.getItem(key));

    } else {
      if(typeof $.cookie(key) !== 'undefined') {
        return JSON.parse($.cookie(key));
      }
    }
  };

  // Stop/start the page from being able to be scrolled
  NAMESPACE.noscroll = (function() {
    var $body = $('body'),
        add,
        remove,
        refresh;

    // Stop the page from being able to be scrolled
    add = function() {
      if ($body.hasClass('no-scroll') === false) {
        var scrollTop = $(window).scrollTop();

        $body.addClass('no-scroll').css({
          top: -scrollTop
        });
      }
    };

    // Allow the page to be scrolled again
    remove = function() {
      var top = parseInt($body.css('top'), 10);

      $body.css({
        top: ''
      }).removeClass('no-scroll');

      $(window).scrollTop(-top);
    };

    // Refresh the height of the page - used for edgecases where the page content changes when in the noscroll mode
    refresh = function() {
      if ($body.hasClass('no-scroll')) {
        // If the page has gotten shorter, make sure we aren't scrolled past the footer
        if ($body.height() > $(window).height()) {
          if ($body.offset().top - $(window).height() < -$body.height()) {
            $body.css({
              top: -($body.height() - $(window).height())
            });
          }
        }
      }
    };

    return {
      add: add,
      remove: remove,
      refresh: refresh
    };
  }());

  /**
   * Scrolls to the element without scrolling the page
   */
  $.fn.noScrollFocus = function() {
    var x = window.scrollX,
      y = window.scrollY;

    this.focus();

    if (!tcom.isIE.any()) {
      window.scrollTo(x, y);
    }

    return this; //chainability
  };

  /**
   * :focusable and :tabbable, both taken from jQuery UI Core
   */
  var focusable;

  $.extend($.expr[ ':' ], {
    data: $.expr.createPseudo ?
      $.expr.createPseudo(function(dataName) {
        return function(elem) {
          return !!$.data(elem, dataName);
        };
      }) :
      // support: jQuery <1.8
      function(elem, i, match) {
        return !!$.data(elem, match[ 3 ]);
      },

    focusable: function(element) {
      return focusable(element, !isNaN($.attr(element, 'tabindex')));
    },

    tabbable: function(element) {
      var tabIndex = $.attr(element, 'tabindex'),
        isTabIndexNaN = isNaN(tabIndex);
      return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
    }
  });

  /**
   * focussable function, taken from jQuery UI Core
   * @param element
   * @returns {*}
   */
  focusable = function(element) {
    var visible, map, mapName, img,
      nodeName = element.nodeName.toLowerCase(),
      isTabIndexNotNaN = !isNaN($.attr(element, 'tabindex'));
    if (nodeName === 'area') {
      map = element.parentNode;
      mapName = map.name;
      if (!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
        return false;
      }
      img = $('img[usemap=#' + mapName + ']')[0];
      return !!img && visible(img);
    }

    visible = function(element) {
      return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function() {
        return $.css(this, 'visibility') === 'hidden';
      }).length;
    };

    return (/input|select|textarea|button|object/.test(nodeName) ?
      !element.disabled :
      nodeName === 'a' ?
        element.href || isTabIndexNotNaN :
        isTabIndexNotNaN) &&
      // the element and all of its ancestors must be visible
      visible(element);
  };
}(jQuery, tcom));

+ function() {
  'use strict';

  var checkEnv = function(env) {
    if (Array.prototype.indexOf) {
      return (tcom.runmodes.indexOf(env) >= 0) ? true : false;
    } else {
      for (var i=0; i<tcom.runmodes.length; i++) {
        if (env === tcom.runmodes[i]) {
          return true;
        }
      }

      return false;
    }
  };

  tcom.isEnvDev = checkEnv('dev');
  tcom.isEnvFast = checkEnv('fast');
  tcom.isEnvSlow = checkEnv('slow');
  tcom.isEnvUat = checkEnv('uat');
  tcom.isEnvProd = checkEnv('prod');
  tcom.isEnvLocal = (!tcom.isEnvDev && !tcom.isEnvFast && !tcom.isEnvSlow && !tcom.isEnvUat && !tcom.isEnvProd) ? true : false;

}();

// @todo: need to refactor the following
// general init
+ function($) {
  'use strict';

  $('[data-toggle="popover"]').popover(); //init bs popovers
  if (!Modernizr.placeholder) {
    $('input, textarea').placeholder();
  }

  // scroll up init
  $('#scrollup').affix({
    offset: {
      top: 500
    }
  }).on('click', function() {
    tcom.scroll.scrollTo('html');
  });

  // @todo: remove this after the proper fix
  // fix LiveChat links
  $('a[href^="https://livechat.telstra.com/"]').each(function() {
    var $this = $(this);

    if ('undefined' === typeof($this.attr('data-popup'))) {
      $this.attr('data-popup', '');
      $this.attr('data-width', '420');
      $this.attr('data-height', '510');
    }
  });
}(jQuery);

/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 */
(function() {
  'use strict';

  if (!window.console) {
    window.console = {};
  }
  // union of Chrome, FF, IE, and Safari console methods
  var m = [
    'log', 'info', 'warn', 'error', 'debug', 'trace', 'dir', 'group',
    'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd',
    'dirxml', 'assert', 'count', 'markTimeline', 'timeStamp', 'clear'
  ];
  // define undefined methods as noops to prevent errors
  for (var i = 0; i < m.length; i++) {
    if (!window.console[m[i]]) {
      window.console[m[i]] = function() {};
    }
  }
})();

+ function($, tcom){
  'use strict';

  tcom.requireFields = function(reqForm, errorSummaryMsg, submitFunction) {

	  var _reqForm;
	  var _errorSummaryMsg;
	  var _groupsValidated;
	  var defaultErrorSummary = 'Please fix the following issues before continuing:';

	  function validateField(reqField){
	    var elemValid;
	    if (reqField.is('input[type="radio"]')) {
	      var groupName = reqField.attr('name');
	      if (typeof(groupName) !== 'undefined' && groupName !== '') {
	        if ($.inArray(groupName, _groupsValidated) >= 0){
	          elemValid = true;
	        } else {
	          elemValid = ($(_reqForm).find('input[name="' + groupName + '"]:checked').length > 0);
	          _groupsValidated.push(groupName);
	        }
	      } else {
	        elemValid = reqField.is(':checked');
	      }
	    } else if (reqField.is('input[type="checkbox"]')) {
	      elemValid = reqField.is(':checked');
	    } else {
	      elemValid = (reqField.val() !== '');
	    }
	    return elemValid;
	  }

	  function getFieldMessage(reqField){
	    var elemMsg;
	    if (typeof(reqField.data('error-msg')) !== 'undefined' && reqField.data('error-msg') !== '') {
	      elemMsg = reqField.data('error-msg');
	    } else {
	      var forLabel = $(_reqForm).find('label[for="' + reqField.attr('id') + '"]');
	      if (forLabel.length > 0 && $(forLabel[0]).text() !== '') {
	        elemMsg = $(forLabel[0]).text() + ' is required';
	      } else {
	        elemMsg = reqField.attr('name') + ' is required';
	      }
	    }
	    return elemMsg;
	  }

	  function showErrors(errorMsgList){
	    _errorSummaryMsg = _errorSummaryMsg || defaultErrorSummary;
	    var errorSummary = $('<div id="errorSummary" class="alert alert-danger" role="alert" tabindex="-1"><p>' + _errorSummaryMsg + '</p></div>');
	    var errorList = $('<ul></ul>');
	    
	    for (var i=0; i < errorMsgList.length; i++) {
	      errorList.append($('<li>' + errorMsgList[i] + '</li>'));
	    }
	    
	    errorSummary.append(errorList);
	    $(_reqForm).prepend(errorSummary);
	    errorSummary.fadeIn();
	    errorSummary.focus();
	  }

	  function handleSubmit(e){
	    e.preventDefault();
	    var formValid = true;
	    var errorMessages = [];
	    _groupsValidated = [];

	    $(_reqForm).find('#errorSummary').remove();
	    
	    $(_reqForm).find('input[required], select[required], textarea[required]').each(function(){
	      if (!validateField($(this))) {
	        $(this).addClass('invalid');
	        errorMessages.push(getFieldMessage($(this)));

	        if ($(this).is('input[type="radio"]') && typeof($(this).attr('name')) !== 'undefined' && $(this).attr('name') !== '') {
	          $(_reqForm).find('input[name="' + $(this).attr('name') + '"]').each(function(){
	            $(this).change(function(){
	              var rdoGroup = $(_reqForm).find('input[name="' + $(this).attr('name') + '"]');
	              if (rdoGroup.filter(':checked').length > 0) {
	                rdoGroup.first().removeClass('invalid');
	              } else {
	                rdoGroup.first().addClass('invalid');
	              }
	            });
	          });
	        } else {
	          $(this).change(function(){
	            if (validateField($(this))) {
	              $(this).removeClass('invalid');
	            } else {
	              $(this).addClass('invalid');
	            }
	          });
	        }
	        
	        formValid = false;
	      } else {
	        $(this).removeClass('invalid');
	      }
	    });
	    
	    if (!formValid) {
	      showErrors(errorMessages);
	      return false;
	    } else {
	      if (typeof(submitFunction) !== 'undefined') {
	        submitFunction();
	      } else {
	        _reqForm.submit();
	      }
	    }
	  }

	  _reqForm = reqForm[0];
	  _errorSummaryMsg = errorSummaryMsg;
	  $(_reqForm).bind('submit', handleSubmit);

	  return {
	    reset: function(){
	      $(_reqForm).find('input[required], select[required], textarea[required]').removeClass('invalid');
	      $(_reqForm).find('#errorSummary').remove();
	    }
	  };
	};
}(jQuery, tcom || {});
// tcom hero row/banner/etc spectrum height
+ function($) {
  'use strict';

  var _spectrum = tcom.spectrum = {};

  _spectrum.reflow = function() {

    var _components = ['hero-row', 'banner', 'jumbotron'],
      _equaliseClass = 'hero-row',
      $firstRow = $($('[role="main"]:not(.v11) .row:first-child').first()),
      $spectrum = $('#spectrum');

    if (tcom.isMobile()) {
      $spectrum.css('visibility', 'visible');
      resizeMobileSpectrum();

      $(window).on('resize.spectrum', $.debounce(150, resizeMobileSpectrum));
      return;
    }

    // temporary bugfix for the hero-row issue
    // the code at $firstRowClasses fail if $firstRow returns an empty array
    if ($firstRow.length < 1 || !$spectrum.length) {
      $spectrum.css('visibility', 'visible');
      return;
    }

    for (var i = 0; i < _components.length; i++) {
      if ($firstRow.hasClass(_components[i])) {
        if ($firstRow.hasClass(_equaliseClass)) {
          tcom.equalise($firstRow, false);
        }
        resizeSpectrum($firstRow);
        $spectrum.css('visibility', 'visible');
        return;
      }
    }

    $spectrum.css('visibility', 'visible');
  };

  var resizeMobileSpectrum = function() {
    var headerHeight = $('.main-content-wrapper').offset().top;

    $('#spectrum').height(headerHeight);
  };

  var resizeSpectrum = function($firstRow) {
    var rowHeight = $firstRow.height(),
    $spectrum = $('#spectrum');

    //if a style height property is empty apply auto height
    if($spectrum.prop('style').height === ''){
      $spectrum.height($firstRow.offset().top + rowHeight - $spectrum.offset().top + 20);
    }

  };

  // // double run spectrum reflow to avoid visible resize after .load
  // _spectrum.reflow();

  // $(window).load(function() {
  //   setTimeout(_spectrum.reflow, 20);
  // });

}(jQuery);

+ function() {
  'use strict';

  if($('html').hasClass('lt-ie9')) { return; }

  var $fixedHeader = $('.site-header').clone();

  $fixedHeader.find('.site-logo').addClass('is-light is-small');
  $fixedHeader.find('.feature-popover').remove();

  $fixedHeader.insertAfter($('.site-header')).addClass('is-fixed').headroom({
    'offset': 205,
    'tolerance': 5,
    'classes': {
      'pinned': 'active'
    },
    onUnpin: function() {
      $fixedHeader.velocity('stop').velocity({
        'top': '-100%'
      },{
        duration: 250,
        complete: function() {
          $fixedHeader.css('display','none');
        }
      });
    },
    onPin: function() {
      $fixedHeader.css('display','block').velocity('stop').velocity({
        'top': '0'
      }, {
        duration: 250
      });
    }
  });

}(jQuery);

+ function($, NAMESPACE) {

  'use strict';

  /**
   * Helper functions used by multiple other modules to make common accessibility
   * functionality easier/more consistent to implement.
   *
   * @namespace accessibility
   * @memberof TCOM
   * @version 0.0.1
   * @author Damian Keeghan - Deloitte Digital Australia
   */
  NAMESPACE.accessibility = (function() {

    var CONST,
      bindToEscape,
      tabInsideContainer;

    CONST = {
      KEYCODE: {
        TAB: 9,
        ESC: 27
      }
    };

    /**
     * Bind an event to the ESC keypress - useful for modal windows,
     * or panels that need to be closed with ESC
     *
     * @namespace bindToEscape
     * @memberof TCOM.accessibility
     */
    bindToEscape = (function() {
      var _callback = null,
        _runCallbackOnEscape,
        set,
        unset;

      /**
       * Checks for the ESC keypress and validates and runs the callback.
       *
       * @memberof TCOM.accessibility.bindToEscape
       * @param  {Object} event jQuery Event passed through from the keyup event
       * @private
       */
      _runCallbackOnEscape = function(event) {
        if (event.keyCode === CONST.KEYCODE.ESC) {
          if (typeof (_callback) === 'function') {
            _callback();
          }
        }
      };

      /**
       * Sets a callback and the event listeners for the keyup event. Only one
       * event can be registered at the one time. Unset is automatically run before
       * setting a new event.
       *
       * @memberof TCOM.accessibility.bindToEscape
       * @param  {Function} callback Function to be run
       */
      set = function(callback) {
        unset();

        _callback = callback;
        $(document).on('keyup.accessibleBindToEscape', _runCallbackOnEscape);
      };

      /**
       * Unset the event listener, recommended to call this event inside the callback
       * that is passed through to the `set` function.
       *
       * @memberof TCOM.accessibility.bindToEscape
       */
      unset = function() {
        _callback = null;
        $(document).off('keyup.accessibleBindToEscape', _runCallbackOnEscape);
      };

      return {
        set: set,
        unset: unset
      };

    }());

    /**
     * Force the keyboard tabbing to only be able to take place inside the
     * specific container. This is useful for modal windows or when you
     * need to lock user tabbing inside an area where they shouldn't be
     * able to interact outside of it.
     *
     * @namespace tabInsideContainer
     * @memberof TCOM.accessibility
     */
    tabInsideContainer = (function() {
      var set,
        unset;

      /**
       * Sets `keydown` event listeners on the first and last focusable element
       * in the container to tab to each other instead of the default action of
       * tabbing outside of the container entirely.
       *
       * @memberof TCOM.accessibility.tabInsideContainer
       * @param  {Object} $container jQuery Element to be used as the bounding container
       */
      set = function($container) {
        // keyboard binding for accessibility
        var $firstFocusable = $container.find(':focusable:first').eq(0),
          $lastFocusable = $container.find(':focusable:last').eq(0);

        // if on the first item with SHIFT+TAB go to the last item
        $firstFocusable.on('keydown.accessibleTabInsideContainer', function(event) {
          if (event.shiftKey && event.keyCode === CONST.KEYCODE.TAB) {
            event.preventDefault();
            $lastFocusable.get(0).focus();
          }
        });

        // if on the last item and TAB go to the first item
        $lastFocusable.on('keydown.accessibleTabInsideContainer', function(event) {
          if (!event.shiftKey && event.keyCode === CONST.KEYCODE.TAB) {
            event.preventDefault();
            $firstFocusable.get(0).focus();
          }
        });
      };

      /**
       * Unsets the `keydown` event listeners on the first and last focusable element
       * in the container
       *
       * @memberof TCOM.accessibility.tabInsideContainer
       * @param  {Object} $container jQuery Element to be used as the bounding container
       */
      unset = function($container) {
        var $firstFocusable = $container.find(':focusable:first').eq(0),
          $lastFocusable = $container.find(':focusable:last').eq(0);

        $firstFocusable.off('keydown.popover');
        $lastFocusable.off('keydown.popover');
      };

      return {
        set: set,
        unset: unset
      };
    }());

    return {
      bindToEscape: bindToEscape,
      tabInsideContainer: tabInsideContainer
    };

  }());

}(jQuery, tcom);

/* =============================================================================
   AJAX LOADER
   ========================================================================== */

(function($, NAMESPACE) {

  'use strict';

  /**
   * Helper functions used to translate changes
   * from a form into an AJAX call
   *
   * @namespace ajaxloader
   * @memberof tcom
   * @version 0.0.1
   * @author Damian Keeghan - Deloitte Digital Australia
   */
  NAMESPACE.ajaxloader = (function() {

    var CONFIG,
      DATA,
      CONST,
      CLASSES,
      SELECTORS,
      _jqXHR,
      _showPreloader,
      _hidePreloader,
      _loadPage,
      _getConfigByType,
      _getFormElementsFromEndpoint,
      init;

    CONFIG = {
      DEFAULTS: {
        afterLoad: function() {}
      },
      TYPES: {
        smlxl: {
          afterLoad: function() {
            if (NAMESPACE.smlxlv2) {
              NAMESPACE.smlxlv2.init();
            }

            if (NAMESPACE.formsubmit) {
              NAMESPACE.formsubmit.init();
            }

            if (NAMESPACE.doWhen) {
              NAMESPACE.doWhen.init();
            }
          }
        }
      }
    };

    DATA = {
      CONTAINER: 'ajaxloader',
      TYPE: 'ajaxloader-type',
      ENDPOINT: 'ajaxloader-endpoint',
      DEBUG: 'ajaxloader-debug',
      DEBUG_PARTIAL: 'ajaxloader-debug-partial'
    };

    CONST = {
      PRELOADER: '<div class="preloader-overlay"><div class="indicator"></div></div>'
    };

    CLASSES = {
      IS_LOADING: 'is-loading'
    };

    SELECTORS = {
      PRELOADER: {
        CONTAINER: '.preloader-container',
        OVERLAY: '.preloader-overlay'
      }
    };

    _showPreloader = function($areaToLoad) {
      $areaToLoad.addClass(CLASSES.IS_LOADING);

      if ($areaToLoad.find(SELECTORS.PRELOADER.OVERLAY).length === 0) {
        $areaToLoad.append(CONST.PRELOADER);
      }

      $areaToLoad.find(SELECTORS.PRELOADER.OVERLAY).hide().fadeIn(100);

      var loadingIndicator = NAMESPACE.loadingIndicator($areaToLoad.find(SELECTORS.PRELOADER.OVERLAY + ' .indicator'));
      loadingIndicator.start();

      return loadingIndicator;
    };

    _hidePreloader = function($areaToLoad, loadingIndicator) {
      $areaToLoad.removeClass(CLASSES.IS_LOADING);

      $areaToLoad.find(SELECTORS.PRELOADER.OVERLAY).fadeOut(100, function() {
        loadingIndicator.stop();
        $(this).remove();
      });
    };

    _loadPage = function(url, done, fail, debug) {
      debug = (typeof (debug) === 'boolean') ? debug : false;

      if (_jqXHR) {
        // abort previous XHR requests if currently running
        _jqXHR.abort();
      }

      // TEL-3701
      // AEM selector requires htm extension
      url = url.replace('.html', '.htm');

      _jqXHR = $.ajax({
        url: url,
        method: 'GET',
        dataType: 'html'
      }).done(function(data, textStatus, jqXHR) {
        // always have a minimum 250ms delay for loads to help with the preloaders
        setTimeout(function() {
          done(data, textStatus, jqXHR);
        }, 250);
      }).fail(fail);
    };

    // loop through the configuration options and compare to the provided ID
    _getConfigByType = function(id) {
      var config = {},
        matchedConfig;

      if (id === null) {
        return CONFIG.DEFAULTS;
      }

      for (var ids in CONFIG.TYPES) {
        if (CONFIG.TYPES.hasOwnProperty(ids) && ids === id) {
          matchedConfig = CONFIG.TYPES[ids];
        }
      }

      // fill out any unfilled options with the defaults
      $.extend(config, CONFIG.DEFAULTS, matchedConfig);

      if (config) {
        return config;
      }

      return CONFIG.DEFAULTS;
    };

    _getFormElementsFromEndpoint = function(endpoint) {
      var regex = /\[(.+?)\]/g,
        match = regex.exec(endpoint),
        ids = [],
        $elements = $([]);

      while (match) {
        ids.push(match[1]);
        match = regex.exec(endpoint);
      }

      if (ids.length) {
        for (var i = 0, len = ids.length; i < len; i += 1) {
          var $element = $('#' + ids[i]);

          if ($element.length) {
            $elements = $elements.add($element);
          }
        }
      }

      return $elements;
    };

    init = function() {
      $('[data-' + DATA.CONTAINER + ']').each(function(i, el) {
        var $container = $(el),
          type = $container.attr('data-' + DATA.TYPE),
          endpoint = $container.attr('data-' + DATA.ENDPOINT),
          debug = ($container.attr('data-' + DATA.DEBUG) === 'true') || false,
          debugPartial = $container.attr('data-' + DATA.DEBUG_PARTIAL) || false,
          config = _getConfigByType(type),
          $elements = _getFormElementsFromEndpoint(endpoint),
          generateAndRequestEndpoint,
          _preloader,
          preloader;

        preloader = {
          show: function() {
            _preloader = _showPreloader($container);
          },
          hide: function() {
            _hidePreloader($container, _preloader);
          }
        };

        generateAndRequestEndpoint = function() {
          var updatedEndpoint = endpoint,
            done,
            fail;

          $elements.each(function(i, el) {
            var $element = $(el),
              id = $element.attr('id');

            updatedEndpoint = updatedEndpoint.replace('[' + id + ']', $element.val());
          });

          done = function(data) {
            $container.html(data);
            config.afterLoad($container);
            preloader.hide();
          };

          fail = function(jqXHR) {
            preloader.hide();

            // we can sometimes call multiple requests at similar times -
            // abort previous requests that aren't needed, but don't show an error.
            if (jqXHR.statusText === 'abort') {
              return;
            }

            console.warn('ajaxloader: couldn\'t complete the request to load "' + updatedEndpoint + '"');
          };

          preloader.show();

          if (debug) {
            console.log('ajaxloader: Debug mode AJAX load for url: "' + updatedEndpoint + '"');
            updatedEndpoint = debugPartial;
          }

          _loadPage(updatedEndpoint, done, fail, debug);
        };

        $elements.on('change.ajaxloader', function() {
          // make sure that any other JS that needs to run has run before the submission
          // e.g. do-when
          setTimeout(generateAndRequestEndpoint, 50);
        });

        $elements.data('ajaxloader-ready', true).trigger('ready.ajaxloader');

      });
    };

    return {
      init: init
    };

  }());

}(jQuery, tcom));


$(document).ready(tcom.ajaxloader.init);

/* ========================================================================
 * Bootstrap: alert.js v3.1.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


/* jshint ignore:start */
+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      if ($this.data('dismissType') === 'hide') {
        $parent.trigger('closed.bs.alert').hide();
      } else {
        $parent.trigger('closed.bs.alert').remove();
      }
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
/* jshint ignore:end */
// // Scroll up widget
// + function($) {
//   'use strict';

//   if ($('#page-scrollup').hasClass('active')) {
//     $.scrollUp({
//       scrollName: 'scrollUp', // Element ID
//       scrollDistance: 300, // Distance from top/bottom before showing element (px)
//       scrollFrom: 'top', // 'top' or 'bottom'
//       scrollSpeed: 1000, // Speed back to top (ms)
//       easingType: 'easeInOutCubic', // Scroll to top easing (see http://easings.net/)
//       animation: 'fade', // Fade, slide, none
//       animationSpeed: 200, // Animation in speed (ms)
//       scrollTrigger: false, // Set a custom triggering element. Can be an HTML string or jQuery object
//       //scrollTarget: false, // Set a custom target element for scrolling to the top
//       scrollText: 'Back to top', // Text for element, can contain HTML
//       scrollTitle: false, // Set a custom <a> title if required.
//       scrollImg: false, // Set true to use image
//       activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
//       zIndex: 2147483647, // Z-Index for the overlay
//       position: 'none', // Position for the overlay
//       wrapper: '#page-scrollup' // Wrapper element for the overlay
//     });
//   }
// }(jQuery);
(function($, NAMESPACE){
  'use strict';

  NAMESPACE.backbutton = (function() {

    var CONFIG = {
      key: 'PCbackbutton',
      buttonId: 'PCbackButton',
      buttonSelector: '#PCbackButton',
      timeout: 1440, // 24 hours
      timeoutCookie: function(){
        var date = new Date();
        return date.setTime(date.getTime() + (CONFIG.timeout * 60 * 1000));
      }
    };

    var set = function(title, url){
      tcom.storeItem(CONFIG.key, {
        'title': title,
        'url': url,
        'timestamp': new Date().getTime()
      }, CONFIG.timeoutCookie());
    };

    var destroy = function() {
      if(Modernizr.localstorage) {
        localStorage.removeItem(CONFIG.key);
      } else {
        $.cookie(CONFIG.key, null, { path: '/' });
      }
    };

    return {
      set: set,
      destroy: destroy,
      config: CONFIG
    };

  }());

})(jQuery, tcom);
// Carousel

+ function($, tcom) {
  'use strict';

  // Generic carousel init function, requires a carousel item to be passed into it.
  tcom.carousel = function($carousel) {
    var _defaults = {
        infinite: false,
        easing: 'easeInOutCubic',
        cssEase: 'ease-in-out',
        speed: 500,
        centerPadding: '8.3333%' //one column width
      },
      _defaultsMulti = {
        slidesToShow: 3,
        infinite: true,
        speed: 250
      };

    // Carousel init
    $carousel.each(function() {
      var $el = $(this);
      var options = $.extend({}, _defaults, $el.data(), addMobileOption($el.data()));

      if ($el.is('.carousel-multi')) {
        options = $.extend({}, _defaults, _defaultsMulti, $el.data(), addMobileOption($el.data()));
      }

      if (options.autoplay) {
        options.infinite = true;
      }

      // carousel-gallery
      if ($el.is('.carousel-gallery')) {
        var $galleryMain = $el.children('.carousel-gallery-main'),
            $galleryList = $el.children('.carousel-gallery-list'),
            mainOptions = $.extend({
              arrows: false,
              speed: 50
            }, _defaults, $galleryMain.data(), addMobileOption($galleryMain.data())),
            listOptions = $.extend({}, _defaults, _defaultsMulti, $galleryList.data(), addMobileOption($galleryList.data()));

        // prepare opts
        listOptions.slidesToScroll = listOptions.slidesToShow;
        listOptions.infinite = false;

        // create carousels
        $galleryMain.slick(mainOptions);
        $galleryList.slick(listOptions);

        $galleryMain.on('beforeChange', function(event, slick, currSlide, nextSlide){
          $galleryList.find('[data-slide-to="' + currSlide + '"]').removeClass('active');
          $galleryList.find('[data-slide-to="' + nextSlide + '"]').addClass('active');
        });

      // generic carousel
      } else {
        $el.slick(options);
      }
    });
  };

  var init = function() {
    var $carousel;

    if ( !tcom.isMobile() ) {
      $carousel = $('.carousel').not('[data-mobile-only=true]');
    } else {
      $carousel = $('.carousel');
    }

    tcom.carousel($carousel);

  };

  // Return an object with all the data-mobile-type
  // converted to data-type to override
  // the carousel option on mobile
  var addMobileOption = function(options){
    var mOptions = {};

    if (tcom.isMobile()) {
      $.each(options, function (key, data) {
        if (key.indexOf('mobile') !== -1) {

          key = key.replace('mobile', '');
          key = key.charAt(0).toLowerCase() + key.slice(1);
          mOptions[key] = data;

        }
      });
    }

    return mOptions;
  };


  // bind slide-to event handler.
  $(document).on('click.tcom.carousel.slideTo', '[data-slide-to]', function(event) {
    // click event to navigate main image
    var $target = $(event.currentTarget),
      data = $target.data(),
      $carousel = $(data.target),
      $videos = $carousel.find('iframe');

    if (!$carousel.is('.carousel-gallery')) {
      $carousel.slick('slickGoTo', data.slideTo);
    } else {
      $carousel.children('.carousel-gallery-main').slick('slickGoTo', data.slideTo);
    }

    // pause every video in gallery
    $videos.each(function(index, item) {
      item.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    });

  });


  // TEL-1729: fix the absolute position for the arrow right and left on mobile
  $(window).load(function() {
    $('.jumbotron').each(function(){

      var $el = $(this);

      if ( $el.hasClass('jumbotron') && tcom.isMobile() ) {

        var $slickArrow = $el.find('.slick-prev, .slick-next'),
            _height = $el.find('.slick-slide img').height();

        var _top = (_height - $slickArrow.height()) /2;

        $slickArrow.css({'top': _top, 'opacity': 1});
      }

    });
  });


  // run init

  init();
}(jQuery, tcom || {});

// !function() {
//   'use strict';

//   var warningCookie = 'tcom-compat-warning',
//     warningDismissed = $.cookie(warningCookie);

//   if (warningDismissed) {
//     $('#browser-warning').addClass('dismissed');
//   }

//   $('#browser-warning:visible').on('click', '#dismiss-warning', function(event) {
//     var $el = $(event.delegateTarget);

//     $el.addClass('dismissed');

//     $.cookie(warningCookie, true, {
//       expires: 1,
//       path: '/',
//       // domain: 'telstra.com.au, localhost'
//     });
//   });

// }();
+ function($) {
  'use strict';

  if (!tcom.countdown) {
    return;
  }

  var createSvg = function(percent) {

    var r = 35,
      degrees = percent * 360,
      radians = (degrees - 90) * Math.PI / 180, // offset degree calc by -90 to start at top
      xpos = r + r * Math.cos(radians),
      ypos = r + r * Math.sin(radians),
      rightHalf = '',
      leftHalf = '',
      svg;

    if ((1 - percent) * 100 <= 50) {
      leftHalf = '<path d="M ' + r + ' 0 ' +
        ' A ' + r + ' ' + r + ' 0 0 0 ' + xpos + ' ' + ypos +
        ' L ' + r + ' ' + r + '" />';
    }

    if ((1 - percent) * 100 > 50) {
      leftHalf = '<path d="M ' + r + ' 0 ' +
        ' A ' + r + ' ' + r + ' 0 0 0 ' + r + ' ' + r*2 +
        ' L ' + r + ' ' + r + '" />';
      rightHalf = '<path d="M ' + r + ' ' + r*2 +
        ' A ' + r + ' ' + r + ' 0 0 0 ' + xpos + ' ' + ypos +
        ' L ' + r + ' ' + r + '" />';
    }

    svg = '<svg height="100%" width="100%"><g stroke-width="0" fill="#757575">' + leftHalf + rightHalf + '</g></svg>';

    return svg;
  };

  $('.page-takeover #clock').countdown(tcom.countdown.timer, function(event) {
      var clock = '<div class="clock-face">' + createSvg((365-parseInt(event.strftime('%D')))/365) + '<div class="clock-time">' + event.strftime('%D') + '</div><div class="clock-text">days</div></div>';
      clock += '<div class="clock-face">' + createSvg((24-parseInt(event.strftime('%H')))/24) + '<div class="clock-time">' + event.strftime('%H') + '</div><div class="clock-text">hours</div></div>';
      clock += '<div class="clock-face">' + createSvg((60-parseInt(event.strftime('%M')))/60) + '<div class="clock-time">' + event.strftime('%M') + '</div><div class="clock-text">minutes</div></div>';
      clock += '<div class="clock-face">' + createSvg((60-parseInt(event.strftime('%S')))/60) + '<div class="clock-time">' + event.strftime('%S') + '</div><div class="clock-text">seconds</div></div>';

      $(this).html(clock);
    })
    .on('update.countdown', function() {
      $('.page-takeover-content').removeClass('hidden');
    })
    .on('finish.countdown', function() {
      var content = '<h1 class="gravur text-light">' + $('<div/>').html(tcom.countdown.heading).text() + '</h1>';
      content += '<p class="text-light">' + $('<div/>').html(tcom.countdown.copy).text() + '</p>';

      if (tcom.countdown.disclaimer) {
        content += '<p class="text-light disclaimer">' + $('<div/>').html(tcom.countdown.disclaimer).text() + '</p>';
      }

      if (tcom.countdown.cta) {
        content += '<a href="' + tcom.countdown.link + '" class="primary btn light">' + tcom.countdown.cta + '</a>';
      }

      $('.page-takeover-content').html(content).removeClass('hidden');
    });

}(jQuery);
// tcom deeplink
+ function($) {
  'use strict';

  var _deep = tcom.deeplink = {};
  var delim = '--';

  // Grab a list of ids from the href strings
  var getIds = function(href) {

    var hashIndex = href.indexOf('#'),
      delimIndex = href.indexOf(delim),
      ids = [];

    if (delimIndex > hashIndex) {
      href = href.substring(delimIndex + 2, href.length);
      ids = href.split('.');
    }

    return ids;
  };

  var activateState = function(href) {
    var ids = getIds(href),
      $toggles = $('[data-toggle], .modal, [data-slide-to]').filter(':not([data-toggle="modal"])');

    for (var i = 0, len = ids.length; i < len; i++) {

      var id = ids[i],
          slide;

      if( id.indexOf('jumbotron') === 0 ){
        slide = id.split('-')[1] -1;
        id = 'jumbotron';
      }

      var $target = $($toggles.filter('[href="#' + id + '"]').get(0) ||
                      $toggles.filter('[data-target="#' + id + '"]').get(0) ||
                      $toggles.filter('#' + id).get(0));

      if ($target.length > 0) {

        var type;

        if ($target.hasClass('modal')){
          type = 'modal';
        } else if ( id === 'jumbotron' ) {
          type = 'jumbotron';
        } else {
          type = $target.data('toggle');
        }

        switch (type) {
          case 'tab':
            $target.tab('show');
            break;
          case 'collapse':
            $target.removeClass('collapsed');
            $('#' + ids[i]).collapse('show');
            break;
          case 'jumbotron':
            $('#jumbotron').find('.slick-slider').slick('slickGoTo', slide);
            break;
          case 'modal':
            $target.modal('show');
            break;
        }
      }
    }
  };

  var activateScroll = function(href) {
    href = href.replace(/[,\/ ]/g, '');

    var hashIndex = href.indexOf('#'),
      delimIndex = href.indexOf(delim);

    if (delimIndex > hashIndex) {
      href = href.substring(hashIndex, delimIndex);
    }

    tcom.scroll.scrollTo(href);
  };

  _deep.init = function() {
    activateState(location.hash);
    activateScroll(location.hash);
  };

  // on load
  $(document).ready(function() {
    if (location.hash && location.hash.slice(0,2) !== '#!') {

      // avoids direct jumping to #hash element
      setTimeout(function() {
        window.scrollTo(0, 0);
        _deep.init();
      }, 10);

      // setTimeout(function() {

      // }, 50);
    }
  });

  $('body').on('click.tcom.deeplink', '[data-smoothscroll], [href^="#"]', function(event) {
    var $target = $(event.currentTarget),
      href = $target.attr('href'),
      hashIndex = href.indexOf('#');

    if (hashIndex < 0 || $target.is('[data-toggle]')) {
      return;
    }

    href = href.substring(hashIndex, href.length);

    if (href.substring(0, 1) === '#') {

      activateState(href);
      activateScroll(href);
      event.preventDefault();

      if (Modernizr.history) {
        history.pushState(null, null, href);
      }
    }

  });

}(jQuery);

/* =============================================================================
   DO WHEN
   ========================================================================== */

(function($, NAMESPACE) {

  'use strict';

  NAMESPACE.doWhen = (function() {
    var CLASSES,
      ACTIONS,
      DATA,
      _fields = [],
      _getActionByType,
      _getValidActions,
      _parseAndSaveData,
      _doesFieldMatch,
      _onStateMatched,
      _onStateUnmatched,
      _checkDoState,
      _checkFieldDoState,
      init;

    // classes
    CLASSES = {
      IS_SHOWN: 'is-shown',
      IS_HIDDEN: 'is-hidden',
      IS_DISABLED: 'is-disabled'
    };

    ACTIONS = {
      DEFAULTS: {
        match: function() {},
        unmatch: function() {}
      },
      TYPES: {
        show: {
          match: function($item) {
            $item.addClass(CLASSES.IS_SHOWN).removeClass(CLASSES.IS_HIDDEN);
            $item.trigger('updated.doWhen').trigger('matched.show.doWhen');
          },
          unmatch: function($item) {
            $item.removeClass(CLASSES.IS_SHOWN).addClass(CLASSES.IS_HIDDEN);
            $item.trigger('updated.doWhen').trigger('unmatched.show.doWhen');
          }
        },
        hide: {
          match: function($item) {
            $item.removeClass(CLASSES.IS_SHOWN).addClass(CLASSES.IS_HIDDEN);
            $item.trigger('updated.doWhen').trigger('matched.hide.doWhen');
          },
          unmatch: function($item) {
            $item.addClass(CLASSES.IS_SHOWN).removeClass(CLASSES.IS_HIDDEN);
            $item.trigger('updated.doWhen').trigger('unmatched.hide.doWhen');
          }
        },
        click: {
          match: function($item) {
            $item.get(0).click();
            $item.trigger('updated.doWhen').trigger('matched.click.doWhen');
          },
          unmatch: function($item) {
            $item.trigger('unmatched.click.doWhen');
          }
        },
        disable: {
          match: function($item) {
            $item.prop('disabled', true).addClass(CLASSES.IS_DISABLED);
            $item.trigger('updated.doWhen').trigger('matched.disabled.doWhen');

            if ($item.get(0).tagName.toLowerCase() === 'option') {
              var $select = $item.parent(),
                $enabledOptions = $select.find('option:not(:disabled)');

              if ($item.prop('selected')) {
                $enabledOptions.eq(0).prop('selected', true);
              }

              if ($enabledOptions.length <= 1) {
                $select.prop('disabled', true).addClass(CLASSES.IS_DISABLED);
              }
            }
          },
          unmatch: function($item) {
            $item.prop('disabled', false).removeClass(CLASSES.IS_DISABLED);
            $item.trigger('updated.doWhen').trigger('unmatched.disabled.doWhen');

            if ($item.get(0).tagName.toLowerCase() === 'option') {
              var $select = $item.parent(),
                $enabledOptions = $select.find('option:not(:disabled)');

              if ($enabledOptions.length > 1) {
                $select.prop('disabled', false).removeClass(CLASSES.IS_DISABLED);
              }
            }
          }
        }
      }
    };

    // data attributes
    DATA = {
      DO_WHEN: 'do-when',
      DO_ACTION: 'do-action',
      PARSED: {
        DO_WHEN: 'do-when-parsed',
        DO_ACTION: 'do-action-parsed'
      }
    };

    _getActionByType = function(type) {
      var config = {},
        matchedConfig = false;

      if (type === null) {
        return ACTIONS.DEFAULTS;
      }

      for (var types in ACTIONS.TYPES) {
        if (ACTIONS.TYPES.hasOwnProperty(types) && types === type) {
          matchedConfig = ACTIONS.TYPES[types];
        }
      }

      if (matchedConfig === false) {
        console.warn('Do when: Invalid type "' + type + '". Valid options are: [' + _getValidActions() + ']');
        return ACTIONS.DEFAULTS;
      }

      // fill out any unfilled options with the defaults
      $.extend(config, ACTIONS.DEFAULTS, matchedConfig);

      return config;
    };

    _getValidActions = function() {
      var validTypes = [];

      for (var type in ACTIONS.TYPES) {
        if (ACTIONS.TYPES.hasOwnProperty(type)) {
          validTypes.push(type);
        }
      }

      return validTypes.join(', ');
    };

    _parseAndSaveData = function(el) {
      var $el = $(el),
        parsed = $el.data(DATA.DO_WHEN),
        type = $el.data(DATA.DO_ACTION),
        actions = _getActionByType(type);

      for (var key in parsed) {
        if (parsed.hasOwnProperty(key)) {
          // if the data is an empty array it means we can ignore it
          if (parsed[key].length === 0) {
            delete parsed[key];
          } else {
            // store all the form fields that impact show/hide functionality
            if (!_fields.hasOwnProperty(key)) {
              _fields[key] = [];
            }

            // store all the elements related to the specific form field
            _fields[key].push(el);
          }
        }
      }

      $el.data(DATA.PARSED.DO_ACTION, actions);
      $el.data(DATA.PARSED.DO_WHEN, parsed);
    };

    _doesFieldMatch = function(idOrName, value) {
      var $field = $('#' + idOrName),
        isMatched = false,
        fieldValue = [];

      // find the field based on the id or name and get the value(s)
      if ($field.length === 0) {
        $field = $('[name="' + idOrName + '"]');

        $field.each(function(i, el) {
          if ($(el).prop('checked')) {
            fieldValue.push($(el).val());
          }
        });
      } else {
        fieldValue.push($field.val());
      }

      for (var i = 0, len = value.length; i < len; i += 1) {
        for (var i2 = 0, len2 = fieldValue.length; i2 < len2; i2 += 1) {
          if (value[i] === fieldValue[i2]) {
            isMatched = true;
          }
        }
      }

      return isMatched;
    };

    _onStateMatched = function($item) {
      var actions = $item.data(DATA.PARSED.DO_ACTION);

      actions.match($item);
    };

    _onStateUnmatched = function($item) {
      var actions = $item.data(DATA.PARSED.DO_ACTION);

      actions.unmatch($item);
    };

    _checkDoState = function($filteredItems) {
      var $items;

      if ($filteredItems) {
        $items = $filteredItems;
      } else {
        $items = $('[data-' + DATA.DO_WHEN + ']');
      }

      $items.each(function(i, el) {
        var $item = $(el),
          data = $item.data(DATA.PARSED.DO_WHEN),
          toDo = true;

        for (var key in data) {
          if (data.hasOwnProperty(key) && toDo) {
            toDo = _doesFieldMatch(key, data[key]);
          }
        }

        if (toDo) {
          _onStateMatched($item);
        } else {
          _onStateUnmatched($item);
        }
      });
    };

    _checkFieldDoState = function() {
      var $field = $(this),
        idOrName = $field.attr('id'),
        nodeName = this.nodeName.toUpperCase();

      if (nodeName === 'INPUT' && ($field.attr('type') === 'radio' || $field.attr('type') === 'checkbox')) {
        idOrName = $field.attr('name');
      }

      if (_fields.hasOwnProperty(idOrName)) {
        // only check the items which will change
        var $filteredItems = $(_fields[idOrName]);
        _checkDoState($filteredItems);
        return;
      }

      // can't detect which items are impacted so check all
      _checkDoState();
    };

    // initialiser
    init = function() {
      _fields = [];

      $('[data-' + DATA.DO_WHEN + ']').each(function(i, el) {
        // format and save the data
        _parseAndSaveData(el);
      });

      for (var key in _fields) {
        if (_fields.hasOwnProperty(key)) {
          var $field = $('#' + key),
            nodeName;

          if ($field.length === 0) {
            $field = $('[name="' + key + '"]');
          }

          if ($field.length === 0) {
            return;
          }

          nodeName = $field.get(0).nodeName.toUpperCase();

          if ((nodeName === 'SELECT' || nodeName === 'INPUT') === false) {
            $field = $('[name="' + key + '"]');
          }

          $field.off('change.doWhen', _checkFieldDoState)
            .on('change.doWhen', _checkFieldDoState);
        }
      }

      // check all fields
      _checkDoState();
    };

    return {
      init: init
    };

  }());

  NAMESPACE.doWhen.init();

}(jQuery, tcom));

// tcom equalisation
+ function($, tcom) {
  'use strict';

  //
  // global variable
  //
  var _column         = '.col',
      _directParent   = '.section', // Direct Parent who the children should be equalise
      _rejected       = '[data-equalise-none], img', // Element who shouldn't be equalise
      _separatorsOnly = '.col-borders:not([data-equalise],.smlxl):visible, .separators:not([data-equalise],.smlxl):visible, .tabs-vertical';

  //
  // function equalise
  // ------------------------------------------------------
  // ------------------------------------------------------
  tcom.equalise = function($container, _fixMerge) {

    var $equaliseOnMobile = ($container.is('[data-equalise-on-mobile]:visible')) ? $container : $container.find('[data-equalise-on-mobile]:visible'),
        $equaliseRows;

    if (tcom.isMobile() && $equaliseOnMobile.length === 0) { 

      // no equalise for mobile
      // ------------------------------------------------------
      return;

    } else if (tcom.isMobile() && $equaliseOnMobile.length > 0) {

      // equalise for mobile with exception
      // ------------------------------------------------------
      $equaliseRows = $equaliseOnMobile;

      $equaliseRows.each(function() {
        var $equaliseRow = $(this);
        // fix merge margin if requested
        _fixMerge = _fixMerge || false;
        if (_fixMerge) { fixMarginMerge($equaliseRow); }
        // equalise the content
        equaliseContent($equaliseRow);
      });

    } else {

      // equalise for desktop
      // ------------------------------------------------------
      // equalise $container, or the $container's children with the attribute data-equalise
      $equaliseRows = ($container.is('[data-equalise]:visible')) ? $container : $container.find('[data-equalise]:visible');

      $equaliseRows.each(function() {
        var $equaliseRow = $(this);
        // fix merge margin if requested
        _fixMerge = _fixMerge || false;
        if (_fixMerge) { fixMarginMerge($equaliseRow); }
        // equalise the content
        equaliseContent($equaliseRow);
      });

      // columns with separators or col-borders have to be equalised
      // even if they don't have the attribute data-equalise
      var $separatorRows = ($container.is(_separatorsOnly)) ? $container : $container.find(_separatorsOnly);

      $separatorRows.each(function() {
        // equalise the col-wrapper
        equaliseSeparators($(this));
      });
    }  
  };

  // equalise - fixMarginMerge
  // ------------------------------------------------------
  // Fixes issue where margin within an element goes outside that element if
  // it isn't padded.
  var fixMarginMerge = function($container) {
    // for all the children
    $container.find(_directParent).children().not(_rejected).each(function() {

      var $child  = $(this),
          padding = {};

      // if they are a parent
      if ($child.children().length > 0) {

        // fix merge top
        if ($child.css('padding-top') === '0px' && $child.find('*:first-child').css('margin-top') !== '0px') {
          padding['padding-top'] = 1;
        }

        // fix merge bottom
        if ($child.css('padding-bottom') === '0px' && $child.find('*:last-child').css('margin-bottom') !== '0px') {
          padding['padding-bottom'] = 1;
        }

        if (padding['padding-top'] || padding['padding-bottom']) {
          $child.css(padding);
        }
      }
    });
  };

  // equalise - doINeedToEqualise
  // ------------------------------------------------------
  // Return false if a column doen't need to be equalise
  // exemple : float none, or width 100%
  var doINeedToEqualise = function ($column) {

    var _widthPercentage = ( 100 * parseFloat($column.css('width')) / parseFloat($column.parent().css('width')) );

    if ($column.hasClass('col-100-c0') || $column.css('float') === 'none' || _widthPercentage === 100) {
      return false;
    } else {
      return true;
    }
  };


  // equalise - equaliseSeparators
  // ------------------------------------------------------
  var equaliseSeparators = function($equaliseRow) {

    var maxHeight = 0,
        $columns  = ($equaliseRow.is('.tabs-vertical')) ? $columns = $equaliseRow.children('.col') : $equaliseRow.find('.col-wrapper');

    $columns
      .css('height', 'auto')
      .each(function() {
        maxHeight = Math.max($(this).outerHeight(), maxHeight);
      })
      .css('height', maxHeight);
  };
  // equalise - equaliseContent
  // ------------------------------------------------------
  // Takes a standard row and provides equalisation of all content within it. Generally
  // requires that all columns have the same # of elements but will work with uneven # of
  // elements - it will just equalise what is available.
  //
  // This will also provide column equalisation for any standard rows that have .separators
  // or .col-borders
  var equaliseContent = function($equaliseRow) {

    var _maxHeight       = [],
        _maxMarginTop    = [],
        _maxMarginBottom = [],
        equaliseColumns  = ($equaliseRow.is('.separators:not(.smlxl), .col-borders:not(.smlxl)')) ? true : false,
        maxColumnHeight  = 0;

    // keep the highest value for each index
    $equaliseRow.find(_column).each(function() {

      var $this = $(this);
          
      if (!doINeedToEqualise($this)) { return; }

      var $children = $this.find(_directParent).children().not(_rejected);

      $children.css('height', 'auto');

      $children.each(function(index) {

        var $child        = $(this),
            _childHeight  = $child.innerHeight(),
            _marginBottom = parseInt($child.css('margin-bottom')),
            _marginTop    = parseInt($child.css('margin-top'));

        _maxHeight[index]       = Math.max(_maxHeight[index], _childHeight) || _childHeight;
        _maxMarginTop[index]    = Math.max(_maxMarginTop[index], _marginTop) || _marginTop;
        _maxMarginBottom[index] = Math.max(_maxMarginBottom[index], _marginBottom) || _marginBottom;
      });
    });

    // set the highest value to all the children
    $equaliseRow.find(_column).each(function() {
      var $this = $(this);

      if (!doINeedToEqualise($this)) { return; }

      $this.find(_directParent).children().not(_rejected).each(function(index) {
        var $child = $(this);
        $child.css({
          'height': _maxHeight[index],
          'margin-bottom': _maxMarginBottom[index],
          'margin-top': _maxMarginTop[index]
        });
      });

      // keep the highest value for the columns
      if (equaliseColumns) {
        $this.find('.col-wrapper').css('min-height', '0px');
        maxColumnHeight = Math.max(maxColumnHeight, $this.find('.col-wrapper').outerHeight());
      }

    });

    // set the highest value to all the columns
    if (equaliseColumns) {
      $equaliseRow.find('.col-wrapper').css('min-height', maxColumnHeight);
    }
  };

  //
  // Event
  // ------------------------------------------------------
  // ------------------------------------------------------

  tcom.spectrum.reflow();

  $(window).load(function() {
    tcom.equalise($('body'), true);
  });

  // list of events to handle
  var equaliseEvents = [
    'show.bs.collapse',
    'show.bs.tab',
    'shown.bs.modal' // due to fade in we use post show event
  ];

  $(window).on(equaliseEvents.join(' '), function(event) {

    var $target = $(event.target);

    if ($target.is('[data-toggle]')) {
      $target = $($target.data('target') || $target.attr('href'));
    }

    setTimeout(function() {
      tcom.equalise($target, true);

    }, 10); 
  });

}(jQuery, tcom || {});
/* ==========================================================================
 * FEATURE POPOVER
 * ========================================================================== */

+ function($, NAMESPACE) {

  'use strict';

  /**
   * Toggles the display of a popover box
   *
   * @namespace featurePopover
   * @memberof TCOM
   * @version 0.0.1
   * @author Damian Keeghan - Deloitte Digital Australia
   */
  NAMESPACE.featurePopover = (function() {

    var CONST,
        DATA,
        CLASSES,
        ANIMATIONS,
        SELECTORS,

        _linkUsedToOpenPopover = null,
        _openPopover = null,
        _isAnimating = false,
        _bindEvents,
        _unbindEvents,
        _setPosition,
        _focusToElement,
        _hidePopover,
        _hideOpenPopover,
        _closeOnScrollOrCloseButton,
        _closeOnShadeClick,
        _showPopover,
        _togglePopover,
        _animate,

        init;

    CONST = {
      DURATION: {
        DELAY: 200,
        ON_HIDE: 250,
        ON_SHOW: 250,
        FOCUS_DELAY: 500
      },
      OFFSET: {
        TOP: 30,
        SIDE: 30
      },
      SHADE_OPACITY: 0.5
    };

    DATA = {
      ANIMATION: 'data-popover-animate',
      ANIMATION_OPTIONS: {
        SLIDE_RIGHT: 'slide-right'
      },
      POSITION: 'data-popover-position',
      POSITION_OPTIONS: {
        SEARCH: 'search',
        CENTRE: 'centre'
      }
    };

    CLASSES = {
      IS_ACTIVE: 'is-active',
      IS_FIXED: 'is-fixed'
    };

    SELECTORS = {
      POPOVER_BUTTON: '.fn_popover',
      POPOVER: '.feature-popover',
      POPOVER_CONTENT: '.popover-content',
      POPOVER_CLOSE: '.popover-close',
      SEARCH_TOGGLE: '.search-toggle',
      IS_FIXED: '.' + CLASSES.IS_FIXED
    };

    ANIMATIONS = {
      slideFromTop: {
        show: function($popover, afterShow) {
          $popover.velocity({
            opacity: 0,
            translateY: '-5px'
          }, {
            duration: 0
          }).addClass(CLASSES.IS_ACTIVE).velocity({
            opacity: 1,
            translateY: 0
          }, {
            delay: CONST.DURATION.DELAY,
            duration: CONST.DURATION.ON_SHOW,
            complete: afterShow
          });
        },
        hide: function($popover, afterHide) {
          $popover.css({
            display: 'block'
          }).removeClass(CLASSES.IS_ACTIVE).velocity({
            opacity: 0,
            translateY: '-5px'
          }, {
            duration: CONST.DURATION.ON_HIDE,
            complete: afterHide
          });
        }
      },
      slideFromRight: {
        show: function($popover, afterShow) {
          $popover.css('display', 'none');
          $popover.velocity({
            opacity: 0,
            translateX: $(SELECTORS.SEARCH_TOGGLE).width()
          }, {
            duration: 0,
            complete: function() {
              $popover.css('display', 'block');
            }
          }).addClass(CLASSES.IS_ACTIVE).velocity({
            opacity: 1,
            translateX: 0
          }, {
            delay: CONST.DURATION.DELAY,
            duration: CONST.DURATION.ON_SHOW,
            complete: afterShow
          });
        },
        hide: function($popover, afterHide) {
          $popover.css({
            display: 'block'
          }).removeClass(CLASSES.IS_ACTIVE).velocity({
            opacity: 0,
            translateX: $(SELECTORS.SEARCH_TOGGLE).width()
          }, {
            duration: CONST.DURATION.ON_HIDE,
            complete: afterHide
          });
        }
      }
    };

    /**
     * Set the position of the popover
     *
     * @memberof TCOM.featurePopover
     * @param  {Object} $popover The popover element to be positioned
     * @private
     */
    _setPosition = function($popover) {
      var hideAgain = true,
          popoverFixed,
          popoverWidth,
          popoverHeight,
          pos = {},

          _setDefaultPosition,
          _setCenteredPosition,
          _setSearchBarPosition,
          _setup;

      /**
       * Set the position of the popover underneath clicked element
       *
       * @memberof TCOM.featurePopover._setPosition
       * @private
       */
      _setDefaultPosition = function() {
        var $link = _linkUsedToOpenPopover,
          linkPos = $link.position(),
          linkWidth = $link.width(),
          linkHeight = $link.height(),
          $content = $popover.find(SELECTORS.POPOVER_CONTENT);

        pos = {
          top: linkPos.top + linkHeight + CONST.OFFSET.TOP - (!popoverFixed ? $(window).scrollTop() : 0),
          left: linkPos.left + (linkWidth / 2) - (popoverWidth / 2)
        };

        // Check viewport and tooltip position
        var vLeft = $(window).scrollLeft(),
          vRight = vLeft + $(window).width(),
          tLeft = $popover.position().left,
          tRight = tLeft + popoverWidth,
          maxOffset = popoverWidth / 2 - CONST.OFFSET.SIDE * 2,
          popoverRightPos = 0;

        if (tRight >= vRight) {
          var offsetRight = tRight - vRight + CONST.OFFSET.SIDE / 2;

          // if (DD.bp.is('m')) {
          //   popoverRightPos = (offsetRight < maxOffset) ? maxOffset : offsetRight;
          // } else {
            popoverRightPos = offsetRight;
          // }
        } else {
          popoverRightPos = maxOffset;
        }

        $content.css('right', popoverRightPos);

        $popover.css(pos);

        if ($content.offset().left < 0) {
          $content.css({
            right: '',
            left: -(tLeft + vLeft) + (CONST.OFFSET.SIDE / 2)
          });
        }
      }; // END _setDefaultPosition

      /**
       * Set the position of the popover to be centered vertically/horizontally
       *
       * @memberof TCOM.featurePopover._setPosition
       * @private
       */
      _setCenteredPosition = function() {
        pos = {
          top: '50%',
          left: '50%',
          'margin-top': -(popoverHeight / 2),
          'margin-left': -(popoverWidth / 2)
        };

        $popover.css(pos);
      }; // END _setCenteredPosition

      /**
       * Set the position of the search bar div
       *
       * @memberof TCOM.featurePopover._setPosition
       * @private
       */
      _setSearchBarPosition = function() {
        var $link = _linkUsedToOpenPopover,
          linkPos = $link.offset().top;

        // Calculate the position of the device based on the position of the popover trigger link
        // and whether the parent is within a fixed container
        pos = {
          top: (!popoverFixed ? linkPos : 0),
          left: $link.position().left - popoverWidth
        };
        $popover.css(pos);
      }; // END _setSearchBarPosition

      /**
       * Initialise popover positioning
       *
       * @memberof TCOM.featurePopover._setPosition
       * @private
       */
      _setup = function() {
        if ($popover.hasClass(CLASSES.IS_ACTIVE)) {
          hideAgain = false;
        } else {
          $popover.addClass(CLASSES.IS_ACTIVE);
        }

        popoverFixed = _linkUsedToOpenPopover.parents(SELECTORS.IS_FIXED).length >= 1;
        popoverWidth = $popover.width();
        popoverHeight = $popover.height();

        $popover.width(popoverWidth);

        // Position the popover position to its defined position configuration
        // else if there is no config, and there was a clicked element, position below element,
        // else display popover centered vertically/horizontally
        if ($popover.attr(DATA.POSITION) === DATA.POSITION_OPTIONS.SEARCH) {
          _setSearchBarPosition();
        } else if ($popover.attr(DATA.POSITION) === DATA.POSITION_OPTIONS.CENTRE || !_linkUsedToOpenPopover) {
          _setCenteredPosition();
        } else {
          _setDefaultPosition();
        }

        // Match position fixed if parent popover trigger is fixed
        if (_linkUsedToOpenPopover.parents(SELECTORS.IS_FIXED).length > 0) {
          $popover.addClass(CLASSES.IS_FIXED);
        } else {
          $popover.removeClass(CLASSES.IS_FIXED);
        }

        // Apply the css outline in the above position configuration
        $popover.css(pos);

        if (hideAgain) {
          $popover.removeClass(CLASSES.IS_ACTIVE);
        }
      }; // END _setup

      _setup();
    }; // END _setPosition()

    /**
     * Focus the specified element if popover data attribute designates
     *
     * @memberof TCOM.featurePopover
     * @param  String ELEMENT_ID The id of the element to focus
     * @private
     */
    _focusToElement = function(selector) {
      if (selector) {
        $(SELECTORS.POPOVER + ' ' + selector).focus();
      }
    };

    /**
     * Bind events to the popover
     *
     * @memberof TCOM.featurePopover
     * @param  {Object} $popover The popover element to have events applied to it
     * @private
     */
    _bindEvents = function($popover) {
      // scrollable and off clicks
      //$(window).on('scroll.popover resize.popover', _closeOnScrollOrCloseButton);
      $(window).on('clicked.shade', _closeOnShadeClick);
      $(window).on('resize.popover', function(event) {
        event.preventDefault();

        // Do not allow resizing to close on mobile, since keyboard popup sometimes resizes page
        // Scrolling on mobile is also a complication, triggering this
        if(tcom.isDevice.touch()) { return; }

        _hideOpenPopover();
      });

      // close button
      $popover.find(SELECTORS.POPOVER_CLOSE).on('click.popover', _closeOnScrollOrCloseButton);

      NAMESPACE.accessibility.tabInsideContainer.set($popover);
      NAMESPACE.accessibility.bindToEscape.set(_closeOnScrollOrCloseButton);

      _openPopover = $popover;
    };

    /**
     * Unbind events to the popover
     *
     * @memberof TCOM.featurePopover
     * @param  {Object} $popover The popover element to have events removed from it
     * @private
     */
    _unbindEvents = function() {
      // scrollable and off clicks
      //$(window).off('scroll.popover resize.popover', _closeOnScrollOrCloseButton);
      $(window).off('clicked.shade', _closeOnShadeClick);

      // close button
      _openPopover.find(SELECTORS.POPOVER_CLOSE).off('click.popover', _closeOnScrollOrCloseButton);

      NAMESPACE.accessibility.tabInsideContainer.unset(_openPopover);
      NAMESPACE.accessibility.bindToEscape.unset();

      _openPopover = null;
      _linkUsedToOpenPopover = null;
    };

    /**
     * Close the open popover on scroll or close button
     *
     * @memberof TCOM.featurePopover
     * @param  {Object=null} event jQuery event
     * @private
     */
    _closeOnScrollOrCloseButton = function(event) {
      // Abort if the user is on mobile and trying to scroll
      if(tcom.isDevice.touch() && $(event.target).parents('.telstra-search').length === 0) { return false; }

      if (event) {
        event.preventDefault();
      }

      _hideOpenPopover();
    };

    /**
     * Close the open popover on click outside of it
     *
     * @memberof TCOM.featurePopover
     * @param  {Object} event jQuery event
     * @private
     */
    _closeOnShadeClick = function(event) {
      if ($(event.target).closest(SELECTORS.POPOVER + ' > ' + SELECTORS.POPOVER_CONTENT).length === 0) {
        event.stopPropagation();
        event.preventDefault();

        _hideOpenPopover();
      }
    };

    /**
     * Hide the popover
     *
     * @memberof TCOM.featurePopover
     * @param  {Object} $popover The popover element
     * @param  {Boolean=false} hideAlways Hide the popover, even if it's animating
     * @param  {Function=null} callback Callback function to call after hide is completed
     * @private
     */
    _hidePopover = function($popover, callback) {
      // Return if the popover is animating, doesnt exist, or isnt open at all
      if (_isAnimating || ($popover === null || !$popover.hasClass(CLASSES.IS_ACTIVE))) {
        return;
      }

      _isAnimating = true;
      $popover.data('popover-is-open', false);

      var afterHide = function() {
        NAMESPACE.shade.setActive(false);

        _isAnimating = false;
        _unbindEvents($popover);
        // NAMESPACE.noscroll.remove();
        $popover.removeAttr('style').velocity({
          translateX: 0,
          translateY: 0
        });

        if (typeof (callback) === 'function') {
          callback();
        }
      };

      if (_linkUsedToOpenPopover && _linkUsedToOpenPopover.length > 0) {
        _linkUsedToOpenPopover.noScrollFocus();
      }

      $popover.removeClass(CLASSES.IS_ACTIVE);
      $popover.removeAttr('style');

      NAMESPACE.shade.opacity(0, CONST.DURATION.DELAY + CONST.DURATION.ON_HIDE);

      _animate($popover, false, afterHide);
    }; // END _hidePopover

    /**
     * Hide the currently open popover without knowing the element to call it on
     *
     * @memberof TCOM.featurePopover
     * @param  {Function=null} callback Callback function to call after hide is completed
     * @private
     */
    _hideOpenPopover = function(callback) {
      _hidePopover(_openPopover, callback);
    };

    /**
     * Show the popover
     *
     * @memberof TCOM.featurePopover
     * @param  {Object} $popover The popover element
     * @param  {Function=null} callback Callback function to call after show is completed
     * @private
     */
    _showPopover = function($popover, callback) {
      if (_isAnimating) {
        return;
      }

      var afterShow = function() {
        $popover.data('popover-is-open', true);

        $popover.closest(SELECTORS.POPOVER_CONTAINER).addClass(CLASSES.IS_ACTIVE);

        _isAnimating = false;
        // Focus on the element
        $popover.noScrollFocus();
        // Or focus on a specified element designated by data attribute
        _focusToElement($popover.attr('data-popover-focusto'));
        _bindEvents($popover);

        if (typeof (callback) === 'function') {
          callback();
        }
      };

      _isAnimating = true;

      _setPosition($popover);

      // NAMESPACE.noscroll.add();
      NAMESPACE.shade.setActive(true);
      NAMESPACE.shade.opacity(CONST.SHADE_OPACITY, CONST.DURATION.DELAY +  CONST.DURATION.ON_SHOW, true);

      // accessibility
      $popover.attr({
        'aria-hidden': false
      });

      _animate($popover, true, afterShow);
    };

    /**
     * Animate the popover in/out
     *
     * @memberof TCOM.featurePopover
     * @param  {Object} $popover The popover element to be positioned
     * @param  Boolean direction The direction the animation is going, in/out : true/false
     * @param  Function callback Actions to be taken after animation is complete
     * @private
     */
    _animate = function($popover, direction, callback) {
      // Animate the popover in according to data attr configuration
      var animname = 'slideFromTop';

      if ($popover.attr(DATA.ANIMATION) === DATA.ANIMATION_OPTIONS.SLIDE_RIGHT) {
        animname = 'slideFromRight';
      }

      if (direction) {
        ANIMATIONS[animname].show($popover, callback);
      } else {
        ANIMATIONS[animname].hide($popover, callback);
      }
    }; // END _animate

    /**
     * Toggle the display of the popover
     *
     * @memberof TCOM.featurePopover
     * @param  {Object} event jQuery event
     * @private
     */
    _togglePopover = function(event) {
      event.preventDefault();

      var $link = $(this),
        id = $link.data('popover-id'),
        $popover = $('#' + id);

      if ($popover.hasClass(CLASSES.IS_ACTIVE)) {
        _hidePopover($popover);
      } else {
        _linkUsedToOpenPopover = $link;
        _showPopover($popover);
      }
    };

    /**
     * Initialise the popover setup on page load
     *
     * @memberof TCOM.featurePopover
     */
    init = function() {
      $(SELECTORS.POPOVER_BUTTON).each(function(i, el) {
        var $link = $(el),
          id = $link.attr('data-popover-id'),
          $popover = $('#' + id);

        if ($popover.length === 0) {
          console.warn('Popover item with ID #' + id + ' not found. Aborting');
          return;
        }

        $link.data('popover-id', id);

        $popover.appendTo('body')
          .data('popover-is-open', false)
          .data('popover-is-animating', false)
          .data('popover-is-in-header', ($popover.closest(SELECTORS.HEADER_FIXED).length > 0));

        // accessibility
        $link.attr({
          'aria-controls': id
        });

        $popover.attr({
          'aria-hidden': true,
          tabindex: '-1'
        });

        // click event
        $link.on('click.popover', _togglePopover);
      });
    };

    return {
      init: init
    };
  }());

  NAMESPACE.featurePopover.init();

}(jQuery, tcom);

// tcom search navigation
+ function($) {
  'use strict';

  //
  // Init
  // -----------------------------------------------------
  var $forms = $('#searchDesktop, #searchMobile'),
      _firstSuggest,
      _firstUar,
      _results,
      $globalNavActiveMenu = $('#global-nav-menu li.active'),
      _gsaClient = 'TDigital_FE_All_Main',
      _gsaSite = 'TDigital_All';

  var siteParamLookup = [
    { key: '', client: 'TDigital_FE_All_Main', site: 'TDigital_All' },
    { key: 'Personal', client: 'TDigital_FE_Personal_Main', site: 'TDigital_Consumer' },
    { key: 'Small Business', client: 'TDigital_FE_SBusiness_Main', site: 'TDigital_SBusiness' },
    { key: 'Business & Enterprise', client: 'TDigital_FE_Business_Main', site: 'TDigital_Business' },
    { key: 'About Us', client: 'TDigital_FE_About_Main', site: 'TDigital_All' },
  ];

  //
  // Ajax call
  // -----------------------------------------------------
  function getSearchResult(_value, cb) {

    var selectedMenuText = $.trim($globalNavActiveMenu.text());
    for (var i=0; i < siteParamLookup.length; i++) {
      if (selectedMenuText === siteParamLookup[i].key) {
        _gsaClient = siteParamLookup[i].client;
        _gsaSite = siteParamLookup[i].site;
        break;
      }
    }

    _firstSuggest = true;
    _firstUar = true;

    $.ajax({
      url: 'https://www.telstra.com.au/gsa-search/suggest',
      type: 'get',
      dataType: 'jsonp',
      data: {
        q: _value,
        max: 10,
        site: _gsaSite,
        client: _gsaClient,
        access: 'p',
        format: 'rich'
      },
      success: function(_json) {
        _results = formatResults(_json.results);
        cb(_results);
      }
    });
  }

  function formatResults(_results){

    for (var i = 0; i < Object.keys(_results).length; i++) {

      if (_results[i].type === 'suggest') {

        _results[i].name = decode(_results[i].name);
      }

      if (_results[i].type === 'uar') {
        var _array = _results[i].content.split('#');

        _results[i].img     = decode(_array[0]);
        _results[i].name    = decode(_array[1]);
        _results[i].content = decode(_array[2]);
      }
    }
    return _results;
  }

  function decode(_text) {

    _text = _text.replace(/\\x3c/g, '<')
    .replace(/\\x3e/g, '>')
    .replace(/\\x3d/g, '=')
    .replace(/\\x27/g, '\'')
    .replace(/\\x22/g, '"');

    return _text;
  }

  //
  // Template
  // -----------------------------------------------------
  function suggestionTemplate(_result){
    var _html = '';
    if (_firstSuggest) {
      _html += '<div class="menu-item-sm menu-item-search-header"><strong>Popular keywords</strong></div>';
      _firstSuggest = false;
    }
    _html += '<a class="menu-item-sm" href="#">' + _result.name + '</a>';
    return _html;
  }

  function uarTemplate(_result){
    var _html = '';
    if (_firstUar) {
      _html += '<div class="menu-item-sm menu-item-search-header"><strong>Our Suggestions</strong></div>';
      _firstUar = false;
    }
    _html += '<a href="' + _result.moreDetailsUrl + '" class="menu-item-lg">';
    _html +=   '<div class="menu-icon">' + _result.img + '</div>';
    _html +=   '<h6 class="content-sub-heading small"><strong>' + _result.name + '</strong></h6>';
    _html +=   '<p class="small">' + _result.content + '</p>';
    _html += '</a>';  
    return _html;
  }

  //
  // Typeahead 
  // -----------------------------------------------------
  $forms.each(function() {
    var $form  = $(this),
        $input =  $(this).find('[data-search-input-desktop]');

    $input
      .typeahead({
        hint: false,
        highlight: false,
        minLength: 0
      },
      {
        name: 'search',
        source: getSearchResult,
        templates: {
          suggestion: function(_result) {

            switch(_result.type) {
              case 'suggest':
                return suggestionTemplate(_result);

              case 'uar':
                return uarTemplate(_result);

              default:
                return;
            }
          }
        }
      })
      .bind('typeahead:selected', function(_obj, _result) {  
        switch(_result.type) {
          case 'suggest':
            $input.typeahead('val', _result.name);
            $form.submit();
            break;

          case 'uar':
            window.location.href = _result.moreDetailsUrl;
            break;

          default:
            return;
        }
      });


    // On mobile only,
    // Losing the focus doesn't clean the research.
    // This fix is very ugly and need to be improve.
    if ($form.attr('id') === 'searchMobile') {

      $input
        .blur(function() {
          var rightArrow;
          rightArrow = $.Event('keydown');
          rightArrow.keyCode = rightArrow.which = 40;

          $(this).trigger(rightArrow);
        });
    }

  });

}(jQuery);
//Lightbox JS
+ function($) {
  'use strict';

  $('a[data-print]').click(function() {
    var DocumentContainer = $(this).parents('.modal').get(0);
    var WindowObject = window.open('', 'PrintWindow', 'width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');
    WindowObject.document.writeln(DocumentContainer.innerHTML);
    WindowObject.document.close();
    WindowObject.focus();
    WindowObject.print();
    WindowObject.close();
  });

  // Set height for .modal-body if needed
  function maxHeight( $modal ) {

    var $modalBody = $modal.find('.modal-body');
        $modalBody.css('max-height', 'none');

    var _modalHeight       = $modal.height(),
        _modaldialogHeigh  = $modal.find('.modal-dialog').height(),
        _modalheaderHeight = $modal.find('[class^=modal-header]').height(),
        _modaldialogMargin = parseInt( $modal.find('.modal-dialog').css('margin-top').replace('px', '') );

    if ( _modaldialogHeigh > _modalHeight ) {
      var _maxheight = _modalHeight - (_modaldialogMargin * 3) - _modalheaderHeight;
      $modalBody.css('max-height', _maxheight);
    }
  }

  // Event modal
  // $('.modal').on('focusin.bs.modal', function () { maxHeight($(this)); });
  $('.modal').on('shown.bs.modal', function () { maxHeight($(this)); });

  // Event resize
  var _throttleTime = 250,
      _timer        = window.setTimeout(function() {}, 0);

  $(window).resize(function() {
    window.clearTimeout(_timer);
    _timer = window.setTimeout(function() {

      var $modal = $('.modal:visible');
      if ($modal.length > 0) { maxHeight($modal); }
      
    }, _throttleTime);
  });


}(jQuery);
/* ==========================================================================
 * LOADING INDICATOR
 * ========================================================================== */

(function($, NAMESPACE) {

  'use strict';

  NAMESPACE.loadingIndicator = function($loader) {

    var cSpeed = 6,
      cTotalFrames = 45,
      cFrameWidth = 48,
      cIndex = 0,
      cXpos = 0,
      cPreloaderTimeout = false,
      SECONDS_BETWEEN_FRAMES = 0,
      _continueAnimation,
      startAnimation,
      stopAnimation;

    _continueAnimation = function() {
      cXpos += cFrameWidth;
      //increase the index so we know which frame of our animation we are currently on
      cIndex += 1;

      //if our cIndex is higher than our total number of frames, we're at the end and should restart
      if (cIndex >= cTotalFrames) {
        cXpos = 0;
        cIndex = 0;
      }

      if ($loader.length > 0) {
        $loader.css('background-position', (-cXpos) + 'px 0');
      }

      cPreloaderTimeout = setTimeout(_continueAnimation, SECONDS_BETWEEN_FRAMES * 1000);
    };

    startAnimation = function() {
      if (typeof ($loader.data('is-animating')) === 'boolean' && $loader.data('is-animating') === true) {
        return;
      }

      var FPS = Math.round(100 / cSpeed);
      SECONDS_BETWEEN_FRAMES = 1 / FPS;

      cPreloaderTimeout = setTimeout(_continueAnimation, SECONDS_BETWEEN_FRAMES * 1000);

      $loader.data('is-animating', true);
    };

    stopAnimation = function() {//stops animation
      clearTimeout(cPreloaderTimeout);
      cPreloaderTimeout = false;

      $loader.data('is-animating', false);
    };

    return {
      start: startAnimation,
      stop: stopAnimation
    };
  };

}(jQuery, tcom));

// tcom mega-menu js
+ function($) {
  'use strict';

  var _mega = tcom.megaMenu = {};
  var $mega = $('#mega-menu');

  // ****************************************************
  // init
  // ****************************************************
  _mega.init = function() {

    // Desktop mega menu handler
    // ****************************************************
    $mega
      // delegate event handler
      .on('mouseover.tcom.mega-menu', '> li', function(event) {
        var $currentTarget = $(event.currentTarget);

        if (!$currentTarget.data('noMenu')) {
          _mega.show($(event.currentTarget));
        }
      })
      .on('mouseout.tcom.mega-menu', '> li', function() {
        _mega.hide();
      })
      .on('click.tcom.mega-menu', '> li > a', function(event) {
        var $currentTarget = $(event.currentTarget).parent(),
          isHover = $currentTarget.hasClass('hover');

        if (!$currentTarget.data('noMenu')) {
          _mega.hide();

          if (!isHover) {
            event.preventDefault();
            _mega.show($currentTarget);
          }
        }
      });
  };

  // ****************************************************
  // Desktop show/hide functions for mega-menu
  // ****************************************************
  _mega.show = function($target) {
    $target.addClass('hover');
    tcom.shade.setActive(true);
    tcom.shade.opacity(0.5, 200);
  };

  _mega.hide = function() {
    $mega.find('> li').removeClass('hover');

    tcom.shade.opacity(0, 200, true, function(){
      tcom.shade.setActive(false);
    });
  };

  _mega.init();




}(jQuery);
// !function() {
//   'use strict';

//   var warningCookie = 'tcom-compat-warning',
//     warningDismissed = $.cookie(warningCookie);

//   if (warningDismissed) {
//     $('#browser-warning').addClass('dismissed');
//   }

//   $('#browser-warning:visible').on('click', '#dismiss-warning', function(event) {
//     var $el = $(event.delegateTarget);

//     $el.addClass('dismissed');

//     $.cookie(warningCookie, true, {
//       expires: 1,
//       path: '/',
//       // domain: 'telstra.com.au, localhost'
//     });
//   });

// }();


/* ==========================================================================
 * NEW MENU HELP
 * ========================================================================== */

// + function($, NAMESPACE) {

//   'use strict';

//   NAMESPACE.newMenuHelp = (function() {

//     var CONST,
//       TEMPLATE,
//       SELECTORS,
//       init,
//       reset,
//       _fmt;

//     CONST = {
//       MESSAGE: 'Looking for something? Here&rsquo;s our new menu.',
//       COOKIE_ID: 'tcom-new-menu-help'
//     };

//     TEMPLATE = {
//       MESSAGE: '<div class="new-menu-help"><div class="container"><p>' + CONST.MESSAGE + ' <a href="#" class="feedback-modal">Tell us what you think</a>.</p><button class="close"><i class="td-icon icon-ui-cross"></i><span class="vh">Close</span></button></div></div>'
//     };

//     SELECTORS = {
//       SITE_HEADER: '.site-header',
//       NEW_MENU_HELP_MSG: '.new-menu-help',
//       CLOSE_BTN: '.close',
//       FEEDBACK: '.feedback-modal'
//     };

//     //feedback modal template
//     _fmt += '<div id="menuFeedbackModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">';
//     _fmt += '    <div class="modal-dialog modal-medium">';
//     _fmt += '        <div class="modal-content">';
//     _fmt += '            <div class="modal-header">';
//     _fmt += '                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>';
//     _fmt += '                <h4 class="modal-title">Feedback</h4>';
//     _fmt += '            </div>';
//     _fmt += '            <div class="modal-body">';
//     _fmt += '                <iframe src="https://say.telstra.com.au/customer/general/forms/telstra-com-hamburger-menu-feedback" frameborder="0" width="100%" height="430"></iframe>';
//     _fmt += '            </div>';
//     _fmt += '        </div>';
//     _fmt += '    </div>';
//     _fmt += '</div>';

//     init = function() {

//       //append fmt to body
//       $('body').append(_fmt);

//       var newMenuDismissed = $.cookie(CONST.COOKIE_ID),
//         $helpMessage,
//         dismissHelpMessage,
//         showFeedbackModal;

//       // if already dismissed or a mobile, don't add the menu
//       if (newMenuDismissed || NAMESPACE.isMobile()) {
//         return;
//       }

//       $(TEMPLATE.MESSAGE).insertBefore($(SELECTORS.SITE_HEADER).eq(0));

//       $helpMessage = $(SELECTORS.NEW_MENU_HELP_MSG);

//       dismissHelpMessage = function() {
//         $.cookie(CONST.COOKIE_ID, true, {
//           expires: 365,
//           path: '/'
//         });

//         $helpMessage.find('p').velocity({
//           opacity: 0
//         }, {
//           duration: 100
//         });

//         $helpMessage.velocity('slideUp', {
//           delay: 100,
//           duration: 150
//         });
//       };

//       showFeedbackModal = function() {
//         $('#menuFeedbackModal').modal('show');
//       };

//       $helpMessage.find(SELECTORS.CLOSE_BTN).on('click.newMenuHelp', dismissHelpMessage);
//       $helpMessage.find(SELECTORS.FEEDBACK).on('click.newMenuHelp', showFeedbackModal);
//     };

//     reset = function() {
//       $.removeCookie(CONST.COOKIE_ID, { path: '/' });
//     };

//     return {
//       init: init,
//       reset: reset
//     };
//   }());

//   NAMESPACE.newMenuHelp.init();

// }(jQuery, tcom);

/* =============================================================================
   OFFSCREEN NAV - CONTENTS
   ========================================================================== */

(function($, NAMESPACE) {

  'use strict';

  /**
   * Convert offscreen navigation semantic lists into the paginated display required
   *
   * @namespace navContents
   * @memberof tcom
   * @version 0.0.1
   * @author Damian Keeghan - Deloitte Digital Australia
   */
  NAMESPACE.navContents = (function() {

    var CONST,
      CLASSES,
      SELECTORS,
      $navContainer,
      focusOnOpen,
      _initToActivePage,
      _scrollAndFocusToPage,
      _setupPages,
      init;

    CONST = {
      DURATION: {
        TO_PAGE: 250,
        TO_PARENT: 250,
        SCROLL: 100
      },
      USE_STATIC_ANIM: ($('.lt-ie9').length > 0)
    };

    CLASSES = {
      IS_DISPLAYED: 'is-displayed',
      IS_EXPANDED: 'is-expanded',
      HAS_CHILDREN: 'has-children',
      BACK_TO_PARENT: 'back-to-parent',
      BACK_TO_PARENT_CONTAINER: 'back-to-parent-container',
      PARENT_LINK: 'parent-link',
      NAV_LVL_1: 'nav-lvl-1',
      HAS_ICON: 'has-icon'
    };

    SELECTORS = {
      NAV: '#nav',
      IS_EXPANDED: '.' + CLASSES.IS_EXPANDED,
      IS_DISPLAYED: '.' + CLASSES.IS_DISPLAYED,
      IS_ACTIVE: '.is-active',
      HAS_CHILDREN: '.' + CLASSES.HAS_CHILDREN,
      BACK_TO_PARENT: '.' + CLASSES.BACK_TO_PARENT,
      NAV_LVL_1: '.' + CLASSES.NAV_LVL_1,
      CHILDREN: '.children',
      TD_ICON: '.td-icon'
    };

    /**
     * Find the displayed page that is deepest in the IA and focus to it
     * so the keyboard navigation can start from the visible page
     *
     * @memberof tcom.navContents
     */
    focusOnOpen = function() {
      // check if any pages are currently open
      if ($navContainer.find(SELECTORS.CHILDREN + SELECTORS.IS_DISPLAYED).length > 0) {
        var $openPages = $navContainer.find(SELECTORS.CHILDREN + SELECTORS.IS_DISPLAYED);

        // get last open page
        $openPages.get($openPages.length - 1).focus();

        return;
      }

      // if there are no pages open - just focus on the main area
      $navContainer.get(0).focus();
    };

    /**
     * Scroll the navigation container to the top of the page,
     * and focus on the new page to be displayed.
     *
     * @memberof tcom.navContents
     * @param  {Object} $page jQuery Element of the page to be displayed
     * @private
     */
    _scrollAndFocusToPage = function($page) {
      $navContainer.scrollTop(0);
      $page.noScrollFocus();
    };

    /**
     * Setup the pages by adding the duplicate links for parent pages
     * inside the children page, along with the "back to parent" links
     * and bind the events for clicking on the children/back links
     *
     * @memberof tcom.navContents
     * @private
     */
    _setupPages = function() {
      var topLevelTitle = $navContainer.find('> ' + SELECTORS.IS_EXPANDED + ' > ' + SELECTORS.NAV_LVL_1).text();

      $navContainer.find('> li > ' + SELECTORS.HAS_CHILDREN + ', > li.' + CLASSES.IS_EXPANDED + ' > ' + SELECTORS.CHILDREN + ' > ul > li > ' + SELECTORS.HAS_CHILDREN).data('parent-page-title', topLevelTitle);

      $navContainer.find(SELECTORS.HAS_CHILDREN).each(function(i, el) {
        var $link = $(el),
          $children = $link.next(SELECTORS.CHILDREN),
          $parentLink = $link.clone(),
          parentPageTitle = ($link.data('parent-page-title')) ? $link.data('parent-page-title') : $link.closest(SELECTORS.CHILDREN).parent().find('> ' + SELECTORS.HAS_CHILDREN).text();

        if ($children.length === 0) {
          // no children found
          return;
        }

        $children.attr({
          tabindex: '-1'
        });

        // add paginated actions
        if (!$link.parent().hasClass(CLASSES.IS_EXPANDED)) {
          $children.prepend($parentLink);
          $parentLink.removeClass(CLASSES.HAS_CHILDREN).removeClass(CLASSES.NAV_LVL_1).addClass(CLASSES.PARENT_LINK);

          if ($parentLink.find(SELECTORS.TD_ICON).length) {
            $parentLink.addClass(CLASSES.HAS_ICON);
          }

          // add back to page link
          $children.prepend('<div class="' + CLASSES.BACK_TO_PARENT_CONTAINER + '"><a href="#" class="' + CLASSES.BACK_TO_PARENT + '">Back to ' + parentPageTitle + '</a></div>');

          var $backToParent = $children.find(SELECTORS.BACK_TO_PARENT);

          // go to next page
          $link.on('click.navContents', function(event) {
            event.preventDefault();

            _scrollAndFocusToPage($children);

            if (CONST.USE_STATIC_ANIM) {
              $children.addClass(CLASSES.IS_DISPLAYED);
            } else {
              $children.hide().velocity({
                translateX: '100%',
                opacity: 0
              }, {
                duration: 0
              }).show().addClass(CLASSES.IS_DISPLAYED).velocity({
                translateX: '0%',
                opacity: 1
              }, {
                duration: CONST.DURATION.TO_PAGE,
                easing: 'easeInOut'
              });
            }
            // DIRTY HACK: fixed the height of the menu to 1000 hide the parent contents
            $children.css('height',1000);
          });

          // go to previous page
          $backToParent.on('click.navContents', function(event) {
            event.preventDefault();

            var $parentPage = $children.parent().closest(SELECTORS.CHILDREN + SELECTORS.IS_DISPLAYED);

            if ($parentPage.length === 0) {
              $parentPage = $navContainer;
            }

            _scrollAndFocusToPage($parentPage);

            if (CONST.USE_STATIC_ANIM) {
              $children.removeClass(CLASSES.IS_DISPLAYED);
            } else {
              $children.velocity({
                translateX: '0%'
              }, {
                duration: 0
              }).velocity({
                translateX: '100%',
                opacity: 0
              }, {
                duration: CONST.DURATION.TO_PAGE,
                easing: 'easeInOut',
                complete: function() {
                  $children.removeAttr('style').removeClass(CLASSES.IS_DISPLAYED);
                }
              });
            }

          });
        }
      });
    };

    /**
     * Reset the display of the pages to show the current active page instead.
     * This is used on page load to ensure that the nav opens at the deeper IA
     *
     * @memberof tcom.navContents
     * @private
     */
    _initToActivePage = function() {
      // reset displayed pages
      $navContainer.find(SELECTORS.IS_DISPLAYED).removeClass(CLASSES.IS_DISPLAYED);

      // set page to active page
      var $activeListItem = $navContainer.find(SELECTORS.IS_ACTIVE);

      if ($activeListItem.hasClass(CLASSES.IS_EXPANDED)) {
        return;
      }

      // add displayed state to page
      $activeListItem.find('> ' + SELECTORS.CHILDREN).addClass(CLASSES.IS_DISPLAYED);

      // add displayed state to pages parents
      $activeListItem.parents(SELECTORS.CHILDREN).each(function(i, el) {
        if ($(el).closest('li').hasClass(CLASSES.IS_EXPANDED)) {
          // don't add the is-displayed state to the expanded item
          return;
        }

        $(el).addClass(CLASSES.IS_DISPLAYED);
      });
    };

    /**
     * Initialisation and setup of the navigation contents
     *
     * @memberof tcom.navContents
     */
    init = function() {
      $navContainer = $(SELECTORS.NAV);

      _setupPages();
      _initToActivePage();
    };

    return {
      init: init,
      focusOnOpen: focusOnOpen
    };

  }());

}(jQuery, tcom));

/* =============================================================================
   OFFSCREEN NAV
   ========================================================================== */

(function($, NAMESPACE) {

  'use strict';

  /**
   * Offscreen navigation - standard Deloitte Digital plugin,
   * retrofitted to work with LESS and adjusted for Telstra
   *
   * @namespace nav
   * @memberof tcom
   * @version 2.0.0.telstra
   * @author Damian Keeghan - Deloitte Digital Australia
   */
  NAMESPACE.nav = (function() {

    var OPTIONS,
      CLASSES,
      SELECTORS,
      _isInit = false,
      _isNavOpen = false,
      _isTransitioning = false,
      _isEnabled = true,
      _newDuration = false,
      _$linkWhichOpenedNav = null,
      isInit,
      _validateOptions,
      _toggleOffscreenNav,
      enableOffscreenNav,
      disableOffscreenNav,
      init;

    // options
    OPTIONS = {
      HAS_BACKGROUND: true,
      USE_CSS_TRANSLATE: true,
      USE_FIXED_POSITIONING: true,
      NAV_WIDTH: 290,
      BACKGROUND_OPACITY: 0.5,
      DO_INLINE_SCROLL: true,
      TRANSITIONS: {
        ANIMATE_IN: 400,
        ANIMATE_OUT: 400
      }
    };

    // classes
    CLASSES = {
      NAV_READY: 'js-nav',
      NAV_USES_TRANSLATE: 'js-nav-translate',
      NAV_TRANSITIONING: 'js-nav-transitioning',
      NAV_OPEN: 'js-nav-open',
      IS_ACTIVE: 'is-active',
      IS_RIGHT: 'is-right'
    };

    // selectors
    SELECTORS = {
      CONTAINER: '.offscreen-nav',
      HEADER: '#header',
      INNER_WRAP: '#inner-wrap',
      NAV_TOGGLE: '.nav-toggle'
    };

    /**
     * Returns if the navigation has been initialised already or not
     *
     * @memberof tcom.nav
     * @private
     */
    isInit = function() {
      return _isInit;
    };

    /**
     * Validate the options that have been passed through and ensure that no
     * invalid combinations are used by resetting them to defaults where needed
     *
     * @memberof tcom.nav
     * @private
     */
    _validateOptions = function() {
      // if DO_INLINE_SCROLL is a function set it to a static variable instead
      if (typeof (OPTIONS.DO_INLINE_SCROLL) === 'function') {
        OPTIONS.DO_INLINE_SCROLL = OPTIONS.DO_INLINE_SCROLL();
      }

      if (OPTIONS.USE_CSS_TRANSLATE) {
        if (typeof (Modernizr) === 'object' && (Modernizr.csstransforms3d && Modernizr.csstransforms)) {
          $('html').addClass(CLASSES.NAV_USES_TRANSLATE);
        } else {
          OPTIONS.USE_CSS_TRANSLATE = false; // fallback to use position left
        }
      }
    };

    /**
     * Toggle open/close the navigation
     *
     * @memberof tcom.nav
     * @param  {Object} event jQuery event of the click event
     */
    _toggleOffscreenNav = function(event) {
      event.preventDefault();

      var $link = $(this),
        navSelector = '#' + $link.attr('data-nav-id');

      if ($(navSelector).length === 0) {
        console.warn('Offscreen Navigation with id "' + navSelector + '" doesn\'t exist. Aborting.');
        return;
      }

      _$linkWhichOpenedNav = $link;

      if (_isNavOpen === false) {
        $(navSelector).trigger('open.nav.offscreen');
        return;
      }

      $(navSelector).trigger('close.nav.offscreen');
    };

    /**
     * Enable the navigation (used by enquire to turn the navigation on if needed)
     *
     * @memberof tcom.nav
     */
    enableOffscreenNav = function() {
      _isEnabled = true;

      $(SELECTORS.CONTAINER).each(function(i, el) {
        $(el).trigger('enableNav.nav.offscreen');
      });
    };

    /**
     * Disable the navigation (used by enquire to turn the navigation off if needed)
     *
     * @memberof tcom.nav
     */
    disableOffscreenNav = function() {
      _isEnabled = false;

      $(SELECTORS.CONTAINER).each(function(i, el) {
        $(el).trigger('disableNav.nav.offscreen');
      });
    };

    /**
     * Initialise the navigation on page load
     *
     * @memberof TCOM_NEXT.nav
     */
    init = function() {
      if (_isInit) {
        // only run once
        return;
      }

      if (!$(SELECTORS.CONTAINER).length) {
        console.warn('The offscreen navigation element (' + SELECTORS.CONTAINER + ') isn\'t present on the page');
        return;
      }

      _validateOptions();

      /**
       * Loop for all the individual navigation items on the page
       * can have more than one
       *
       * @namespace eachNavItem
       * @memberof tcom.nav
       */
      $(SELECTORS.CONTAINER).each(function(i, el) {
        var $navContainer = $(el),
          navId = $navContainer.attr('id'),
          _animations = {},
          _containerHeightForNav = {},
          _touchInteraction = {},
          _getAnimatedItems,
          _closeOnCloseButtonClick,
          _bindEventsToCloseOpenNavigation,
          _unbindEventsToCloseOpenNavigation,
          _isCurrentlyOpen,
          _openOffscreenNav,
          _closeOffscreenNav,
          _enableOffscreenNav,
          _disableOffscreenNav;

        /**
         * Shortcut for getting all the items that need to be animated
         *
         * @memberof tcom.nav.eachNavItem
         * @private
         */
        _getAnimatedItems = function() {
          return $navContainer;
        };

        /**
         * Animations required for the open/close of the navigation
         *
         * @namespace _animations
         * @memberof tcom.nav.eachNavItem
         * @private
         */
        _animations = {

          /**
           * Animation for opening the navigation panel
           *
           * @memberof tcom.nav.eachNavItem._animations
           * @param  {Number} duration Time in milliseconds
           * @param  {Function} callback Function to call after the animation is complete
           * @private
           */
          openNav: function(duration, callback) {
            callback = callback || function() {};

            _getAnimatedItems().velocity('stop', true);

            $navContainer.addClass(CLASSES.IS_ACTIVE);

            $navContainer.attr({
              'aria-hidden': false
            });

            var navContainerAnim = {};

            // the open position of the navigation
            if (OPTIONS.USE_CSS_TRANSLATE) {
              navContainerAnim.translateZ = 0;
              navContainerAnim.translateX = 0;

              //set the current position to stop initial transition bugs
              var matrixToArray,
                getTranslateXFromMatrix;

              matrixToArray = function(str) {
                return str.replace('matrix3d', '').replace('matrix', '').match(/(-?[0-9\.]+)/g);
              };

              getTranslateXFromMatrix = function(str) {
                var arr = matrixToArray(str);

                if (str.indexOf('matrix(') === 0) {
                  return arr[4];
                } else if (str.indexOf('matrix3d(') === 0) {
                  return arr[12];
                }

                return 0;
              };

              var currentTranslateX = getTranslateXFromMatrix($navContainer.css('transform'));

              $navContainer.velocity({
                translateX: currentTranslateX
              }, 0);
            } else {
              if ($navContainer.hasClass(CLASSES.IS_RIGHT)) {
                navContainerAnim.right = 0;
              } else {
                navContainerAnim.left = 0;
              }

              navContainerAnim.translateZ = 0;
            }

            $navContainer.velocity(navContainerAnim, {
              duration: duration,
              complete: callback,
              easing: 'ease-in-out'
            });

            if (OPTIONS.HAS_BACKGROUND) {
              NAMESPACE.shade.opacity(OPTIONS.BACKGROUND_OPACITY, duration, true);
            }
          },

          /**
           * Animation for closing the navigation panel
           *
           * @memberof tcom.nav.eachNavItem._animations
           * @param  {Object} duration Time in milliseconds
           * @param  {Function} callback Function to call after the animation is complete
           * @private
           */
          closeNav: function(duration, callback) {
            var afterCloseNav;

            callback = callback || function() {};

            afterCloseNav = function () {
              $navContainer.removeClass(CLASSES.IS_ACTIVE);

              if (typeof(callback) === 'function') {
                callback();
              }
            };

            _getAnimatedItems().velocity('stop', true);

            $navContainer.attr({
              'aria-hidden': true
            });

            var navContainerAnim = {};

            // the closed position of the navigation
            if (OPTIONS.USE_CSS_TRANSLATE) {
              navContainerAnim.translateZ = 0;

              if ($navContainer.hasClass(CLASSES.IS_RIGHT)) {
                navContainerAnim.translateX = OPTIONS.NAV_WIDTH + 'px';
              } else {
                navContainerAnim.translateX = '-' + OPTIONS.NAV_WIDTH + 'px';
              }
            } else {
              if ($navContainer.hasClass(CLASSES.IS_RIGHT)) {
                navContainerAnim.right = '-' + OPTIONS.NAV_WIDTH + 'px';
              } else {
                navContainerAnim.left = '-' + OPTIONS.NAV_WIDTH + 'px';
              }
            }

            $navContainer.velocity(navContainerAnim, {
              duration: duration,
              complete: afterCloseNav,
              easing: 'ease-in-out'
            });

            if (OPTIONS.HAS_BACKGROUND) {
              NAMESPACE.shade.opacity(0, duration);
            }
          },

          /**
           * Reset the inline style from animated items
           *
           * @memberof tcom.nav.eachNavItem._animations
           * @private
           */
          resetInlineStyle: function() {
            _getAnimatedItems().velocity('stop', true).removeAttr('style');
          }
        };

        /**
         * Set/unset the container for the navigation when it opens/close
         *
         * @namespace _containerHeightForNav
         * @memberof tcom.nav.eachNavItem
         * @private
         */
        _containerHeightForNav = {};

        /**
         * Set the height of the nav when opened or internal height is updated
         *
         * @memberof tcom.nav.eachNavItem._containerHeightForNav
         * @private
         */
        _containerHeightForNav.set = function() {
          // scroll the navigation inline - separate to the rest of the page
          NAMESPACE.noscroll.add();

          $navContainer.css({
            'overflow-x': 'hidden',
            '-webkit-overflow-scrolling': 'touch'
          });

          if (typeof (event) === 'undefined') {
            $(window).off('resize.nav').on('resize.nav', $.debounce(100, _containerHeightForNav.set));
          }
        };

        /**
         * Resets all inline styles that are added in _containerHeightForNav.set
         * called when the navigation is closed
         *
         * @memberof tcom.nav.eachNavItem._containerHeightForNav
         * @private
         */
        _containerHeightForNav.unset = function() {
          // scroll the navigation inline - separate to the rest of the page
          // behaves more like an app
          NAMESPACE.noscroll.remove();

          $navContainer.css({
            'overflow-x': '',
            'overflow-y': ''
          }).find('> nav').css({
            'overflow-x': '',
            width: ''
          });

          _getAnimatedItems().css('transform', '').css('transition-duration', '');

          // remove resize functionality
          $(window).off('resize.nav');
        };

        /**
         * Touch interaction object used for all touch/swiping events, initialise vars object
         *
         * @namespace _touchInteraction
         * @memberof tcom.nav.eachNavItem
         * @private
         */
        _touchInteraction = {
          vars: {}
        };

        /**
         * Gets the xPosition of the first touch (or mouse position)
         *
         * @memberof tcom.nav.eachNavItem._touchInteraction
         * @param  {Object} origEvent Plain JS event, passed through from jQuery `event.originalEvent`
         * @private
         */
        _touchInteraction.getCurrentXPos = function(origEvent) {
          return (origEvent.touches && origEvent.touches.length > 0) ? origEvent.touches[0].pageX : origEvent.pageX;
        };

        /**
         * Calculates the difference in pixels between the start position and current position
         *
         * @memberof tcom.nav.eachNavItem._touchInteraction
         * @param  {Object} vars Object containing values for `startXPos` and `currentXPos`
         * @private
         */
        _touchInteraction.getPxWidthMoved  = function(vars) {
          var diff = vars.startXPos - vars.currentXPos;

          if ($navContainer.hasClass(CLASSES.IS_RIGHT)) {
            diff = vars.currentXPos - vars.startXPos;
          }

          return diff;
        };

        /**
         * Calculates the difference in percentage between the start position and the current position
         *
         * @memberof tcom.nav.eachNavItem._touchInteraction
         * @param  {Object} vars Object containing values for `startXPos` and `currentXPos`
         * @private
         */
        _touchInteraction.getPercentageWidthMoved = function(vars) {
          var diff = vars.startXPos - vars.currentXPos;

          return (diff / $(window).width()) * 100;
        };

        /**
         * On touch start of the background behind the navigation
         *
         * @memberof tcom.nav.eachNavItem._touchInteraction
         * @param  {Object} event jQuery event of the TouchStart/MouseDown event
         * @private
         */
        _touchInteraction.onStart = function(event) {
          event.stopPropagation();

          // need the JS event, not the jQuery event
          var origEvent = event.originalEvent;

          origEvent.stopPropagation();

          // only run if navigation is open and the interaction isn't inside the navigation
          if (_isCurrentlyOpen && $(event.target).closest(SELECTORS.CONTAINER).length === 0) {
            event.preventDefault();
            origEvent.preventDefault();

            // ie9 and below don't handle this well
            if ($('.lt-ie10').length > 0) {
              return;
            }

            // set default positions, speed and assume that the user will be closing it
            _touchInteraction.vars = {
              isMovingTowardsClose: true,
              speed: 0,
              startXPos: _touchInteraction.getCurrentXPos(origEvent),
              prevXPos: _touchInteraction.getCurrentXPos(origEvent)
            };

            // listen for move and end events
            $(document).on('touchmove.nav mousemove.nav', _touchInteraction.onMove);
            $(document).on('touchend.nav mouseup.nav', _touchInteraction.onEnd);
          }
        };

        /**
         * On touch move interaction (in between touchstart and touchend)
         *
         * @memberof tcom.nav.eachNavItem._touchInteraction
         * @param  {Object} event jQuery event of the TouchMove/MouseMove event
         * @private
         */
        _touchInteraction.onMove = function(event) {
          event.stopPropagation();
          event.preventDefault();

          var origEvent = event.originalEvent,
            vars = _touchInteraction.vars;

          vars.currentXPos = _touchInteraction.getCurrentXPos(origEvent);

          // only calculate new positions if it has moved (this stops unnecessary processing if the user is just holding their finger down)
          if (vars.currentXPos !== vars.prevXPos) {
            if (!$navContainer.hasClass(CLASSES.IS_ACTIVE)) {
              $navContainer.addClass(CLASSES.IS_ACTIVE);
            }

            // determine the direction so we can either close or open if the user doesn't slide it enough
            vars.isMovingTowardsClose = (vars.currentXPos <= vars.prevXPos);

            if ($navContainer.hasClass(CLASSES.IS_RIGHT)) {
              vars.isMovingTowardsClose = !vars.isMovingTowardsClose;
            }

            vars.prevXPos = vars.currentXPos;

            // figure out how much the navigation should move, vs how much the parallax inner module should move
            var newInnerXPos = OPTIONS.NAV_WIDTH - _touchInteraction.getPxWidthMoved(vars),
              newNavXPos =  OPTIONS.NAV_WIDTH - (OPTIONS.NAV_WIDTH - _touchInteraction.getPxWidthMoved(vars));

            // this can sometimes go outside of the bounds. Ensure this doesn't happen
            if (newNavXPos > OPTIONS.NAV_WIDTH) {
              newNavXPos = OPTIONS.NAV_WIDTH;
            } else if (newNavXPos < 0) {
              newNavXPos = 0;
            }

            // reset all the items to start (this stops transitions stacking up)
            if (newInnerXPos <= 0) {
              _animations.closeNav(0);
            } else if (newInnerXPos >= OPTIONS.NAV_WIDTH) {
              _animations.openNav(0);
            } else {
              // calculate the percentage closed currently
              var percentageNavBg = OPTIONS.BACKGROUND_OPACITY - (OPTIONS.BACKGROUND_OPACITY * (newNavXPos / OPTIONS.NAV_WIDTH));

              if (OPTIONS.USE_CSS_TRANSLATE) {
                if ($navContainer.hasClass(CLASSES.IS_RIGHT)) {
                  $navContainer.velocity({ translateZ: 0, translateX: newNavXPos + 'px' }, 0);
                } else {
                  $navContainer.velocity({ translateZ: 0, translateX: '-' + newNavXPos + 'px' }, 0);
                }
              } else {
                if ($navContainer.hasClass(CLASSES.IS_RIGHT)) {
                  $navContainer.velocity({ right: '-' + newNavXPos + 'px' }, 0);
                } else {
                  $navContainer.velocity({ left: '-' + newNavXPos + 'px' }, 0);
                }
              }

              if (OPTIONS.HAS_BACKGROUND) {
                NAMESPACE.shade.opacity(percentageNavBg, 0);
              }
            }
          }
        };

        /**
         * On touch end interaction
         *
         * @memberof tcom.nav.eachNavItem._touchInteraction
         * @param  {Object} event jQuery event of the TouchEnd/MouseUp event
         * @private
         */
        _touchInteraction.onEnd = function(event) {
          event.stopPropagation();
          event.preventDefault();

          var vars = _touchInteraction.vars,
            validateNewDuration;

          validateNewDuration = function(newDuration) {
            if (isNaN(newDuration)) {
              newDuration = OPTIONS.TRANSITIONS.ANIMATE_OUT;
            } else if (newDuration < 0) {
              newDuration = 0;
            }

            return newDuration;
          };

          // remove the previous event listeners as they aren't needed anymore
          $(document).off('touchmove.nav mousemove.nav', _touchInteraction.onMove);
          $(document).off('touchend.nav mouseup.nav', _touchInteraction.onEnd);

          // calculate how much time is required for the rest of the animation
          // this is based on the original transition duration and the total x pos to move, vs the x pos remaining to move
          var durationDistance = vars.startXPos - vars.currentXPos;

          if ($navContainer.hasClass(CLASSES.IS_RIGHT)) {
            durationDistance = vars.currentXPos - vars.startXPos;
          }

          _newDuration = validateNewDuration(OPTIONS.TRANSITIONS.ANIMATE_OUT - Math.round(OPTIONS.TRANSITIONS.ANIMATE_OUT * (durationDistance / OPTIONS.NAV_WIDTH)));

          // stop the current animation
          _getAnimatedItems().velocity('stop', true);

          // determine whether to close or open the navigation depending on the direction of movement
          if (vars.isMovingTowardsClose) {
            _closeOffscreenNav();
          } else {
            _isCurrentlyOpen = false; //make sure that "_openOffscreenNav()" runs

            // recalculate the duration because it's opening not closing
            _newDuration = validateNewDuration(OPTIONS.TRANSITIONS.ANIMATE_IN - _newDuration);

            _openOffscreenNav();
          }
        };

        /**
         * On click outside of the navigation (also if the user taps with a finger)
         *
         * @memberof tcom.nav.eachNavItem._touchInteraction
         * @param  {Object} event jQuery event of the TouchEnd/MouseUp event
         * @private
         */
        _touchInteraction.onClickOrTap = function(event) {
          // only do this if the interaction isn't inside the navigation
          if (_isCurrentlyOpen && $(event.target).closest(SELECTORS.CONTAINER).length === 0) {
            event.stopPropagation();
            event.preventDefault();
            _closeOffscreenNav();
          }
        };

        /**
         * Event for actually clicking a button to close the screen
         *
         * @memberof tcom.nav.eachNavItem
         * @param  {Object} event jQuery event of the click event
         * @private
         */
        _closeOnCloseButtonClick = function(event) {
          event.stopPropagation();
          event.preventDefault();
          _closeOffscreenNav();
        };

        /**
         * Bind the events to close an open navigation
         *
         * @memberof tcom.nav.eachNavItem
         * @private
         */
        _bindEventsToCloseOpenNavigation = function() {
          // ensure we don't double bind events
          _unbindEventsToCloseOpenNavigation();

          // bind event to the document to close on click of anywhere but the nav
          if (NAMESPACE.isDevice.touch()) {
            $(document).on('touchstart.nav mousedown.nav', _touchInteraction.onStart);
          } else {
            $(document).on('click.nav', _touchInteraction.onClickOrTap);
          }

          $navContainer.find('.nav-close').on('click.nav', _closeOnCloseButtonClick);
        };

        /**
         * Remove the event listeners that are no longer needed.
         *
         * @memberof tcom.nav.eachNavItem
         * @private
         */
        _unbindEventsToCloseOpenNavigation = function() {
          $(document).off('touchstart.nav mousedown.nav', _touchInteraction.onStart);
          $(document).off('click.nav', _touchInteraction.onClickOrTap);
          $navContainer.find('.nav-close').off('click.nav');
        };

        /**
         * Open the navigation
         *
         * @memberof tcom.nav.eachNavItem
         * @private
         */
        _openOffscreenNav = function() {
          if (!_isCurrentlyOpen && !_isTransitioning) {
            _isTransitioning = true;

            var openNavEnd,
              openNav;

            openNavEnd = function() {
              $('html').addClass(CLASSES.NAV_OPEN).removeClass(CLASSES.NAV_TRANSITIONING);

              NAMESPACE.accessibility.tabInsideContainer.set($navContainer, true);
              NAMESPACE.accessibility.bindToEscape.set(_closeOffscreenNav);

              NAMESPACE.navContents.focusOnOpen();

              // reset non-default duration
              _newDuration = false;
              _animations.resetInlineStyle();

              _containerHeightForNav.set();

              _isTransitioning = false;
            };

            openNav = function() {
              $('html').addClass(CLASSES.NAV_TRANSITIONING);

              if (OPTIONS.HAS_BACKGROUND) {
                NAMESPACE.shade.setActive(true);
              }

              _isCurrentlyOpen = true;
              _isNavOpen = navId;

              var openDuration = (_newDuration !== false) ? _newDuration : OPTIONS.TRANSITIONS.ANIMATE_IN;
              _animations.openNav(openDuration, openNavEnd);
            };

            // scroll to the top of the navigation if required
            if ($('#outer-wrap').scrollTop() > 0 && !OPTIONS.USE_FIXED_POSITIONING) {
              $('#outer-wrap').animate({ scrollTop: 0 }, 100, openNav);
            } else {
              openNav();
            }

            // set events to allow for close of the navigation
            _bindEventsToCloseOpenNavigation();
          }
        };

        /**
         * Close the navigation
         *
         * @memberof tcom.nav.eachNavItem
         * @private
         */
        _closeOffscreenNav = function() {
          if (_isCurrentlyOpen && !_isTransitioning) {
            _isTransitioning = true;

            var closeNavEnd,
              closeNav;

            // after the animation ends, unbind the transition end event, and set the closed variable
            closeNavEnd = function() {
              $('html').removeClass(CLASSES.NAV_OPEN);

              if (OPTIONS.HAS_BACKGROUND) {
                NAMESPACE.shade.setActive(false);
              }

              _isCurrentlyOpen = false;
              _isNavOpen = false;

              //inside set timeout to avoid some display issues that can occur
              setTimeout(_containerHeightForNav.unset, 10);

              NAMESPACE.accessibility.tabInsideContainer.unset($navContainer);
              NAMESPACE.accessibility.bindToEscape.unset();

              if (_$linkWhichOpenedNav && _$linkWhichOpenedNav.length > 0) {
                _$linkWhichOpenedNav.get(0).focus();
              }

              // reset non-default duration
              _newDuration = false;
              _animations.resetInlineStyle();

              _isTransitioning = false;
            };

            // setup the animation to close the nav
            closeNav = function() {
              //reset the animations
              var closeDuration = (_newDuration !== false) ? _newDuration : OPTIONS.TRANSITIONS.ANIMATE_OUT;
              _animations.closeNav(closeDuration, closeNavEnd);

              // remove the bindings to close the navigation
              _unbindEventsToCloseOpenNavigation();
            };

            closeNav();
          }
        };

        /**
         * Enable the current navigation
         *
         * @memberof tcom.nav.eachNavItem
         * @private
         */
        _enableOffscreenNav = function() {
          // nothing to do because the navigation should already be closed
        };

        /**
         * Disable the current navigation
         *
         * @memberof tcom.nav.eachNavItem
         * @private
         */
        _disableOffscreenNav = function() {
          if (_isCurrentlyOpen) {
            _closeOffscreenNav();
          }
        };

        // hide the navigation
        $navContainer.attr({
          'aria-hidden': false
        });

        $navContainer.on('open.nav.offscreen', _openOffscreenNav);
        $navContainer.on('close.nav.offscreen', _closeOffscreenNav);
        $navContainer.on('enableNav.nav.offscreen', _enableOffscreenNav);
        $navContainer.on('disableNav.nav.offscreen', _disableOffscreenNav);
      });

      // bind click events
      $(SELECTORS.NAV_TOGGLE).on('click.nav.offscreen', _toggleOffscreenNav);

      _isInit = true;
    };

    return {
      init: init,
      isInit: isInit,
      enable: enableOffscreenNav,
      disable: disableOffscreenNav,
      OPTIONS: OPTIONS
    };

  }());

}(jQuery, tcom));

$(document).ready(function() {
  'use strict';

  tcom.nav.init();
  tcom.navContents.init();
  tcom.scrollbar.init();
});

+ function($) {
	'use strict';

	if(tcom.isMobile()){

		//store flyoutModal
		var $flyoutModal = $('#flyout-mobile-menu');

		//link click event
		$('.page-takeover-links .flyout-toggle').on('click',function(e){
			//prevent default action
			e.preventDefault();

			//get the flyout menu jQuery object
			var flyoutMenu = $(this).next('.flyout-menu');

			//build menu
			$flyoutModal.find('.mobile-menu').html(flyoutMenu[0].innerHTML);

			//open in modal window
			$flyoutModal.modal();
		});

		//modal vertical center align fix
		$flyoutModal.on('show.bs.modal', function(){
			$(this).css('display', 'block');
	    var $dialog = $(this).find('.modal-dialog');
	    var offset = ($(window).height() - $dialog.height()) / 2;
	    // Center modal vertically in window
	    $dialog.css('margin-top', offset);
		});

	}

}(jQuery);



// tcom help popovers
+function($) {
  'use strict';

  tcom.popovers = {};

  tcom.popovers.init = function ($elements, options) {
    // default options for tcom.popovers
    var defaultOptions = {
      html: true,
      container: 'body',
      trigger: tcom.isMobile() || Modernizr.touch ? 'click' : 'hover'
    };

    // for each element
    $elements.each(function(){
      var $element = $(this);

      // extend the options
      options = $.extend({}, defaultOptions, options || {}, $element.data());

      // init bootstrap popover
      $element.popover(options);

      // if the trigger is a click event
      if (options.trigger === 'click') {
        $element.on('show.bs.popover', function () {
          var $popover = $(this);

          // create popover-overlay
          $('<div></div>')
            .addClass('popover-overlay')
            .appendTo('body')
            // on click event, destroy the popover
            .on('touchstart click', function() {
              $(this).remove();
              $popover.popover('hide');
            });
        });
      }
    });
  };

  tcom.popovers.init($('.help-tooltip'));

}(jQuery);

/**
* tcom popup windows
* @class popup
*/
+ function($) {
  'use strict';

  var _popup = tcom.popup = {};
  var _defaults = {
    name: 'newWindow',
    resizable: false,
    scrollbars: true,
    toolbar: false
  };

  _defaults.width = screen.width * 0.8;
  _defaults.height = screen.height * 0.8;

  /**
  * @function open
  * @param {object} the target jQuery object
  * @param {object} list of options
  */
  _popup.open = function(target, options) {
    options = $.extend({}, _defaults, options);

    options.width = calculateCorrectSize(options.width, 'width');
    options.height = calculateCorrectSize(options.height, 'height');

    // fixes dual screen positioning
    // @screen.left = fix firefox
    var _windowScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left,
      _windowWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;

    var leftPosition = _windowScreenLeft + ((_windowWidth / 2) - (options.width / 2));

    var windowSettings = 'width=' + options.width +
      ',height=' + options.height +
      ((options.resizable) ? ',resizable=yes' : '') +
      ((options.scrollbars) ? ',scrollbars=yes' : '') +
      ((options.toolbar) ? ',toolbar=yes' : '') +
      ',left=' + leftPosition +
      ',top=' + (screen.height / 2 - options.height / 2);

    window.open(target, options.name, windowSettings);
  };

  /**
  * event delegate
  * @event click.tcom.popup
  */
  $('body').on('click.tcom.popup', '[data-popup]', function(event) {
    var $elem = $(event.currentTarget),
      options = $elem.data(),
      targetUrl;

    event.preventDefault();

    options.name = options.popup;
    targetUrl = ($elem.attr('href')) ? $elem.attr('href') : options.target;

    _popup.open(targetUrl, options);
  });


  /**
  * @function calculateCorrectSize
  * @param {int} _value
  * @param {int} _side
  */
  var calculateCorrectSize = function(_value, _side) {
    var _maxSize;

    if (_side === 'width') {
      _side = screen.width;
      _maxSize = _side - 100;
    } else {
      _side = screen.height;
      _maxSize = _side - 200;
    }

    // parse _value in string
    _value = _value + '';

    // _value format 50% ?
    if (_value.match(new RegExp('%', 'g'))) {

      // delete %
      _value = _value.substring(0, _value.length - 1);

      // parse int and calculate max _value
      _value = parseInt(_value) / 100;
      _maxSize = Math.min(_value, 1);
      _value = _side * _maxSize;

    } else {

      // _value format 50px ?
      if (_value.match(new RegExp('px', 'g'))) {

        // delete px
        _value = _value.substring(0, _value.length - 2);
      }
      // parse int and calculate max _value
      _value = parseInt(_value);
      _value = Math.min(_value, _maxSize);
    }

    return _value;
  };
}(jQuery);
+function($) {
  'use strict';

  $('.responsive-switch').on('click', function() {
    if (localStorage) {
      localStorage.forceDesktop = (localStorage.forceDesktop === 'true') ? false : true;
      location.reload();
    }
  });

}(jQuery);
/* ==========================================================================
 * SCROLLBAR
 * ========================================================================== */

+ function($, NAMESPACE) {

  'use strict';

  /**
   * Creates a custom looking scrollbar that's much nicer than the default scrollbar visually
   *
   * @namespace scrollbar
   * @memberof TCOM_NEXT
   * @version 0.0.1
   * @author Damian Keeghan - Deloitte Digital Australia
   */
  NAMESPACE.scrollbar = (function() {

    var SELECTORS,
      update,
      init;

    SELECTORS = {
      CONTAINER: '.fn_scrollbar'
    };

    /**
     * Update the scrollbar heights
     *
     * @memberof TCOM_NEXT.scrollbar
     * @param  {Object} $scrollbar jQuery Element of the scrollbar container
     */
    update = function($scrollbar) {
      if ($scrollbar && $scrollbar.length) {
        $scrollbar.perfectScrollbar('update');
        return;
      }

      // if no variable update all
      $(SELECTORS.CONTAINER).each(function(i, el) {
        $(el).perfectScrollbar('update');
      });
    };

    /**
     * Add the scrollbar to the containers with the class `fn_scrollbar`
     *
     * @memberof TCOM_NEXT.scrollbar
     */
    init = function() {
      $(SELECTORS.CONTAINER).each(function(i, el) {
        var suppressX = ($(el).attr('data-scrollbar-x') === 'false'),
          suppressY = ($(el).attr('data-scrollbar-y') === 'false');

        if ($('.lt-ie10').length || (NAMESPACE.isDevice.touch() && !NAMESPACE.isDevice.iOS())) {
          $(el).addClass('has-css-scroll');

          return;
        }

        $(el).perfectScrollbar({
          suppressScrollX: suppressX,
          suppressScrollY: suppressY,
          scrollXMarginOffset: 20,
          scrollYMarginOffset: 20,
          includePadding: true,
          useBothWheelAxes: true
        });
      });
    };

    return {
      update: update,
      init: init
    };
  }());

}(jQuery, tcom);

/* ==========================================================================
 * TYPEAHEAD
 * ========================================================================== */

+ function($, NAMESPACE) {

  'use strict';

  /**
   * Initialises typeahead on identified objects
   *
   * @namespace searchTypeahead
   * @memberof TCOM_NEXT
   * @version 0.0.1
   * @author Saxon Cameron - Deloitte Digital Australia
   */
  NAMESPACE.searchTypeahead = (function() {

    var HTML_TEMPLATES,
        CONST,
        DATA,
        CLASSES,
        SELECTORS,

    // ---------- Functions
        init,
        bindEvents,

    // ---------- Typeahead
        _results,
        firstSuggestion,
        firstKeyword,

        getSearchResults,
        formatResults,
        decode;

    CONST = {
      CLEAR_DELAY: 500
    };

    DATA = {
      TYPEAHEAD: {
        GSA_CLIENT: 'TDigital_FE_All_Main',
        GSA_SITE:'TDigital_All',
        AJAX_URL: 'https://www.telstra.com.au/gsa-search/suggest'
      }
    };

    CLASSES = {
      SEARCH_POPOVER: {
        SCROLL: 'overflow-scroll'
      }
    };

    SELECTORS = {
      SEARCH_POPOVER: {
        DROPDOWN_RESULTS: '.popover-content .tt-dropdown-menu',
        ACTIVE_POPOVER: '.feature-popover.is-active',
        INPUT: 'input[data-search-input-mobile]',
        BUTTON: '.telstra-search .btn-search'
      },
      SEARCH_FORM: 'form.telstra-search'
    };

    HTML_TEMPLATES = {
      // Title row, prepended before keyword and suggestion partitions of search results respectively
      titleTemplate: function(title) {
        var _html = '<div class="search-results-title"><strong>' + title + '</strong></div>';

        return _html;
      },

      // Simple search result, single line text only
      keywordTemplate: function(_result) {
        var _html = '';

        if (firstKeyword) {
          _html += HTML_TEMPLATES.titleTemplate('Popular Keywords');
        }

        firstKeyword = false;

        _html += '<a class="search-list-result" href="#">' + _result.name + '</a>';

        return _html;
      },

      // Larger search result template, icon, title and text description
      suggestionTemplate: function(_result) {
        var _html = '';

        if (firstSuggestion) {
          _html += HTML_TEMPLATES.titleTemplate('Our Suggestions');
        }

        firstSuggestion = false;

        _html += [
          '<a href="' + _result.moreDetailsUrl + '">',
            '<div class="suggested-item">',
              '<div class="icon-container">',
                _result.img,
              '</div>',
              '<div class="content-container">',
                '<p><strong>' + _result.name + '</strong></p>',
                '<p>' + _result.content + '</p>',
              '</div>',
            '</div>',
          '</a>'
        ].join('\n');

        return _html;
      },

      // Template to display when no respective search terms for keywords/suggestions are returned
      noResultsFound: function() {
        var _html = '';

        _html += [
          '<div class="no-results-found">',
          '  <p>No results match your search.</p>',
          '</div>'
        ].join('\n');

        return _html;
      }
    }; // END HTML_TEMPLATES

    /**
     * Retrieve search results using ajax and send results to be parsed before passing back to typeahead
     *
     * @memberof TCOM_NEXT.searchTypeahead
     */
    getSearchResults = function(query, process) {

      // If the 'Personal' global menu item is selected
      if ($.trim($('.global-nav li.is-active a').text) === 'Personal') {
        DATA.TYPEAHEAD.GSA_CLIENT = 'TDigital_FE_Personal_Main';
        DATA.TYPEAHEAD.GSA_SITE = 'TDigital_Consumer';
      }

      // Reset flags that detect first instances of keyword and suggestion searches so that title rows can be prepended
      firstSuggestion = true;
      firstKeyword = true;

      $.ajax({
        url: DATA.TYPEAHEAD.AJAX_URL,
        type: 'get',
        dataType: 'jsonp',
        data: {
          q: query,
          max: 10,
          site: DATA.TYPEAHEAD.GSA_SITE,
          client: DATA.TYPEAHEAD.GSA_CLIENT,
          access: 'p',
          format: 'rich'
        },
        success: function(_json) {
          // Parse results and ensure correct format before processing
          _results = formatResults(_json.results);
          process(_results);

          // After results have been populated above, resize dropdown if necessary to enable scrolling
          $(SELECTORS.SEARCH_POPOVER.INPUT).trigger('typeahead:opened');
        }
      }); // END $.ajax
    }; // END getSearchResults()

    /**
     * Format results by parsing inline html and separating joined strings into array
     *
     * @memberof TCOM_NEXT.searchTypeahead
     */
    formatResults = function(_results) {
      // Iterate through every result returned matching the search term
      for (var i = 0; i < Object.keys(_results).length; i++) {
        // If the type is the larger, icon/title/description block
        if (_results[i].type === 'suggest') {
          _results[i].name = decode(_results[i].name);
        // Else if just a keyword search term return
        } else if (_results[i].type === 'uar') {
          var _array = _results[i].content.split('#');

          _results[i].img     = decode(_array[0]);
          _results[i].name    = decode(_array[1]);
          _results[i].content = decode(_array[2]);
        }
      }

      return _results;
    };

    /**
     * Decode character symbols back into string parameter
     *
     * @memberof TCOM_NEXT.searchTypeahead
     */
    decode = function(_text) {
      _text = _text.replace(/\\x3c/g, '<')
      .replace(/\\x3e/g, '>')
      .replace(/\\x3d/g, '=')
      .replace(/\\x27/g, '\'')
      .replace(/\\x22/g, '"');

      return _text;
    };

    /**
     * Bind typeahead events
     *
     * @memberof TCOM.searchTypeahead
     */
    bindEvents = function() {
      var _submitSearch,
          _clearSearchValueOnClose,
          _stopMobileDropdownClose,
          _setup;

      /**
       * Submit search term when clicking on typeahead item
       *
       * @memberof TCOM.searchTypeahead.bindEvents
       * @private
       */
      _submitSearch = function() {
        $(SELECTORS.SEARCH_POPOVER.INPUT).off('typeahead:selected').on('typeahead:selected', function(el, _result) {
          switch (_result.type) {
            case 'suggest':
              $(this).typeahead('val', _result.name);
              $(SELECTORS.SEARCH_FORM).submit();
              break;

            case 'uar':
              window.location.href = _result.moreDetailsUrl;
              break;

            default:
              return;
          }
        });
      };

      /**
       * Clear the search input box value when containing popover closes
       *
       * @memberof TCOM_NEXT.searchTypeahead.bindEvents
       * @private
       */
      _clearSearchValueOnClose = function() {
        // Typeahead:closed also triggers on loss of input focus, so an additional check related to active popover status must be made
        $(SELECTORS.SEARCH_POPOVER.INPUT).off('typeahead:closed').on('typeahead:closed', function() {
          // Check to see if the popover is still open after the typeahead was trigger as closed
          setTimeout(function() {
            if ($(SELECTORS.SEARCH_POPOVER.ACTIVE_POPOVER).length === 0) {
              // Popover is closed, clear the search val
              $(SELECTORS.SEARCH_POPOVER.INPUT).val('');
            }
          }, CONST.CLEAR_DELAY);
        });
      };

      /**
       * Prevent the dropdown from closing when closing the keyboard / losing focus of search bar on mobile
       *
       * @memberof TCOM_NEXT.searchTypeahead.bindEvents
       * @private
       */
      _stopMobileDropdownClose = function() {
        if (tcom.isDevice.touch()) {
          $(SELECTORS.SEARCH_POPOVER.INPUT).blur(function() {
            var rightArrow;
            rightArrow = $.Event('keydown');
            rightArrow.keyCode = rightArrow.which = 40;

            $(this).trigger(rightArrow);
          });
        }
      };

      /**
       * Initialise the bindEvents setup to bind typeahead event triggers
       *
       * @memberof TCOM_NEXT.searchTypeahead.bindEvents
       * @private
       */
      _setup = function() {
        _submitSearch();
        _clearSearchValueOnClose();
        _stopMobileDropdownClose();
      };

      _setup();
    }; // END bindEvents()

    /**
     * Initialise the typeahead setup on page load
     *
     * @memberof TCOM_NEXT.searchTypeahead
     */
  init = function() {
      // Initialise the typeahead prediction on search inputs
      $(SELECTORS.SEARCH_POPOVER.INPUT).typeahead({
        highlight: true,
        hint: false,
        minLength: 0
      }, {
        name: 'search',
        source: getSearchResults,
        templates: {
          suggestion: function(_result) {
            switch (_result.type) {
              // Standard search result one line text
              case 'suggest':
                return HTML_TEMPLATES.keywordTemplate(_result);

              // Larger, icon/header/text description template
              case 'uar':
                return HTML_TEMPLATES.suggestionTemplate(_result);

              default:
                return;
            }
          }
        }
      }); // END input typeahead

      // Bind typeahead and search submission events to input
      bindEvents();
    }; // END init

    return {
      init: init
    };

  }());

  NAMESPACE.searchTypeahead.init();

}(jQuery, tcom);

// tcom flyout menus, lhs nav
+ function($) {
  'use strict';

  //var _flyout = tcom.flyout = {};
  var $leftNav = $('.lh-nav');

  $leftNav
    .on('mouseover.tcom.flyout', '.flyout-toggle, .flyout-menu', function() {
      $(this).parent().addClass('hover');
    })
    .on('mouseout.tcom.flyout', '.flyout-toggle, .flyout-menu', function() {
      $(this).parent().removeClass('hover');
    });

}(jQuery);
/* =============================================================================
   SHADE
   ========================================================================== */

+ function($, NAMESPACE) {

  'use strict';

  /**
   * Background shade used for modal windows and blockouts of the screen
   *
   * @namespace shade
   * @memberof TCOM
   * @version 0.0.1
   * @author Damian Keeghan - Deloitte Digital Australia
   */
  NAMESPACE.shade = (function() {

    var CLASSES,
      SELECTORS,
      $shade,
      _triggerClick,
      _setClass,
      _isActive = false,
      isActive,
      setBehindHeader,
      setActive,
      opacity,
      init;

    // classes
    CLASSES = {
      SHADE: 'shade-bg',
      IS_ACTIVE: 'is-active',
      IS_BEHIND_HEADER: 'is-behind-header'
    };

    // selectors
    SELECTORS = {
      SHADE: '.' + CLASSES.SHADE
    };

    /**
     * Add or remove a class to the shade
     *
     * @memberof TCOM.shade
     * @param  {Object} event jQuery click event
     * @private
     */
    _triggerClick = function(event) {
      event.preventDefault();
      $(window).trigger('clicked.shade');
    };

    /**
     * Add or remove a class to the shade
     *
     * @memberof TCOM.shade
     * @param  {Boolean} state Boolean to determine if to add or remove the class required
     * @param  {String} className The class to add/remove
     * @return {Boolean} Returns that state of the selected option as a boolean
     * @private
     */
    _setClass = function(state, className) {
      state = (typeof (state) === 'boolean' && state === true);

      if (state) {
        $shade.addClass(className);
      } else {
        $shade.removeClass(className);
      }

      return state;
    };

    /**
     * Set the shade to go behind the fixed header rather than the default of in front
     *
     * @memberof TCOM.shade
     * @param  {Boolean} isBehindHeader Boolean to determine if to add or remove the class required
     */
    setBehindHeader = function(isBehindHeader) {
      _setClass(isBehindHeader, CLASSES.IS_BEHIND_HEADER);
    };

    /**
     * Set the shade to active (this is required before you set the opacity of it)
     *
     * @memberof TCOM.shade
     * @param  {Boolean} isActive Boolean to determine if to activate or deactivate
     */
    setActive = function(isActive) {
      _setClass(isActive, CLASSES.IS_ACTIVE);
      _isActive = CLASSES.IS_ACTIVE;

      if (_isActive) {
        // .one will unbind the event immediately after it's triggered
        $shade.one('click.shade', _triggerClick);
      }
    };

    /**
     * Set the shade to active (this is required before you set the opacity of it)
     *
     * @memberof TCOM.shade
     * @return {Boolean} True if the shade is currently active, False if inactive
     */
    isActive = function() {
      return _isActive;
    };

    /**
     * Set the opacity of the shade, can be over a duration or immediately
     *
     * @memberof TCOM.shade
     * @param {Number} opacity Opacity to go to between 0 and 1. Is converted to a fixed 2 decimal places
     * @param {Number} duration Duration in milliseconds over which the opacity should be set, use 0 for immediate
     * @param {Boolean=false} setToCurrent Use true to set the opacity to it's current opacity prior to starting the animation. Used to avoid some display issues in IE
     * @param {Function=null} callback Callback function to be called after complete
     */
    opacity = function(opacity, duration, setToCurrent, callback) {
      var opacityTo = (typeof (opacity) === 'number') ? opacity.toFixed(2) : 1,
        opacityDuration = duration || 0,
        setCurrentOpacity = (setToCurrent === true) || false;

      if (setCurrentOpacity) {
        $shade.css('opacity', $shade.css('opacity'));
      }

      if (opacityDuration === 0) {
        $shade.velocity('stop');
        $shade.css('opacity', opacityTo);

        if (typeof (callback) === 'function') {
          callback();
        }
        return;
      }

      $shade.velocity('stop').velocity({
        opacity: opacityTo
      }, {
        duration: opacityDuration,
        complete: function() {
          if (typeof (callback) === 'function') {
            callback();
          }
        }
      });
    };

    /**
     * Initialise the shade on page load
     *
     * @memberof TCOM.shade
     */
    init = function() {
      $('body').append('<div class="' + CLASSES.SHADE + '">&nbsp;</div>');

      $shade = $(SELECTORS.SHADE);
    };

    return {
      setBehindHeader: setBehindHeader,
      setActive: setActive,
      opacity: opacity,
      isActive: isActive,
      init: init
    };

  }());

  NAMESPACE.shade.init();

}(jQuery, tcom);

// Share via SMS JS
+ function($) {
  'use strict';

  var _formURL = (tcom.isEnvProd && !tcom.isAuthor) ? 'https://www.telstra.com.au/homepage/includes/sms-contact.cfm' : 'https://www.staging.telstra.com.au/homepage/includes/sms-contact.cfm';
  var _regexPhone = /^(\+61|0)4[0-9]{8}$/;
  var _msgs = {
    success: 'The link has been sent.',
    tooManyUses: 'You have reached the limit of messages you can send right now.',
    genericError: 'We\'re sorry, we can\'t process your request right now.'
  };

  var $lightbox = $('#shareSMS');

  if ($lightbox.length > 0) {
    $lightbox.on('show.bs.modal', function () {
      resetForm();
    });

    $lightbox.on('shown.bs.modal', function () {
      $lightbox.find('#mobileNumber').focus();
    });

    $lightbox.find('form').submit(function(e){
      e.preventDefault();
      submitForm();
      return false;
    });
  }

  function submitForm(){
    var mobileNum = $lightbox.find('#mobileNumber').val().replace(/ /g, '');

    $lightbox.find('.form-group').removeClass('has-error');
    $lightbox.find('.sms-error-msg').hide();

    if (!_regexPhone.test(mobileNum)) {
      $lightbox.find('.form-group').addClass('has-error');
      $lightbox.find('.sms-error-msg').fadeIn();
      return;
    }

    $lightbox.find('button[type="submit"]').addClass('loading');

    $.ajax({
      type: 'get',
      url: _formURL,
      data: { contact: mobileNum, address: mobileNum, url: window.location.pathname.replace(/^\//,'') },
      dataType: 'jsonp'
    })
    .done(function(data){
      if (data && data.Success === 'true') {
        showResult(_msgs.success);
      } else {
        if (data && data.Errors === 'limit reached') {
          showResult(_msgs.tooManyUses);
        } else {
          showResult(_msgs.genericError);
        }
      }
    })
    .fail(function(){
      showResult(_msgs.genericError);
    });
  }

  function showResult(msg) {
    $lightbox.find('.result p').text(msg);
    $lightbox.find('form').hide();
    $lightbox.find('.result').fadeIn().focus();
  }

  function resetForm() {
    $lightbox.find('#mobileNumber').val('');
    $lightbox.find('.form-group').removeClass('has-error');
    $lightbox.find('.sms-error-msg').hide();
    $lightbox.find('button[type="submit"]').removeClass('loading');
    $lightbox.find('form').show();
    $lightbox.find('.result').hide();
  }
}(jQuery);
+ function($) {
	'use strict';
	
	$('.show-hide-toggle').on('click',function(event){
		event.preventDefault();

		$(this).toggleClass('opened');

		$(this).siblings('.more-text').animate({
			
			height : 'toggle',
			opacity: 'toggle'

		},600);

		return false;
	});
}(jQuery);



// tcom smooth scroll
+function($) {
  'use strict';

  var _scroll = tcom.scroll = {};

  var moveTo = function(target, smoothscroll) {
    var $target;

    if (typeof(target) === 'string') {
      $target = $(target);
    } else {
      $target = target;
    }

    // check if the target is a tab/accordion
    if ($target.hasClass('tab-pane') && !tcom.isMobile()) {

      $target = $('[href="#' + $target.attr('id') + '"][data-toggle="tab"]');
      $target.tab('show');

    } else if ($target.hasClass('collapse-content')) {

      $target
        .addClass('in')
        .css('height', 'auto');

      $target = $('.collapse-bar[data-target="#' + $target.attr('id') + '"]');
      $target.removeClass('collapsed');
    }

    if ($target && $target.length === 1) {
      
      if (smoothscroll) {
        $('html, body').animate({
          scrollTop: $target.offset().top - 10 // moves it just a touch above our target
        },
        {
          duration: 1200,
          easing: 'easeInOutCubic'
        });
      } else {
        $('html, body').scrollTop($target.offset().top - 10);
      }
    }
  };

  _scroll.scrollTo = function(target) {
    moveTo(target, true);
  };

  _scroll.jumpTo = function(target) {
    moveTo(target, false);
  };

}(jQuery);

// tcom switch nav
+ function($) {
  'use strict';

  var $switchNavLinks = $('.switch-nav a');

  $switchNavLinks.on('click', function(){
    
    //remove other active classes
    $(this).parents('.switch-nav').find('a').removeClass('active');

    //add active to clicked anchor
    $(this).addClass('active');
  });

}(jQuery);
+ function($) {
	'use strict';

	/*
	 * Return the maximun scroll value for the table inside the wrap
	 * table.width return the table container's size on iPhone, and not the real size.
	 * Due to this issue, we are using the TH/TD's width to calcul the table's width.
	 */
	function getMaxScroll($table, $wrap){

		var _tableWidth = 0;
		var _wrapWidth = $wrap.width();
		var _maxScroll;

		$table.find('tr:first-child > *').each(function() {
			_tableWidth = _tableWidth + $(this).outerWidth();
		});

		_maxScroll = _tableWidth - _wrapWidth;

		return _maxScroll;
	}

	/*
	 * Add borders and shadows on the right or on the left 
	 * if you can scroll the table in this direction
	 */
	function addBorder($wrap, $responsive, _maxScroll){
		var _currentScroll = $responsive.scrollLeft();

		// if you can scroll to the left
		if (_currentScroll > 0) {
			$wrap.addClass('left');
		} else {
			$wrap.removeClass('left');
		}

		// if you can scroll to the right
		if (_currentScroll < _maxScroll) {
			$wrap.addClass('right');
		} else {
			$wrap.removeClass('right');
		}
	}

	/*
	 * Core function
	 */
	function responsiveTable(){
		$('.table-wrap').each(function() {
			// Init variable
			var $wrap = $(this),
				$responsive = $(this).find('.table-responsive'),
				$table = $(this).find('.table');

			// Get the max scroll
			var _maxScroll = getMaxScroll($table, $wrap);

			// Add the first class on $wrap
			addBorder($wrap, $responsive, _maxScroll);

			// Listen the scroll event
			// Should we throttle this event ? 
			$responsive.on('scroll', function() { 
		        addBorder($wrap, $responsive, _maxScroll);
			});
		});	
	}

	/*
	 * rotate event
	 */
    if (document.addEventListener) {
        window.addEventListener('orientationchange', function() {
            responsiveTable();
        }, false);
    }

	responsiveTable();

}(jQuery);
// tabs.js

// Exclusive accordion functionality for small screen. Disabled for the time being.
// + function($) {
//   'use strict';
//   if (tcom.isMobile()) {
//     $('.tab-content .collapse-bar').click(function() {

//       $.each($(this).siblings('.collapse-bar'), function() {

//         var $bar = $(this), $content = $bar.next();

//         if (!$bar.hasClass('collapsed')){
//           $bar.addClass('collapsed');
//           $content.collapse('hide');
//         }
//       });
//     });
//   }

// }(jQuery);
/* ==========================================================================
 * THEME
 * ========================================================================== */

+ function($, NAMESPACE) {

  'use strict';

  var THEME_PREFIX = 'base-',
    DEFAULT_THEME = 'default',
    COLOURS = [DEFAULT_THEME, 'magenta', 'green', 'orange', 'blue', 'grey'];

  NAMESPACE.theme = (function() {
    var _setClass,
      set;

    _setClass = function(colour) {
      for (var i = 0, len = COLOURS.length; i < len; i += 1) {
        var reg = new RegExp('(\\s|^)' + THEME_PREFIX + COLOURS[i] + '(\\s|$)');
        document.body.className = document.body.className.replace(reg, ' ');
      }

      document.body.className += ' ' + THEME_PREFIX + colour;
    };

    set = function(colour) {
      var isValidColour = false;

      colour = colour.toLowerCase();

      for (var i = 0, len = COLOURS.length; i < len; i += 1) {
        if (colour === COLOURS[i]) {
          isValidColour = true;
          _setClass(colour);
        }
      }

      if (!isValidColour) {
        _setClass(DEFAULT_THEME);
      }
    };

    return {
      set: set
    };
  }());

}(jQuery, tcom);

+function() {
  'use strict';

  /**
  * Modernizr.inlinesvg is not supported by :
  * - IE8 and under
  * - Firefox 3.6 and under
  * - Chrome 6 and under
  * - Safari 5 and under
  * - Opera 11.5 and under
  * - IOS Safari 4.3 and under
  * - Opera Mini 8
  *
  *   All these browsers won't be able to access to the offcanvas navigation on the mobile view
  *
  */
  var _pathTouchJS;
  var _location = window.location.href;

  if( _location.indexOf('telstra') > -1 || _location.indexOf(':4502') > -1) {
    // online build
    _pathTouchJS = '/etc/designs/tcom/tcom-core/js/touch.js';

  } else {
    // local build
    _pathTouchJS = '/tcom-core/js/touch.js';

  }

  Modernizr.load({
    test: Modernizr.inlinesvg,
    yep : _pathTouchJS
  });

}();



// var OO = OO || {};
/* global OO */

(function($, NAMESPACE) {
  'use strict';

  NAMESPACE.videomodule = (function() {
    // variables
    // ----------------------------------------------------------
    // ----------------------------------------------------------
    var _ooyala;
    var _ooyalaPlayer = '//player.ooyala.com/v3/b360cc6b75a14786998429404ea88378';
    var $videoModuleTriggers = $('.video-panel, .video-panel-desc').find('[data-src]');


    // private functions
    // ----------------------------------------------------------
    // ----------------------------------------------------------
    function stopAllYoutubePlayer(){
      var events = ['show.bs.modal, hide.bs.modal'];
      $('body').on(events.join(','), function() {
        var $youtubeIframe = $('iframe[src*="youtube"]');
        $youtubeIframe.each(function(index, item) {
          item.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        });
      });
    }

    function createYoutubeIframe($target, _src, _autoplay){

      _src = '//www.youtube.com/embed/' + _src + '?enablejsapi=1&rel=0';
      _src = _autoplay ? _src + '&autoplay=1' : _src;
      var $iframe = $('<iframe src="' + _src + '" frameborder="0" allowfullscreen></iframe>');

      $target.find('.video-module').prepend($iframe);
    }

    function createOoyalaPlayer($target, _src, _autoplay){

      $target.find('.video-module').attr('id', _src);

      OO.ready(function() { 
        _ooyala = OO.Player.create(_src, _src); 
        if (_autoplay) { _ooyala.play(); }
      });
    }

    function bindVideoModule(){

      $videoModuleTriggers.on('click', function() {
        var $this      = $(this);
        var $target    = $($this.data('target'));
        var $playerTag = $target.find('.video-module').children();
        var _src       = $this.data('src');
        var _autoplay  = $this.data('autoplay');

        // destroy previous player
        if ($playerTag.is('iframe')) {
          $playerTag.remove();
        } else if ($playerTag.is('.innerWrapper')){
          _ooyala.destroy();
        }

        // create new player
        if (_src.indexOf('ooyala:') === -1) {
          createYoutubeIframe($target, _src, _autoplay);
        } else {
          _src = _src.replace('ooyala:', '');
          createOoyalaPlayer($target, _src, _autoplay);
        }
      });
    }

    // public functions
    // ----------------------------------------------------------
    // ----------------------------------------------------------
    function init(){

      if ( $('[data-src^=ooyala]').length > 0) {
        $.getScript(_ooyalaPlayer, function(){
          bindVideoModule();
        });
      } else {
        bindVideoModule();
      }

      stopAllYoutubePlayer();
    }

    // return public functions
    // ----------------------------------------------------------
    // ----------------------------------------------------------
    return {
      init: init
    };
  }());

 NAMESPACE.videomodule.init();

}(jQuery, tcom));