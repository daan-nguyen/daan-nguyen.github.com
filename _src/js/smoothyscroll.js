(function(window, document) {
  "use strict";

  var _smoothy = window.smoothy = {};

  // easing formulas
  // http://www.gizma.com/easing/
  var _easing = {
    linear: function (t, b, c, d) {
      return c*t/d + b;
    },
    easeInOutCubic: function (t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t*t + b;
      t -= 2;
      return c/2*(t*t*t + 2) + b;
    },
    easeOutCubic: function (t, b, c, d) {
      t /= d;
      t--;
      return c*(t*t*t + 1) + b;
    },
    easeInOutQuart: function (t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t*t*t + b;
      t -= 2;
      return -c/2 * (t*t*t*t - 2) + b;
    },
    easeInOutCirc: function (t, b, c, d) {
      t /= d/2;
      if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
      t -= 2;
      return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
    }
  };

  // default options
  var _options = {
    duration: 1200,
    easing: _easing.easeInOutCubic,
    headerOffset: 0
  };

  // animation functions
  var _animationId;
  var _startTime;

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

  // stop function
  var _stopScrollTo = function() {
    window.cancelAnimationFrame(_animationId);
    _startTime = false;
    _animationId = false;
  };

  smoothy.scrollTo = function(targetOffset) {
    var startOffset = window.pageYOffset;
    var deltaOffset = targetOffset - startOffset;

    if (_animationId) _stopScrollTo();
    _animateScroll(startOffset, deltaOffset, _options.duration);
  };

  smoothy.initOptions = function(options) {
    for (var key in options) {
      if (_options.hasOwnProperty(key) && options[key]) {
        _options[key] = options[key];
      }
    }
  };

  smoothy.initAnchors = function(options) {
    // Set header offset if there is a tagged element
    var offsetEl = document.querySelector('.smoothy-offset');
    _options.headerOffset = (offsetEl) ? offsetEl.offsetHeight : 0;

    // Set passed options
    if (options) smoothy.initOptions(options);

    document.body.addEventListener('click', function(event) {
      if (event.target.tagName.toLowerCase() === 'a') {
        var href = event.target.attributes.href.value;

        if (href && href.indexOf('#') === 0 && href.substring(1).length > 0) {
          event.preventDefault();

          var targetEl = document.querySelector(href) || document.querySelector('a[name=' + href.substring(1) + ']');
          smoothy.scrollTo(targetEl.offsetTop - _options.headerOffset);

        }
      }
    }, false);
  };

})(window, document);