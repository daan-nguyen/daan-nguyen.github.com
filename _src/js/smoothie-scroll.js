/**
 * @preserve requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 */
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                      window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/* @preserve Smoothie-scroll.js - eased smooth scrollin' without dependencies.
 *
 *
 */

(function(window, document) {
  "use strict";

  var _smoothie = window.smoothie = {};

  /* Easing Formulas
   *
   * Easing equations Linear -> easeInOutQuart:
   * http://www.gizma.com/easing/
   ***************************************************************************/
  var _easing = {
    linear: function (t, b, c, d) {
      return c*t/d + b;
    },
    easeInQuad: function (t, b, c, d) {
      t /= d;
      return c*t*t + b;
    },
    easeOutQuad: function (t, b, c, d) {
      t /= d;
      return -c * t*(t-2) + b;
    },
    easeInOutQuad: function (t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    },
    easeInCubic: function (t, b, c, d) {
      t /= d;
      return c*t*t*t + b;
    },
    easeOutCubic: function (t, b, c, d) {
      t /= d;
      t--;
      return c*(t*t*t + 1) + b;
    },
    easeInOutCubic: function (t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t*t + b;
      t -= 2;
      return c/2*(t*t*t + 2) + b;
    },
    easeInQuart: function (t, b, c, d) {
      t /= d;
      return c*t*t*t*t + b;
    },
    easeOutQuart: function (t, b, c, d) {
      t /= d;
      t--;
      return -c * (t*t*t*t - 1) + b;
    },
    easeInOutQuart: function (t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t*t*t + b;
      t -= 2;
      return -c/2 * (t*t*t*t - 2) + b;
    }
  };

  /* Default Options
   ***************************************************************************/
  var _options = {
    duration: 1200,
    easing: _easing.easeInOutCubic,
    headerOffset: 0
  };

  /* Private Functions
   ***************************************************************************/
  var _animationId;
  var _startTime;

  // Primary animation
  var _animateScroll = function(startOffset, deltaOffset, duration) {
    var nowTime = (new Date()).getTime();
    if (!_startTime) _startTime = nowTime;
    var animationTime = nowTime - _startTime;

    if (animationTime <= duration) {
      _animationId = window.requestAnimationFrame(_animateScroll.bind(null, startOffset, deltaOffset, duration));
    } else {
      _stopScrollTo();
    }

    window.scrollTo(0, _options.easing(animationTime, startOffset, deltaOffset, duration));
  };

  // Animation stop
  var _stopScrollTo = function() {
    window.cancelAnimationFrame(_animationId);
    _startTime = false;
    _animationId = false;
  };

  // Parents util function
  // Iterates through a nodes parents to check if it a child of a certain tag type
  // Returns the element if found
  var _childOfElement = function(targetElement, parentElementTag) {
    while (targetElement !== document) {
      if (targetElement.tagName.toLowerCase() === parentElementTag.toLowerCase()) {
        return targetElement;
      } else {
        targetElement = targetElement.parentNode;
      }
    }
  };


  /* Public Interface
   ***************************************************************************/

  // Arbitary scroll function
  // Scroll from the current position to the target position passed.
  smoothie.scrollTo = function(targetOffset) {
    var startOffset = window.pageYOffset;
    var deltaOffset = targetOffset - startOffset;

    if (_animationId) _stopScrollTo();
    _animateScroll(startOffset, deltaOffset, _options.duration);
  };

  // Function that accepts an options object to override default options
  smoothie.initOptions = function(options) {
    for (var key in options) {
      if (_options.hasOwnProperty(key) && options[key]) {
        _options[key] = options[key];
      }
    }
  };

  // Primary init function that binds an event handler to the body that handles
  // all links pointing to on page anchors.
  smoothie.initAnchors = function(options) {
    // Set header offset if there is a tagged element
    var offsetEl = document.querySelector('.smoothie-offset');
    _options.headerOffset = (offsetEl) ? offsetEl.offsetHeight : 0;

    // Set passed options
    if (options) smoothie.initOptions(options);

    document.body.addEventListener('click', function(event) {
      var targetElement = _childOfElement(event.target, 'a');

      if (targetElement) {
        var href = targetElement.attributes.href.value;

        if (href && href.indexOf('#') === 0 && href.substring(1).length > 0) {
          event.preventDefault();

          var targetEl = document.querySelector(href) || document.querySelector('a[name=' + href.substring(1) + ']');
          smoothie.scrollTo(targetEl.offsetTop - _options.headerOffset);

        }
      }
    }, false);
  };

})(window, document);